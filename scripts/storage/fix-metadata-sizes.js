#!/usr/bin/env node

/**
 * Script to fix file sizes in metadata files
 * This updates the storage.size field to match actual file sizes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const METADATA_DIR = path.join(__dirname, '..', 'metadata');
const STORAGE_DIR = path.join(__dirname, '..', 'storage');

async function getFileSize(filePath) {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.size;
  } catch (error) {
    return null;
  }
}

async function fixMetadataSizes() {
  console.log('Starting metadata size fix...\n');
  
  try {
    // Read all metadata files
    const metadataFiles = await fs.promises.readdir(METADATA_DIR);
    const jsonFiles = metadataFiles.filter(f => f.endsWith('.json') && f.startsWith('content-'));
    
    let fixed = 0;
    let errors = 0;
    
    for (const file of jsonFiles) {
      const metadataPath = path.join(METADATA_DIR, file);
      
      try {
        // Read metadata
        const content = await fs.promises.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(content);
        
        if (metadata.storage && metadata.storage.path) {
          // Get actual file path
          const storagePath = path.join(__dirname, '..', metadata.storage.path);
          const fileSize = await getFileSize(storagePath);
          
          if (fileSize !== null) {
            const oldSize = metadata.storage.size || 0;
            
            if (oldSize !== fileSize) {
              // Update size
              metadata.storage.size = fileSize;
              
              // Write back
              await fs.promises.writeFile(
                metadataPath,
                JSON.stringify(metadata, null, 2)
              );
              
              console.log(`✓ Fixed ${file}: ${oldSize} → ${fileSize} bytes`);
              fixed++;
            }
          } else {
            console.log(`✗ File not found for ${file}: ${metadata.storage.path}`);
            errors++;
          }
        }
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Total metadata files: ${jsonFiles.length}`);
    console.log(`- Fixed: ${fixed}`);
    console.log(`- Errors: ${errors}`);
    
  } catch (error) {
    console.error('Failed to fix metadata sizes:', error);
    process.exit(1);
  }
}

// Run the fix
fixMetadataSizes();