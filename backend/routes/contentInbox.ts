/**
 * @layer backend-routes
 * @description API routes for content inbox operations
 * @dependencies express, ../services/ContentInboxService, ../services/MetadataService
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming conventions:
 * - Routes: /api/content-inbox/[action]
 * - Handlers: handle[Action]Request
 */

import { Router, Request, Response } from 'express';
import { ContentInboxService } from '../services/ContentInboxService';
import { MetadataService } from '../services/MetadataService';
import type { ContentInboxServiceInput } from '../types/ContentTypes';

const router = Router();
const contentInboxService = new ContentInboxService();
const metadataService = new MetadataService();

/**
 * GET /api/content-inbox/items
 * Get all content items from inbox
 */
router.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await contentInboxService.getInboxContent();
    res.json({ 
      success: true,
      items 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get inbox items'
    });
  }
});

/**
 * POST /api/content-inbox/add
 * Add new content to inbox
 */
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { method, content, url, filename, metadata } = req.body;
    
    if (!method || !content) {
      return res.status(400).json({
        success: false,
        error: 'Method and content are required'
      });
    }

    const input: ContentInboxServiceInput = {
      method,
      content,
      url,
      filename,
      metadata
    };

    const result = await contentInboxService.handleContentSubmission(input);
    
    if (result.success) {
      res.json({
        success: true,
        item: result.metadata
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('[ADD CONTENT ERROR]:', error);
    console.error('[ADD CONTENT ERROR STACK]:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add content'
    });
  }
});

/**
 * GET /api/content-inbox/item/:id
 * Get specific content item by ID
 */
router.get('/item/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await contentInboxService.getMetadataById(id);
    
    if (item) {
      res.json({
        success: true,
        item
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get content item'
    });
  }
});

/**
 * PUT /api/content-inbox/item/:id
 * Update content item metadata
 */
router.put('/item/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const frontendUpdates = req.body;
    
    // Transform frontend updates to backend format
    const backendUpdates: any = {};
    
    // Handle content updates FIRST
    if (frontendUpdates.content !== undefined) {
      backendUpdates.content = backendUpdates.content || {};
      backendUpdates.content.full_text = frontendUpdates.content;
      // Recalculate word count when content changes
      const words = frontendUpdates.content.trim().split(/\s+/).filter(Boolean);
      backendUpdates.content.word_count = words.length;
    }
    
    // Handle metadata updates (title, category, tags, etc.)
    if (frontendUpdates.metadata) {
      const { metadata } = frontendUpdates;
      
      // Update content title if provided
      if (metadata.title !== undefined) {
        backendUpdates.content = backendUpdates.content || {};
        backendUpdates.content.title = metadata.title;
      }
      
      // Update tags if provided
      if (metadata.tags !== undefined) {
        backendUpdates.tags = metadata.tags;
      }
      
      // Update category if provided
      if (metadata.category !== undefined) {
        backendUpdates.llm_analysis = backendUpdates.llm_analysis || {};
        backendUpdates.llm_analysis.category = metadata.category;
      }
      
      // Update source URL if provided (including empty string to remove URL)
      if (metadata.url !== undefined) {
        if (!backendUpdates.source) {
          backendUpdates.source = {};
        }
        backendUpdates.source.url = metadata.url.trim() || null;
      }
    }
    
    // Handle direct title updates
    if (frontendUpdates.title !== undefined) {
      backendUpdates.content = backendUpdates.content || {};
      backendUpdates.content.title = frontendUpdates.title;
    }
    
    // console.log('[PUT UPDATE] Frontend updates:', JSON.stringify(frontendUpdates, null, 2));
    // console.log('[PUT UPDATE] Backend updates:', JSON.stringify(backendUpdates, null, 2));
    
    const result = await contentInboxService.updateMetadata(id, backendUpdates);
    
    if (result.success) {
      // Get updated item
      const updatedItem = await contentInboxService.getMetadataById(id);
      res.json({
        success: true,
        item: updatedItem
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update content item'
    });
  }
});

/**
 * PUT /api/content-inbox/item/:id/remove
 * Remove item from inbox (changes status to stored)
 */
router.put('/item/:id/remove', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`[REMOVE FROM INBOX] Removing item from inbox: ${id}`);
    const result = await contentInboxService.removeFromInbox(id);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Content removed from inbox'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove from inbox'
    });
  }
});

/**
 * DELETE /api/content-inbox/item/:id
 * Delete content item (PERMANENTLY)
 */
router.delete('/item/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`[DELETE REQUEST] Attempting to delete item: ${id}`);
    const result = await contentInboxService.deleteContent(id);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Content deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete content item'
    });
  }
});

/**
 * GET /api/content-inbox/stats
 * Get inbox statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await metadataService.getMetadataStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats'
    });
  }
});

/**
 * GET /api/content-inbox/search
 * Search content items
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const results = await metadataService.searchMetadataByContent(q);
    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search content'
    });
  }
});

export default router;