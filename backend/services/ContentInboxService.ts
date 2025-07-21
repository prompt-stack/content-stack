/**
 * @layer backend-service
 * @description Service for handling content inbox operations
 * @dependencies fs, path, ../types/ContentTypes, ../utils/createMetadata
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming conventions:
 * - Service pattern: [FeatureName]Service
 * - Methods: handle[Event], get[Value], create[Subject]
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import type { 
  ContentInboxServiceInput, 
  ContentMetadata, 
  ContentCreationResult,
  FileOperationResult
} from '../types/ContentTypes';
import { createMetadata } from '../utils/createMetadata';

export class ContentInboxService {
  private contentDir: string;
  private metadataDir: string;

  constructor(baseDir: string = process.cwd()) {
    this.contentDir = join(baseDir, 'content');
    this.metadataDir = join(baseDir, 'content', 'metadata');
  }

  /**
   * Handle new content submission
   * Following design-system pattern: handle[Event]
   */
  async handleContentSubmission(input: ContentInboxServiceInput): Promise<ContentCreationResult> {
    try {
      // Create metadata
      const metadata = createMetadata(input);
      
      // Ensure directories exist
      await this.ensureDirectoriesExist();
      
      // Write content file to inbox
      const fileResult = await this.writeContentFile(metadata);
      if (!fileResult.success) {
        return {
          success: false,
          error: fileResult.error,
        };
      }
      
      // Write metadata file
      const metadataResult = await this.writeMetadataFile(metadata);
      if (!metadataResult.success) {
        return {
          success: false,
          error: metadataResult.error,
        };
      }
      
      return {
        success: true,
        metadata,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get all content items from inbox
   * Following design-system pattern: get[Value]
   */
  async getInboxContent(): Promise<ContentMetadata[]> {
    try {
      await this.ensureDirectoriesExist();
      
      const metadataFiles = await fs.readdir(this.metadataDir);
      const metadataPromises = metadataFiles
        .filter(file => file.endsWith('.json'))
        .map(file => this.getMetadataById(file.replace('.json', '')));
        
      const results = await Promise.allSettled(metadataPromises);
      
      const validItems: ContentMetadata[] = [];
      const orphanedMetadata: string[] = [];
      
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value !== null) {
          const metadata = result.value;
          
          // Check if corresponding content file exists
          const contentPath = join(this.contentDir, '..', metadata.location.inbox_path);
          try {
            await fs.access(contentPath);
            validItems.push(metadata);
          } catch (error) {
            // Content file missing - this is orphaned metadata
            console.log(`[CLEANUP] Found orphaned metadata: ${metadata.id}, missing content file: ${contentPath}`);
            orphanedMetadata.push(metadata.id);
          }
        }
      }
      
      // Clean up orphaned metadata files
      for (const orphanedId of orphanedMetadata) {
        try {
          const metadataPath = join(this.metadataDir, `${orphanedId}.json`);
          await fs.unlink(metadataPath);
          console.log(`[CLEANUP] Removed orphaned metadata file: ${metadataPath}`);
        } catch (error) {
          console.error(`[CLEANUP] Failed to remove orphaned metadata ${orphanedId}:`, error);
        }
      }
      
      return validItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      console.error('Error getting inbox content:', error);
      return [];
    }
  }

  /**
   * Get metadata by content ID
   * Following design-system pattern: get[Value]
   */
  async getMetadataById(id: string): Promise<ContentMetadata | null> {
    try {
      const metadataPath = join(this.metadataDir, `${id}.json`);
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(metadataContent) as ContentMetadata;
    } catch {
      return null;
    }
  }

  /**
   * Update metadata for content item
   * Following design-system pattern: update[Subject]
   */
  async updateMetadata(id: string, updates: Partial<ContentMetadata>): Promise<FileOperationResult> {
    try {
      const existingMetadata = await this.getMetadataById(id);
      if (!existingMetadata) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      // Deep merge updates to handle nested objects properly
      const updatedMetadata: ContentMetadata = {
        ...existingMetadata,
        ...updates,
        updated_at: new Date().toISOString(),
        // Deep merge nested objects
        content: updates.content ? {
          ...existingMetadata.content,
          ...updates.content
        } : existingMetadata.content,
        source: updates.source ? {
          ...existingMetadata.source,
          ...updates.source
        } : existingMetadata.source,
        llm_analysis: updates.llm_analysis ? {
          ...existingMetadata.llm_analysis,
          ...updates.llm_analysis
        } : existingMetadata.llm_analysis,
      };

      return await this.writeMetadataFile(updatedMetadata);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete content item
   * Following design-system pattern: delete[Subject]
   */
  async deleteContent(id: string): Promise<FileOperationResult> {
    try {
      const metadata = await this.getMetadataById(id);
      if (!metadata) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      // Delete content file (check if exists first)
      const contentPath = join(this.contentDir, '..', metadata.location.inbox_path);
      console.log(`[DELETE] Attempting to delete content file: ${contentPath}`);
      try {
        await fs.access(contentPath);
        await fs.unlink(contentPath);
        console.log(`[DELETE] Content file deleted successfully`);
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.log(`[DELETE] Content file already deleted: ${contentPath}`);
        } else {
          throw error;
        }
      }

      // Delete metadata file (check if exists first)
      const metadataPath = join(this.metadataDir, `${id}.json`);
      console.log(`[DELETE] Attempting to delete metadata file: ${metadataPath}`);
      try {
        await fs.access(metadataPath);
        await fs.unlink(metadataPath);
        console.log(`[DELETE] Metadata file deleted successfully`);
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.log(`[DELETE] Metadata file already deleted: ${metadataPath}`);
        } else {
          throw error;
        }
      }

      return {
        success: true,
        path: metadataPath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Write content file to inbox
   * Private helper method
   */
  private async writeContentFile(metadata: ContentMetadata): Promise<FileOperationResult> {
    try {
      const contentPath = join(this.contentDir, '..', metadata.location.inbox_path);
      await fs.writeFile(contentPath, metadata.content.full_text, 'utf-8');
      
      return {
        success: true,
        path: contentPath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to write content file',
      };
    }
  }

  /**
   * Write metadata file
   * Private helper method
   */
  private async writeMetadataFile(metadata: ContentMetadata): Promise<FileOperationResult> {
    try {
      const metadataPath = join(this.metadataDir, `${metadata.id}.json`);
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
      
      return {
        success: true,
        path: metadataPath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to write metadata file',
      };
    }
  }

  /**
   * Ensure required directories exist
   * Private helper method
   */
  private async ensureDirectoriesExist(): Promise<void> {
    const dirs = [
      join(this.contentDir, 'inbox'),
      join(this.contentDir, 'storage'),
      join(this.contentDir, 'metadata'),
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}