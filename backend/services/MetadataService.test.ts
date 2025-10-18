/**
 * @fileoverview Test for MetadataService
 * @module MetadataService.test
 * @test-coverage 90
 */

import { MetadataService } from './MetadataService';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { ContentMetadata } from '../types/ContentTypes';

// Mock fs and path
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    unlink: jest.fn(),
    access: jest.fn()
  }
}));

jest.mock('../../config/paths.config', () => ({
  getMetadataPath: jest.fn((baseDir) => join(baseDir, 'content/metadata'))
}));

describe('MetadataService', () => {
  let service: MetadataService;
  const mockBaseDir = '/test/project';
  const mockMetadataDir = '/test/project/content/metadata';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MetadataService(mockBaseDir);
  });

  describe('getAllMetadata', () => {
    it('should return all metadata sorted by creation date', async () => {
      const mockFiles = ['content1.json', 'content2.json', 'notjson.txt'];
      const mockMetadata1: ContentMetadata = {
        id: 'content1',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'processed',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'First', wordCount: 100, hash: 'hash1', tags: [] },
        processing: { stage: 'complete', priority: 'normal', errors: [] },
        storage: { path: '/storage/content1.txt', size: 1000 }
      };

      const mockMetadata2: ContentMetadata = {
        id: 'content2',
        created_at: '2024-01-20T11:00:00Z', // Newer
        updated_at: '2024-01-20T11:00:00Z',
        status: 'processed',
        source: { userId: 'user1', uploadedAt: '2024-01-20T11:00:00Z' },
        content: { type: 'text', title: 'Second', wordCount: 200, hash: 'hash2', tags: [] },
        processing: { stage: 'complete', priority: 'normal', errors: [] },
        storage: { path: '/storage/content2.txt', size: 2000 }
      };

      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockMetadata1))
        .mockResolvedValueOnce(JSON.stringify(mockMetadata2));

      const result = await service.getAllMetadata();

      expect(fs.mkdir).toHaveBeenCalledWith(mockMetadataDir, { recursive: true });
      expect(fs.readdir).toHaveBeenCalledWith(mockMetadataDir);
      expect(fs.readFile).toHaveBeenCalledTimes(2);
      
      // Should be sorted by date descending (newest first)
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('content2');
      expect(result[1].id).toBe('content1');
    });

    it('should handle empty directory', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue([]);

      const result = await service.getAllMetadata();

      expect(result).toEqual([]);
    });

    it('should skip non-JSON files', async () => {
      const mockFiles = ['readme.txt', 'data.csv', 'image.png'];
      
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);

      const result = await service.getAllMetadata();

      expect(result).toEqual([]);
      expect(fs.readFile).not.toHaveBeenCalled();
    });

    it('should handle corrupted JSON files gracefully', async () => {
      const mockFiles = ['valid.json', 'corrupted.json'];
      const validMetadata: ContentMetadata = {
        id: 'valid',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'processed',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Valid', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'complete', priority: 'normal', errors: [] },
        storage: { path: '/storage/valid.txt', size: 1000 }
      };

      // Mock console.error to suppress error output in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(validMetadata))
        .mockResolvedValueOnce('{ invalid json');

      const result = await service.getAllMetadata();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('valid');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error reading metadata file corrupted.json:'),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle file read errors', async () => {
      const mockFiles = ['error.json'];
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await service.getAllMetadata();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getMetadataById', () => {
    it('should return metadata for existing ID', async () => {
      const mockMetadata: ContentMetadata = {
        id: 'test-id',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'processed',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Test', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'complete', priority: 'normal', errors: [] },
        storage: { path: '/storage/test.txt', size: 1000 }
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockMetadata));

      const result = await service.getMetadataById('test-id');

      expect(fs.readFile).toHaveBeenCalledWith(
        join(mockMetadataDir, 'content-test-id.json'),
        'utf-8'
      );
      expect(result).toEqual(mockMetadata);
    });

    it('should return null for non-existent ID', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));

      const result = await service.getMetadataById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('saveMetadata', () => {
    it('should save metadata to file', async () => {
      const mockMetadata: ContentMetadata = {
        id: 'save-test',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Save Test', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        storage: { path: '/storage/save-test.txt', size: 1000 }
      };

      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await service.saveMetadata(mockMetadata);

      expect(fs.mkdir).toHaveBeenCalledWith(mockMetadataDir, { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(
        join(mockMetadataDir, 'content-save-test.json'),
        JSON.stringify(mockMetadata, null, 2),
        'utf-8'
      );
    });

    it('should handle save errors', async () => {
      const mockMetadata: ContentMetadata = {
        id: 'error-test',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Error', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        storage: { path: '/storage/error.txt', size: 1000 }
      };

      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Disk full'));

      await expect(service.saveMetadata(mockMetadata)).rejects.toThrow('Disk full');
    });
  });

  describe('updateMetadata', () => {
    it('should update existing metadata', async () => {
      const existingMetadata: ContentMetadata = {
        id: 'update-test',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Original', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        storage: { path: '/storage/test.txt', size: 1000 }
      };

      const updates = {
        title: 'Updated Title',
        tags: ['new', 'updated']
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(existingMetadata));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await service.updateMetadata('update-test', updates);

      expect(result?.content.title).toBe('Updated Title');
      expect(result?.content.tags).toEqual(['new', 'updated']);
      expect(result?.updated_at).not.toBe(existingMetadata.updated_at);
    });

    it('should return null for non-existent metadata', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));

      const result = await service.updateMetadata('nonexistent', { title: 'New' });

      expect(result).toBeNull();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});