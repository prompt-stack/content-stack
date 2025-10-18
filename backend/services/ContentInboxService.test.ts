/**
 * @fileoverview Test for ContentInboxService
 * @module ContentInboxService.test
 * @test-coverage 90
 */

import { ContentInboxService } from './ContentInboxService';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { ContentInboxServiceInput, ContentMetadata } from '../types/ContentTypes';

// Mock dependencies
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

jest.mock('../utils/createMetadata', () => ({
  createMetadata: jest.fn((input: ContentInboxServiceInput) => ({
    id: 'test-id-123',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    status: 'inbox',
    source: input.source,
    content: input.content,
    processing: {
      stage: 'new',
      priority: 'normal',
      errors: []
    },
    location: {
      inbox_path: 'content/inbox/test-file.txt'
    }
  }))
}));

jest.mock('../../config/content-types.config', () => ({
  getStorageDirectory: jest.fn((type: string) => {
    const typeMap: Record<string, string> = {
      text: 'text',
      image: 'images',
      video: 'videos',
      audio: 'audio',
      pdf: 'documents'
    };
    return typeMap[type] || 'misc';
  })
}));

jest.mock('../../config/paths.config', () => ({
  getStoragePaths: jest.fn(() => ({
    root: '/test/project/storage'
  })),
  getMetadataPath: jest.fn(() => '/test/project/content/metadata'),
  getAllRequiredDirectories: jest.fn(() => [
    '/test/project/content/inbox',
    '/test/project/content/metadata',
    '/test/project/storage'
  ]),
  toRelativePath: jest.fn((absolutePath: string) => absolutePath.replace('/test/project/', ''))
}));

