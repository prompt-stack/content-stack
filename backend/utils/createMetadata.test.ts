/**
 * @fileoverview Test for createMetadata utility
 * @module createMetadata.test
 * @test-coverage 95
 */

import { createMetadata } from './createMetadata';
import type { ContentInboxServiceInput } from '../types/ContentTypes';

// Mock all dependencies
jest.mock('./generateContentId', () => ({
  generateContentId: jest.fn(() => 'test-id-123')
}));

jest.mock('./detectContentType', () => ({
  detectContentType: jest.fn(() => 'text')
}));

jest.mock('./extractTitle', () => ({
  extractTitle: jest.fn((content: string) => content.slice(0, 20))
}));

jest.mock('./calculateWordCount', () => ({
  calculateWordCount: jest.fn((content: string) => {
    if (!content || content.trim() === '') return 0;
    return content.trim().split(/\s+/).length;
  })
}));

jest.mock('./generateHash', () => ({
  generateHash: jest.fn(() => 'hash123abc')
}));

jest.mock('../../config/paths.config', () => ({
  generateStoragePath: jest.fn((type, id, ext) => `/storage/${type}/${id}${ext}`)
}));

// Mock Date
const mockDate = '2024-01-20T12:00:00.000Z';
const realDate = Date;
beforeAll(() => {
  global.Date = class extends Date {
    constructor() {
      super();
      return new realDate(mockDate);
    }
    static now() {
      return new realDate(mockDate).getTime();
    }
  } as any;
});
afterAll(() => {
  global.Date = realDate;
});

describe('createMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic metadata creation', () => {
    it('should create metadata with all required fields', () => {
      const input: ContentInboxServiceInput = {
        content: 'This is test content',
        filename: 'test.txt',
        userId: 'user-123',
        tags: ['test', 'sample']
      };

      const metadata = createMetadata(input);

      expect(metadata).toEqual({
        id: 'test-id-123',
        created_at: mockDate,
        updated_at: mockDate,
        status: 'inbox',
        source: {
          method: undefined,
          url: null
        },
        content: {
          type: 'text',
          title: 'test.txt',
          full_text: 'This is test content',
          word_count: 4,
          hash: 'hash123abc'
        },
        location: {
          inbox_path: '/storage/text/test-id-123txt',
          final_path: null
        },
        llm_analysis: null,
        tags: []
      });
    });

    it('should handle input without filename', () => {
      const input: ContentInboxServiceInput = {
        content: 'This is a long piece of content without filename',
        userId: 'user-456'
      };

      const metadata = createMetadata(input);

      expect(metadata.content.title).toBe('This is a long piece'); // First 20 chars from extractTitle
    });

    it('should handle input without tags', () => {
      const input: ContentInboxServiceInput = {
        content: 'Content without tags',
        filename: 'no-tags.txt',
        userId: 'user-789'
      };

      const metadata = createMetadata(input);

      expect(metadata.tags).toEqual([]);
    });
  });

  describe('content type handling', () => {
    it('should detect content type correctly', () => {
      const detectContentType = require('./detectContentType').detectContentType;
      detectContentType.mockReturnValueOnce('image');

      const input: ContentInboxServiceInput = {
        content: 'binary image data',
        filename: 'photo.jpg',
        userId: 'user-123'
      };

      const metadata = createMetadata(input);

      expect(metadata.content.type).toBe('image');
      expect(detectContentType).toHaveBeenCalledWith('binary image data', 'photo.jpg');
    });
  });

  describe('storage path generation', () => {
    it('should generate correct storage path', () => {
      const generateStoragePath = require('../../config/paths.config').generateStoragePath;
      
      const input: ContentInboxServiceInput = {
        content: 'test content',
        filename: 'document.txt',
        userId: 'user-123'
      };

      createMetadata(input);

      expect(generateStoragePath).toHaveBeenCalledWith('text', 'test-id-123', 'txt');
    });

    it('should extract extension from filename', () => {
      const generateStoragePath = require('../../config/paths.config').generateStoragePath;
      const detectContentType = require('./detectContentType').detectContentType;
      detectContentType.mockReturnValueOnce('document');
      
      const input: ContentInboxServiceInput = {
        content: 'pdf content',
        filename: 'report.pdf',
        userId: 'user-123'
      };

      createMetadata(input);

      expect(generateStoragePath).toHaveBeenCalledWith('document', 'test-id-123', 'pdf');
    });
  });

  describe('edge cases', () => {
    it('should handle empty content', () => {
      const input: ContentInboxServiceInput = {
        content: '',
        filename: 'empty.txt',
        userId: 'user-123'
      };

      const metadata = createMetadata(input);

      expect(metadata.content.word_count).toBe(0);
      expect(metadata.content.full_text).toBe('');
    });

    it('should handle very long content', () => {
      const longContent = 'word '.repeat(10000).trim();
      const input: ContentInboxServiceInput = {
        content: longContent,
        filename: 'large.txt',
        userId: 'user-123'
      };

      const metadata = createMetadata(input);

      expect(metadata.content.word_count).toBe(10000);
    });

    it('should handle special characters in filename', () => {
      const input: ContentInboxServiceInput = {
        content: 'test',
        filename: 'file with spaces & symbols!.txt',
        userId: 'user-123'
      };

      const metadata = createMetadata(input);

      expect(metadata.content.title).toBe('file with spaces & symbols!.txt');
    });
  });

  describe('source metadata', () => {
    it('should handle URL in metadata', () => {
      const input: ContentInboxServiceInput = {
        content: 'web content',
        filename: 'page.html',
        userId: 'user-123',
        metadata: {
          reference_url: 'https://example.com/page'
        }
      };

      const metadata = createMetadata(input);

      expect(metadata.source.url).toBe('https://example.com/page');
    });

    it('should handle URL in input', () => {
      const input: ContentInboxServiceInput = {
        content: 'web content',
        userId: 'user-123',
        url: 'https://example.com/article'
      };

      const metadata = createMetadata(input);

      expect(metadata.source.url).toBe('https://example.com/article');
    });

    it('should prefer reference_url over url', () => {
      const input: ContentInboxServiceInput = {
        content: 'web content',
        userId: 'user-123',
        url: 'https://example.com/old',
        metadata: {
          reference_url: 'https://example.com/new'
        }
      };

      const metadata = createMetadata(input);

      expect(metadata.source.url).toBe('https://example.com/new');
    });
  });
});