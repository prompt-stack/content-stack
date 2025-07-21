/**
 * @file server/routes/index.js
 * @purpose Server-side index logic
 * @layer backend
 * @deps [import express from 'express';, import path from 'path';, import { PATHS } from '../../config/paths.js';, import { extractContent } from '../extractors.js';, import { promises as fs } from 'fs';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { PATHS } from '../../config/paths.js';
import { extractContent } from '../extractors.js';

const router = express.Router();

export default function(ROOT_DIR) {
    // Configuration endpoint
    router.get('/config/content-types', async (req, res) => {
        try {
            const configPath = path.join(ROOT_DIR, 'config', 'content-types.json');
            const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
            res.json(config);
        } catch (error) {
            console.error('Error reading content types config:', error);
            res.status(500).json({ error: 'Failed to load content types configuration' });
        }
    });

    // Archive endpoint
    router.get('/archive/:timestamp', async (req, res) => {
        try {
            const { timestamp } = req.params;
            const archiveDir = PATHS.archive;
            
            await fs.mkdir(archiveDir, { recursive: true });
            
            const files = await fs.readdir(archiveDir);
            
            for (const file of files) {
                if (file.includes(timestamp) && (file.endsWith('.txt') || file.endsWith('.md'))) {
                    const filePath = path.join(archiveDir, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    return res.json({ content, filename: file });
                }
            }
            
            return res.status(404).json({ error: 'Archived content not found' });
        } catch (error) {
            console.error('Error fetching archive:', error);
            res.status(500).json({ error: 'Failed to fetch archived content' });
        }
    });

    // Plugin endpoints
    router.get('/plugins', async (req, res) => {
        try {
            const pluginsDir = path.join(ROOT_DIR, 'plugins', 'installed');
            await fs.mkdir(pluginsDir, { recursive: true });
            
            const plugins = [];
            const items = await fs.readdir(pluginsDir, { withFileTypes: true });
            
            for (const item of items) {
                if (item.isDirectory()) {
                    const manifestPath = path.join(pluginsDir, item.name, 'manifest.json');
                    try {
                        const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
                        plugins.push({
                            ...manifest,
                            path: item.name,
                            enabled: true
                        });
                    } catch (e) {
                        console.error(`Failed to load plugin ${item.name}:`, e);
                    }
                }
            }
            
            res.json({ plugins });
        } catch (error) {
            console.error('Error fetching plugins:', error);
            res.status(500).json({ error: 'Failed to fetch plugins' });
        }
    });

    // Health check endpoint
    router.get('/health', async (req, res) => {
        res.json({
            status: 'ok',
            timestamp: Date.now(),
            uptime: process.uptime(),
            version: '1.0.0'
        });
    });

    // Health check for extractors
    router.get('/health/extractors', async (req, res) => {
        try {
            // Check if yt-dlp is available
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);
            
            let ytdlpAvailable = false;
            try {
                await execAsync('yt-dlp --version');
                ytdlpAvailable = true;
            } catch (e) {
                // yt-dlp not installed
            }
            
            res.json({
                youtube: ytdlpAvailable,
                reddit: true, // Always available
                article: true // Always available
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to check extractors' });
        }
    });

    // Extract content from URL
    router.post('/extract-url', async (req, res) => {
        try {
            const { url } = req.body;
            
            if (!url) {
                return res.status(400).json({ error: 'URL is required' });
            }
            
            console.log('Extracting content from:', url);
            
            // Use the centralized extractor
            const result = await extractContent(url);
            
            if (result.error || !result.content) {
                return res.json({
                    success: false,
                    error: result.error || 'Extraction failed'
                });
            }
            
            // Save to inbox
            const timestamp = Date.now();
            const platform = result.platform;
            const filename = `${platform}-${timestamp}.txt`;
            
            const inboxDir = PATHS.inbox;
            const metadataDir = PATHS.metadata.root;
            await fs.mkdir(inboxDir, { recursive: true });
            await fs.mkdir(metadataDir, { recursive: true });
            await fs.mkdir(PATHS.metadata.raw, { recursive: true });
            
            // Save content file
            const filePath = path.join(inboxDir, filename);
            await fs.writeFile(filePath, result.content, 'utf8');
            
            // Save metadata (new files go to raw subfolder)
            const metadataId = `inbox-${timestamp}`;
            const metadataPath = path.join(PATHS.metadata.raw, `${metadataId}.json`);
            const metadata = {
                id: metadataId,
                original_filename: result.title || 'Untitled',
                saved_filename: filename,
                source: 'url-extraction',
                saved_at: new Date().toISOString(),
                size: Buffer.byteLength(result.content, 'utf8'),
                status: 'raw',
                is_binary: false,
                mime_type: 'text/plain',
                original_content: result.content, // Add original content for token optimization
                extraction: {
                    platform: result.platform,
                    url: result.url,
                    title: result.title,
                    author: result.author || 'Unknown',
                    extractedAt: new Date().toISOString(),
                    metadata: result.metadata || {}
                },
                links: {
                    describes: [],
                    described_by: [],
                    part_of: [],
                    related: [],
                    source: [],
                    derived_from: [],
                    uploaded_with: []
                }
            };
            
            await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
            
            console.log(`✅ Extracted ${result.platform} content: ${filename}`);
            
            res.json({
                success: true,
                id: metadata.id,
                filename: filename,
                title: result.title,
                platform: result.platform,
                size: metadata.size
            });
            
        } catch (error) {
            console.error('URL extraction error:', error);
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
        }
    });

    return router;
}