describe('ContentInboxService', () => {
  let service: ContentInboxService;
  const mockBaseDir = '/test/project';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ContentInboxService(mockBaseDir);
  });

  describe('handleContentSubmission', () => {
    const mockInput: ContentInboxServiceInput = {
      source: {
        userId: 'user1',
        uploadedAt: '2024-01-20T10:00:00Z',
        method: 'upload'
      },
      content: {
        type: 'text',
        title: 'Test Content',
        full_text: 'This is test content',
        wordCount: 4,
        hash: 'test-hash',
        tags: ['test'],
        size: 19
      }
    };

    it('should successfully create content and metadata', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await service.handleContentSubmission(mockInput);

      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.id).toBe('test-id-123');
      expect(result.metadata?.storage).toEqual({
        path: 'storage/text/test-id-123.txt',
        type: 'text',
        size: 19
      });

      // Should write content to storage
      expect(fs.writeFile).toHaveBeenCalledWith(
        '/test/project/storage/text/test-id-123.txt',
        'This is test content',
        'utf-8'
      );

      // Should write metadata with truncated content
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('metadata'),
        expect.stringContaining('"full_text": "This is test content..."'),
        'utf-8'
      );
    });

    it('should handle storage write failure', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Disk full'));

      const result = await service.handleContentSubmission(mockInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Disk full');
    });

    it('should handle metadata write failure', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock)
        .mockResolvedValueOnce(undefined) // Storage write succeeds
        .mockRejectedValueOnce(new Error('Permission denied')); // Metadata write fails

      const result = await service.handleContentSubmission(mockInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });

    it('should determine correct storage directory by type', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      // Test image type
      const imageInput = {
        ...mockInput,
        content: { ...mockInput.content, type: 'image' as const }
      };

      await service.handleContentSubmission(imageInput);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('storage/images/'),
        expect.any(String),
        'utf-8'
      );
    });

    it('should handle long content by truncating in metadata', async () => {
      const longContent = 'a'.repeat(2000);
      const longInput = {
        ...mockInput,
        content: { ...mockInput.content, full_text: longContent }
      };

      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await service.handleContentSubmission(longInput);

      // Storage should get full content
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('storage/'),
        longContent,
        'utf-8'
      );

      // Metadata should get truncated content
      const metadataCall = (fs.writeFile as jest.Mock).mock.calls.find(
        call => call[0].includes('metadata')
      );
      expect(metadataCall[1]).toContain('"full_text": "' + 'a'.repeat(1000) + '..."');
    });
  });

  describe('getInboxContent', () => {
    it('should return valid metadata sorted by date', async () => {
      const mockFiles = ['content-1.json', 'content-2.json', 'readme.txt'];
      const mockMetadata1: ContentMetadata = {
        id: 'content-1',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'First', wordCount: 100, hash: 'hash1', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/first.txt' }
      };

      const mockMetadata2: ContentMetadata = {
        id: 'content-2',
        created_at: '2024-01-20T11:00:00Z', // Newer
        updated_at: '2024-01-20T11:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T11:00:00Z' },
        content: { type: 'text', title: 'Second', wordCount: 200, hash: 'hash2', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/second.txt' }
      };

      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockMetadata1))
        .mockResolvedValueOnce(JSON.stringify(mockMetadata2));
      (fs.access as jest.Mock).mockResolvedValue(undefined); // Files exist

      const result = await service.getInboxContent();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('content-2'); // Newer first
      expect(result[1].id).toBe('content-1');
    });

    it('should handle orphaned metadata by removing it', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockFiles = ['orphaned.json'];
      const orphanedMetadata: ContentMetadata = {
        id: 'orphaned',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Orphaned', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/missing.txt' }
      };

      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(orphanedMetadata));
      (fs.access as jest.Mock).mockRejectedValue(new Error('ENOENT')); // File missing
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      const result = await service.getInboxContent();

      expect(result).toHaveLength(0);
      expect(fs.unlink).toHaveBeenCalledWith('/test/project/content/metadata/orphaned.json');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CLEANUP] Found orphaned metadata')
      );

      consoleLogSpy.mockRestore();
    });

    it('should handle empty directory', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue([]);

      const result = await service.getInboxContent();

      expect(result).toEqual([]);
    });

    it('should handle read errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await service.getInboxContent();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting inbox content:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getMetadataById', () => {
    it('should return metadata for existing ID', async () => {
      const mockMetadata: ContentMetadata = {
        id: 'test-id',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Test', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/test.txt' }
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockMetadata));

      const result = await service.getMetadataById('test-id');

      expect(fs.readFile).toHaveBeenCalledWith(
        '/test/project/content/metadata/test-id.json',
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

  describe('updateMetadata', () => {
    it('should update metadata with deep merge', async () => {
      const existingMetadata: ContentMetadata = {
        id: 'update-test',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { 
          type: 'text', 
          title: 'Original', 
          wordCount: 100, 
          hash: 'hash', 
          tags: ['old'] 
        },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/test.txt' }
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(existingMetadata));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const updates = {
        content: {
          title: 'Updated Title',
          tags: ['new', 'updated']
        }
      };

      const result = await service.updateMetadata('update-test', updates);

      expect(result.success).toBe(true);
      
      const savedMetadata = JSON.parse(
        (fs.writeFile as jest.Mock).mock.calls[0][1]
      );
      
      expect(savedMetadata.content.title).toBe('Updated Title');
      expect(savedMetadata.content.tags).toEqual(['new', 'updated']);
      expect(savedMetadata.content.type).toBe('text'); // Preserved
      expect(savedMetadata.content.wordCount).toBe(100); // Preserved
      expect(savedMetadata.updated_at).not.toBe(existingMetadata.updated_at);
    });

    it('should handle non-existent metadata', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));

      const result = await service.updateMetadata('nonexistent', { content: { title: 'New' } });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Content not found');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle write errors', async () => {
      const existingMetadata: ContentMetadata = {
        id: 'error-test',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Test', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/test.txt' }
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(existingMetadata));
      (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Disk full'));

      const result = await service.updateMetadata('error-test', { content: { title: 'New' } });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Disk full');
    });
  });

  describe('deleteContent', () => {
    it('should delete both content and metadata files', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const mockMetadata: ContentMetadata = {
        id: 'delete-test',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Delete Me', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/delete-me.txt' }
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockMetadata));
      (fs.access as jest.Mock).mockResolvedValue(undefined); // Files exist
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteContent('delete-test');

      expect(result.success).toBe(true);
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(fs.unlink).toHaveBeenCalledWith('/test/project/content/inbox/delete-me.txt');
      expect(fs.unlink).toHaveBeenCalledWith('/test/project/content/metadata/delete-test.json');
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DELETE] Content file deleted successfully')
      );

      consoleLogSpy.mockRestore();
    });

    it('should handle already deleted content file', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const mockMetadata: ContentMetadata = {
        id: 'partial-delete',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Partial', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/missing.txt' }
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockMetadata));
      (fs.access as jest.Mock)
        .mockRejectedValueOnce({ code: 'ENOENT' }) // Content file missing
        .mockResolvedValueOnce(undefined); // Metadata file exists
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteContent('partial-delete');

      expect(result.success).toBe(true);
      expect(fs.unlink).toHaveBeenCalledTimes(1); // Only metadata deleted
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DELETE] Content file already deleted')
      );

      consoleLogSpy.mockRestore();
    });

    it('should handle non-existent content', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));

      const result = await service.deleteContent('nonexistent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Content not found');
      expect(fs.unlink).not.toHaveBeenCalled();
    });

    it('should handle deletion errors', async () => {
      const mockMetadata: ContentMetadata = {
        id: 'error-delete',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        status: 'inbox',
        source: { userId: 'user1', uploadedAt: '2024-01-20T10:00:00Z' },
        content: { type: 'text', title: 'Error', wordCount: 100, hash: 'hash', tags: [] },
        processing: { stage: 'new', priority: 'normal', errors: [] },
        location: { inbox_path: 'content/inbox/error.txt' }
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockMetadata));
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.unlink as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await service.deleteContent('error-delete');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });
  });

  describe('private methods', () => {
    it('should ensure all required directories exist', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue([]);

      await service.getInboxContent();

      expect(fs.mkdir).toHaveBeenCalledWith('/test/project/content/inbox', { recursive: true });
      expect(fs.mkdir).toHaveBeenCalledWith('/test/project/content/metadata', { recursive: true });
      expect(fs.mkdir).toHaveBeenCalledWith('/test/project/storage', { recursive: true });
    });
  });
});