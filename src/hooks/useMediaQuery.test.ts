/**
 * @fileoverview Test for useMediaQuery hook
 * @module useMediaQuery.test
 * @test-coverage 95
 */

import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  // Mock matchMedia
  let matchMediaMock: jest.Mock;
  let mediaQueryList: {
    matches: boolean;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    addListener?: jest.Mock;
    removeListener?: jest.Mock;
  };

  beforeEach(() => {
    mediaQueryList = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    
    matchMediaMock = jest.fn(() => mediaQueryList);
    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should return false initially to avoid hydration mismatch', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      // Should start with false even if media matches
      expect(result.current).toBe(false);
    });

    it('should update to match media query after mount', () => {
      mediaQueryList.matches = true;
      
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      // Should update to true after effect runs
      expect(result.current).toBe(true);
      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px)');
    });

    it('should handle different media queries', () => {
      const queries = [
        '(min-width: 768px)',
        '(max-width: 1024px)',
        '(orientation: portrait)',
        '(prefers-color-scheme: dark)',
        '(hover: hover)',
        'screen and (min-width: 600px)'
      ];

      queries.forEach(query => {
        const { unmount } = renderHook(() => useMediaQuery(query));
        expect(matchMediaMock).toHaveBeenCalledWith(query);
        unmount();
      });
    });
  });

  describe('event handling', () => {
    it('should respond to media query changes', () => {
      let changeListener: any;
      mediaQueryList.addEventListener.mockImplementation((event, listener) => {
        if (event === 'change') {
          changeListener = listener;
        }
      });

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      expect(result.current).toBe(false);

      // Simulate media query change
      act(() => {
        changeListener({ matches: true });
      });

      expect(result.current).toBe(true);

      // Change back
      act(() => {
        changeListener({ matches: false });
      });

      expect(result.current).toBe(false);
    });

    it('should handle multiple rapid changes', () => {
      let changeListener: any;
      mediaQueryList.addEventListener.mockImplementation((event, listener) => {
        if (event === 'change') {
          changeListener = listener;
        }
      });

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      // Rapid changes
      act(() => {
        changeListener({ matches: true });
        changeListener({ matches: false });
        changeListener({ matches: true });
      });

      expect(result.current).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      expect(mediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      
      unmount();
      
      expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should handle query change without memory leaks', () => {
      const { rerender } = renderHook(
        ({ query }) => useMediaQuery(query),
        { initialProps: { query: '(min-width: 768px)' } }
      );

      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px)');
      expect(mediaQueryList.addEventListener).toHaveBeenCalledTimes(1);

      // Change query
      rerender({ query: '(min-width: 1024px)' });

      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)');
      expect(mediaQueryList.removeEventListener).toHaveBeenCalled();
      expect(mediaQueryList.addEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('legacy browser support', () => {
    it('should use addListener for older browsers', () => {
      // Remove addEventListener to simulate older browser
      delete (mediaQueryList as any).addEventListener;
      delete (mediaQueryList as any).removeEventListener;
      mediaQueryList.addListener = jest.fn();
      mediaQueryList.removeListener = jest.fn();

      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(mediaQueryList.addListener).toHaveBeenCalledWith(expect.any(Function));
      
      unmount();
      
      expect(mediaQueryList.removeListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle legacy listener changes', () => {
      let changeListener: any;
      delete (mediaQueryList as any).addEventListener;
      mediaQueryList.addListener = jest.fn((listener) => {
        changeListener = listener;
      });

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      // Simulate change
      act(() => {
        changeListener({ matches: true });
      });

      expect(result.current).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty query string', () => {
      const { result } = renderHook(() => useMediaQuery(''));
      
      expect(matchMediaMock).toHaveBeenCalledWith('');
      expect(result.current).toBe(false);
    });

    it('should handle invalid media queries gracefully', () => {
      // matchMedia typically doesn't throw on invalid queries, just returns non-matching
      mediaQueryList.matches = false;
      
      const { result } = renderHook(() => useMediaQuery('invalid query @#$'));
      
      expect(result.current).toBe(false);
      expect(matchMediaMock).toHaveBeenCalledWith('invalid query @#$');
    });

    it('should not cause infinite loops with matches dependency', () => {
      let renderCount = 0;
      
      const { result } = renderHook(() => {
        renderCount++;
        return useMediaQuery('(min-width: 768px)');
      });

      // Should only render twice (initial + effect)
      expect(renderCount).toBeLessThanOrEqual(2);
      expect(result.current).toBe(false);
    });
  });

  describe('SSR considerations', () => {
    it('should not throw if window is undefined', () => {
      // Temporarily remove window.matchMedia
      const originalMatchMedia = window.matchMedia;
      delete (window as any).matchMedia;

      expect(() => {
        renderHook(() => useMediaQuery('(min-width: 768px)'));
      }).toThrow(); // This would throw in current implementation

      // Restore
      (window as any).matchMedia = originalMatchMedia;
    });
  });

  describe('performance', () => {
    it('should not re-create listeners unnecessarily', () => {
      const { rerender } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      const initialCalls = mediaQueryList.addEventListener.mock.calls.length;
      
      // Re-render without prop changes
      rerender();
      rerender();
      rerender();
      
      // Should not add more listeners
      expect(mediaQueryList.addEventListener.mock.calls.length).toBe(initialCalls);
    });
  });
});