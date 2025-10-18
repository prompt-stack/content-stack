/**
 * @file config/scripts/metadata-enforcer.ts
 * @purpose Enforce metadata schema rules at runtime
 * @description Can be used as middleware or validation layer
 */

import { ContentMetadata, metadataSchema } from '../schemas/metadata-schema.config';

export class MetadataEnforcer {
  /**
   * Enforce immutable fields haven't changed
   */
  static enforceImmutability(
    original: Partial<ContentMetadata>, 
    updated: Partial<ContentMetadata>
  ): { valid: boolean; violations: string[] } {
    const violations: string[] = [];
    
    // Check immutable fields
    const immutableFields = [
      'id',
      'created_at',
      'source.method',
      'content.type',
      'content.full_text',
      'content.hash'
    ];

    immutableFields.forEach(field => {
      const originalValue = this.getNestedValue(original, field);
      const updatedValue = this.getNestedValue(updated, field);
      
      if (originalValue !== undefined && 
          updatedValue !== undefined && 
          originalValue !== updatedValue) {
        violations.push(`Cannot modify immutable field: ${field}`);
      }
    });

    return { 
      valid: violations.length === 0, 
      violations 
    };
  }

  /**
   * Enforce field ownership rules
   */
  static enforceFieldOwnership(
    updates: Partial<ContentMetadata>,
    updater: 'user' | 'llm' | 'system'
  ): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    // Define field ownership
    const ownership = {
      user: ['user_tags', 'source_url', 'reference_urls', 'metadata'],
      llm: ['llm_analysis'],
      system: ['updated_at', 'status', 'title', 'filename', 'location', 'storage']
    };

    // Check each field in updates
    Object.keys(updates).forEach(field => {
      // Determine who owns this field
      let owner: string | null = null;
      
      for (const [role, fields] of Object.entries(ownership)) {
        if (fields.includes(field) || 
            fields.some(f => field.startsWith(f + '.'))) {
          owner = role;
          break;
        }
      }

      // Check if updater has permission
      if (owner && owner !== updater && owner !== 'system') {
        violations.push(
          `${updater} cannot modify ${field} (owned by ${owner})`
        );
      }
    });

    return { 
      valid: violations.length === 0, 
      violations 
    };
  }

  /**
   * Enforce enrichment rules
   */
  static enforceEnrichmentRules(
    metadata: ContentMetadata
  ): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    // If enriched, must have llm_analysis
    if (metadata.status === 'enriched') {
      if (!metadata.llm_analysis) {
        violations.push('Enriched content must have llm_analysis');
      } else {
        // Check required LLM fields
        const requiredLLMFields = ['category', 'title', 'tags'];
        requiredLLMFields.forEach(field => {
          if (!metadata.llm_analysis[field as keyof typeof metadata.llm_analysis]) {
            violations.push(`llm_analysis.${field} is required for enriched content`);
          }
        });
      }
    }

    // If has llm_analysis, must be enriched
    if (metadata.llm_analysis && metadata.status !== 'enriched') {
      violations.push('Content with llm_analysis must have status "enriched"');
    }

    return { 
      valid: violations.length === 0, 
      violations 
    };
  }

  /**
   * Create safe update that respects all rules
   */
  static createSafeUpdate(
    original: ContentMetadata,
    updates: Partial<ContentMetadata>,
    updater: 'user' | 'llm' | 'system'
  ): { 
    safeUpdates: Partial<ContentMetadata>; 
    rejected: string[] 
  } {
    const safeUpdates: Partial<ContentMetadata> = {};
    const rejected: string[] = [];

    // Check immutability
    const immutabilityCheck = this.enforceImmutability(original, updates);
    if (!immutabilityCheck.valid) {
      rejected.push(...immutabilityCheck.violations);
    }

    // Check ownership
    const ownershipCheck = this.enforceFieldOwnership(updates, updater);
    if (!ownershipCheck.valid) {
      rejected.push(...ownershipCheck.violations);
    }

    // Build safe updates (excluding rejected fields)
    const rejectedFields = new Set(
      rejected.map(r => r.match(/field: (\S+)/)?.[1]).filter(Boolean)
    );

    Object.entries(updates).forEach(([key, value]) => {
      if (!rejectedFields.has(key)) {
        (safeUpdates as any)[key] = value;
      }
    });

    // Always update timestamp for any change
    if (Object.keys(safeUpdates).length > 0) {
      safeUpdates.updated_at = new Date().toISOString();
    }

    return { safeUpdates, rejected };
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
  }
}

// Example usage as Express middleware
export function metadataUpdateMiddleware(
  req: any, 
  res: any, 
  next: any
) {
  const { original, updates, updater } = req.body;
  
  // Enforce rules
  const { safeUpdates, rejected } = MetadataEnforcer.createSafeUpdate(
    original,
    updates,
    updater
  );

  if (rejected.length > 0) {
    console.warn('Rejected updates:', rejected);
  }

  // Pass safe updates forward
  req.body.safeUpdates = safeUpdates;
  next();
}