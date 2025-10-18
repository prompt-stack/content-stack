/**
 * @fileoverview Test for useDebounce hook
 * @module useDebounce.test
 * @test-coverage 90
 */

import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  // Use fake timers for testing delays
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      
      expect(result.current).toBe('initial');
    });

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      expect(result.current).toBe('initial');

      // Update value
      rerender({ value: 'updated', delay: 500 });
      
      // Value shouldn't change immediately
      expect(result.current).toBe('initial');

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Now value should be updated
      expect(result.current).toBe('updated');
    });

    it('should cancel pending updates on new value', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'first', delay: 500 } }
      );

      // First update
      rerender({ value: 'second', delay: 500 });
      
      // Advance timer partially
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Still original value
      expect(result.current).toBe('first');

      // New update before previous completes
      rerender({ value: 'third', delay: 500 });

      // Complete first timer - should not update to 'second'
      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(result.current).toBe('first');

      // Complete second timer
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(result.current).toBe('third');
    });
  });

  describe('different delay values', () => {
    it('should work with zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 0 } }
      );

      rerender({ value: 'updated', delay: 0 });

      act(() => {
        jest.runAllTimers();
      });

      expect(result.current).toBe('updated');
    });

    it('should work with very long delays', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 10000 } }
      );

      rerender({ value: 'updated', delay: 10000 });

      // Advance time partially
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(result.current).toBe('initial');

      // Complete the delay
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(result.current).toBe('updated');
    });

    it('should handle delay changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      // Change both value and delay
      rerender({ value: 'updated', delay: 1000 });

      // Old delay shouldn't trigger update
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current).toBe('initial');

      // New delay should trigger update
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current).toBe('updated');
    });
  });

  describe('different data types', () => {
    it('should work with numbers', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 42, delay: 300 } }
      );

      rerender({ value: 100, delay: 300 });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current).toBe(100);
    });

    it('should work with objects', () => {
      const obj1 = { name: 'John', age: 30 };
      const obj2 = { name: 'Jane', age: 25 };

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: obj1, delay: 300 } }
      );

      rerender({ value: obj2, delay: 300 });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current).toBe(obj2);
    });

    it('should work with arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: arr1, delay: 300 } }
      );

      rerender({ value: arr2, delay: 300 });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current).toBe(arr2);
    });

    it('should work with null and undefined', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: null as any, delay: 300 } }
      );

      expect(result.current).toBe(null);

      rerender({ value: undefined as any, delay: 300 });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current).toBe(undefined);
    });
  });

  describe('rapid updates', () => {
    it('should only apply the last value after rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      // Simulate rapid typing
      const updates = ['a', 'ab', 'abc', 'abcd', 'abcde'];
      updates.forEach((value, index) => {
        rerender({ value, delay: 500 });
        act(() => {
          jest.advanceTimersByTime(100); // 100ms between keystrokes
        });
      });

      // Still showing initial because no full delay has passed
      expect(result.current).toBe('initial');

      // Complete the delay from the last update
      act(() => {
        jest.advanceTimersByTime(400);
      });

      // Should show the last value
      expect(result.current).toBe('abcde');
    });
  });

  describe('cleanup', () => {
    it('should cleanup timeout on unmount', () => {
      const { result, unmount } = renderHook(() => useDebounce('value', 500));

      // Unmount before timeout completes
      unmount();

      // Running timers shouldn't cause errors
      act(() => {
        jest.runAllTimers();
      });

      // No expectation needed - just ensuring no errors
    });
  });
});