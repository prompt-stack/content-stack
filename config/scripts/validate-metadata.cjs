#!/usr/bin/env node

/**
 * Simple metadata validator in plain JavaScript
 * No TypeScript compilation needed!
 */

const fs = require('fs');
const path = require('path');

// Import the schema values directly
const metadataSchema = {
  required: [
    'id', 'created_at', 'updated_at', 'status', 'title', 'filename',
    'source', 'content', 'location', 'user_tags', 'storage'
  ],
  statusValues: ['raw', 'enriched'],
  sourceMethodValues: ['paste', 'upload', 'url', 'drop', 'manual', 'api'],
  contentTypes: [
    'text', 'document', 'spreadsheet', 'presentation',
    'code', 'image', 'video', 'audio', 'archive',
    'design', 'email', 'web', 'data'
  ]
};

function validateMetadata(filePath) {
  const errors = [];
  
  // Read file
  let metadata;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    metadata = JSON.parse(content);
  } catch (e) {
    return { valid: false, errors: ['Invalid JSON format'] };
  }

  // Check required fields
  metadataSchema.required.forEach(field => {
    if (!(field in metadata)) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate status
  if (metadata.status && !metadataSchema.statusValues.includes(metadata.status)) {
    errors.push(`Invalid status: ${metadata.status}`);
  }

  // Validate source method
  if (metadata.source?.method && !metadataSchema.sourceMethodValues.includes(metadata.source.method)) {
    errors.push(`Invalid source method: ${metadata.source.method}`);
  }

  // Validate content type
  if (metadata.content?.type && !metadataSchema.contentTypes.includes(metadata.content.type)) {
    errors.push(`Invalid content type: ${metadata.content.type}`);
  }

  // Check enrichment consistency
  if (metadata.status === 'enriched' && !metadata.llm_analysis) {
    errors.push('Enriched content must have llm_analysis');
  }

  return { valid: errors.length === 0, errors };
}

// CLI usage
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Usage: node validate-metadata.js <metadata-file.json>');
    process.exit(1);
  }

  const result = validateMetadata(filePath);
  
  if (result.valid) {
    console.log('✅ Valid');
  } else {
    console.error('❌ Invalid:');
    result.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
}

module.exports = { validateMetadata };