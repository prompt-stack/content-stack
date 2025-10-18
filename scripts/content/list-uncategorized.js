#!/usr/bin/env node

/**
 * List all uncategorized content before removal
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..', '..');
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

async function listUncategorized() {
  console.log('📋 Listing Uncategorized Content');
  console.log('================================\n');
  
  const uncategorized = [];
  
  try {
    const files = await fs.promises.readdir(METADATA_DIR);
    const metadataFiles = files.filter(f => f.endsWith('.json') && f.startsWith('content-'));
    
    for (const file of metadataFiles) {
      const metadataPath = path.join(METADATA_DIR, file);
      
      try {
        const content = await fs.promises.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(content);
        
        const category = metadata.category || 'uncategorized';
        if (category.toLowerCase() === 'general' || category.toLowerCase() === 'uncategorized') {
          uncategorized.push({
            file,
            id: metadata.id,
            title: metadata.content?.title || 'Untitled',
            category: category,
            type: metadata.content?.type || 'unknown',
            created: metadata.created_at,
            size: metadata.storage?.size || 0
          });
        }
      } catch (error) {
        log.error(`Failed to read ${file}: ${error.message}`);
      }
    }
    
    if (uncategorized.length === 0) {
      log.success('No uncategorized content found!');
    } else {
      log.warning(`Found ${uncategorized.length} uncategorized items:\n`);
      
      uncategorized.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        log.detail(`File: ${item.file}`);
        log.detail(`Type: ${item.type}`);
        log.detail(`Category: ${item.category}`);
        log.detail(`Created: ${new Date(item.created).toLocaleDateString()}`);
        log.detail(`Size: ${item.size} bytes`);
        console.log('');
      });
    }
    
  } catch (error) {
    log.error(`Failed to read metadata directory: ${error.message}`);
  }
}

listUncategorized().catch(console.error);