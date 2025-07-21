/**
 * @file server/routes/export.js
 * @purpose Server-side export logic
 * @layer backend
 * @deps [import archiver from 'archiver';, import express from 'express';, import path from 'path';, import { PATHS } from '../../config/paths.js';, import { Parser } from 'json2csv';, import { promises as fs } from 'fs';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { PATHS } from '../../config/paths.js';
import archiver from 'archiver';
import { Parser } from 'json2csv';

const router = express.Router();

export default function(ROOT_DIR) {
    // Export selected library items
    router.post('/selected', async (req, res) => {
        try {
            const { ids, format = 'json' } = req.body;
            
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: 'No items selected for export' });
            }
            
            // Collect all selected items
            const items = [];
            const categories = await fs.readdir(PATHS.library, { withFileTypes: true });
            
            for (const category of categories) {
                if (category.isDirectory()) {
                    const categoryPath = path.join(PATHS.library, category.name);
                    const files = await fs.readdir(categoryPath);
                    
                    for (const file of files) {
                        if (file.endsWith('.json')) {
                            const content = JSON.parse(
                                await fs.readFile(path.join(categoryPath, file), 'utf8')
                            );
                            
                            if (ids.includes(content.id)) {
                                // Fetch original content from metadata if needed
                                if (content.source_metadata_id) {
                                    try {
                                        const metadataFiles = [
                                            path.join(PATHS.metadata.processed, `${content.source_metadata_id}.json`),
                                            path.join(PATHS.metadata.raw, `${content.source_metadata_id}.json`),
                                            path.join(PATHS.metadata.root, `${content.source_metadata_id}.json`)
                                        ];
                                        
                                        for (const metaPath of metadataFiles) {
                                            try {
                                                const metadata = JSON.parse(await fs.readFile(metaPath, 'utf8'));
                                                content.original_content = metadata.original_content;
                                                break;
                                            } catch (e) {
                                                // Try next path
                                            }
                                        }
                                    } catch (e) {
                                        console.error('Could not fetch original content:', e);
                                    }
                                }
                                
                                items.push({
                                    ...content,
                                    category: category.name
                                });
                            }
                        }
                    }
                }
            }
            
            // Format and send response
            switch (format) {
                case 'csv':
                    return exportAsCSV(items, res);
                case 'markdown':
                    return exportAsMarkdown(items, res);
                case 'json':
                default:
                    return exportAsJSON(items, res);
            }
            
        } catch (error) {
            console.error('Export error:', error);
            res.status(500).json({ error: 'Export failed' });
        }
    });
    
    // Export all library content
    router.get('/all/:format?', async (req, res) => {
        try {
            const format = req.params.format || 'json';
            
            // Collect all library items
            const items = [];
            const categories = await fs.readdir(PATHS.library, { withFileTypes: true });
            
            for (const category of categories) {
                if (category.isDirectory()) {
                    const categoryPath = path.join(PATHS.library, category.name);
                    const files = await fs.readdir(categoryPath);
                    
                    for (const file of files) {
                        if (file.endsWith('.json')) {
                            const content = JSON.parse(
                                await fs.readFile(path.join(categoryPath, file), 'utf8')
                            );
                            items.push({
                                ...content,
                                category: category.name
                            });
                        }
                    }
                }
            }
            
            // Format and send response
            switch (format) {
                case 'csv':
                    return exportAsCSV(items, res);
                case 'markdown':
                    return exportAsMarkdown(items, res);
                case 'json':
                default:
                    return exportAsJSON(items, res);
            }
            
        } catch (error) {
            console.error('Export all error:', error);
            res.status(500).json({ error: 'Export failed' });
        }
    });
    
    // Export complete backup (ZIP with everything)
    router.get('/backup', async (req, res) => {
        try {
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename="content-stack-backup-${new Date().toISOString().split('T')[0]}.zip"`);
            
            const archive = archiver('zip', {
                zlib: { level: 9 } // Maximum compression
            });
            
            archive.pipe(res);
            
            // Add all content folders
            archive.directory(PATHS.library, 'library');
            archive.directory(PATHS.metadata.root, 'metadata');
            archive.directory(PATHS.inbox, 'inbox');
            archive.directory(PATHS.archive, 'archive');
            
            // Add configuration
            archive.file(path.join(ROOT_DIR, 'config', 'content-types.json'), { name: 'config/content-types.json' });
            
            // Add a manifest
            const manifest = {
                version: '1.0',
                exported_at: new Date().toISOString(),
                content_count: {
                    library: await countFiles(PATHS.library, '.json'),
                    metadata: await countFiles(PATHS.metadata.root, '.json'),
                    inbox: await countFiles(PATHS.inbox, '.txt'),
                    archive: await countFiles(PATHS.archive, '.txt')
                }
            };
            
            archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });
            
            await archive.finalize();
            
        } catch (error) {
            console.error('Backup error:', error);
            res.status(500).json({ error: 'Backup failed' });
        }
    });
    
    return router;
}

// Helper functions
function exportAsJSON(items, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="content-export-${Date.now()}.json"`);
    res.json({
        export_date: new Date().toISOString(),
        total_items: items.length,
        items: items
    });
}

function exportAsCSV(items, res) {
    try {
        // Flatten items for CSV
        const flatItems = items.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            summary: item.summary,
            source: item.source_metadata_id,
            created: item.processed_at,
            score: item.score,
            confidence: item.confidence,
            key_points: Array.isArray(item.key_points) ? item.key_points.join('; ') : '',
            topics: Array.isArray(item.topics) ? item.topics.join(', ') : ''
        }));
        
        const parser = new Parser();
        const csv = parser.parse(flatItems);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="content-export-${Date.now()}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('CSV export error:', error);
        res.status(500).json({ error: 'CSV export failed' });
    }
}

function exportAsMarkdown(items, res) {
    let markdown = `# Content Stack Export
Generated: ${new Date().toISOString()}
Total Items: ${items.length}

---

`;
    
    // Group by category
    const byCategory = {};
    items.forEach(item => {
        if (!byCategory[item.category]) {
            byCategory[item.category] = [];
        }
        byCategory[item.category].push(item);
    });
    
    // Generate markdown
    Object.entries(byCategory).forEach(([category, categoryItems]) => {
        markdown += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        
        categoryItems.forEach(item => {
            markdown += `### ${item.title}\n\n`;
            markdown += `**Summary:** ${item.summary}\n\n`;
            
            if (item.key_points && item.key_points.length > 0) {
                markdown += `**Key Points:**\n`;
                item.key_points.forEach(point => {
                    markdown += `- ${point}\n`;
                });
                markdown += '\n';
            }
            
            if (item.original_content) {
                markdown += `**Original Content:**\n\`\`\`\n${item.original_content}\n\`\`\`\n\n`;
            }
            
            markdown += `---\n\n`;
        });
    });
    
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="content-export-${Date.now()}.md"`);
    res.send(markdown);
}

async function countFiles(dir, extension) {
    try {
        let count = 0;
        const items = await fs.readdir(dir, { withFileTypes: true });
        
        for (const item of items) {
            if (item.isDirectory()) {
                count += await countFiles(path.join(dir, item.name), extension);
            } else if (item.name.endsWith(extension)) {
                count++;
            }
        }
        
        return count;
    } catch (error) {
        return 0;
    }
}
