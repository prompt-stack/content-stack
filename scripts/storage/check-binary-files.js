#!/usr/bin/env node

/**
 * Script to check for placeholder/corrupted binary files
 * Identifies files that should be binary but contain text placeholders
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.join(__dirname, '..', 'storage');

// File extensions that should be binary
const BINARY_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', // Images
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', // Documents
  '.mp3', '.mp4', '.wav', '.mov', '.avi', // Media
  '.zip', '.tar', '.gz', '.rar' // Archives
];

async function checkBinaryFiles() {
  console.log('Checking for placeholder/corrupted binary files...\n');
  
  const issues = [];
  
  async function checkDirectory(dir) {
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await checkDirectory(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          
          if (BINARY_EXTENSIONS.includes(ext)) {
            try {
              // Read first 100 bytes
              const buffer = Buffer.alloc(100);
              const fd = await fs.promises.open(fullPath, 'r');
              await fd.read(buffer, 0, 100, 0);
              await fd.close();
              
              // Check if it starts with text (UTF-8)
              const content = buffer.toString('utf-8');
              if (content.startsWith('📄 Binary file:') || 
                  content.includes('Binary file:') ||
                  content.match(/^[\x20-\x7E\n\r\t]+$/)) {
                // This is a text placeholder, not actual binary
                const stats = await fs.promises.stat(fullPath);
                const relativePath = path.relative(path.join(__dirname, '..'), fullPath);
                
                issues.push({
                  path: relativePath,
                  size: stats.size,
                  type: ext,
                  content: content.substring(0, 50).replace(/\n/g, ' ')
                });
              }
            } catch (error) {
              // If we can't read it as UTF-8, it's probably actual binary (good)
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error checking directory ${dir}:`, error.message);
    }
  }
  
  await checkDirectory(STORAGE_DIR);
  
  if (issues.length === 0) {
    console.log('✓ No placeholder/corrupted binary files found!');
  } else {
    console.log(`Found ${issues.length} placeholder/corrupted binary files:\n`);
    
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.path}`);
      console.log(`   Size: ${issue.size} bytes`);
      console.log(`   Type: ${issue.type}`);
      console.log(`   Content: "${issue.content}..."`);
      console.log();
    });
    
    console.log('These files contain text placeholders instead of actual binary data.');
    console.log('They should be re-uploaded or removed.');
  }
  
  return issues;
}

// Run the check
checkBinaryFiles();