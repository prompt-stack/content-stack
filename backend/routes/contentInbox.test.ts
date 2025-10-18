/**
 * @fileoverview Test for content inbox API routes
 * @module contentInbox.test
 * @test-coverage 85
 */

import request from 'supertest';
import express from 'express';
import router from './contentInbox';
import { ContentInboxService } from '../services/ContentInboxService';
import { MetadataService } from '../services/MetadataService';

// Mock the services
jest.mock('../services/ContentInboxService');
jest.mock('../services/MetadataService');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/content-inbox', router);

describe('Content Inbox Routes', () => {
  let mockContentInboxService: jest.Mocked<ContentInboxService>;
  let mockMetadataService: jest.Mocked<MetadataService>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Get mocked instances
    mockContentInboxService = ContentInboxService.prototype as jest.Mocked<ContentInboxService>;
    mockMetadataService = MetadataService.prototype as jest.Mocked<MetadataService>;
  });

  describe('GET /api/content-inbox/items', () => {
    it('should return all inbox items successfully', async () => {
      const mockItems = [
        { id: '1', content: 'Test 1', status: 'inbox' },
        { id: '2', content: 'Test 2', status: 'inbox' }
      ];

      mockContentInboxService.getInboxContent = jest.fn().mockResolvedValue(mockItems);

      const response = await request(app)
        .get('/api/content-inbox/items')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        items: mockItems
      });
      expect(mockContentInboxService.getInboxContent).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting inbox items', async () => {
      mockContentInboxService.getInboxContent = jest.fn()
        .mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/content-inbox/items')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Database error'
      });
    });
  });

  describe('POST /api/content-inbox/add', () => {
    it('should add content successfully', async () => {
      const newContent = {
        method: 'direct',
        content: 'Test content',
        filename: 'test.txt',
        metadata: { tags: ['test'] }
      };

      const mockResult = {
        id: 'content-123',
        ...newContent,
        status: 'inbox'
      };

      mockContentInboxService.addContent = jest.fn().mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/content-inbox/add')
        .send(newContent)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        item: mockResult
      });

      expect(mockContentInboxService.addContent).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test content',
          filename: 'test.txt',
          userId: 'system'
        })
      );
    });

    it('should handle URL content', async () => {
      const urlContent = {
        method: 'url',
        url: 'https://example.com/article',
        metadata: { tags: ['article'] }
      };

      const mockResult = {
        id: 'content-456',
        content: 'Fetched content',
        url: urlContent.url,
        status: 'inbox'
      };

      mockContentInboxService.addContent = jest.fn().mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/content-inbox/add')
        .send(urlContent)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockContentInboxService.addContent).toHaveBeenCalledWith(
        expect.objectContaining({
          content: urlContent.url,
          userId: 'system'
        })
      );
    });

    it('should return 400 for missing required fields', async () => {
      const invalidContent = {
        method: 'direct'
        // missing content
      };

      const response = await request(app)
        .post('/api/content-inbox/add')
        .send(invalidContent)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Method and content are required'
      });

      expect(mockContentInboxService.addContent).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const content = {
        method: 'direct',
        content: 'Test content'
      };

      mockContentInboxService.addContent = jest.fn()
        .mockRejectedValue(new Error('Storage full'));

      const response = await request(app)
        .post('/api/content-inbox/add')
        .send(content)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Storage full'
      });
    });
  });

  describe('POST /api/content-inbox/process/:id', () => {
    it('should process content successfully', async () => {
      const contentId = 'content-123';
      const mockProcessed = {
        id: contentId,
        status: 'processed',
        processedAt: new Date().toISOString()
      };

      mockContentInboxService.processContent = jest.fn().mockResolvedValue(mockProcessed);

      const response = await request(app)
        .post(`/api/content-inbox/process/${contentId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        item: mockProcessed
      });

      expect(mockContentInboxService.processContent).toHaveBeenCalledWith(contentId);
    });

    it('should handle processing errors', async () => {
      const contentId = 'content-456';

      mockContentInboxService.processContent = jest.fn()
        .mockRejectedValue(new Error('Processing failed'));

      const response = await request(app)
        .post(`/api/content-inbox/process/${contentId}`)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Processing failed'
      });
    });
  });

  describe('DELETE /api/content-inbox/:id', () => {
    it('should delete content successfully', async () => {
      const contentId = 'content-789';

      mockContentInboxService.removeContent = jest.fn().mockResolvedValue(undefined);

      const response = await request(app)
        .delete(`/api/content-inbox/${contentId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Content removed from inbox'
      });

      expect(mockContentInboxService.removeContent).toHaveBeenCalledWith(contentId);
    });

    it('should handle deletion errors', async () => {
      const contentId = 'content-999';

      mockContentInboxService.removeContent = jest.fn()
        .mockRejectedValue(new Error('Content not found'));

      const response = await request(app)
        .delete(`/api/content-inbox/${contentId}`)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Content not found'
      });
    });
  });

  describe('PUT /api/content-inbox/:id/metadata', () => {
    it('should update metadata successfully', async () => {
      const contentId = 'content-123';
      const newMetadata = {
        title: 'Updated Title',
        tags: ['updated', 'test']
      };

      mockMetadataService.updateMetadata = jest.fn().mockResolvedValue({
        id: contentId,
        ...newMetadata
      });

      const response = await request(app)
        .put(`/api/content-inbox/${contentId}/metadata`)
        .send({ metadata: newMetadata })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockMetadataService.updateMetadata).toHaveBeenCalledWith(
        contentId,
        newMetadata
      );
    });
  });
});