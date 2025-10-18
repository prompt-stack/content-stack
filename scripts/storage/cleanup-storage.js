#!/usr/bin/env node

/**
 * Comprehensive storage cleanup script
 * - Removes placeholder binary files
 * - Cleans up orphaned metadata
 * - Fixes metadata inconsistencies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.join(__dirname, '..', 'storage');
const METADATA_DIR = path.join(__dirname, '..', 'metadata');
const BACKUP_DIR = path.join(__dirname, '..', 'backup', `cleanup-${new Date().toISOString().split('T')[0]}`);

async function ensureBackupDir() {
  await fs.promises.mkdir(BACKUP_DIR, { recursive: true });
}

async function backupFile(filePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  await fs.promises.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.promises.copyFile(filePath, backupPath);
  return backupPath;
}

async function removePlaceholderFiles() {
  console.log('\n1. Removing placeholder binary files...');
  
  const placeholderFiles = [
    'storage/documents/content-1753204489547-ox6b85.pdf',
    'storage/documents/content-1753204598519-tvc140.pdf',
    'storage/documents/content-1753280741624-9dexlw.pdf',
    'storage/documents/content-1753280764830-ichlbw.pdf',
    'storage/images/content-1753137071663-edg3w7.png',
    'storage/images/content-1753137530064-518om1.jpg',
    'storage/images/content-1753137530074-lteo60.jpg'
  ];
  
  let removed = 0;
  
  for (const file of placeholderFiles) {
    const fullPath = path.join(__dirname, '..', file);
    try {
      // Check if it's actually a placeholder
      const content = await fs.promises.readFile(fullPath, 'utf-8');
      if (content.startsWith('📄 Binary file:')) {
        // Backup first
        await backupFile(fullPath);
        // Remove file
        await fs.promises.unlink(fullPath);
        console.log(`  ✓ Removed placeholder: ${file}`);
        
        // Also remove corresponding metadata
        const basename = path.basename(file, path.extname(file));
        const metadataFile = path.join(METADATA_DIR, `${basename}.json`);
        if (await fs.promises.access(metadataFile).then(() => true).catch(() => false)) {
          await backupFile(metadataFile);
          await fs.promises.unlink(metadataFile);
          console.log(`  ✓ Removed metadata: ${basename}.json`);
        }
        
        removed++;
      }
    } catch (error) {
      console.log(`  ✗ Error processing ${file}: ${error.message}`);
    }
  }
  
  console.log(`  Removed ${removed} placeholder files and their metadata`);
}

async function findOrphanedMetadata() {
  console.log('\n2. Finding orphaned metadata...');
  
  const metadataFiles = await fs.promises.readdir(METADATA_DIR);
  const orphaned = [];
  
  for (const file of metadataFiles) {
    if (!file.endsWith('.json') || !file.startsWith('content-')) continue;
    
    try {
      const metadataPath = path.join(METADATA_DIR, file);
      const content = await fs.promises.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(content);
      
      if (metadata.storage && metadata.storage.path) {
        const storagePath = path.join(__dirname, '..', metadata.storage.path);
        const exists = await fs.promises.access(storagePath).then(() => true).catch(() => false);
        
        if (!exists) {
          orphaned.push({
            metadataFile: file,
            missingStorage: metadata.storage.path
          });
        }
      }
    } catch (error) {
      console.log(`  ✗ Error checking ${file}: ${error.message}`);
    }
  }
  
  if (orphaned.length > 0) {
    console.log(`  Found ${orphaned.length} orphaned metadata files:`);
    for (const item of orphaned) {
      console.log(`    - ${item.metadataFile} -> missing: ${item.missingStorage}`);
      
      // Backup and remove
      const metadataPath = path.join(METADATA_DIR, item.metadataFile);
      await backupFile(metadataPath);
      await fs.promises.unlink(metadataPath);
      console.log(`      ✓ Removed`);
    }
  } else {
    console.log('  ✓ No orphaned metadata found');
  }
}

async function fixMetadataTypeMismatch() {
  console.log('\n3. Fixing metadata type mismatches...');
  
  const metadataFiles = await fs.promises.readdir(METADATA_DIR);
  let fixed = 0;
  
  for (const file of metadataFiles) {
    if (!file.endsWith('.json') || !file.startsWith('content-')) continue;
    
    try {
      const metadataPath = path.join(METADATA_DIR, file);
      const content = await fs.promises.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(content);
      
      if (metadata.storage && metadata.storage.path) {
        // Extract directory name from path
        const pathParts = metadata.storage.path.split('/');
        if (pathParts.length >= 2) {
          const correctType = pathParts[1]; // e.g., "images", "documents", etc.
          
          // Fix common mismatches
          let fixedType = correctType;
          if (correctType === 'images' && metadata.storage.type === 'image') {
            fixedType = 'image'; // Keep singular
          } else if (correctType === 'documents' && metadata.storage.type === 'document') {
            fixedType = 'document'; // Keep singular
          }
          
          if (metadata.storage.type !== fixedType) {
            metadata.storage.type = fixedType;
            await fs.promises.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
            console.log(`  ✓ Fixed type for ${file}: ${metadata.storage.type} -> ${fixedType}`);
            fixed++;
          }
        }
      }
    } catch (error) {
      console.log(`  ✗ Error processing ${file}: ${error.message}`);
    }
  }
  
  console.log(`  Fixed ${fixed} type mismatches`);
}

async function generateSummary() {
  console.log('\n4. Generating final summary...');
  
  // Count files in storage
  const storageTypes = {};
  const dirs = await fs.promises.readdir(STORAGE_DIR, { withFileTypes: true });
  
  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const files = await fs.promises.readdir(path.join(STORAGE_DIR, dir.name));
      const validFiles = files.filter(f => !f.startsWith('.'));
      if (validFiles.length > 0) {
        storageTypes[dir.name] = validFiles.length;
      }
    }
  }
  
  // Count metadata files
  const metadataFiles = await fs.promises.readdir(METADATA_DIR);
  const validMetadata = metadataFiles.filter(f => f.endsWith('.json') && f.startsWith('content-'));
  
  console.log('\n📊 Final Storage Summary:');
  console.log('  Storage files by type:');
  for (const [type, count] of Object.entries(storageTypes)) {
    console.log(`    - ${type}: ${count} files`);
  }
  console.log(`  Total storage files: ${Object.values(storageTypes).reduce((a, b) => a + b, 0)}`);
  console.log(`  Total metadata files: ${validMetadata.length}`);
  console.log(`\n  Backup location: ${BACKUP_DIR}`);
}

async function main() {
  console.log('🧹 Storage Cleanup Script');
  console.log('========================\n');
  
  try {
    await ensureBackupDir();
    console.log(`Created backup directory: ${BACKUP_DIR}`);
    
    await removePlaceholderFiles();
    await findOrphanedMetadata();
    await fixMetadataTypeMismatch();
    await generateSummary();
    
    console.log('\n✅ Cleanup completed successfully!');
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Run cleanup
main();