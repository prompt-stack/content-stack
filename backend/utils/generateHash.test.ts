/**
 * @fileoverview Test for generateHash utility
 * @module generateHash.test
 * @test-coverage 100
 */

import { generateHash } from './generateHash';
import { createHash } from 'crypto';

describe('generateHash', () => {
  describe('basic functionality', () => {
    it('should generate hash with sha256 prefix', () => {
      const content = 'Hello, World!';
      const hash = generateHash(content);
      
      expect(hash).toMatch(/^sha256-[a-f0-9]{64}$/);
    });

    it('should generate consistent hash for same content', () => {
      const content = 'Test content for hashing';
      const hash1 = generateHash(content);
      const hash2 = generateHash(content);
      
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different content', () => {
      const hash1 = generateHash('Content A');
      const hash2 = generateHash('Content B');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const hash = generateHash('');
      
      // SHA-256 of empty string
      expect(hash).toBe('sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });

    it('should handle very long content', () => {
      const longContent = 'x'.repeat(1000000); // 1MB of 'x'
      const hash = generateHash(longContent);
      
      expect(hash).toMatch(/^sha256-[a-f0-9]{64}$/);
    });

    it('should handle unicode content', () => {
      const unicodeContent = '你好世界 🌍 Привет мир';
      const hash = generateHash(unicodeContent);
      
      expect(hash).toMatch(/^sha256-[a-f0-9]{64}$/);
      
      // Should be consistent
      const hash2 = generateHash(unicodeContent);
      expect(hash).toBe(hash2);
    });

    it('should handle content with special characters', () => {
      const specialContent = '\n\r\t\0\x01\x02';
      const hash = generateHash(specialContent);
      
      expect(hash).toMatch(/^sha256-[a-f0-9]{64}$/);
    });
  });

  describe('hash properties', () => {
    it('should produce correct sha256 hash', () => {
      // Test with known SHA-256 hash
      const content = 'The quick brown fox jumps over the lazy dog';
      const expectedHash = 'sha256-d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592';
      
      expect(generateHash(content)).toBe(expectedHash);
    });

    it('should have fixed length output', () => {
      const testCases = [
        'a',
        'ab',
        'abc',
        'a'.repeat(100),
        'a'.repeat(1000)
      ];
      
      testCases.forEach(content => {
        const hash = generateHash(content);
        // sha256- (7 chars) + 64 hex chars = 71 total
        expect(hash.length).toBe(71);
      });
    });

    it('should be case sensitive', () => {
      const hash1 = generateHash('Hello');
      const hash2 = generateHash('hello');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should be whitespace sensitive', () => {
      const hash1 = generateHash('hello world');
      const hash2 = generateHash('hello  world'); // double space
      const hash3 = generateHash('hello\tworld'); // tab
      
      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash2).not.toBe(hash3);
    });
  });

  describe('deduplication use case', () => {
    it('should identify duplicate content', () => {
      const content1 = 'This is my blog post content';
      const content2 = 'This is my blog post content'; // exact duplicate
      const content3 = 'This is my blog post content.'; // slight difference
      
      const hash1 = generateHash(content1);
      const hash2 = generateHash(content2);
      const hash3 = generateHash(content3);
      
      // Duplicates should have same hash
      expect(hash1).toBe(hash2);
      
      // Different content should have different hash
      expect(hash1).not.toBe(hash3);
    });

    it('should work for file content deduplication', () => {
      const fileContent = JSON.stringify({
        title: 'Test Document',
        content: 'Lorem ipsum dolor sit amet',
        metadata: { created: '2024-01-20' }
      });
      
      const hash = generateHash(fileContent);
      
      // Should be consistent for same file content
      const hash2 = generateHash(fileContent);
      expect(hash).toBe(hash2);
      
      // Should differ if any part changes
      const modifiedContent = JSON.stringify({
        title: 'Test Document',
        content: 'Lorem ipsum dolor sit amet',
        metadata: { created: '2024-01-21' } // different date
      });
      
      const hash3 = generateHash(modifiedContent);
      expect(hash).not.toBe(hash3);
    });
  });

  describe('performance considerations', () => {
    it('should handle multiple calls efficiently', () => {
      const content = 'Performance test content';
      const iterations = 1000;
      
      const start = Date.now();
      for (let i = 0; i < iterations; i++) {
        generateHash(content);
      }
      const duration = Date.now() - start;
      
      // Should complete 1000 hashes in reasonable time (< 100ms)
      expect(duration).toBeLessThan(100);
    });
  });
});