/**
 * @file server/services/ps-inbox-service.js
 * @purpose Server-side ps-inbox-service logic
 * @layer backend
 * @deps [import fs from 'fs/promises';, import path from 'path';, import { PATHS } from '../../config/paths.js';, import { createMetadata } from '../../config/metadata-schema.js';, import { dirCache } from '../utils/dir-cache.js';, import { hashContent } from '../utils/hashing.js';, ps-inbox-processor, ps-inbox-storage, ps-inbox-validator]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import fs from 'fs/promises';
import path from 'path';
import { PATHS } from '../../config/paths.js';
import { createMetadata } from '../../config/metadata-schema.js';
import { PSInboxStorage } from './ps-inbox-storage.js';
import { PSInboxValidator } from './ps-inbox-validator.js';
import { PSInboxProcessor } from './ps-inbox-processor.js';
import { hashContent } from '../utils/hashing.js';
import { dirCache } from '../utils/dir-cache.js';

export class PSInboxService {
  constructor() {
    this.storage = new PSInboxStorage();
    this.validator = new PSInboxValidator();
    this.processor = new PSInboxProcessor();
  }

  async getItems(filters = {}) {
    try {
      const items = await this.storage.getAllItems();
      
      if (filters.status) {
        return items.filter(item => item.metadata?.status === filters.status);
      }
      
      return items;
    } catch (error) {
      throw new Error(`Failed to get inbox items: ${error.message}`);
    }
  }

  async getItem(id) {
    if (!this.validator.isValidId(id)) {
      throw new Error('Invalid item ID');
    }

    const item = await this.storage.getItem(id);
    if (!item) {
      throw new Error('Item not found');
    }

    return item;
  }

  async createTextItem(content, source = 'paste') {
    if (!content || typeof content !== 'string') {
      throw new Error('Content is required and must be a string');
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new Error('Content cannot be empty');
    }

    const contentHash = hashContent(trimmedContent);
    const existingFile = await this.storage.findByHash(contentHash);
    
    if (existingFile) {
      return {
        success: false,
        message: 'This content already exists in the inbox',
        existingFile: existingFile.id
      };
    }

    const timestamp = Date.now();
    const id = `${source}-${timestamp}`;
    const filename = `${id}.txt`;
    
    const metadata = createMetadata({
      id,
      original_filename: filename,
      saved_filename: filename,
      source,
      size: Buffer.byteLength(trimmedContent, 'utf8'),
      content_hash: contentHash,
      is_binary: false,
      mime_type: 'text/plain',
      original_content: trimmedContent,
      user_title: this.extractTitle(trimmedContent)
    });

    await this.storage.saveItem(id, trimmedContent, metadata);
    
    return {
      success: true,
      file: { id, filename },
      metadata
    };
  }

  async createFileItem(file, extractedContent = null) {
    if (!file || !file.originalname) {
      throw new Error('Invalid file upload');
    }

    // Read file content from disk since multer saved it to a temp file
    const fileContent = await fs.readFile(file.path);
    const fileHash = hashContent(fileContent);
    const existingFile = await this.storage.findByHash(fileHash);
    
    if (existingFile) {
      await fs.unlink(file.path).catch(() => {});
      return {
        success: false,
        message: 'This file already exists in the inbox',
        existingFile: existingFile.id
      };
    }

    const timestamp = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, extension);
    const sanitizedName = this.validator.sanitizeFilename(baseName);
    const id = `upload-${timestamp}`;
    const filename = `${sanitizedName}-${timestamp}${extension}`;

    const metadata = createMetadata({
      id,
      original_filename: file.originalname,
      saved_filename: filename,
      source: 'upload',
      size: file.size,
      content_hash: fileHash,
      is_binary: true,
      mime_type: file.mimetype || 'application/octet-stream',
      user_title: sanitizedName
    });

    if (extractedContent) {
      metadata.extracted_content = extractedContent;
    }

    await this.storage.saveFile(id, file.path, filename, metadata);
    
    return {
      success: true,
      file: { id, filename },
      metadata
    };
  }

  async deleteItem(id) {
    if (!this.validator.isValidId(id)) {
      throw new Error('Invalid item ID');
    }

    const deleted = await this.storage.deleteItem(id);
    if (!deleted) {
      throw new Error('Item not found');
    }

    return { success: true, message: 'Item deleted successfully' };
  }

  async updateItem(id, updates) {
    if (!this.validator.isValidId(id)) {
      throw new Error('Invalid item ID');
    }

    const validatedUpdates = this.validator.validateMetadataUpdate(updates);
    const updated = await this.storage.updateMetadata(id, validatedUpdates);
    
    if (!updated) {
      throw new Error('Item not found');
    }

    return { success: true, metadata: updated };
  }

  async linkItems(sourceId, targetId, linkType = 'related') {
    if (!this.validator.isValidId(sourceId) || !this.validator.isValidId(targetId)) {
      throw new Error('Invalid item ID');
    }

    if (!['related', 'describes', 'uploaded_with'].includes(linkType)) {
      throw new Error('Invalid link type');
    }

    const linked = await this.storage.linkItems(sourceId, targetId, linkType);
    if (!linked) {
      throw new Error('Failed to link items - one or both items not found');
    }

    return { success: true, message: 'Items linked successfully' };
  }

  async prepareForProcessing() {
    return this.processor.prepareForLLM();
  }

  async processManually(id) {
    if (!this.validator.isValidId(id)) {
      throw new Error('Invalid item ID');
    }

    return this.processor.processToLibrary(id);
  }

  extractTitle(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return 'Untitled';
    
    let title = lines[0].trim();
    title = title.replace(/^#+\s*/, '');
    title = title.replace(/[*_`]/g, '');
    
    if (title.length > 100) {
      title = title.substring(0, 97) + '...';
    }
    
    return title || 'Untitled';
  }
}

export const inboxService = new PSInboxService();
