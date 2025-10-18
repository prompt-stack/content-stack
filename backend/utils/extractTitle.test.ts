/**
 * @fileoverview Test for extractTitle utility
 * @module extractTitle.test
 * @test-coverage 95
 */

import { extractTitle } from './extractTitle';

describe('extractTitle', () => {
  describe('markdown headers', () => {
    it('should extract H1 headers', () => {
      expect(extractTitle('# Main Title')).toBe('Main Title');
      expect(extractTitle('# This is a Header')).toBe('This is a Header');
      expect(extractTitle('#  Extra Spaces  ')).toBe('Extra Spaces');
    });

    it('should extract H2 headers when no H1', () => {
      expect(extractTitle('## Secondary Title')).toBe('Secondary Title');
      expect(extractTitle('## Another Header')).toBe('Another Header');
    });

    it('should prefer H1 over H2', () => {
      const content = `# Primary Title
## Secondary Title
Some content`;
      expect(extractTitle(content)).toBe('Primary Title');
    });

    it('should handle headers with special characters', () => {
      expect(extractTitle('# Title with **bold** text')).toBe('Title with **bold** text');
      expect(extractTitle('# Title with [link](url)')).toBe('Title with [link](url)');
      expect(extractTitle('# Title with `code`')).toBe('Title with `code`');
    });
  });

  describe('plain text', () => {
    it('should use first line when no headers', () => {
      expect(extractTitle('This is the first line\nThis is second')).toBe('This is the first line');
      expect(extractTitle('Simple text content')).toBe('Simple text content');
    });

    it('should truncate long first lines', () => {
      const longLine = 'This is a very long first line that exceeds fifty characters and should be truncated';
      expect(extractTitle(longLine)).toBe('This is a very long first line that exceeds fifty...');
      
      const exactFifty = 'a'.repeat(50);
      expect(extractTitle(exactFifty)).toBe(exactFifty);
      
      const fiftyOne = 'a'.repeat(51);
      expect(extractTitle(fiftyOne)).toBe('a'.repeat(50) + '...');
    });

    it('should skip empty lines', () => {
      const content = `

First non-empty line
Second line`;
      expect(extractTitle(content)).toBe('First non-empty line');
    });

    it('should handle lines with only whitespace', () => {
      const content = `   
      
First real line`;
      expect(extractTitle(content)).toBe('First real line');
    });
  });

  describe('edge cases', () => {
    it('should return default for empty content', () => {
      expect(extractTitle('')).toBe('Untitled Content');
    });

    it('should return default for whitespace only', () => {
      expect(extractTitle('   ')).toBe('Untitled Content');
      expect(extractTitle('\n\n\n')).toBe('Untitled Content');
      expect(extractTitle('\t\t\t')).toBe('Untitled Content');
    });

    it('should handle content with only empty lines', () => {
      expect(extractTitle('\n\n\n\n')).toBe('Untitled Content');
    });

    it('should not treat non-header # as header', () => {
      expect(extractTitle('This is #not a header')).toBe('This is #not a header');
      expect(extractTitle(' # Not a header (space before)')).toBe('# Not a header (space before)');
      expect(extractTitle('#NoSpace')).toBe('#NoSpace');
    });

    it('should handle H3+ headers as regular text', () => {
      expect(extractTitle('### H3 Header')).toBe('### H3 Header');
      expect(extractTitle('#### H4 Header')).toBe('#### H4 Header');
    });
  });

  describe('special content types', () => {
    it('should handle code blocks', () => {
      const codeContent = '```javascript\nfunction test() {}\n```';
      expect(extractTitle(codeContent)).toBe('```javascript');
    });

    it('should handle lists', () => {
      expect(extractTitle('- First item\n- Second item')).toBe('- First item');
      expect(extractTitle('1. Numbered list\n2. Second item')).toBe('1. Numbered list');
    });

    it('should handle blockquotes', () => {
      expect(extractTitle('> This is a quote\n> More quote')).toBe('> This is a quote');
    });

    it('should handle mixed content', () => {
      const mixed = `Some intro text

# Actual Title

More content`;
      expect(extractTitle(mixed)).toBe('Some intro text');
    });

    it('should handle content with multiple empty lines between', () => {
      const content = `First line


Second line`;
      expect(extractTitle(content)).toBe('First line');
    });
  });

  describe('unicode and special characters', () => {
    it('should handle unicode correctly', () => {
      expect(extractTitle('# 你好世界')).toBe('你好世界');
      expect(extractTitle('# Café résumé')).toBe('Café résumé');
      expect(extractTitle('# 🚀 Rocket Title')).toBe('🚀 Rocket Title');
    });

    it('should handle various line endings', () => {
      expect(extractTitle('First\r\nSecond')).toBe('First');
      expect(extractTitle('First\rSecond')).toBe('First');
      expect(extractTitle('# Title\r\nContent')).toBe('Title');
    });
  });
});