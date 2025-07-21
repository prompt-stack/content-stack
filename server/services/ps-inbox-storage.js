/**
 * @file server/services/ps-inbox-storage.js
 * @purpose Server-side ps-inbox-storage logic
 * @layer backend
 * @deps [import fs from 'fs/promises';, import path from 'path';, import { PATHS } from '../../config/paths.js';, import { dirCache } from '../utils/dir-cache.js';, import { isValidFilename,  isPathWithinDirectory } from '../utils/validation.js';, import { withLock } from '../utils/file-lock.js';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import fs from 'fs/promises';
import path from 'path';
import { PATHS } from '../../config/paths.js';
import { isValidFilename, isPathWithinDirectory } from '../utils/validation.js';
import { dirCache } from '../utils/dir-cache.js';
import { withLock } from '../utils/file-lock.js';

export class PSInboxStorage {
  constructor() {
    this.inboxPath = PATHS.inbox;
    this.metadataPath = PATHS.metadata.raw;
  }

  async ensureDirectories() {
    await fs.mkdir(this.inboxPath, { recursive: true });
    await fs.mkdir(this.metadataPath, { recursive: true });
  }

  async getAllItems() {
    await this.ensureDirectories();
    
    const files = await fs.readdir(this.inboxPath);
    const textFiles = files.filter(file => file.endsWith('.txt'));
    
    const items = await Promise.all(
      textFiles.map(async (file) => {
        const id = path.basename(file, '.txt');
        const metadata = await this.getMetadata(id);
        
        return {
          id,
          filename: file,
          metadata,
          hasContent: true
        };
      })
    );

    return items.filter(item => item !== null);
  }

  async getItem(id) {
    const contentPath = path.join(this.inboxPath, `${id}.txt`);
    const metadataPath = path.join(this.metadataPath, `${id}.json`);

    if (!isPathWithinDirectory(contentPath, this.inboxPath)) {
      throw new Error('Invalid path');
    }

    try {
      const [contentExists, metadataExists] = await Promise.all([
        fs.access(contentPath).then(() => true).catch(() => false),
        fs.access(metadataPath).then(() => true).catch(() => false)
      ]);

      if (!contentExists && !metadataExists) {
        return null;
      }

      let content = null;
      let metadata = null;

      if (contentExists) {
        content = await fs.readFile(contentPath, 'utf8');
      }

      if (metadataExists) {
        const metadataRaw = await fs.readFile(metadataPath, 'utf8');
        metadata = JSON.parse(metadataRaw);
      }

      return {
        id,
        filename: `${id}.txt`,
        content,
        metadata,
        hasContent: contentExists
      };
    } catch (error) {
      throw new Error(`Failed to get item: ${error.message}`);
    }
  }

  async saveItem(id, content, metadata) {
    await this.ensureDirectories();
    
    const contentPath = path.join(this.inboxPath, `${id}.txt`);
    const metadataPath = path.join(this.metadataPath, `${id}.json`);

    await withLock(contentPath, async () => {
      await Promise.all([
        fs.writeFile(contentPath, content, 'utf8'),
        fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8')
      ]);

      dirCache.invalidate(this.inboxPath);
      dirCache.invalidate(this.metadataPath);
    });
  }

  async saveFile(id, sourcePath, filename, metadata) {
    await this.ensureDirectories();
    
    const destPath = path.join(this.inboxPath, filename);
    const metadataPath = path.join(this.metadataPath, `${id}.json`);

    await withLock(destPath, async () => {
      await Promise.all([
        fs.rename(sourcePath, destPath),
        fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8')
      ]);

      dirCache.invalidate(this.inboxPath);
      dirCache.invalidate(this.metadataPath);
    });
  }

  async deleteItem(id) {
    const contentPath = path.join(this.inboxPath, `${id}.txt`);
    const metadataPath = path.join(this.metadataPath, `${id}.json`);

    return await withLock(contentPath, async () => {
      const [contentDeleted, metadataDeleted] = await Promise.all([
        fs.unlink(contentPath).then(() => true).catch(() => false),
        fs.unlink(metadataPath).then(() => true).catch(() => false)
      ]);

      if (contentDeleted || metadataDeleted) {
        dirCache.invalidate(this.inboxPath);
        dirCache.invalidate(this.metadataPath);
        return true;
      }

      const files = await fs.readdir(this.inboxPath);
      const fileToDelete = files.find(file => file.startsWith(id));
      
      if (fileToDelete) {
        await fs.unlink(path.join(this.inboxPath, fileToDelete));
        dirCache.invalidate(this.inboxPath);
        return true;
      }

      return false;
    });
  }

  async getMetadata(id) {
    const metadataPath = path.join(this.metadataPath, `${id}.json`);
    
    try {
      const data = await fs.readFile(metadataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async updateMetadata(id, updates) {
    const metadataPath = path.join(this.metadataPath, `${id}.json`);
    
    return await withLock(metadataPath, async () => {
      const existing = await this.getMetadata(id);
      if (!existing) {
        return null;
      }

      const updated = {
        ...existing,
        ...updates,
        updated_at: new Date().toISOString()
      };

      await fs.writeFile(metadataPath, JSON.stringify(updated, null, 2), 'utf8');
      dirCache.invalidate(this.metadataPath);
      
      return updated;
    });
  }

  async findByHash(contentHash) {
    const files = await fs.readdir(this.metadataPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    for (const file of jsonFiles) {
      try {
        const data = await fs.readFile(path.join(this.metadataPath, file), 'utf8');
        const metadata = JSON.parse(data);
        
        if (metadata.content_hash === contentHash) {
          return {
            id: metadata.id,
            filename: file
          };
        }
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  async linkItems(sourceId, targetId, linkType) {
    const sourceMetadata = await this.getMetadata(sourceId);
    const targetMetadata = await this.getMetadata(targetId);

    if (!sourceMetadata || !targetMetadata) {
      return false;
    }

    if (!sourceMetadata.links) {
      sourceMetadata.links = { describes: [], related: [], uploaded_with: [] };
    }

    if (!sourceMetadata.links[linkType].includes(targetId)) {
      sourceMetadata.links[linkType].push(targetId);
    }

    await this.updateMetadata(sourceId, { links: sourceMetadata.links });

    const reverseLinkType = linkType === 'describes' ? 'related' : linkType;
    if (!targetMetadata.links) {
      targetMetadata.links = { describes: [], related: [], uploaded_with: [] };
    }

    if (!targetMetadata.links[reverseLinkType].includes(sourceId)) {
      targetMetadata.links[reverseLinkType].push(sourceId);
    }

    await this.updateMetadata(targetId, { links: targetMetadata.links });

    return true;
  }
}
