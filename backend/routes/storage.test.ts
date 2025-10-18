/**
 * @fileoverview Test for storage API routes
 * @module storage.test
 * @test-coverage 90
 */

import request from 'supertest';
import express from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import storageRoutes from './storage';

// Mock dependencies
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    stat: jest.fn(),
    readFile: jest.fn(),
    unlink: jest.fn(),
    rename: jest.fn()
  }
}));

jest.mock('../../config/paths.config', () => ({
  getStoragePaths: jest.fn(() => ({
    root: '/test/storage'
  })),
  getMetadataPath: jest.fn(() => '/test/metadata')
}));

jest.mock('../../config/content-types.config', () => ({
  STORAGE_DIRECTORIES: {
    text: 'text',
    image: 'images',
    video: 'videos',
    audio: 'audio',
    pdf: 'documents'
  }
}));

// Create test app
const app = express();
app.use(express.json());
app.use('/api/storage', storageRoutes);

describe('Storage Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/storage/stats', () => {
    it('should return storage statistics for all types', async () => {
      // Mock file listings
      (fs.readdir as jest.Mock)
        .mockResolvedValueOnce(['file1.txt', 'file2.txt', '.hidden'])
        .mockResolvedValueOnce(['image1.jpg', 'image2.png'])
        .mockResolvedValueOnce([]) // Empty videos
        .mockResolvedValueOnce(['audio1.mp3'])
        .mockResolvedValueOnce(['doc1.pdf', 'doc2.pdf']);

      // Mock file stats
      (fs.stat as jest.Mock)
        .mockResolvedValue({ isFile: () => true, size: 1024 })
        .mockResolvedValueOnce({ isFile: () => true, size: 2048 }) // file1.txt
        .mockResolvedValueOnce({ isFile: () => true, size: 1024 }) // file2.txt
        .mockResolvedValueOnce({ isFile: () => true, size: 512 })  // .hidden
        .mockResolvedValueOnce({ isFile: () => true, size: 4096 }) // image1.jpg
        .mockResolvedValueOnce({ isFile: () => true, size: 3072 }) // image2.png
        .mockResolvedValueOnce({ isFile: () => true, size: 8192 }) // audio1.mp3
        .mockResolvedValueOnce({ isFile: () => true, size: 5120 }) // doc1.pdf
        .mockResolvedValueOnce({ isFile: () => true, size: 6144 }); // doc2.pdf

      const response = await request(app)
        .get('/api/storage/stats')
        .expect(200);

      expect(response.body).toEqual({
        stats: {
          text: { count: 2, size: 3584 }, // Excludes .hidden
          image: { count: 2, size: 7168 },
          video: { count: 0, size: 0 },
          audio: { count: 1, size: 8192 },
          pdf: { count: 2, size: 11264 }
        },
        total: {
          count: 7,
          size: 30208
        }
      });
    });

    it('should handle missing directories gracefully', async () => {
      (fs.readdir as jest.Mock)
        .mockRejectedValueOnce(new Error('ENOENT'))
        .mockResolvedValueOnce(['image.jpg'])
        .mockRejectedValueOnce(new Error('ENOENT'))
        .mockRejectedValueOnce(new Error('ENOENT'))
        .mockRejectedValueOnce(new Error('ENOENT'));

      (fs.stat as jest.Mock).mockResolvedValue({ isFile: () => true, size: 1024 });

      const response = await request(app)
        .get('/api/storage/stats')
        .expect(200);

      expect(response.body.stats).toEqual({
        text: { count: 0, size: 0 },
        image: { count: 1, size: 1024 },
        video: { count: 0, size: 0 },
        audio: { count: 0, size: 0 },
        pdf: { count: 0, size: 0 }
      });
    });

    it('should handle server errors', async () => {
      (fs.readdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const response = await request(app)
        .get('/api/storage/stats')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to get storage stats'
      });
    });
  });

  describe('GET /api/storage/:type', () => {
    it('should list files in a storage directory', async () => {
      const mockFiles = [
        { name: 'file1.txt', size: 1024, modified: '2024-01-20T10:00:00Z' },
        { name: 'file2.txt', size: 2048, modified: '2024-01-20T11:00:00Z' }
      ];

      (fs.readdir as jest.Mock).mockResolvedValue(['file1.txt', 'file2.txt']);
      (fs.stat as jest.Mock)
        .mockResolvedValueOnce({ 
          isFile: () => true, 
          size: 1024, 
          mtime: new Date('2024-01-20T10:00:00Z') 
        })
        .mockResolvedValueOnce({ 
          isFile: () => true, 
          size: 2048, 
          mtime: new Date('2024-01-20T11:00:00Z') 
        });

      const response = await request(app)
        .get('/api/storage/text')
        .expect(200);

      expect(response.body).toEqual({
        type: 'text',
        files: mockFiles.map(f => ({
          ...f,
          modified: expect.any(String)
        }))
      });
    });

    it('should return 400 for invalid storage type', async () => {
      const response = await request(app)
        .get('/api/storage/invalid')
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid storage type'
      });
    });

    it('should handle empty directories', async () => {
      (fs.readdir as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/storage/text')
        .expect(200);

      expect(response.body).toEqual({
        type: 'text',
        files: []
      });
    });

    it('should filter out directories and hidden files', async () => {
      (fs.readdir as jest.Mock).mockResolvedValue(['file.txt', '.hidden', 'subdir']);
      (fs.stat as jest.Mock)
        .mockResolvedValueOnce({ 
          isFile: () => true, 
          size: 1024, 
          mtime: new Date() 
        })
        .mockResolvedValueOnce({ 
          isFile: () => true, 
          size: 512, 
          mtime: new Date() 
        })
        .mockResolvedValueOnce({ 
          isFile: () => false, 
          size: 0, 
          mtime: new Date() 
        });

      const response = await request(app)
        .get('/api/storage/text')
        .expect(200);

      expect(response.body.files).toHaveLength(1);
      expect(response.body.files[0].name).toBe('file.txt');
    });
  });

  describe('DELETE /api/storage/:type/:filename', () => {
    it('should delete a file from storage', async () => {
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/storage/text/file-to-delete.txt')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'File deleted successfully'
      });
      expect(fs.unlink).toHaveBeenCalledWith('/test/storage/text/file-to-delete.txt');
    });

    it('should return 400 for invalid storage type', async () => {
      const response = await request(app)
        .delete('/api/storage/invalid/file.txt')
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid storage type'
      });
    });

    it('should handle file not found', async () => {
      (fs.unlink as jest.Mock).mockRejectedValue({ code: 'ENOENT' });

      const response = await request(app)
        .delete('/api/storage/text/nonexistent.txt')
        .expect(404);

      expect(response.body).toEqual({
        error: 'File not found'
      });
    });

    it('should handle deletion errors', async () => {
      (fs.unlink as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const response = await request(app)
        .delete('/api/storage/text/protected.txt')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to delete file'
      });
    });
  });

  describe('PUT /api/storage/:type/:filename/move', () => {
    it('should move file to different storage type', async () => {
      (fs.rename as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .put('/api/storage/text/document.txt/move')
        .send({ targetType: 'pdf' })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'File moved successfully',
        newPath: 'pdf/document.txt'
      });
      expect(fs.rename).toHaveBeenCalledWith(
        '/test/storage/text/document.txt',
        '/test/storage/documents/document.txt'
      );
    });

    it('should return 400 for invalid source type', async () => {
      const response = await request(app)
        .put('/api/storage/invalid/file.txt/move')
        .send({ targetType: 'pdf' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid storage type'
      });
    });

    it('should return 400 for invalid target type', async () => {
      const response = await request(app)
        .put('/api/storage/text/file.txt/move')
        .send({ targetType: 'invalid' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid target type'
      });
    });

    it('should return 400 for same source and target', async () => {
      const response = await request(app)
        .put('/api/storage/text/file.txt/move')
        .send({ targetType: 'text' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Source and target types are the same'
      });
    });

    it('should handle file not found', async () => {
      (fs.rename as jest.Mock).mockRejectedValue({ code: 'ENOENT' });

      const response = await request(app)
        .put('/api/storage/text/missing.txt/move')
        .send({ targetType: 'pdf' })
        .expect(404);

      expect(response.body).toEqual({
        error: 'File not found'
      });
    });
  });
});