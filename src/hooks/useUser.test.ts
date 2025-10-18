/**
 * @fileoverview Test for useUser hook
 * @module useUser.test
 * @test-coverage 95
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useUser } from './useUser';
import type { User } from './useUser';

describe('useUser', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should start with loading state', () => {
      const { result } = renderHook(() => useUser());

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should load user data after delay', async () => {
      const { result } = renderHook(() => useUser());

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual({
        email: 'user@example.com',
        tier: 'pro',
        name: 'John Doe'
      });
      expect(result.current.error).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const { result } = renderHook(() => useUser());

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Update user
      act(() => {
        result.current.updateUser({ tier: 'enterprise' });
      });

      expect(result.current.user).toEqual({
        email: 'user@example.com',
        tier: 'enterprise',
        name: 'John Doe'
      });
    });

    it('should handle multiple updates', async () => {
      const { result } = renderHook(() => useUser());

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Multiple updates
      act(() => {
        result.current.updateUser({ name: 'Jane Smith' });
        result.current.updateUser({ email: 'jane@example.com' });
        result.current.updateUser({ avatar: 'https://example.com/avatar.jpg' });
      });

      expect(result.current.user).toEqual({
        email: 'jane@example.com',
        tier: 'pro',
        name: 'Jane Smith',
        avatar: 'https://example.com/avatar.jpg'
      });
    });

    it('should not update if user is null', () => {
      const { result } = renderHook(() => useUser());

      // Try to update before user loads
      act(() => {
        result.current.updateUser({ tier: 'enterprise' });
      });

      expect(result.current.user).toBeNull();
    });

    it('should partially update user properties', async () => {
      const { result } = renderHook(() => useUser());

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialUser = result.current.user;

      // Update only one property
      act(() => {
        result.current.updateUser({ tier: 'free' });
      });

      expect(result.current.user).toEqual({
        ...initialUser,
        tier: 'free'
      });
    });
  });

  describe('error handling', () => {
    it('should handle errors during load', async () => {
      // Mock console.error to suppress error output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Override setTimeout to throw error
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((callback: any) => {
        callback();
        throw new Error('Network error');
      }) as any;

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toEqual(new Error('Failed to load user'));

      // Restore
      global.setTimeout = originalSetTimeout;
      consoleErrorSpy.mockRestore();
    });
  });

  describe('re-render behavior', () => {
    it('should not reload user on re-render', async () => {
      const { result, rerender } = renderHook(() => useUser());

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialUser = result.current.user;

      // Re-render
      rerender();

      // User should remain the same
      expect(result.current.user).toBe(initialUser);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('unmount behavior', () => {
    it('should handle unmount during loading', () => {
      const { unmount } = renderHook(() => useUser());

      // Unmount before timer completes
      unmount();

      // Advance timers - should not cause errors
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    });
  });

  describe('user object structure', () => {
    it('should have correct user structure', async () => {
      const { result } = renderHook(() => useUser());

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const user = result.current.user;
      expect(user).toBeDefined();
      expect(user?.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Valid email
      expect(['free', 'pro', 'enterprise']).toContain(user?.tier);
      expect(typeof user?.name).toBe('string');
    });
  });
});