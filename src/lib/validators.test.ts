/**
 * @fileoverview Test for validators utility functions
 * @module validators.test
 * @test-coverage 95
 */

import { 
  validateURL, 
  extractVideoId, 
  detectPlatform, 
  validateFileType, 
  validateFileSize 
} from './validators';

describe('validators', () => {
  describe('validateURL', () => {
    it('should validate correct URLs', () => {
      expect(validateURL('https://example.com')).toBe(true);
      expect(validateURL('http://example.com')).toBe(true);
      expect(validateURL('https://example.com/path')).toBe(true);
      expect(validateURL('https://example.com/path?query=value')).toBe(true);
      expect(validateURL('https://example.com:8080')).toBe(true);
      expect(validateURL('ftp://files.example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateURL('not a url')).toBe(false);
      expect(validateURL('example.com')).toBe(false);
      expect(validateURL('http://')).toBe(false);
      expect(validateURL('')).toBe(false);
      expect(validateURL('javascript:alert(1)')).toBe(false);
      expect(validateURL('//example.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateURL('http://localhost')).toBe(true);
      expect(validateURL('http://192.168.1.1')).toBe(true);
      expect(validateURL('https://example.com/path with spaces')).toBe(true);
      expect(validateURL('data:text/plain;base64,SGVsbG8=')).toBe(true);
    });
  });

  describe('extractVideoId', () => {
    describe('YouTube', () => {
      it('should extract ID from youtube.com watch URLs', () => {
        expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        expect(extractVideoId('http://youtube.com/watch?v=ABC123')).toBe('ABC123');
        expect(extractVideoId('https://youtube.com/watch?v=123&feature=share')).toBe('123');
      });

      it('should extract ID from youtu.be URLs', () => {
        expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        expect(extractVideoId('http://youtu.be/ABC123')).toBe('ABC123');
        expect(extractVideoId('https://youtu.be/123?t=60')).toBe('123');
      });

      it('should handle YouTube edge cases', () => {
        expect(extractVideoId('https://m.youtube.com/watch?v=ABC123')).toBe('ABC123');
        expect(extractVideoId('youtube.com/watch?v=ABC-_123')).toBe('ABC-_123');
      });
    });

    describe('TikTok', () => {
      it('should extract ID from TikTok URLs', () => {
        expect(extractVideoId('https://www.tiktok.com/@user/video/1234567890')).toBe('1234567890');
        expect(extractVideoId('https://tiktok.com/@username123/video/9876543210')).toBe('9876543210');
        expect(extractVideoId('https://www.tiktok.com/@user.name/video/1111111111')).toBe('1111111111');
      });

      it('should handle TikTok usernames with special chars', () => {
        expect(extractVideoId('https://tiktok.com/@user-name/video/123')).toBe('123');
        expect(extractVideoId('https://tiktok.com/@user_name/video/456')).toBe('456');
        expect(extractVideoId('https://tiktok.com/@user.name/video/789')).toBe('789');
      });
    });

    it('should return null for non-video URLs', () => {
      expect(extractVideoId('https://example.com')).toBe(null);
      expect(extractVideoId('https://reddit.com/r/videos')).toBe(null);
      expect(extractVideoId('https://twitter.com/user/status/123')).toBe(null);
      expect(extractVideoId('')).toBe(null);
    });

    it('should return null for malformed video URLs', () => {
      expect(extractVideoId('youtube.com/watch')).toBe(null);
      expect(extractVideoId('https://youtu.be/')).toBe(null);
      expect(extractVideoId('tiktok.com/video/123')).toBe(null);
    });
  });

  describe('detectPlatform', () => {
    it('should detect YouTube', () => {
      expect(detectPlatform('https://www.youtube.com/watch?v=123')).toBe('youtube');
      expect(detectPlatform('https://youtu.be/123')).toBe('youtube');
      expect(detectPlatform('http://m.youtube.com/watch?v=123')).toBe('youtube');
    });

    it('should detect TikTok', () => {
      expect(detectPlatform('https://www.tiktok.com/@user/video/123')).toBe('tiktok');
      expect(detectPlatform('https://tiktok.com/video')).toBe('tiktok');
    });

    it('should detect Reddit', () => {
      expect(detectPlatform('https://www.reddit.com/r/test')).toBe('reddit');
      expect(detectPlatform('https://reddit.com/user/test')).toBe('reddit');
      expect(detectPlatform('https://old.reddit.com/r/test')).toBe('reddit');
    });

    it('should detect Twitter/X', () => {
      expect(detectPlatform('https://twitter.com/user/status/123')).toBe('twitter');
      expect(detectPlatform('https://x.com/user/status/123')).toBe('twitter');
      expect(detectPlatform('https://mobile.twitter.com/user')).toBe('twitter');
    });

    it('should default to article for unknown platforms', () => {
      expect(detectPlatform('https://example.com')).toBe('article');
      expect(detectPlatform('https://medium.com/article')).toBe('article');
      expect(detectPlatform('https://dev.to/post')).toBe('article');
      expect(detectPlatform('')).toBe('article');
    });
  });

  describe('validateFileType', () => {
    it('should validate accepted file types', () => {
      const imageFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
      expect(validateFileType(imageFile, ['.jpg', '.png', '.gif'])).toBe(true);

      const docFile = new File([''], 'document.pdf', { type: 'application/pdf' });
      expect(validateFileType(docFile, ['.pdf', '.doc', '.docx'])).toBe(true);
    });

    it('should reject non-accepted file types', () => {
      const exeFile = new File([''], 'program.exe', { type: 'application/exe' });
      expect(validateFileType(exeFile, ['.jpg', '.png', '.gif'])).toBe(false);

      const txtFile = new File([''], 'notes.txt', { type: 'text/plain' });
      expect(validateFileType(txtFile, ['.pdf', '.doc'])).toBe(false);
    });

    it('should handle case insensitive extensions', () => {
      const upperFile = new File([''], 'PHOTO.JPG', { type: 'image/jpeg' });
      expect(validateFileType(upperFile, ['.jpg'])).toBe(true);

      const mixedFile = new File([''], 'Document.PDF', { type: 'application/pdf' });
      expect(validateFileType(mixedFile, ['.pdf'])).toBe(true);
    });

    it('should handle files with multiple dots', () => {
      const multiDotFile = new File([''], 'my.document.backup.pdf', { type: 'application/pdf' });
      expect(validateFileType(multiDotFile, ['.pdf'])).toBe(true);
    });

    it('should handle files without extensions', () => {
      const noExtFile = new File([''], 'README', { type: 'text/plain' });
      expect(validateFileType(noExtFile, ['.txt'])).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should accept files within size limit', () => {
      const smallFile = new File(['a'.repeat(1000)], 'small.txt');
      expect(validateFileSize(smallFile, 2000)).toBe(true);

      const exactFile = new File(['a'.repeat(1024)], 'exact.txt');
      expect(validateFileSize(exactFile, 1024)).toBe(true);
    });

    it('should reject files over size limit', () => {
      const largeFile = new File(['a'.repeat(2000)], 'large.txt');
      expect(validateFileSize(largeFile, 1000)).toBe(false);

      const overByOne = new File(['a'.repeat(1025)], 'over.txt');
      expect(validateFileSize(overByOne, 1024)).toBe(false);
    });

    it('should handle zero-size files', () => {
      const emptyFile = new File([''], 'empty.txt');
      expect(validateFileSize(emptyFile, 1000)).toBe(true);
      expect(validateFileSize(emptyFile, 0)).toBe(true);
    });

    it('should handle various file sizes', () => {
      const sizes = [
        { size: 1024, limit: 1024 * 1024, expected: true }, // 1KB < 1MB
        { size: 1024 * 1024, limit: 1024 * 1024, expected: true }, // 1MB = 1MB
        { size: 1024 * 1024 * 5, limit: 1024 * 1024 * 10, expected: true }, // 5MB < 10MB
        { size: 1024 * 1024 * 11, limit: 1024 * 1024 * 10, expected: false }, // 11MB > 10MB
      ];

      sizes.forEach(({ size, limit, expected }) => {
        const file = new File(['a'.repeat(size)], 'test.txt');
        expect(validateFileSize(file, limit)).toBe(expected);
      });
    });
  });
});