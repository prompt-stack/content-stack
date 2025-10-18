#!/usr/bin/env node

/**
 * Storage integrity check script
 * Run regularly to ensure storage and metadata consistency
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.join(__dirname, '..', 'storage');
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

async function checkIntegrity() {
  console.log('🔍 Storage Integrity Check');
  console.log('=========================\n');
  
  const issues = {
    orphanedMetadata: [],
    orphanedStorage: [],
    sizeMismatch: [],
    placeholderFiles: [],
    invalidTimestamps: []
  };
  
  // Get all storage files
  const storageFiles = new Map();
  
  async function scanStorage(dir, basePath = '') {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);
      
      if (entry.isDirectory()) {
        await scanStorage(fullPath, relativePath);
      } else if (entry.isFile() && !entry.name.startsWith('.')) {
        const stats = await fs.promises.stat(fullPath);
        const storageKey = path.join('storage', relativePath);
        storageFiles.set(storageKey, {
          path: storageKey,
          size: stats.size,
          fullPath
        });
      }
    }
  }
  
  await scanStorage(STORAGE_DIR);
  
  // Check all metadata files
  const metadataFiles = await fs.promises.readdir(METADATA_DIR);
  const validMetadata = metadataFiles.filter(f => f.endsWith('.json') && f.startsWith('content-'));
  
  for (const metaFile of validMetadata) {
    try {
      const metaPath = path.join(METADATA_DIR, metaFile);
      const content = await fs.promises.readFile(metaPath, 'utf-8');
      const metadata = JSON.parse(content);
      
      // Check for invalid timestamps
      if (metadata.created_at && metadata.created_at.includes('N')) {
        issues.invalidTimestamps.push({
          file: metaFile,
          timestamp: metadata.created_at
        });
      }
      
      if (metadata.storage && metadata.storage.path) {
        const storageInfo = storageFiles.get(metadata.storage.path);
        
        if (!storageInfo) {
          // Storage file doesn't exist
          issues.orphanedMetadata.push({
            metadata: metaFile,
            missingStorage: metadata.storage.path
          });
        } else {
          // Check size match
          if (metadata.storage.size !== storageInfo.size) {
            issues.sizeMismatch.push({
              file: metadata.storage.path,
              metadataSize: metadata.storage.size,
              actualSize: storageInfo.size
            });
          }
          
          // Check for placeholder files
          if (storageInfo.size < 100 && 
              (metadata.storage.path.includes('.pdf') || 
               metadata.storage.path.includes('.jpg') || 
               metadata.storage.path.includes('.png'))) {
            
            // Read first few bytes to check
            const buffer = Buffer.alloc(100);
            const fd = await fs.promises.open(storageInfo.fullPath, 'r');
            await fd.read(buffer, 0, Math.min(100, storageInfo.size), 0);
            await fd.close();
            
            const content = buffer.toString('utf-8');
            if (content.startsWith('📄 Binary file:')) {
              issues.placeholderFiles.push({
                file: metadata.storage.path,
                size: storageInfo.size
              });
            }
          }
          
          // Mark as processed
          storageFiles.delete(metadata.storage.path);
        }
      }
    } catch (error) {
      log.error(`Failed to process ${metaFile}: ${error.message}`);
    }
  }
  
  // Remaining storage files have no metadata
  for (const [path, info] of storageFiles) {
    issues.orphanedStorage.push({
      storage: path,
      size: info.size
    });
  }
  
  // Report results
  console.log('📊 Results:\n');
  
  if (issues.orphanedMetadata.length > 0) {
    log.warning(`Found ${issues.orphanedMetadata.length} orphaned metadata files:`);
    issues.orphanedMetadata.forEach(item => {
      log.detail(`${item.metadata} → missing: ${item.missingStorage}`);
    });
    console.log();
  }
  
  if (issues.orphanedStorage.length > 0) {
    log.warning(`Found ${issues.orphanedStorage.length} storage files without metadata:`);
    issues.orphanedStorage.forEach(item => {
      log.detail(`${item.storage} (${item.size} bytes)`);
    });
    console.log();
  }
  
  if (issues.sizeMismatch.length > 0) {
    log.warning(`Found ${issues.sizeMismatch.length} size mismatches:`);
    issues.sizeMismatch.forEach(item => {
      log.detail(`${item.file}: metadata=${item.metadataSize}, actual=${item.actualSize}`);
    });
    console.log();
  }
  
  if (issues.placeholderFiles.length > 0) {
    log.warning(`Found ${issues.placeholderFiles.length} placeholder binary files:`);
    issues.placeholderFiles.forEach(item => {
      log.detail(`${item.file} (${item.size} bytes)`);
    });
    console.log();
  }
  
  if (issues.invalidTimestamps.length > 0) {
    log.warning(`Found ${issues.invalidTimestamps.length} invalid timestamps:`);
    issues.invalidTimestamps.forEach(item => {
      log.detail(`${item.file}: ${item.timestamp}`);
    });
    console.log();
  }
  
  // Summary
  const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
  
  if (totalIssues === 0) {
    log.success('No integrity issues found! Storage is healthy.');
  } else {
    console.log(`\n${colors.yellow}Total issues: ${totalIssues}${colors.reset}`);
    console.log('\nTo fix these issues, run:');
    console.log('  node scripts/cleanup-storage.js');
  }
  
  return issues;
}

// Run check
checkIntegrity().catch(console.error);