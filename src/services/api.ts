import { api as apiClient, ApiError } from '@/lib/api'
import type { ContentItem, TierLevel } from '@/types'

// Server response types
interface InboxItemResponse {
  id: string
  filename: string
  metadata: {
    id: string
    original_filename: string
    saved_filename: string
    source: string
    saved_at: string
    size?: number
    content_hash: string
    status: string
    is_binary: boolean
    mime_type: string
    original_content?: string
    user_title?: string
    reference_url?: string
    extracted_content?: {
      summary: string
      key_points: string[]
      topics: string[]
      category: string
    }
    links: Record<string, any[]>
  }
  hasContent: boolean
}

interface InboxUploadResponse {
  success: boolean
  file: {
    id: string
    filename: string
  }
  metadata: InboxItemResponse['metadata']
}

class ApiService {
  // Transform server response to ContentItem format
  transformInboxItem = (item: InboxItemResponse): ContentItem => {
    return {
      id: item.id,
      type: item.metadata?.is_binary ? 'file' : 'text',
      source: item.metadata?.source || 'file-upload',
      status: item.metadata?.status || 'raw',
      title: item.metadata?.user_title || item.metadata?.original_filename || 'Untitled',
      content: item.metadata?.original_content,
      metadata: {
        created_at: item.metadata?.saved_at || new Date().toISOString(),
        updated_at: item.metadata?.saved_at || new Date().toISOString(),
        size: item.metadata?.size,
        url: item.metadata?.reference_url,
        file_type: item.metadata?.mime_type,
        content_hash: item.metadata?.content_hash || ''
      },
      enrichment: item.metadata?.extracted_content ? {
        summary: item.metadata.extracted_content.summary || '',
        key_points: item.metadata.extracted_content.key_points || [],
        topics: item.metadata.extracted_content.topics || [],
        category: item.metadata.extracted_content.category || ''
      } : undefined
    }
  }

  // Inbox operations
  getInboxItems = async (): Promise<ContentItem[]> => {
    const response = await apiClient.get<{ items: InboxItemResponse[] }>('/api/inbox/items')
    return response.items.map(item => this.transformInboxItem(item))
  }

  addInboxItem = async (data: FormData | Partial<ContentItem>): Promise<ContentItem> => {
    try {
      if (data instanceof FormData) {
        const response = await apiClient.upload<InboxUploadResponse>('/api/inbox/upload', data)
        // The response structure includes file info and metadata
        const item: InboxItemResponse = {
          id: response.file.id,
          filename: response.file.filename,
          metadata: response.metadata,
          hasContent: true
        }
        return this.transformInboxItem(item)
      }
      
      // For text/paste content
      const response = await apiClient.post<InboxUploadResponse>('/api/inbox', data)
      const item: InboxItemResponse = {
        id: response.file.id,
        filename: response.file.filename,
        metadata: response.metadata,
        hasContent: true
      }
      return this.transformInboxItem(item)
    } catch (error: unknown) {
      // If it's an API error with status 409, it might be a duplicate
      if (error instanceof ApiError && error.status === 409) {
        throw new Error(error.message || 'This content already exists in the inbox')
      }
      throw error
    }
  }

  deleteInboxItem = async (id: string): Promise<void> => {
    return apiClient.delete(`/api/inbox/${id}`)
  }

  extractURL = async (url: string): Promise<ContentItem> => {
    return apiClient.post('/api/inbox/extract', { url, platform: 'auto' })
  }

  // Library operations
  getLibraryItems = async (): Promise<ContentItem[]> => {
    const response = await apiClient.get<{ content: ContentItem[] }>('/api/content/library')
    return response.content
  }

  moveToLibrary = async (id: string): Promise<ContentItem> => {
    return apiClient.post(`/api/inbox/${id}/move-to-library`, {})
  }

  // Search operations
  searchContent = async (query: string): Promise<ContentItem[]> => {
    const response = await apiClient.get<{ results: ContentItem[] }>(`/api/content/search?q=${encodeURIComponent(query)}`)
    return response.results || []
  }

  // User operations (mock for now since we don't have user endpoints)
  getUserInfo = async (): Promise<{ id: string; email: string; tier: TierLevel }> => {
    // TODO: Implement actual user endpoint when available
    return {
      id: '1',
      email: 'user@example.com',
      tier: 'free' as TierLevel
    }
  }
}

export const api = new ApiService()