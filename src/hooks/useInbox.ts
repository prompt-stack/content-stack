/**
 * @file hooks/useInbox.ts
 * @purpose Hook for Inbox management
 * @layer hook
 * @deps none
 * @used-by none
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import toast from 'react-hot-toast'

export function useInbox() {
  const queryClient = useQueryClient()

  const { data: items = [], isLoading: loading, error } = useQuery({
    queryKey: ['inbox'],
    queryFn: api.getInboxItems,
  })

  const addMutation = useMutation({
    mutationFn: api.addInboxItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] })
      toast.success('Item added to inbox')
    },
    onError: (error: any) => {
      // Check if it's a duplicate file error
      if (error.message?.includes('already exists')) {
        toast.error(error.message, {
          duration: 4000,
          icon: '⚠️'
        })
      } else {
        toast.error(`Failed to add item: ${error.message}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteInboxItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] })
      toast.success('Item deleted')
    },
    onError: (error) => {
      toast.error(`Failed to delete item: ${error.message}`)
    },
  })

  const extractURLMutation = useMutation({
    mutationFn: api.extractURL,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] })
      toast.success('URL content extracted')
    },
    onError: (error) => {
      toast.error(`Failed to extract URL: ${error.message}`)
    },
  })

  return {
    items,
    loading,
    error,
    addItem: addMutation.mutate,
    deleteItem: deleteMutation.mutate,
    extractURL: extractURLMutation.mutate,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isExtracting: extractURLMutation.isPending,
  }
}
