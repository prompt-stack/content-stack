#!/usr/bin/env ts-node

/**
 * @file config/scripts/validate-metadata.ts
 * @purpose Validate metadata files against the schema
 * @usage ts-node validate-metadata.ts [file-path]
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ContentMetadata, validateMetadata, metadataSchema } from '../schemas/metadata-schema.config';

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

class MetadataValidator {
  private errors: ValidationError[] = [];

  validateFile(filePath: string): { valid: boolean; errors: ValidationError[] } {
    this.errors = [];

    if (!existsSync(filePath)) {
      this.errors.push({ field: 'file', message: 'File does not exist' });
      return { valid: false, errors: this.errors };
    }

    let metadata: any;
    try {
      const content = readFileSync(filePath, 'utf-8');
      metadata = JSON.parse(content);
    } catch (e) {
      this.errors.push({ field: 'file', message: 'Invalid JSON format' });
      return { valid: false, errors: this.errors };
    }

    // Check required fields
    this.checkRequiredFields(metadata);
    
    // Validate field types
    this.validateFieldTypes(metadata);
    
    // Validate enum values
    this.validateEnumValues(metadata);
    
    // Validate field relationships
    this.validateFieldRelationships(metadata);
    
    // Check LLM analysis if enriched
    if (metadata.status === 'enriched') {
      this.validateLLMAnalysis(metadata);
    }

    return { 
      valid: this.errors.length === 0, 
      errors: this.errors 
    };
  }

  private checkRequiredFields(metadata: any) {
    metadataSchema.required.forEach(field => {
      if (!(field in metadata)) {
        this.errors.push({ 
          field, 
          message: `Required field missing` 
        });
      }
    });

    // Check nested required fields
    if (metadata.source && !metadata.source.method) {
      this.errors.push({ 
        field: 'source.method', 
        message: 'Required field missing' 
      });
    }

    if (metadata.content) {
      ['type', 'full_text', 'hash'].forEach(field => {
        if (!(field in metadata.content)) {
          this.errors.push({ 
            field: `content.${field}`, 
            message: 'Required field missing' 
          });
        }
      });
    }
  }

  private validateFieldTypes(metadata: any) {
    // String fields
    const stringFields = [
      'id', 'created_at', 'updated_at', 'title', 'filename',
      'source_url', 'content.full_text', 'content.hash'
    ];
    
    stringFields.forEach(field => {
      const value = this.getNestedValue(metadata, field);
      if (value !== undefined && typeof value !== 'string') {
        this.errors.push({ 
          field, 
          message: `Must be a string, got ${typeof value}`,
          value 
        });
      }
    });

    // Number fields
    const numberFields = [
      'content.size', 'storage.size', 'llm_analysis.confidence',
      'llm_analysis.word_count', 'content.dimensions.width',
      'content.dimensions.height'
    ];
    
    numberFields.forEach(field => {
      const value = this.getNestedValue(metadata, field);
      if (value !== undefined && typeof value !== 'number') {
        this.errors.push({ 
          field, 
          message: `Must be a number, got ${typeof value}`,
          value 
        });
      }
    });

    // Array fields
    const arrayFields = ['user_tags', 'reference_urls', 'llm_analysis.tags', 
                        'llm_analysis.extracted_entities'];
    
    arrayFields.forEach(field => {
      const value = this.getNestedValue(metadata, field);
      if (value !== undefined && !Array.isArray(value)) {
        this.errors.push({ 
          field, 
          message: `Must be an array, got ${typeof value}`,
          value 
        });
      }
    });
  }

  private validateEnumValues(metadata: any) {
    // Validate status
    if (metadata.status && !metadataSchema.statusValues.includes(metadata.status)) {
      this.errors.push({ 
        field: 'status', 
        message: `Invalid value. Must be one of: ${metadataSchema.statusValues.join(', ')}`,
        value: metadata.status 
      });
    }

    // Validate source method
    if (metadata.source?.method && 
        !metadataSchema.sourceMethodValues.includes(metadata.source.method)) {
      this.errors.push({ 
        field: 'source.method', 
        message: `Invalid value. Must be one of: ${metadataSchema.sourceMethodValues.join(', ')}`,
        value: metadata.source.method 
      });
    }

    // Validate content type
    if (metadata.content?.type && 
        !metadataSchema.contentTypes.includes(metadata.content.type)) {
      this.errors.push({ 
        field: 'content.type', 
        message: `Invalid value. Must be one of: ${metadataSchema.contentTypes.join(', ')}`,
        value: metadata.content.type 
      });
    }
  }

  private validateFieldRelationships(metadata: any) {
    // If status is enriched, llm_analysis should exist
    if (metadata.status === 'enriched' && !metadata.llm_analysis) {
      this.errors.push({ 
        field: 'llm_analysis', 
        message: 'Required when status is "enriched"' 
      });
    }

    // If llm_analysis exists, status should be enriched
    if (metadata.llm_analysis && metadata.status !== 'enriched') {
      this.errors.push({ 
        field: 'status', 
        message: 'Should be "enriched" when llm_analysis is present',
        value: metadata.status 
      });
    }

    // Check ISO timestamp formats
    const timestampFields = ['created_at', 'updated_at', 'source.timestamp', 
                            'storage.last_accessed', 'llm_analysis.analyzed_at'];
    
    timestampFields.forEach(field => {
      const value = this.getNestedValue(metadata, field);
      if (value && !this.isValidISOTimestamp(value)) {
        this.errors.push({ 
          field, 
          message: 'Must be valid ISO timestamp',
          value 
        });
      }
    });
  }

  private validateLLMAnalysis(metadata: any) {
    if (!metadata.llm_analysis) return;

    const requiredLLMFields = ['category', 'title', 'tags'];
    requiredLLMFields.forEach(field => {
      if (!(field in metadata.llm_analysis)) {
        this.errors.push({ 
          field: `llm_analysis.${field}`, 
          message: 'Required field missing in LLM analysis' 
        });
      }
    });

    // Validate confidence range
    if (metadata.llm_analysis.confidence !== undefined) {
      const conf = metadata.llm_analysis.confidence;
      if (conf < 0 || conf > 1) {
        this.errors.push({ 
          field: 'llm_analysis.confidence', 
          message: 'Must be between 0 and 1',
          value: conf 
        });
      }
    }

    // Validate category
    const validCategories = ['tech', 'business', 'education', 'creative', 
                            'personal', 'reference', 'general'];
    if (metadata.llm_analysis.category && 
        !validCategories.includes(metadata.llm_analysis.category)) {
      this.errors.push({ 
        field: 'llm_analysis.category', 
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
        value: metadata.llm_analysis.category 
      });
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
  }

  private isValidISOTimestamp(value: string): boolean {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime()) && 
           date.toISOString() === value;
  }
}

// CLI execution
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Usage: ts-node validate-metadata.ts <metadata-file.json>');
    process.exit(1);
  }

  const validator = new MetadataValidator();
  const result = validator.validateFile(filePath);

  if (result.valid) {
    console.log('✅ Metadata is valid!');
  } else {
    console.error('❌ Metadata validation failed:');
    result.errors.forEach(error => {
      console.error(`  - ${error.field}: ${error.message}`);
      if (error.value !== undefined) {
        console.error(`    Got: ${JSON.stringify(error.value)}`);
      }
    });
    process.exit(1);
  }
}

export { MetadataValidator };