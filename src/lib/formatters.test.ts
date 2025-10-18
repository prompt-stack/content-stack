/**
 * @fileoverview Test for formatters utility functions
 * @module formatters.test
 * @test-coverage 95
 */

import { formatDate, formatRelativeTime, formatFileSize, truncateText } from './formatters';

describe('formatters', () => {
  // Mock Date for consistent testing
  const mockNow = new Date('2024-01-20T12:00:00Z');
  const originalDate = global.Date;

  beforeEach(() => {
    // Mock Date.now() and new Date() without arguments
    global.Date = class extends originalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          return mockNow;
        }
        return new originalDate(...args);
      }
      static now() {
        return mockNow.getTime();
      }
    } as any;
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date)).toBe('Jan 15, 2024');
    });

    it('should format date string correctly', () => {
      expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
      expect(formatDate('2024-12-25T00:00:00Z')).toBe('Dec 25, 2024');
    });

    it('should handle different months', () => {
      expect(formatDate('2024-02-29')).toBe('Feb 29, 2024'); // Leap year
      expect(formatDate('2024-06-15')).toBe('Jun 15, 2024');
      expect(formatDate('2024-11-30')).toBe('Nov 30, 2024');
    });

    it('should handle single digit days', () => {
      expect(formatDate('2024-01-01')).toBe('Jan 1, 2024');
      expect(formatDate('2024-03-09')).toBe('Mar 9, 2024');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for times less than 60 seconds', () => {
      const recent = new Date(mockNow.getTime() - 30 * 1000); // 30 seconds ago
      expect(formatRelativeTime(recent)).toBe('just now');
      
      const veryRecent = new Date(mockNow.getTime() - 1000); // 1 second ago
      expect(formatRelativeTime(veryRecent)).toBe('just now');
    });

    it('should format minutes correctly', () => {
      const oneMinAgo = new Date(mockNow.getTime() - 60 * 1000);
      expect(formatRelativeTime(oneMinAgo)).toBe('1m ago');
      
      const thirtyMinAgo = new Date(mockNow.getTime() - 30 * 60 * 1000);
      expect(formatRelativeTime(thirtyMinAgo)).toBe('30m ago');
      
      const fiftyNineMinAgo = new Date(mockNow.getTime() - 59 * 60 * 1000);
      expect(formatRelativeTime(fiftyNineMinAgo)).toBe('59m ago');
    });

    it('should format hours correctly', () => {
      const oneHourAgo = new Date(mockNow.getTime() - 60 * 60 * 1000);
      expect(formatRelativeTime(oneHourAgo)).toBe('1h ago');
      
      const twelveHoursAgo = new Date(mockNow.getTime() - 12 * 60 * 60 * 1000);
      expect(formatRelativeTime(twelveHoursAgo)).toBe('12h ago');
      
      const twentyThreeHoursAgo = new Date(mockNow.getTime() - 23 * 60 * 60 * 1000);
      expect(formatRelativeTime(twentyThreeHoursAgo)).toBe('23h ago');
    });

    it('should format days correctly', () => {
      const oneDayAgo = new Date(mockNow.getTime() - 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(oneDayAgo)).toBe('1d ago');
      
      const threeDaysAgo = new Date(mockNow.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago');
      
      const sixDaysAgo = new Date(mockNow.getTime() - 6 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(sixDaysAgo)).toBe('6d ago');
    });

    it('should fall back to full date for 7+ days', () => {
      const sevenDaysAgo = new Date(mockNow.getTime() - 7 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(sevenDaysAgo)).toBe('Jan 13, 2024');
      
      const oneMonthAgo = new Date(mockNow.getTime() - 30 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(oneMonthAgo)).toBe('Dec 21, 2023');
    });

    it('should handle null/undefined', () => {
      expect(formatRelativeTime(null)).toBe('Unknown time');
      expect(formatRelativeTime(undefined)).toBe('Unknown time');
    });

    it('should handle invalid dates', () => {
      expect(formatRelativeTime('invalid-date')).toBe('Invalid date');
      expect(formatRelativeTime('2024-13-45')).toBe('Invalid date');
    });

    it('should handle date strings', () => {
      const dateString = new Date(mockNow.getTime() - 2 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(dateString)).toBe('2h ago');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1)).toBe('1 Bytes');
      expect(formatFileSize(100)).toBe('100 Bytes');
      expect(formatFileSize(1023)).toBe('1023 Bytes');
    });

    it('should format KB correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(1024 * 1023)).toBe('1023 KB');
    });

    it('should format MB correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
      expect(formatFileSize(1024 * 1024 * 10)).toBe('10 MB');
      expect(formatFileSize(1024 * 1024 * 1023)).toBe('1023 MB');
    });

    it('should format GB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 100)).toBe('100 GB');
    });

    it('should round to 2 decimal places', () => {
      expect(formatFileSize(1234)).toBe('1.21 KB');
      expect(formatFileSize(1234567)).toBe('1.18 MB');
      expect(formatFileSize(1234567890)).toBe('1.15 GB');
    });

    it('should handle edge cases', () => {
      expect(formatFileSize(0.5)).toBe('0.5 Bytes');
      expect(formatFileSize(1023.99)).toBe('1023.99 Bytes');
    });
  });

  describe('truncateText', () => {
    it('should not truncate text shorter than maxLength', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
      expect(truncateText('Short text', 10)).toBe('Short text');
      expect(truncateText('Exact', 5)).toBe('Exact');
    });

    it('should truncate text longer than maxLength', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
      expect(truncateText('This is a very long text', 10)).toBe('This is...');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 5)).toBe('');
      expect(truncateText('Hi', 0)).toBe('...');
      expect(truncateText('Hello', 5)).toBe('Hello');
      expect(truncateText('Hello', 4)).toBe('H...');
    });

    it('should handle very small maxLength', () => {
      expect(truncateText('Hello', 3)).toBe('...');
      expect(truncateText('Hi', 3)).toBe('Hi');
      expect(truncateText('Hello', 1)).toBe('...');
    });

    it('should preserve exact length match', () => {
      const text = 'Exactly twenty chars';
      expect(truncateText(text, 20)).toBe(text);
      expect(truncateText(text, 19)).toBe('Exactly twenty c...');
    });
  });
});