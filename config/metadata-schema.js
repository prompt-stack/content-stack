/**
 * @file config/metadata-schema.js
 * @purpose Configuration for metadata-schema
 * @layer config
 * @deps none
 * @llm-read true
 * @llm-write read-only
 * @llm-role entrypoint
 */

/**
 * Metadata Schema Configuration
 * Defines the standard structure for all metadata files in the system
 */

export const METADATA_SCHEMA = {
    // Required fields for all metadata
    required: {
        id: 'string',                    // Unique identifier (e.g., 'paste-1234567890')
        original_filename: 'string',      // Original name of the file/content
        saved_filename: 'string',         // Actual filename saved in inbox
        source: 'string',                 // Source type (paste, file-upload, url-youtube, etc.)
        saved_at: 'string',              // ISO timestamp when saved
        size: 'number',                  // Size in bytes
        content_hash: 'string',          // SHA-256 hash for deduplication
        status: 'string',                // raw, processed, archived
        is_binary: 'boolean',            // Whether content is binary
        mime_type: 'string',             // MIME type of content
    },
    
    // Optional fields
    optional: {
        original_content: 'string|null',  // Text content (null for binary files)
        reference_url: 'string|null',     // Reference/source URL for any content
        platform: 'string|null',          // Platform identifier (youtube, tiktok, etc.)
        extracted_at: 'string|null',      // When content was extracted
        orphaned: 'boolean|null',         // Whether this is orphaned content
        
        // User-provided metadata
        user_title: 'string|null',        // User-provided title
        user_tags: 'array|null',          // User-provided tags
        user_notes: 'string|null',        // User-provided notes
        
        // Relationship links
        links: {
            describes: 'array',           // IDs this content describes
            described_by: 'array',        // IDs that describe this content
            part_of: 'array',            // IDs this is part of
            related: 'array',            // Related content IDs
            source: 'array',             // Source URLs/references
            derived_from: 'array',       // IDs this was derived from
            uploaded_with: 'array'       // IDs uploaded together
        }
    },
    
    // Status values
    STATUS: {
        RAW: 'raw',
        PROCESSED: 'processed',
        ARCHIVED: 'archived'
    },
    
    // Common source prefixes
    SOURCE_TYPES: {
        PASTE: 'paste',
        FILE_UPLOAD: 'file-upload',
        URL_YOUTUBE: 'url-youtube',
        URL_TIKTOK: 'url-tiktok',
        URL_REDDIT: 'url-reddit',
        URL_ARTICLE: 'url-article',
        URL_EXTRACTION: 'url-extraction',
        IMAGE: 'image',
        PDF: 'pdf',
        VIDEO: 'video',
        AUDIO: 'audio',
        TEXT: 'text',
        DOCUMENT: 'document',
        SPREADSHEET: 'spreadsheet'
    }
};

/**
 * Create a standard metadata object
 * @param {Object} data - Metadata fields
 * @returns {Object} Standardized metadata object
 */
export function createMetadata(data) {
    const metadata = {
        // Required fields
        id: data.id,
        original_filename: data.original_filename,
        saved_filename: data.saved_filename,
        source: data.source,
        saved_at: data.saved_at || new Date().toISOString(),
        size: data.size,
        content_hash: data.content_hash,
        status: data.status || METADATA_SCHEMA.STATUS.RAW,
        is_binary: data.is_binary || false,
        mime_type: data.mime_type || 'text/plain',
        
        // Optional fields - only include if provided
        ...(data.original_content !== undefined && { original_content: data.original_content }),
        ...(data.reference_url && { reference_url: data.reference_url }),
        ...(data.platform && { platform: data.platform }),
        ...(data.extracted_at && { extracted_at: data.extracted_at }),
        ...(data.orphaned && { orphaned: data.orphaned }),
        ...(data.user_title && { user_title: data.user_title }),
        ...(data.user_tags && { user_tags: data.user_tags }),
        ...(data.user_notes && { user_notes: data.user_notes }),
        
        // Links structure
        links: {
            describes: [],
            described_by: [],
            part_of: [],
            related: [],
            source: data.reference_url ? [data.reference_url] : [],
            derived_from: [],
            uploaded_with: [],
            ...(data.links || {})
        }
    };
    
    return metadata;
}

/**
 * Validate metadata object against schema
 * @param {Object} metadata - Metadata to validate
 * @returns {Object} Validation result
 */
export function validateMetadata(metadata) {
    const errors = [];
    
    // Check required fields
    for (const [field, type] of Object.entries(METADATA_SCHEMA.required)) {
        if (!(field in metadata)) {
            errors.push(`Missing required field: ${field}`);
        } else if (typeof metadata[field] !== type) {
            errors.push(`Invalid type for ${field}: expected ${type}, got ${typeof metadata[field]}`);
        }
    }
    
    // Validate status
    if (metadata.status && !Object.values(METADATA_SCHEMA.STATUS).includes(metadata.status)) {
        errors.push(`Invalid status: ${metadata.status}`);
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}
