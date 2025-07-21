/**
 * @file server/utils/files.js
 * @purpose Server-side files logic
 * @layer backend
 * @deps [import path from 'path';, import { promises as fs } from 'fs';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import { promises as fs } from 'fs';
import path from 'path';

export async function ensureDirectories(ROOT_DIR) {
    const dirs = [
        'inbox',
        'library', 
        'metadata',
        'archive',
        'plugins/installed'
    ];
    
    for (const dir of dirs) {
        await fs.mkdir(path.join(ROOT_DIR, dir), { recursive: true });
    }
}

export async function findContentById(libraryDir, contentId) {
    const items = await fs.readdir(libraryDir, { withFileTypes: true });
    
    for (const item of items) {
        if (item.isDirectory()) {
            const categoryPath = path.join(libraryDir, item.name);
            const files = await fs.readdir(categoryPath);
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(categoryPath, file);
                    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
                    
                    if (data.id === contentId) {
                        return { data, filePath };
                    }
                }
            }
        }
    }
    
    return null;
}

export async function getContentStats(ROOT_DIR) {
    const inboxDir = path.join(ROOT_DIR, 'inbox');
    const libraryDir = path.join(ROOT_DIR, 'library');
    const metadataDir = path.join(ROOT_DIR, 'metadata');
    
    // Ensure directories exist
    await ensureDirectories(ROOT_DIR);
    
    // Get metadata files first
    const metaFiles = await fs.readdir(metadataDir);
    
    // Count all content files in inbox (not just text)
    const inboxFiles = await fs.readdir(inboxDir);
    const contentFiles = inboxFiles.filter(f => 
        f !== 'README.md' && 
        !f.endsWith('.meta.json') &&
        !f.startsWith('.'));
    
    const rawCount = contentFiles.length;
    
    // Count metadata files
    const metaCount = metaFiles.filter(f => f.endsWith('.json')).length;
    
    // Get content type breakdown from library
    const contentTypes = {};
    const libraryItems = await fs.readdir(libraryDir, { withFileTypes: true });
    let actualProcessedCount = 0;
    
    for (const item of libraryItems) {
        if (item.isDirectory()) {
            const categoryDir = path.join(libraryDir, item.name);
            const files = await fs.readdir(categoryDir);
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    actualProcessedCount++;
                    const filePath = path.join(categoryDir, file);
                    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
                    contentTypes[data.content_type] = (contentTypes[data.content_type] || 0) + 1;
                }
            }
        } else if (item.name.endsWith('.json')) {
            // Count root level files too
            actualProcessedCount++;
            const filePath = path.join(libraryDir, item.name);
            const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
            contentTypes[data.content_type] = (contentTypes[data.content_type] || 0) + 1;
        }
    }
    
    return {
        inbox: {
            raw: rawCount,
            processed: actualProcessedCount,
            metadata: metaCount
        },
        contentTypes
    };
}

export function generateFilename(source, type, timestamp) {
    const prefixMap = {
        'url-extraction': {
            youtube: 'youtube',
            tiktok: 'tiktok',
            reddit: 'reddit',
            article: 'article'
        },
        'file-upload': {
            image: 'image',
            pdf: 'pdf',
            video: 'video',
            audio: 'audio',
            text: 'text',
            document: 'document',
            spreadsheet: 'spreadsheet'
        },
        'paste': {
            youtube: 'youtube-text',
            tiktok: 'tiktok-text',
            default: 'paste'
        }
    };
    
    let prefix = 'content';
    if (prefixMap[source] && prefixMap[source][type]) {
        prefix = prefixMap[source][type];
    } else if (prefixMap[source] && prefixMap[source].default) {
        prefix = prefixMap[source].default;
    }
    
    return `${prefix}-${timestamp}`;
}

export function detectContentType(content, filename = '') {
    const ext = path.extname(filename).toLowerCase();
    
    // Check by extension first
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
        return { type: 'image', isBinary: true };
    }
    if (ext === '.pdf') {
        return { type: 'pdf', isBinary: true };
    }
    if (['.mp4', '.avi', '.mov', '.webm'].includes(ext)) {
        return { type: 'video', isBinary: true };
    }
    if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
        return { type: 'audio', isBinary: true };
    }
    if (['.doc', '.docx', '.odt'].includes(ext)) {
        return { type: 'document', isBinary: true };
    }
    if (['.xls', '.xlsx', '.csv'].includes(ext)) {
        return { type: 'spreadsheet', isBinary: ext !== '.csv' };
    }
    
    // Check content for platform detection
    if (typeof content === 'string') {
        if (content.includes('youtube.com') || content.includes('youtu.be')) {
            return { type: 'youtube', isBinary: false };
        }
        if (content.includes('tiktok.com')) {
            return { type: 'tiktok', isBinary: false };
        }
        if (content.includes('reddit.com')) {
            return { type: 'reddit', isBinary: false };
        }
    }
    
    return { type: 'text', isBinary: false };
}

/**
 * Generate standardized inbox filename
 * @param {string} source - Content source (youtube, reddit, paste, etc)
 * @param {string} extension - File extension
 * @param {string|null} title - Optional title to include in filename
 * @returns {string} Generated filename
 */
export function generateInboxFilename(source, extension, title = null) {
    const timestamp = Date.now();
    
    // Clean title for filename (if provided)
    const titleSlug = title ? 
        '-' + title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 60) 
        : '';
    
    return `${source}${titleSlug}-${timestamp}.${extension}`;
}
