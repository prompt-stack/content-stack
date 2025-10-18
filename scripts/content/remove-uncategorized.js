#!/usr/bin/env node

/**
 * Remove all uncategorized content from storage and metadata
 * Finds items with category 'general' or 'uncategorized' and removes them
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..', '..');
const STORAGE_DIR = path.join(ROOT_DIR, 'storage');
const METADATA_DIR = path.join(ROOT_DIR, 'metadata');

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

async function removeUncategorizedContent() {
  console.log('🗑️  Removing Uncategorized Content');
  console.log('==================================\n');
  
  let checked = 0;
  let removed = 0;
  let errors = 0;
  const removedItems = [];
  
  try {
    // Get all metadata files
    const files = await fs.promises.readdir(METADATA_DIR);
    const metadataFiles = files.filter(f => f.endsWith('.json') && f.startsWith('content-'));
    
    log.info(`Found ${metadataFiles.length} metadata files to check\n`);
    
    for (const file of metadataFiles) {
      const metadataPath = path.join(METADATA_DIR, file);
      checked++;
      
      try {
        const content = await fs.promises.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(content);
        
        // Check if category is 'general' or 'uncategorized'
        const category = metadata.category || 'uncategorized';
        if (category.toLowerCase() === 'general' || category.toLowerCase() === 'uncategorized') {
          log.warning(`Found uncategorized item: ${file}`);
          log.detail(`Category: ${category}`);
          log.detail(`Title: ${metadata.content?.title || 'Untitled'}`);
          
          // Find and remove storage file
          if (metadata.storage?.path) {
            const storagePath = path.join(ROOT_DIR, metadata.storage.path);
            try {
              await fs.promises.access(storagePath);
              await fs.promises.unlink(storagePath);
              log.success(`Removed storage file: ${metadata.storage.path}`);
            } catch (err) {
              if (err.code !== 'ENOENT') {
                log.error(`Failed to remove storage file: ${err.message}`);
                errors++;
              } else {
                log.detail(`Storage file already missing: ${metadata.storage.path}`);
              }
            }
          }
          
          // Remove metadata file
          await fs.promises.unlink(metadataPath);
          log.success(`Removed metadata file: ${file}`);
          
          removed++;
          removedItems.push({
            id: metadata.id,
            title: metadata.content?.title || 'Untitled',
            category: category,
            type: metadata.content?.type || 'unknown'
          });
          
          console.log(''); // Empty line for readability
        }
        
      } catch (error) {
        errors++;
        log.error(`Failed to process ${file}: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log('===========');
    log.info(`Files checked: ${checked}`);
    log.success(`Items removed: ${removed}`);
    if (errors > 0) {
      log.error(`Errors: ${errors}`);
    }
    
    if (removedItems.length > 0) {
      console.log('\n🗑️  Removed Items:');
      console.log('================');
      removedItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title} (${item.type}) - Category: ${item.category}`);
      });
    }
    
    console.log('\n✅ All uncategorized content has been removed!');
    
  } catch (error) {
    log.error(`Failed to read metadata directory: ${error.message}`);
  }
}

// Add confirmation prompt
import readline from 'readline';

console.log('⚠️  WARNING: This will permanently delete all uncategorized content!');
console.log('Items with category "general" or "uncategorized" will be removed.\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    rl.close();
    removeUncategorizedContent().catch(console.error);
  } else {
    console.log('\n❌ Operation cancelled.');
    rl.close();
  }
});