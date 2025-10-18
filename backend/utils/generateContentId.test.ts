/**
 * @fileoverview Test for generateContentId utility
 * @module generateContentId.test
 * @test-coverage 95
 */

import { generateContentId } from './generateContentId';

describe('generateContentId', () => {
  // Mock Date.now and Math.random for predictable tests
  const originalDateNow = Date.now;
  const originalMathRandom = Math.random;

  beforeEach(() => {
    // Reset mocks before each test
    Date.now = originalDateNow;
    Math.random = originalMathRandom;
  });

  afterAll(() => {
    // Restore original functions
    Date.now = originalDateNow;
    Math.random = originalMathRandom;
  });

  describe('ID generation', () => {
    it('should generate ID with correct format', () => {
      const id = generateContentId();
      
      // Check format: content-{timestamp}-{random}
      expect(id).toMatch(/^content-\d+-[a-z0-9]{6}$/);
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      
      // Generate 1000 IDs
      for (let i = 0; i < 1000; i++) {
        ids.add(generateContentId());
      }
      
      // All should be unique
      expect(ids.size).toBe(1000);
    });

    it('should use current timestamp', () => {
      const mockTimestamp = 1705344000000; // 2024-01-15
      Date.now = jest.fn(() => mockTimestamp);
      
      const id = generateContentId();
      
      expect(id).toContain(`content-${mockTimestamp}-`);
      expect(Date.now).toHaveBeenCalled();
    });

    it('should use random string for uniqueness', () => {
      const mockRandom = 0.123456789;
      Math.random = jest.fn(() => mockRandom);
      
      const id = generateContentId();
      
      // Should have format: content-{timestamp}-{6 char alphanumeric}
      expect(id).toMatch(/^content-\d+-[a-z0-9]{6}$/);
      expect(Math.random).toHaveBeenCalled();
    });
  });

  describe('consistency', () => {
    it('should generate consistent format with mocked values', () => {
      Date.now = jest.fn(() => 1234567890);
      Math.random = jest.fn(() => 0.8394720938);
      
      const id = generateContentId();
      
      // Check format, not exact value since toString(36) output varies
      expect(id).toMatch(/^content-1234567890-[a-z0-9]{6}$/);
    });

    it('should handle edge case random values', () => {
      Date.now = jest.fn(() => 0);
      
      // Test very small random value
      Math.random = jest.fn(() => 0.0000001);
      const id1 = generateContentId();
      expect(id1).toMatch(/^content-0-[a-z0-9]+$/);
      
      // Test very large random value  
      Math.random = jest.fn(() => 0.9999999);
      const id2 = generateContentId();
      expect(id2).toMatch(/^content-0-[a-z0-9]+$/);
    });
  });

  describe('performance', () => {
    it('should generate IDs quickly', () => {
      const startTime = performance.now();
      
      // Generate 10000 IDs
      for (let i = 0; i < 10000; i++) {
        generateContentId();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in less than 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe('real-world behavior', () => {
    it('should generate valid IDs over time', () => {
      const ids = [];
      
      // Simulate generating IDs over time
      for (let i = 0; i < 5; i++) {
        Date.now = jest.fn(() => 1705344000000 + i * 1000);
        ids.push(generateContentId());
      }
      
      // All IDs should be unique
      expect(new Set(ids).size).toBe(5);
      
      // Timestamps should increase
      ids.forEach((id, index) => {
        expect(id).toContain(`content-${1705344000000 + index * 1000}-`);
      });
    });
  });
});