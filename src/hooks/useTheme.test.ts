/**
 * @fileoverview Test for useTheme hook
 * @module useTheme.test
 * @test-coverage 90
 */

import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Mock matchMedia
  const matchMediaMock = jest.fn();
  Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });

  // Mock document
  const mockClassList = {
    add: jest.fn(),
    remove: jest.fn()
  };
  const mockSetAttribute = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default matchMedia behavior
    matchMediaMock.mockReturnValue({
      matches: false, // Light mode by default
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    
    // Setup document mocks
    Object.defineProperty(document.documentElement, 'classList', {
      value: mockClassList,
      configurable: true
    });
    document.documentElement.setAttribute = mockSetAttribute;
  });

  describe('initialization', () => {
    it('should use system theme by default', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('system');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('content-stack-theme');
    });

    it('should load saved theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('should resolve system theme to light when prefers-color-scheme is light', () => {
      localStorageMock.getItem.mockReturnValue('system');
      matchMediaMock.mockReturnValue({
        matches: false, // Light mode
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('should resolve system theme to dark when prefers-color-scheme is dark', () => {
      localStorageMock.getItem.mockReturnValue('system');
      matchMediaMock.mockReturnValue({
        matches: true, // Dark mode
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('should update theme and save to localStorage', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('content-stack-theme', 'dark');
    });

    it('should handle all theme values', () => {
      const { result } = renderHook(() => useTheme());
      
      // Test each theme
      ['light', 'dark', 'system'].forEach(theme => {
        act(() => {
          result.current.setTheme(theme as any);
        });
        
        expect(result.current.theme).toBe(theme);
        expect(localStorageMock.setItem).toHaveBeenCalledWith('content-stack-theme', theme);
      });
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('should toggle based on resolved theme when using system', () => {
      localStorageMock.getItem.mockReturnValue('system');
      matchMediaMock.mockReturnValue({
        matches: false, // Light mode
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });
      
      const { result } = renderHook(() => useTheme());
      
      // Should toggle to dark since resolved is light
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });

  describe('DOM updates', () => {
    it('should apply dark theme classes and attributes', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      renderHook(() => useTheme());
      
      expect(mockClassList.add).toHaveBeenCalledWith('dark-theme');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should remove dark theme classes for light theme', () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      renderHook(() => useTheme());
      
      expect(mockClassList.remove).toHaveBeenCalledWith('dark-theme');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should update DOM when theme changes', () => {
      const { result } = renderHook(() => useTheme());
      
      // Change to dark
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(mockClassList.add).toHaveBeenCalledWith('dark-theme');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      
      // Change back to light
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(mockClassList.remove).toHaveBeenCalledWith('dark-theme');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });
  });

  describe('system theme changes', () => {
    it('should respond to system theme changes', () => {
      localStorageMock.getItem.mockReturnValue('system');
      let changeListener: any;
      
      const mediaQueryMock = {
        matches: false,
        addEventListener: jest.fn((event, listener) => {
          changeListener = listener;
        }),
        removeEventListener: jest.fn()
      };
      matchMediaMock.mockReturnValue(mediaQueryMock);
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.resolvedTheme).toBe('light');
      
      // Simulate system theme change to dark
      act(() => {
        mediaQueryMock.matches = true;
        changeListener();
      });
      
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('should cleanup event listener on unmount', () => {
      const removeEventListenerMock = jest.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: removeEventListenerMock
      });
      
      const { unmount } = renderHook(() => useTheme());
      
      unmount();
      
      expect(removeEventListenerMock).toHaveBeenCalled();
    });
  });
});