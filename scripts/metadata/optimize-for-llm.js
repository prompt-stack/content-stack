#!/usr/bin/env node

/**
 * Optimize metadata files for LLM token efficiency
 * Removes redundant full_text field to reduce token usage
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

async function optimizeForLLM() {
  console.log('🚀 Optimizing Metadata for LLM Token Efficiency');
  console.log('===========================================\n');
  
  let processed = 0;
  let bytesReduced = 0;
  let errors = 0;
  
  try {
    const files = await fs.promises.readdir(METADATA_DIR);
    const metadataFiles = files.filter(f => f.endsWith('.json') && f.startsWith('content-'));
    
    log.info(`Found ${metadataFiles.length} metadata files to optimize\n`);
    
    for (const file of metadataFiles) {
      const filePath = path.join(METADATA_DIR, file);
      
      try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const metadata = JSON.parse(content);
        
        // Calculate size before
        const sizeBefore = content.length;
        
        // Check if optimization is needed
        if (metadata.content && metadata.content.full_text && metadata.content.full_text.length > 0) {
          // Clear full_text field
          const fullTextLength = metadata.content.full_text.length;
          metadata.content.full_text = '';
          
          // Write back optimized metadata
          const optimizedContent = JSON.stringify(metadata, null, 2) + '\n';
          await fs.promises.writeFile(filePath, optimizedContent);
          
          // Calculate reduction
          const sizeAfter = optimizedContent.length;
          const reduction = sizeBefore - sizeAfter;
          bytesReduced += reduction;
          
          processed++;
          log.success(`Optimized ${file} - removed ${fullTextLength} chars, saved ${reduction} bytes`);
        } else {
          log.detail(`Skipped ${file} - already optimized`);
        }
        
      } catch (error) {
        errors++;
        log.error(`Failed to process ${file}: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 Optimization Summary:');
    console.log('========================');
    log.info(`Files checked: ${metadataFiles.length}`);
    log.success(`Files optimized: ${processed}`);
    log.detail(`Total space saved: ${(bytesReduced / 1024).toFixed(2)} KB`);
    if (errors > 0) {
      log.error(`Errors: ${errors}`);
    }
    
    console.log('\n💡 Token Optimization Tips:');
    console.log('- Metadata files now only contain content.text for LLM processing');
    console.log('- Original content is preserved in storage files');
    console.log('- Use EnrichmentService.prepareEnrichmentPrompt() for efficient prompts');
    console.log('- Consider batch processing for multiple items');
    
  } catch (error) {
    log.error(`Failed to read metadata directory: ${error.message}`);
  }
}

// Run the optimization
optimizeForLLM().catch(console.error);