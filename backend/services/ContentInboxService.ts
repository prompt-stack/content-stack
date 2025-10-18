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
import { getStorageDirectory } from '../../config/schemas/content-types.config';
import { 
  getStoragePaths, 
  getMetadataPath,
  getAllRequiredDirectories,
  toRelativePath 
} from '../../config/schemas/paths.config';

export class ContentInboxService {
  private baseDir: string;
  private storagePaths: ReturnType<typeof getStoragePaths>;
  private metadataPath: string;

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = baseDir;
    this.storagePaths = getStoragePaths(baseDir);
    this.metadataPath = getMetadataPath(baseDir);
  }


  /**
   * Handle new content submission with storage splitting
   * Following design-system pattern: handle[Event]
   */
  async handleContentSubmission(input: ContentInboxServiceInput): Promise<ContentCreationResult> {
    try {
      // Create metadata
      const metadata = createMetadata(input);
      
      // Ensure directories exist
      await this.ensureDirectoriesExist();
      
      // Determine storage location based on content type
      const storageSubDir = getStorageDirectory(metadata.content.type || 'text');
      
      // Extract file extension from inbox path
      const fileExtension = metadata.location.inbox_path.split('.').pop() || 'txt';
      const storagePath = join(this.storagePaths.root, storageSubDir, `${metadata.id}.${fileExtension}`);
      
      // Update metadata with storage path
      metadata.storage = {
        path: toRelativePath(storagePath, this.baseDir),
        type: storageSubDir,
        size: metadata.content.size || 0
      };
      
      // Write content to storage (not inbox)
      const storageResult = await this.writeToStorage(metadata, storagePath);
      if (!storageResult.success) {
        return {
          success: false,
          error: storageResult.error,
        };
      }
      
      // Write metadata file with FULL content for LLM processing
      // No truncation - we want the complete text for analysis
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
   * Get all content items with inbox status
   * Following design-system pattern: get[Value]
   */
  async getInboxContent(): Promise<ContentMetadata[]> {
    try {
      await this.ensureDirectoriesExist();
      
      const metadataFiles = await fs.readdir(this.metadataPath);
      const metadataPromises = metadataFiles
        .filter(file => file.endsWith('.json'))
        .map(file => this.getMetadataById(file.replace('.json', '')));
        
      const results = await Promise.allSettled(metadataPromises);
      
      const validItems: ContentMetadata[] = [];
      const orphanedMetadata: string[] = [];
      
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value !== null) {
          const metadata = result.value;
          
          // Include items with 'raw' or 'enriched' status (per new schema)
          if (metadata.status === 'raw' || metadata.status === 'enriched') {
            // Check if corresponding content file exists (legacy inbox path)
            const contentPath = join(this.baseDir, metadata.location.inbox_path);
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
      }
      
      // Clean up orphaned metadata files
      for (const orphanedId of orphanedMetadata) {
        try {
          const metadataPath = join(this.metadataPath, `${orphanedId}.json`);
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
      const metadataPath = join(this.metadataPath, `${id}.json`);
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
   * Remove content from inbox (changes status to 'stored')
   * Following design-system pattern: remove[Subject]FromInbox
   */
  async removeFromInbox(id: string): Promise<FileOperationResult> {
    try {
      const existingMetadata = await this.getMetadataById(id);
      if (!existingMetadata) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      // Update status to 'enriched' and set final_path to remove from inbox view
      const updatedMetadata: ContentMetadata = {
        ...existingMetadata,
        status: 'enriched',
        location: {
          ...existingMetadata.location,
          final_path: existingMetadata.location.inbox_path // Move to final location
        },
        updated_at: new Date().toISOString(),
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
   * Delete content item (PERMANENTLY removes from storage)
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
      const contentPath = join(this.baseDir, metadata.location.inbox_path);
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
      const metadataPath = join(this.metadataPath, `${id}.json`);
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
   * Write content to storage directory
   */
  private async writeToStorage(metadata: ContentMetadata, storagePath: string): Promise<FileOperationResult> {
    try {
      // Ensure storage subdirectory exists
      const storageDir = join(storagePath, '..');
      await fs.mkdir(storageDir, { recursive: true });
      
      // Write content to storage
      await fs.writeFile(storagePath, metadata.content.full_text, 'utf-8');
      
      return {
        success: true,
        path: storagePath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to write to storage',
      };
    }
  }

  /**
   * Write metadata file
   * Private helper method
   */
  private async writeMetadataFile(metadata: ContentMetadata): Promise<FileOperationResult> {
    try {
      const metadataPath = join(this.metadataPath, `${metadata.id}.json`);
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
    const dirs = getAllRequiredDirectories(this.baseDir);

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}