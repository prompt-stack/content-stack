#!/usr/bin/env node

/**
 * Add category field to existing metadata files
 * This migration ensures all metadata files have the required category field
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const METADATA_DIR = path.join(__dirname, '..', 'metadata');

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

async function addCategoryField() {
  console.log('🏷️  Adding Category Field to Metadata Files');
  console.log('=========================================\n');
  
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
        
        // Check if category field already exists
        if (metadata.category) {
          skipped++;
          continue;
        }
        
        // Add category field with default value
        // Try to infer from llm_analysis first
        let category = 'general';
        
        if (metadata.llm_analysis && metadata.llm_analysis.category) {
          // Map from StorageCategory to ContentCategory if needed
          const categoryMap = {
            'articles': 'general',
            'notes': 'general',
            'code': 'tech',
            'images': 'general',
            'videos': 'entertainment',
            'audio': 'entertainment',
            'data': 'tech',
            'documents': 'general',
            'web': 'general',
            'design': 'general',
            'archives': 'general'
          };
          
          category = categoryMap[metadata.llm_analysis.category] || 'general';
        }
        
        // Try to detect from content
        if (metadata.content && metadata.content.title) {
          const title = metadata.content.title.toLowerCase();
          
          if (title.includes('code') || title.includes('programming') || 
              title.includes('api') || title.includes('development')) {
            category = 'tech';
          } else if (title.includes('business') || title.includes('marketing') || 
                     title.includes('startup')) {
            category = 'business';
          } else if (title.includes('health') || title.includes('fitness') || 
                     title.includes('wellness')) {
            category = 'health';
          } else if (title.includes('recipe') || title.includes('cooking') || 
                     title.includes('food')) {
            category = 'cooking';
          } else if (title.includes('learn') || title.includes('tutorial') || 
                     title.includes('guide')) {
            category = 'education';
          }
        }
        
        // Add category field - insert it after location for consistency
        const updatedMetadata = {
          id: metadata.id,
          created_at: metadata.created_at,
          updated_at: metadata.updated_at,
          status: metadata.status,
          source: metadata.source,
          content: metadata.content,
          location: metadata.location,
          storage: metadata.storage,
          category: category,  // Add the category field here
          llm_analysis: metadata.llm_analysis,
          tags: metadata.tags
        };
        
        // Write back to file
        await fs.promises.writeFile(
          filePath,
          JSON.stringify(updatedMetadata, null, 2) + '\n'
        );
        
        updated++;
        log.success(`Updated ${file} with category: ${category}`);
        
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
    log.detail(`Files skipped (already have category): ${skipped}`);
    if (errors > 0) {
      log.error(`Errors: ${errors}`);
    }
    
  } catch (error) {
    log.error(`Failed to read metadata directory: ${error.message}`);
  }
}

// Run the migration
addCategoryField().catch(console.error);