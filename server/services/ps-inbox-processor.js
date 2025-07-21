import fs from 'fs/promises';
import path from 'path';
import { PATHS } from '../../config/paths.js';
import { PSInboxStorage } from './ps-inbox-storage.js';
import { dirCache } from '../utils/dir-cache.js';
// removed unused import
import { METADATA_SCHEMA } from '../../config/metadata-schema.js';

export class PSInboxProcessor {
  constructor() {
    this.storage = new PSInboxStorage();
  }

  async prepareForLLM(options = {}) {
    const { format = 'markdown', includeMetadata = true } = options;
    
    const items = await this.storage.getAllItems();
    const rawItems = items.filter(item => 
      item.metadata?.status === METADATA_SCHEMA.STATUS.RAW
    );

    if (rawItems.length === 0) {
      return {
        success: true,
        message: 'No raw items to process',
        content: '',
        count: 0
      };
    }

    let output = '';

    if (format === 'markdown') {
      output = await this.formatAsMarkdown(rawItems, includeMetadata);
    } else if (format === 'json') {
      output = await this.formatAsJSON(rawItems, includeMetadata);
    } else {
      output = await this.formatAsText(rawItems, includeMetadata);
    }

    return {
      success: true,
      content: output,
      count: rawItems.length,
      items: rawItems.map(item => ({
        id: item.id,
        title: item.metadata?.title || 'Untitled'
      }))
    };
  }

  async formatAsMarkdown(items, includeMetadata) {
    const sections = [];

    for (const item of items) {
      let section = `## ${item.metadata?.title || item.id}\n\n`;
      
      if (includeMetadata) {
        section += `**ID:** ${item.id}\n`;
        section += `**Source:** ${item.metadata?.source || 'unknown'}\n`;
        section += `**Created:** ${item.metadata?.created_at || 'unknown'}\n\n`;
      }

      const content = await this.getItemContent(item);
      section += `${content}\n\n---\n\n`;
      
      sections.push(section);
    }

    return sections.join('');
  }

  async formatAsJSON(items, includeMetadata) {
    const data = [];

    for (const item of items) {
      const content = await this.getItemContent(item);
      
      const entry = {
        id: item.id,
        content: content
      };

      if (includeMetadata) {
        entry.metadata = item.metadata;
      }

      data.push(entry);
    }

    return JSON.stringify(data, null, 2);
  }

  async formatAsText(items, includeMetadata) {
    const sections = [];

    for (const item of items) {
      let section = '';
      
      if (includeMetadata) {
        section += `=== ${item.id} ===\n`;
        section += `Title: ${item.metadata?.title || 'Untitled'}\n`;
        section += `Source: ${item.metadata?.source || 'unknown'}\n\n`;
      }

      const content = await this.getItemContent(item);
      section += `${content}\n\n`;
      
      sections.push(section);
    }

    return sections.join('---\n\n');
  }

  async getItemContent(item) {
    if (!item.hasContent) {
      return '[No content available]';
    }

    try {
      const contentPath = path.join(PATHS.inbox, `${item.id}.txt`);
      const content = await fs.readFile(contentPath, 'utf8');
      return content.trim();
    } catch (error) {
      return '[Error reading content]';
    }
  }

  async processToLibrary(id) {
    const item = await this.storage.getItem(id);
    
    if (!item) {
      throw new Error('Item not found');
    }

    if (!item.metadata) {
      throw new Error('Item has no metadata');
    }

    if (item.metadata.status === METADATA_SCHEMA.STATUS.PROCESSED) {
      return {
        success: false,
        message: 'Item already processed'
      };
    }

    const timestamp = Date.now();
    const processedId = `processed-${timestamp}`;
    
    const libraryEntry = {
      id: processedId,
      source_metadata_id: id,
      category: 'uncategorized',
      title: item.metadata.title || 'Untitled',
      summary: 'Manually processed item',
      key_points: [],
      tags: item.metadata.tags || [],
      channel_fitness: {
        youtube: 'unknown',
        blog: 'unknown',
        twitter: 'unknown',
        linkedin: 'unknown'
      },
      created_at: new Date().toISOString(),
      processed_at: new Date().toISOString()
    };

    const categoryPath = path.join(PATHS.library, 'uncategorized');
    await fs.mkdir(categoryPath, { recursive: true });

    const libraryPath = path.join(categoryPath, `${processedId}.json`);
    await fs.writeFile(libraryPath, JSON.stringify(libraryEntry, null, 2), 'utf8');

    await this.storage.updateMetadata(id, {
      status: METADATA_SCHEMA.STATUS.PROCESSED,
      processed_at: new Date().toISOString(),
      library_id: processedId
    });

    const metadataSourcePath = path.join(PATHS.metadata.raw, `${id}.json`);
    const metadataDestPath = path.join(PATHS.metadata.processed, `${id}.json`);
    
    try {
      await fs.rename(metadataSourcePath, metadataDestPath);
      dirCache.invalidate(PATHS.metadata.raw);
      dirCache.invalidate(PATHS.metadata.processed);
    } catch (error) {
      console.error('Failed to move metadata file:', error);
    }

    return {
      success: true,
      message: 'Item processed to library',
      libraryId: processedId,
      category: 'uncategorized'
    };
  }
}