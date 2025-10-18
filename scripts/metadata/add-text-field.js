#!/usr/bin/env node

/**
 * Add content.text field to existing metadata files
 * This migration copies full_text to text for text-based content types
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const METADATA_DIR = path.join(__dirname, '..', '..', 'metadata');

// Content types that should have text extracted
const TEXT_BASED_TYPES = ['text', 'code', 'data', 'web', 'email'];

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

async function addTextField() {
  console.log('📝 Adding content.text Field to Metadata Files');
  console.log('===========================================\n');
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  try {
    const files = await fs.promises.readdir(METADATA_DIR);
    const metadataFiles = files.filter(f => f.endsWith('.json') && f.startsWith('content-'));
    
    log.info(`Found ${metadataFiles.length} metadata files to check\n`);
    
    for (const file of metadataFiles) {
      const filePath = path.join(METADATA_DIR, file);
      
      try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const metadata = JSON.parse(content);
        
        // Check if content.text field already exists
        if (metadata.content && metadata.content.text !== undefined) {
          skipped++;
          continue;
        }
        
        // Check if this is a text-based content type
        if (metadata.content && TEXT_BASED_TYPES.includes(metadata.content.type)) {
          // Add text field with full content
          metadata.content.text = metadata.content.full_text || null;
          
          // Write back to file
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(metadata, null, 2) + '\n'
          );
          
          updated++;
          log.success(`Updated ${file} - added text field for ${metadata.content.type} content`);
        } else if (metadata.content) {
          // For non-text types, add null text field
          metadata.content.text = null;
          
          // Write back to file
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(metadata, null, 2) + '\n'
          );
          
          updated++;
          log.detail(`Updated ${file} - added null text field for ${metadata.content.type} content`);
        } else {
          skipped++;
          log.warning(`Skipped ${file} - no content object`);
        }
        
      } catch (error) {
        errors++;
        log.error(`Failed to process ${file}: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log('===========');
    log.info(`Files checked: ${metadataFiles.length}`);
    log.success(`Files updated: ${updated}`);
    log.detail(`Files skipped: ${skipped}`);
    if (errors > 0) {
      log.error(`Errors: ${errors}`);
    }
    
    console.log('\n💡 Note:');
    console.log('The content.text field contains the full extracted text for LLM processing.');
    console.log('For text-based types (text, code, data, web, email), it mirrors full_text.');
    console.log('For binary types (image, video, audio, document), it is null until extraction services are added.');
    
  } catch (error) {
    log.error(`Failed to read metadata directory: ${error.message}`);
  }
}

// Run the migration
addTextField().catch(console.error);