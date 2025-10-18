#!/usr/bin/env node

/**
 * Audit and fix metadata files to ensure they follow the correct schema
 * Fixes duplicate categories and other schema violations
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

// Required fields for valid metadata
const REQUIRED_FIELDS = [
  'id',
  'created_at',
  'updated_at',
  'status',
  'source',
  'content',
  'location',
  'tags'
];

// Valid status values
const VALID_STATUSES = ['inbox', 'processed', 'manually_processed', 'stored'];

// Valid content types
const VALID_CONTENT_TYPES = ['text', 'code', 'data', 'web', 'image', 'document', 'video', 'audio', 'email'];

// Valid categories
const VALID_CATEGORIES = ['tech', 'business', 'finance', 'health', 'cooking', 'education', 'lifestyle', 'entertainment', 'general'];

async function auditAndFixMetadata() {
  console.log('🔍 Auditing Metadata Files');
  console.log('==========================\n');
  
  let total = 0;
  let fixed = 0;
  let errors = 0;
  const issues = [];
  
  try {
    const files = await fs.promises.readdir(METADATA_DIR);
    const metadataFiles = files.filter(f => f.endsWith('.json') && f.startsWith('content-'));
    
    log.info(`Found ${metadataFiles.length} metadata files to audit\n`);
    
    for (const file of metadataFiles) {
      const filePath = path.join(METADATA_DIR, file);
      total++;
      
      try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const metadata = JSON.parse(content);
        const fileIssues = [];
        let needsFix = false;
        
        // Check for required fields
        for (const field of REQUIRED_FIELDS) {
          if (!(field in metadata)) {
            fileIssues.push(`Missing required field: ${field}`);
            needsFix = true;
          }
        }
        
        // Check for duplicate category fields
        if ('category' in metadata && metadata.llm_analysis?.category) {
          fileIssues.push('Duplicate category fields (top-level and in llm_analysis)');
          needsFix = true;
        }
        
        // Fix duplicate categories
        if (needsFix && 'category' in metadata && metadata.llm_analysis?.category) {
          // Keep the llm_analysis category as it's likely more accurate
          const category = metadata.llm_analysis.category || metadata.category || 'general';
          delete metadata.category; // Remove top-level category
          metadata.category = category; // Set correct top-level category
          
          // Clean up llm_analysis if it only had category
          if (metadata.llm_analysis && Object.keys(metadata.llm_analysis).length === 1) {
            metadata.llm_analysis = null;
          } else if (metadata.llm_analysis?.category) {
            delete metadata.llm_analysis.category;
          }
        }
        
        // Ensure category field exists
        if (!('category' in metadata)) {
          metadata.category = 'general';
          fileIssues.push('Missing category field');
          needsFix = true;
        }
        
        // Validate category value
        if (metadata.category && !VALID_CATEGORIES.includes(metadata.category)) {
          fileIssues.push(`Invalid category: ${metadata.category}`);
          metadata.category = 'general';
          needsFix = true;
        }
        
        // Validate status
        if (!VALID_STATUSES.includes(metadata.status)) {
          fileIssues.push(`Invalid status: ${metadata.status}`);
          metadata.status = 'inbox';
          needsFix = true;
        }
        
        // Ensure tags is an array
        if (!Array.isArray(metadata.tags)) {
          fileIssues.push('Tags is not an array');
          metadata.tags = [];
          needsFix = true;
        }
        
        // Validate content structure
        if (metadata.content) {
          if (!metadata.content.type) {
            fileIssues.push('Missing content.type');
            needsFix = true;
          } else if (!VALID_CONTENT_TYPES.includes(metadata.content.type)) {
            fileIssues.push(`Invalid content type: ${metadata.content.type}`);
            needsFix = true;
          }
          
          // Ensure content.text exists for text-based types
          const textBasedTypes = ['text', 'code', 'data', 'web', 'email'];
          if (textBasedTypes.includes(metadata.content.type) && !('text' in metadata.content)) {
            fileIssues.push('Missing content.text for text-based type');
            metadata.content.text = metadata.content.full_text || '';
            needsFix = true;
          }
        }
        
        // Ensure storage field exists
        if (!metadata.storage) {
          fileIssues.push('Missing storage field');
          // Try to reconstruct from location
          if (metadata.location?.inbox_path) {
            metadata.storage = {
              path: metadata.location.inbox_path,
              type: metadata.content?.type || 'text',
              size: metadata.content?.full_text?.length || 0
            };
            needsFix = true;
          }
        }
        
        if (fileIssues.length > 0) {
          issues.push({ file, issues: fileIssues });
          log.warning(`${file}:`);
          fileIssues.forEach(issue => log.detail(issue));
        }
        
        // Write fixed metadata back to file
        if (needsFix) {
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(metadata, null, 2) + '\n'
          );
          fixed++;
          log.success(`Fixed ${file}`);
        }
        
      } catch (error) {
        errors++;
        log.error(`Failed to process ${file}: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 Audit Summary:');
    console.log('================');
    log.info(`Total files: ${total}`);
    log.success(`Files fixed: ${fixed}`);
    log.detail(`Files already correct: ${total - fixed - errors}`);
    if (errors > 0) {
      log.error(`Errors: ${errors}`);
    }
    
    if (issues.length > 0) {
      console.log('\n🔧 Issues Fixed:');
      console.log('===============');
      const issueCounts = {};
      issues.forEach(({ issues: fileIssues }) => {
        fileIssues.forEach(issue => {
          const key = issue.split(':')[0];
          issueCounts[key] = (issueCounts[key] || 0) + 1;
        });
      });
      
      Object.entries(issueCounts).forEach(([issue, count]) => {
        log.detail(`${issue}: ${count} files`);
      });
    }
    
    console.log('\n✅ All metadata files now follow the correct schema!');
    
  } catch (error) {
    log.error(`Failed to read metadata directory: ${error.message}`);
  }
}

// Run the audit
auditAndFixMetadata().catch(console.error);