/**
 * @layer backend-service
 * @description Service for handling metadata operations
 * @dependencies fs, path, ../types/ContentTypes
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming conventions:
 * - Service pattern: [FeatureName]Service
 * - Methods: get[Value], find[Items], has[Property]
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import type { ContentMetadata, ContentStatus } from '../types/ContentTypes';
import { getMetadataPath } from '../../config/schemas/paths.config';

export class MetadataService {
  private metadataDir: string;

  constructor(baseDir: string = process.cwd()) {
    this.metadataDir = getMetadataPath(baseDir);
  }

  /**
   * Get all metadata items
   * Following design-system pattern: get[Value]
   */
  async getAllMetadata(): Promise<ContentMetadata[]> {
    try {
      await fs.mkdir(this.metadataDir, { recursive: true });
      
      const files = await fs.readdir(this.metadataDir);
      const metadataFiles = files.filter(file => file.endsWith('.json'));
      
      const metadataPromises = metadataFiles.map(async (file) => {
        try {
          const filePath = join(this.metadataDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          return JSON.parse(content) as ContentMetadata;
        } catch (error) {
          console.error(`Error reading metadata file ${file}:`, error);
          return null;
        }
      });

      const results = await Promise.all(metadataPromises);
      return results
        .filter((item): item is ContentMetadata => item !== null)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      console.error('Error getting all metadata:', error);
      return [];
    }
  }

  /**
   * Find metadata by status
   * Following design-system pattern: find[Items]
   */
  async findMetadataByStatus(status: ContentStatus): Promise<ContentMetadata[]> {
    const allMetadata = await this.getAllMetadata();
    return allMetadata.filter(item => item.status === status);
  }

  /**
   * Find metadata by content type
   * Following design-system pattern: find[Items]
   */
  async findMetadataByType(type: string): Promise<ContentMetadata[]> {
    const allMetadata = await this.getAllMetadata();
    return allMetadata.filter(item => item.content.type === type);
  }

  /**
   * Find metadata by method
   * Following design-system pattern: find[Items]
   */
  async findMetadataByMethod(method: string): Promise<ContentMetadata[]> {
    const allMetadata = await this.getAllMetadata();
    return allMetadata.filter(item => item.source.method === method);
  }

  /**
   * Get metadata statistics
   * Following design-system pattern: get[Value]
   */
  async getMetadataStats(): Promise<{
    total: number;
    byStatus: Record<ContentStatus, number>;
    byType: Record<string, number>;
    byMethod: Record<string, number>;
  }> {
    const allMetadata = await this.getAllMetadata();
    
    const byStatus: Record<ContentStatus, number> = {
      inbox: 0,
      stored: 0,
    };
    
    const byType: Record<string, number> = {};
    const byMethod: Record<string, number> = {};

    allMetadata.forEach(item => {
      // Count by status
      byStatus[item.status]++;
      
      // Count by type
      byType[item.content.type] = (byType[item.content.type] || 0) + 1;
      
      // Count by method
      byMethod[item.source.method] = (byMethod[item.source.method] || 0) + 1;
    });

    return {
      total: allMetadata.length,
      byStatus,
      byType,
      byMethod,
    };
  }

  /**
   * Check if content hash exists (deduplication)
   * Following design-system pattern: has[Property]
   */
  async hasContentHash(hash: string): Promise<boolean> {
    const allMetadata = await this.getAllMetadata();
    return allMetadata.some(item => item.content.hash === hash);
  }

  /**
   * Find metadata by hash
   * Following design-system pattern: find[Items]
   */
  async findMetadataByHash(hash: string): Promise<ContentMetadata | null> {
    const allMetadata = await this.getAllMetadata();
    return allMetadata.find(item => item.content.hash === hash) || null;
  }

  /**
   * Search metadata by content
   * Following design-system pattern: search[Items]
   */
  async searchMetadataByContent(query: string): Promise<ContentMetadata[]> {
    const allMetadata = await this.getAllMetadata();
    const lowercaseQuery = query.toLowerCase();
    
    return allMetadata.filter(item => 
      item.content.title.toLowerCase().includes(lowercaseQuery) ||
      item.content.full_text.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get recent metadata items
   * Following design-system pattern: get[Value]
   */
  async getRecentMetadata(limit: number = 10): Promise<ContentMetadata[]> {
    const allMetadata = await this.getAllMetadata();
    return allMetadata.slice(0, limit);
  }

  /**
   * Count metadata items
   * Following design-system pattern: count[Items]
   */
  async countMetadata(): Promise<number> {
    const allMetadata = await this.getAllMetadata();
    return allMetadata.length;
  }
}