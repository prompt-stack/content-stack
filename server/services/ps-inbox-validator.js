import { isValidId, isValidFilename, sanitizeFilename as utilSanitizeFilename } from '../utils/validation.js';
import { METADATA_SCHEMA } from '../../config/metadata-schema.js';

export class PSInboxValidator {
  constructor() {
    this.allowedMimeTypes = [
      'text/plain',
      'text/markdown',
      'text/html',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/json',
      'application/xml',
      'text/csv'
    ];

    this.maxFileSize = 50 * 1024 * 1024; // 50MB
    this.maxTextLength = 1000000; // 1M characters
  }

  isValidId(id) {
    return isValidId(id);
  }

  isValidFilename(filename) {
    return isValidFilename(filename);
  }

  sanitizeFilename(filename) {
    return utilSanitizeFilename(filename);
  }

  validateTextContent(content) {
    if (!content || typeof content !== 'string') {
      return {
        valid: false,
        error: 'Content must be a non-empty string'
      };
    }

    const trimmed = content.trim();
    if (!trimmed) {
      return {
        valid: false,
        error: 'Content cannot be empty'
      };
    }

    if (trimmed.length > this.maxTextLength) {
      return {
        valid: false,
        error: `Content exceeds maximum length of ${this.maxTextLength} characters`
      };
    }

    return { valid: true };
  }

  validateFileUpload(file) {
    if (!file) {
      return {
        valid: false,
        error: 'No file provided'
      };
    }

    if (!file.originalname) {
      return {
        valid: false,
        error: 'File must have a name'
      };
    }

    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum of ${this.maxFileSize / 1024 / 1024}MB`
      };
    }

    if (file.mimetype && !this.allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: `File type '${file.mimetype}' is not allowed`
      };
    }

    return { valid: true };
  }

  validateMetadataUpdate(updates) {
    const allowed = ['title', 'description', 'tags', 'status', 'links'];
    const validated = {};

    for (const [key, value] of Object.entries(updates)) {
      if (!allowed.includes(key)) {
        continue;
      }

      switch (key) {
        case 'title':
        case 'description':
          if (typeof value === 'string' && value.trim()) {
            validated[key] = value.trim();
          }
          break;

        case 'tags':
          if (Array.isArray(value)) {
            validated[key] = value
              .filter(tag => typeof tag === 'string' && tag.trim())
              .map(tag => tag.trim());
          }
          break;

        case 'status':
          if (Object.values(METADATA_SCHEMA.STATUS).includes(value)) {
            validated[key] = value;
          }
          break;

        case 'links':
          if (this.validateLinks(value)) {
            validated[key] = value;
          }
          break;
      }
    }

    return validated;
  }

  validateLinks(links) {
    if (!links || typeof links !== 'object') {
      return false;
    }

    const validTypes = ['describes', 'related', 'uploaded_with'];
    
    for (const [type, ids] of Object.entries(links)) {
      if (!validTypes.includes(type)) {
        return false;
      }

      if (!Array.isArray(ids)) {
        return false;
      }

      if (!ids.every(id => this.isValidId(id))) {
        return false;
      }
    }

    return true;
  }

  validateExtractRequest(url, platform) {
    if (!url || typeof url !== 'string') {
      return {
        valid: false,
        error: 'URL is required'
      };
    }

    try {
      new URL(url);
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid URL format'
      };
    }

    const allowedPlatforms = ['youtube', 'tiktok', 'reddit', 'article'];
    if (platform && !allowedPlatforms.includes(platform)) {
      return {
        valid: false,
        error: `Invalid platform: ${platform}`
      };
    }

    return { valid: true };
  }

  validatePrepareRequest(options = {}) {
    const { format = 'markdown', includeMetadata = true } = options;

    if (!['markdown', 'json', 'text'].includes(format)) {
      return {
        valid: false,
        error: 'Invalid format. Must be: markdown, json, or text'
      };
    }

    if (typeof includeMetadata !== 'boolean') {
      return {
        valid: false,
        error: 'includeMetadata must be a boolean'
      };
    }

    return { valid: true };
  }
}