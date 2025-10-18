/**
 * @fileoverview Test for calculateWordCount utility
 * @module calculateWordCount.test
 * @test-coverage 95
 */

import { calculateWordCount } from './calculateWordCount';

describe('calculateWordCount', () => {
  describe('basic word counting', () => {
    it('should count words correctly in normal text', () => {
      expect(calculateWordCount('Hello world')).toBe(2);
      expect(calculateWordCount('This is a test')).toBe(4);
      expect(calculateWordCount('One')).toBe(1);
    });

    it('should handle multiple spaces between words', () => {
      expect(calculateWordCount('Hello    world')).toBe(2);
      expect(calculateWordCount('This   is    a     test')).toBe(4);
      expect(calculateWordCount('Multiple     spaces')).toBe(2);
    });

    it('should handle various whitespace characters', () => {
      expect(calculateWordCount('Hello\tworld')).toBe(2);
      expect(calculateWordCount('Hello\nworld')).toBe(2);
      expect(calculateWordCount('Hello\r\nworld')).toBe(2);
      expect(calculateWordCount('Tab\tNewline\nReturn\rMixed')).toBe(4);
    });

    it('should trim leading and trailing whitespace', () => {
      expect(calculateWordCount('  Hello world  ')).toBe(2);
      expect(calculateWordCount('\t\tHello world\n\n')).toBe(2);
      expect(calculateWordCount('   Single   ')).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for empty string', () => {
      expect(calculateWordCount('')).toBe(0);
    });

    it('should return 0 for whitespace only', () => {
      expect(calculateWordCount('   ')).toBe(0);
      expect(calculateWordCount('\t\t\t')).toBe(0);
      expect(calculateWordCount('\n\n\n')).toBe(0);
      expect(calculateWordCount('   \t\n\r   ')).toBe(0);
    });

    it('should return 0 for null or undefined', () => {
      expect(calculateWordCount(null as any)).toBe(0);
      expect(calculateWordCount(undefined as any)).toBe(0);
    });

    it('should handle punctuation correctly', () => {
      expect(calculateWordCount('Hello, world!')).toBe(2);
      expect(calculateWordCount('one-word')).toBe(1);
      expect(calculateWordCount("it's a test")).toBe(3);
      expect(calculateWordCount('email@example.com')).toBe(1);
    });

    it('should handle numbers', () => {
      expect(calculateWordCount('123 456 789')).toBe(3);
      expect(calculateWordCount('3.14159')).toBe(1);
      expect(calculateWordCount('1st 2nd 3rd')).toBe(3);
    });
  });

  describe('special content', () => {
    it('should count words in sentences', () => {
      const sentence = 'The quick brown fox jumps over the lazy dog.';
      expect(calculateWordCount(sentence)).toBe(9);
    });

    it('should handle paragraphs', () => {
      const paragraph = `This is the first sentence.
      This is the second sentence.
      And this is the third.`;
      expect(calculateWordCount(paragraph)).toBe(13);
    });

    it('should handle special characters', () => {
      expect(calculateWordCount('café résumé naïve')).toBe(3);
      expect(calculateWordCount('hello@world.com is an email')).toBe(4);
      expect(calculateWordCount('#hashtag @mention')).toBe(2);
    });

    it('should handle code snippets', () => {
      const code = 'function test() { return true; }';
      expect(calculateWordCount(code)).toBe(6);
      
      const multilineCode = `
        const x = 42;
        console.log(x);
      `;
      expect(calculateWordCount(multilineCode)).toBe(5);
    });

    it('should handle very long text', () => {
      const longText = 'word '.repeat(1000);
      expect(calculateWordCount(longText)).toBe(1000);
    });

    it('should handle text with mixed languages', () => {
      expect(calculateWordCount('Hello 世界 world')).toBe(3);
      expect(calculateWordCount('Bonjour мир hello')).toBe(3);
    });
  });

  describe('performance', () => {
    it('should handle large texts efficiently', () => {
      const largeText = 'Lorem ipsum dolor sit amet '.repeat(10000);
      const startTime = performance.now();
      
      const count = calculateWordCount(largeText);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(count).toBe(50000);
      expect(duration).toBeLessThan(100); // Should process in under 100ms
    });
  });
});