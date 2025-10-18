/**
 * @fileoverview Test for useInbox hook
 * @module useInbox.test
 * @test-coverage 90
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInbox } from './useInbox';
import { Api } from '@/services/ApiService';
import toast from 'react-hot-toast';
import React from 'react';

// Mock dependencies
jest.mock('@/services/ApiService');
jest.mock('react-hot-toast');

// Create wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useInbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial query', () => {
    it('should load inbox items on mount', async () => {
      const mockItems = [
        { id: '1', title: 'Item 1', createdAt: '2024-01-20' },
        { id: '2', title: 'Item 2', createdAt: '2024-01-21' }
      ];
      
      (Api.getInboxItems as jest.Mock).mockResolvedValue(mockItems);

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.items).toEqual([]);

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toEqual(mockItems);
      expect(result.current.error).toBeNull();
      expect(Api.getInboxItems).toHaveBeenCalledTimes(1);
    });

    it('should handle query errors', async () => {
      const mockError = new Error('Failed to fetch');
      (Api.getInboxItems as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('addItem', () => {
    it('should add item successfully', async () => {
      const mockItems = [{ id: '1', title: 'Item 1' }];
      const newItem = { title: 'New Item', content: 'Content' };
      
      (Api.getInboxItems as jest.Mock).mockResolvedValue(mockItems);
      (Api.addInboxItem as jest.Mock).mockResolvedValue({ id: '2', ...newItem });

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Add item
      result.current.addItem(newItem);

      await waitFor(() => {
        expect(result.current.isAdding).toBe(false);
      });

      expect(Api.addInboxItem).toHaveBeenCalledWith(newItem);
      expect(toast.success).toHaveBeenCalledWith('Item added to inbox');
      expect(Api.getInboxItems).toHaveBeenCalledTimes(2); // Initial + refetch
    });

    it('should handle duplicate file error', async () => {
      const mockError = new Error('File already exists with hash: abc123');
      (Api.getInboxItems as jest.Mock).mockResolvedValue([]);
      (Api.addInboxItem as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Try to add duplicate
      result.current.addItem({ title: 'Duplicate' });

      await waitFor(() => {
        expect(result.current.isAdding).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith(
        'File already exists with hash: abc123',
        {
          duration: 4000,
          icon: '⚠️'
        }
      );
    });

    it('should handle generic add errors', async () => {
      const mockError = new Error('Network error');
      (Api.getInboxItems as jest.Mock).mockResolvedValue([]);
      (Api.addInboxItem as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      result.current.addItem({ title: 'Test' });

      await waitFor(() => {
        expect(result.current.isAdding).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to add item: Network error');
    });
  });

  describe('deleteItem', () => {
    it('should delete item successfully', async () => {
      const mockItems = [
        { id: '1', title: 'Item 1' },
        { id: '2', title: 'Item 2' }
      ];
      
      (Api.getInboxItems as jest.Mock).mockResolvedValue(mockItems);
      (Api.deleteInboxItem as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Delete item
      result.current.deleteItem('1');

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(false);
      });

      expect(Api.deleteInboxItem).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Item deleted');
      expect(Api.getInboxItems).toHaveBeenCalledTimes(2); // Initial + refetch
    });

    it('should handle delete errors', async () => {
      const mockError = new Error('Permission denied');
      (Api.getInboxItems as jest.Mock).mockResolvedValue([]);
      (Api.deleteInboxItem as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      result.current.deleteItem('1');

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to delete item: Permission denied');
    });
  });

  describe('extractURL', () => {
    it('should extract URL content successfully', async () => {
      const mockUrl = 'https://example.com/article';
      
      (Api.getInboxItems as jest.Mock).mockResolvedValue([]);
      (Api.extractURL as jest.Mock).mockResolvedValue({ id: '1', url: mockUrl });

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Extract URL
      result.current.extractURL(mockUrl);

      await waitFor(() => {
        expect(result.current.isExtracting).toBe(false);
      });

      expect(Api.extractURL).toHaveBeenCalledWith(mockUrl);
      expect(toast.success).toHaveBeenCalledWith('URL content extracted');
      expect(Api.getInboxItems).toHaveBeenCalledTimes(2); // Initial + refetch
    });

    it('should handle extract URL errors', async () => {
      const mockError = new Error('Invalid URL');
      (Api.getInboxItems as jest.Mock).mockResolvedValue([]);
      (Api.extractURL as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      result.current.extractURL('invalid-url');

      await waitFor(() => {
        expect(result.current.isExtracting).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to extract URL: Invalid URL');
    });
  });

  describe('loading states', () => {
    it('should track loading states correctly', async () => {
      (Api.getInboxItems as jest.Mock).mockResolvedValue([]);
      (Api.addInboxItem as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: '1' }), 100))
      );

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Start adding
      expect(result.current.isAdding).toBe(false);
      
      result.current.addItem({ title: 'Test' });
      
      // Should be adding
      await waitFor(() => {
        expect(result.current.isAdding).toBe(true);
      });

      // Wait for completion
      await waitFor(() => {
        expect(result.current.isAdding).toBe(false);
      });
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple operations', async () => {
      (Api.getInboxItems as jest.Mock).mockResolvedValue([]);
      (Api.addInboxItem as jest.Mock).mockResolvedValue({ id: '1' });
      (Api.deleteInboxItem as jest.Mock).mockResolvedValue(undefined);
      (Api.extractURL as jest.Mock).mockResolvedValue({ id: '2' });

      const { result } = renderHook(() => useInbox(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Start multiple operations
      result.current.addItem({ title: 'Item 1' });
      result.current.deleteItem('old-item');
      result.current.extractURL('https://example.com');

      await waitFor(() => {
        expect(result.current.isAdding).toBe(false);
        expect(result.current.isDeleting).toBe(false);
        expect(result.current.isExtracting).toBe(false);
      });

      expect(toast.success).toHaveBeenCalledTimes(3);
    });
  });
});