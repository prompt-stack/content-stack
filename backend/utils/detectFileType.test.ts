/**
 * @fileoverview Test for detectFileType utility
 * @module detectFileType.test
 * @test-coverage 95
 */

import { detectFileType } from './detectFileType';
import type { ContentType } from '../types/ContentTypes';

// Mock the config import
jest.mock('../../config/content-types.config', () => ({
  getContentTypeFromExtension: jest.fn((filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, ContentType> = {
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'pdf': 'document',
      'doc': 'document',
      'docx': 'document',
      'txt': 'text',
      'md': 'text',
      'mp4': 'video',
      'avi': 'video',
      'mp3': 'audio',
      'wav': 'audio',
      'js': 'code',
      'ts': 'code',
      'py': 'code',
    };
    return typeMap[ext || ''] || 'text';
  })
}));

describe('detectFileType', () => {
  describe('basic file type detection', () => {
    it('should detect image files correctly', () => {
      expect(detectFileType('photo.jpg')).toBe('image');
      expect(detectFileType('screenshot.png')).toBe('image');
      expect(detectFileType('animation.gif')).toBe('image');
      expect(detectFileType('picture.jpeg')).toBe('image');
    });

    it('should detect document files correctly', () => {
      expect(detectFileType('report.pdf')).toBe('document');
      expect(detectFileType('letter.doc')).toBe('document');
      expect(detectFileType('thesis.docx')).toBe('document');
    });

    it('should detect video files correctly', () => {
      expect(detectFileType('movie.mp4')).toBe('video');
      expect(detectFileType('clip.avi')).toBe('video');
    });

    it('should detect audio files correctly', () => {
      expect(detectFileType('song.mp3')).toBe('audio');
      expect(detectFileType('recording.wav')).toBe('audio');
    });

    it('should detect code files correctly', () => {
      expect(detectFileType('script.js')).toBe('code');
      expect(detectFileType('component.ts')).toBe('code');
      expect(detectFileType('app.py')).toBe('code');
    });

    it('should detect text files correctly', () => {
      expect(detectFileType('readme.txt')).toBe('text');
      expect(detectFileType('notes.md')).toBe('text');
    });
  });

  describe('web content detection', () => {
    it('should detect HTTP URLs as web content', () => {
      expect(detectFileType('http://example.com')).toBe('web');
      expect(detectFileType('http://example.com/page.html')).toBe('web');
    });

    it('should detect HTTPS URLs as web content', () => {
      expect(detectFileType('https://example.com')).toBe('web');
      expect(detectFileType('https://example.com/article')).toBe('web');
    });

    it('should not detect non-URLs as web content', () => {
      expect(detectFileType('httpfile.txt')).toBe('text');
      expect(detectFileType('https-security.pdf')).toBe('document');
    });
  });

  describe('code pattern detection in text files', () => {
    it('should detect code patterns in text content', () => {
      const codeContent = `
        function hello() {
          console.log("Hello World");
        }
      `;
      expect(detectFileType('notes.txt', codeContent)).toBe('code');
    });

    it('should detect various code patterns', () => {
      const patterns = [
        'const x = 42;',
        'import React from "react"',
        'export default MyComponent',
        'async function fetchData() {}',
        'class Person { }',
        'def calculate(x, y):',
        'public class Main',
        '```javascript\ncode\n```',
      ];

      patterns.forEach(content => {
        expect(detectFileType('file.txt', content)).toBe('code');
      });
    });

    it('should not detect regular text as code', () => {
      const regularText = 'This is just a regular text file with some words.';
      expect(detectFileType('notes.txt', regularText)).toBe('text');
    });
  });

  describe('edge cases', () => {
    it('should handle files without extensions', () => {
      expect(detectFileType('README')).toBe('text');
      expect(detectFileType('Makefile')).toBe('text');
    });

    it('should handle files with multiple dots', () => {
      expect(detectFileType('my.photo.backup.jpg')).toBe('image');
      expect(detectFileType('report.final.v2.pdf')).toBe('document');
    });

    it('should handle mixed case extensions', () => {
      expect(detectFileType('Photo.JPG')).toBe('image');
      expect(detectFileType('Document.PDF')).toBe('document');
    });

    it('should handle empty filenames gracefully', () => {
      expect(detectFileType('')).toBe('text');
    });

    it('should handle very long filenames', () => {
      const longFilename = 'x'.repeat(255) + '.jpg';
      expect(detectFileType(longFilename)).toBe('image');
    });
  });

  describe('content analysis edge cases', () => {
    it('should handle undefined content', () => {
      expect(detectFileType('file.txt', undefined)).toBe('text');
    });

    it('should handle empty content', () => {
      expect(detectFileType('file.txt', '')).toBe('text');
    });

    it('should handle content with only whitespace', () => {
      expect(detectFileType('file.txt', '   \n\t  ')).toBe('text');
    });

    it('should prioritize URL detection over extension', () => {
      expect(detectFileType('https://example.com/image.jpg')).toBe('web');
    });
  });
});