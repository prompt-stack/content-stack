/**
 * @file server/routes/content.js
 * @purpose Server-side content logic
 * @layer backend
 * @deps [import express from 'express';, import path from 'path';, import { PATHS } from '../../config/paths.js';, import { dirCache } from '../utils/dir-cache.js';, import { findContentById,  getContentStats } from '../utils/files.js';, import { promises as fs } from 'fs';, import { searchCache } from '../utils/search-cache.js';, import { searchContent,  findSimilarContent,  detectDuplicates } from '../search.js';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { PATHS } from '../../config/paths.js';
import { searchContent, findSimilarContent, detectDuplicates } from '../search.js';
import { findContentById, getContentStats } from '../utils/files.js';
import { searchCache } from '../utils/search-cache.js';
import { dirCache } from '../utils/dir-cache.js';

const router = express.Router();

export default function(ROOT_DIR) {
    // Get library content with filters
    router.get('/library', async (req, res) => {
        try {
            const { category, type } = req.query;
            const libraryDir = PATHS.library;
            const content = [];
            
            await fs.mkdir(libraryDir, { recursive: true });
            
            const items = await dirCache.readdir(libraryDir, { withFileTypes: true });
            
            for (const item of items) {
                if (item.isDirectory()) {
                    const categoryDir = path.join(libraryDir, item.name);
                    const files = await dirCache.readdir(categoryDir);
                    
                    for (const file of files) {
                        if (file.endsWith('.json')) {
                            const filePath = path.join(categoryDir, file);
                            const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
                            
                            if ((!category || data.category === category) && 
                                (!type || data.content_type === type)) {
                                content.push(data);
                            }
                        }
                    }
                } else if (item.name.endsWith('.json')) {
                    const filePath = path.join(libraryDir, item.name);
                    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
                    
                    if ((!category || data.category === category) && 
                        (!type || data.content_type === type)) {
                        content.push(data);
                    }
                }
            }
            
            content.sort((a, b) => new Date(b.processed_at) - new Date(a.processed_at));
            
            res.json({
                total: content.length,
                content
            });
        } catch (error) {
            console.error('Error fetching content library:', error);
            res.status(500).json({ error: 'Failed to fetch content library' });
        }
    });

    // Get categories with counts
    router.get('/categories', async (req, res) => {
        try {
            const libraryDir = PATHS.library;
            await fs.mkdir(libraryDir, { recursive: true });
            
            const items = await dirCache.readdir(libraryDir, { withFileTypes: true });
            const categoryCounts = {};
            const categories = new Set();
            
            for (const item of items) {
                if (item.isDirectory()) {
                    const categoryDir = path.join(libraryDir, item.name);
                    const files = await dirCache.readdir(categoryDir);
                    const jsonFiles = files.filter(f => f.endsWith('.json'));
                    
                    if (jsonFiles.length > 0) {
                        categories.add(item.name);
                        categoryCounts[item.name] = jsonFiles.length;
                    }
                }
            }
            
            // Also check root directory for backwards compatibility
            for (const item of items) {
                if (!item.isDirectory() && item.name.endsWith('.json')) {
                    const filePath = path.join(libraryDir, item.name);
                    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
                    
                    if (data.category) {
                        categories.add(data.category);
                        categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
                    }
                }
            }
            
            res.json({
                categories: Array.from(categories),
                counts: categoryCounts
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    });

    // Get content statistics
    router.get('/stats', async (req, res) => {
        try {
            const stats = await getContentStats(ROOT_DIR);
            res.json(stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    });

    // Search content
    router.get('/search', async (req, res) => {
        try {
            const libraryDir = PATHS.library;
            const searchIndex = await searchCache.getIndex(libraryDir);
            
            const {
                q: query,
                category,
                topics,
                type: contentType,
                minScore,
                dateFrom,
                dateTo,
                limit = 50,
                offset = 0
            } = req.query;
            
            const results = searchContent(searchIndex, {
                query,
                category,
                topics: topics ? topics.split(',') : [],
                contentType,
                minScore: minScore ? parseInt(minScore) : 0,
                dateFrom,
                dateTo,
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
            
            res.json(results);
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({ error: 'Search failed' });
        }
    });

    // Get similar content
    router.get('/:id/similar', async (req, res) => {
        try {
            const libraryDir = PATHS.library;
            const searchIndex = await searchCache.getIndex(libraryDir);
            
            const { id } = req.params;
            const { limit = 5 } = req.query;
            
            const similar = findSimilarContent(searchIndex, id, parseInt(limit));
            res.json(similar);
        } catch (error) {
            console.error('Similar content error:', error);
            res.status(500).json({ error: 'Failed to find similar content' });
        }
    });

    // Detect duplicates
    router.get('/duplicates', async (req, res) => {
        try {
            const libraryDir = PATHS.library;
            const searchIndex = await searchCache.getIndex(libraryDir);
            
            const { threshold = 0.8 } = req.query;
            const duplicates = detectDuplicates(searchIndex, parseFloat(threshold));
            res.json(duplicates);
        } catch (error) {
            console.error('Duplicate detection error:', error);
            res.status(500).json({ error: 'Failed to detect duplicates' });
        }
    });

    // Get specific content item
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const libraryDir = PATHS.library;
            
            const result = await findContentById(libraryDir, id);
            
            if (result) {
                res.json(result.data);
            } else {
                res.status(404).json({ error: 'Content not found' });
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(500).json({ error: 'Failed to fetch content' });
        }
    });

    // Transform content via plugin
    router.post('/:id/transform', async (req, res) => {
        try {
            const { id } = req.params;
            const { plugin, transform } = req.body;
            
            // This would be implemented to call the appropriate plugin transform
            res.json({
                success: true,
                message: `Transform ${transform} from ${plugin} would be applied to content ${id}`
            });
        } catch (error) {
            console.error('Error transforming content:', error);
            res.status(500).json({ error: 'Failed to transform content' });
        }
    });

    // Link content items
    router.post('/link', async (req, res) => {
        try {
            const { contentIds, linkType = 'related', primaryId } = req.body;
            
            if (!contentIds || contentIds.length < 2) {
                return res.status(400).json({ error: 'Need at least 2 content IDs to link' });
            }
            
            const libraryDir = PATHS.library;
            const updatedFiles = [];
            
            // Link type mappings for directional relationships
            const linkTypeMap = {
                'describes': 'described_by',
                'described_by': 'describes',
                'source': 'derived_from',
                'derived_from': 'source',
                'contains': 'part_of',
                'part_of': 'contains',
                'related': 'related'
            };
            
            if (primaryId) {
                const complementaryType = linkTypeMap[linkType] || 'related';
                
                for (const contentId of contentIds) {
                    const result = await findContentById(libraryDir, contentId);
                    
                    if (result) {
                        const { data, filePath } = result;
                        if (!data.links) data.links = {};
                        
                        if (contentId === primaryId) {
                            const otherIds = contentIds.filter(id => id !== primaryId);
                            if (!data.links[linkType]) data.links[linkType] = [];
                            
                            for (const otherId of otherIds) {
                                if (!data.links[linkType].includes(otherId)) {
                                    data.links[linkType].push(otherId);
                                }
                            }
                        } else {
                            if (!data.links[complementaryType]) data.links[complementaryType] = [];
                            
                            if (!data.links[complementaryType].includes(primaryId)) {
                                data.links[complementaryType].push(primaryId);
                            }
                        }
                        
                        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
                        updatedFiles.push(contentId);
                    }
                }
            } else {
                // Peer-to-peer linking
                for (const contentId of contentIds) {
                    const result = await findContentById(libraryDir, contentId);
                    
                    if (result) {
                        const { data, filePath } = result;
                        const otherIds = contentIds.filter(id => id !== contentId);
                        
                        if (!data.links) data.links = {};
                        if (!data.links[linkType]) data.links[linkType] = [];
                        
                        for (const otherId of otherIds) {
                            if (!data.links[linkType].includes(otherId)) {
                                data.links[linkType].push(otherId);
                            }
                        }
                        
                        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
                        updatedFiles.push(contentId);
                    }
                }
            }
            
            res.json({ success: true, linked: updatedFiles });
        } catch (error) {
            console.error('Error linking content:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Debug endpoint for cache stats
    router.get('/debug/cache-stats', async (req, res) => {
        try {
            const searchStats = searchCache.getStats();
            const dirStats = dirCache.getStats();
            const memoryUsage = process.memoryUsage();
            
            res.json({
                searchCache: searchStats,
                directoryCache: dirStats,
                memory: {
                    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`
                },
                uptime: process.uptime()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    return router;
}
