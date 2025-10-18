#!/usr/bin/env node

/**
 * Validate all metadata files against the schema
 * Does NOT modify files - only reports issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const METADATA_DIR = path.join(__dirname, '..', '..', 'metadata');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

const log = {
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  detail: (msg) => console.log(`${colors.gray}  ${msg}${colors.reset}`)
};

// Schema definition
const SCHEMA = {
  required: [
    'id', 'created_at', 'updated_at', 'status', 'source', 
    'content', 'location', 'tags', 'category'
  ],
  optional: ['storage', 'llm_analysis'],
  
  fieldTypes: {
    id: 'string',
    created_at: 'string',
    updated_at: 'string',
    status: 'string',
    category: 'string',
    tags: 'array',
    source: 'object',
    content: 'object',
    location: 'object',
    storage: 'object',
    llm_analysis: ['object', 'null']
  },
  
  validValues: {
    status: ['inbox', 'processed', 'manually_processed', 'stored'],
    category: ['tech', 'business', 'finance', 'health', 'cooking', 'education', 'lifestyle', 'entertainment', 'general'],
    'content.type': ['text', 'code', 'data', 'web', 'image', 'document', 'video', 'audio', 'email'],
    'source.method': ['paste', 'upload', 'url', 'drop']
  },
  
  nestedRequired: {
    source: ['method', 'url'],
    content: ['type', 'title', 'full_text', 'word_count', 'hash'],
    location: ['inbox_path', 'final_path'],
    storage: ['path', 'type', 'size']
  }
};

function validateField(obj, field, value, issues) {
  const expectedType = SCHEMA.fieldTypes[field];
  
  if (Array.isArray(expectedType)) {
    // Multiple allowed types
    const actualType = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    if (!expectedType.includes(actualType)) {
      issues.push(`${field}: expected ${expectedType.join(' or ')}, got ${actualType}`);
    }
  } else {
    // Single expected type
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== expectedType) {
      issues.push(`${field}: expected ${expectedType}, got ${actualType}`);
    }
  }
  
  // Check valid values
  if (SCHEMA.validValues[field] && !SCHEMA.validValues[field].includes(value)) {
    issues.push(`${field}: invalid value '${value}' (allowed: ${SCHEMA.validValues[field].join(', ')})`);
  }
}

function validateNestedObject(obj, path, required, issues) {
  if (!obj) return;
  
  required.forEach(field => {
    if (!(field in obj)) {
      issues.push(`Missing ${path}.${field}`);
    }
  });
  
  // Check nested valid values
  Object.keys(obj).forEach(field => {
    const fullPath = `${path}.${field}`;
    if (SCHEMA.validValues[fullPath]) {
      if (!SCHEMA.validValues[fullPath].includes(obj[field])) {
        issues.push(`${fullPath}: invalid value '${obj[field]}' (allowed: ${SCHEMA.validValues[fullPath].join(', ')})`);
      }
    }
  });
}

async function validateMetadata() {
  console.log('🔍 Validating Metadata Schema');
  console.log('============================\n');
  
  let total = 0;
  let valid = 0;
  let invalid = 0;
  const allIssues = [];
  
  try {
    const files = await fs.promises.readdir(METADATA_DIR);
    const metadataFiles = files.filter(f => f.endsWith('.json') && f.startsWith('content-'));
    
    log.info(`Validating ${metadataFiles.length} metadata files\n`);
    
    for (const file of metadataFiles) {
      const filePath = path.join(METADATA_DIR, file);
      total++;
      
      try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const metadata = JSON.parse(content);
        const issues = [];
        
        // Check required fields
        SCHEMA.required.forEach(field => {
          if (!(field in metadata)) {
            issues.push(`Missing required field: ${field}`);
          } else {
            validateField(metadata, field, metadata[field], issues);
          }
        });
        
        // Check for unexpected fields
        Object.keys(metadata).forEach(field => {
          if (!SCHEMA.required.includes(field) && !SCHEMA.optional.includes(field)) {
            issues.push(`Unexpected field: ${field}`);
          }
        });
        
        // Check for duplicate categories
        if (metadata.category && metadata.llm_analysis?.category) {
          issues.push('Duplicate category (in both top-level and llm_analysis)');
        }
        
        // Validate nested objects
        if (metadata.source) {
          validateNestedObject(metadata.source, 'source', SCHEMA.nestedRequired.source, issues);
        }
        if (metadata.content) {
          validateNestedObject(metadata.content, 'content', SCHEMA.nestedRequired.content, issues);
          
          // Special check for text field in text-based types
          const textBasedTypes = ['text', 'code', 'data', 'web', 'email'];
          if (textBasedTypes.includes(metadata.content.type) && !('text' in metadata.content)) {
            issues.push('Missing content.text for text-based content type');
          }
        }
        if (metadata.location) {
          validateNestedObject(metadata.location, 'location', SCHEMA.nestedRequired.location, issues);
        }
        if (metadata.storage) {
          validateNestedObject(metadata.storage, 'storage', SCHEMA.nestedRequired.storage, issues);
        }
        
        // Check ID matches filename
        const expectedId = file.replace('.json', '');
        if (metadata.id !== expectedId) {
          issues.push(`ID mismatch: ${metadata.id} !== ${expectedId}`);
        }
        
        if (issues.length === 0) {
          valid++;
        } else {
          invalid++;
          allIssues.push({ file, issues });
          log.error(`${file}:`);
          issues.forEach(issue => log.detail(issue));
          console.log('');
        }
        
      } catch (error) {
        invalid++;
        log.error(`${file}: Failed to parse JSON - ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 Validation Summary:');
    console.log('====================');
    log.info(`Total files: ${total}`);
    if (valid === total) {
      log.success(`All ${valid} files are valid! ✨`);
    } else {
      log.success(`Valid files: ${valid}`);
      log.error(`Invalid files: ${invalid}`);
    }
    
    if (allIssues.length > 0) {
      console.log('\n❌ Issues Found:');
      console.log('==============');
      const issueCounts = {};
      allIssues.forEach(({ issues }) => {
        issues.forEach(issue => {
          const key = issue.split(':')[0].trim();
          issueCounts[key] = (issueCounts[key] || 0) + 1;
        });
      });
      
      Object.entries(issueCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([issue, count]) => {
          log.detail(`${issue}: ${count} occurrence${count > 1 ? 's' : ''}`);
        });
        
      console.log('\n💡 Run "npm run metadata:fix" to automatically fix these issues');
    }
    
  } catch (error) {
    log.error(`Failed to read metadata directory: ${error.message}`);
  }
}

// Run validation
validateMetadata().catch(console.error);