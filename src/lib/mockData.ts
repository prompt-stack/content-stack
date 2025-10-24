/**
 * @file lib/mockData.ts
 * @purpose Generate mock data for demo/portfolio purposes
 * @layer utility
 * @deps none
 * @used-by [InboxPage, ContentInboxFeature]
 * @llm-read true
 * @llm-write full-edit
 */

import type { ContentItem } from '@/types'

export function generateMockInboxData(): ContentItem[] {
  const now = new Date()
  const mockItems: ContentItem[] = [
    {
      id: 'demo-1',
      title: 'Next.js 15 Release Notes - Performance Improvements',
      type: 'url',
      content: 'https://nextjs.org/blog/next-15',
      status: 'pending',
      created_at: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 min ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      size: 45000,
      tags: ['development', 'react', 'nextjs'],
      category: 'article',
      metadata: {
        source_url: 'https://nextjs.org/blog/next-15',
        word_count: 2500,
        reading_time: '10 min read'
      }
    },
    {
      id: 'demo-2',
      title: 'Building Scalable Component Libraries',
      type: 'text',
      content: 'A comprehensive guide to creating reusable component libraries with React and TypeScript...',
      status: 'pending',
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      size: 15000,
      tags: ['react', 'typescript', 'architecture'],
      category: 'note',
      metadata: {
        word_count: 850,
        reading_time: '4 min read'
      }
    },
    {
      id: 'demo-3',
      title: 'design-system-mockup.pdf',
      type: 'file',
      content: 'design-system-mockup.pdf',
      status: 'processed',
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(),
      size: 2500000,
      tags: ['design', 'figma', 'mockup'],
      category: 'design',
      metadata: {
        file_type: 'application/pdf',
        pages: 24
      }
    },
    {
      id: 'demo-4',
      title: 'Understanding React Server Components',
      type: 'url',
      content: 'https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-march-2023',
      status: 'pending',
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      size: 38000,
      tags: ['react', 'rsc', 'server-components'],
      category: 'article',
      metadata: {
        source_url: 'https://react.dev/blog',
        word_count: 1850,
        reading_time: '8 min read'
      }
    },
    {
      id: 'demo-5',
      title: 'TypeScript 5.6 Features',
      type: 'text',
      content: 'New features in TypeScript 5.6 include improved type inference, better error messages...',
      status: 'processed',
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      size: 12000,
      tags: ['typescript', 'programming'],
      category: 'note',
      metadata: {
        word_count: 650,
        reading_time: '3 min read'
      }
    },
    {
      id: 'demo-6',
      title: 'component-architecture.png',
      type: 'file',
      content: 'component-architecture.png',
      status: 'pending',
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      size: 850000,
      tags: ['diagram', 'architecture'],
      category: 'image',
      metadata: {
        file_type: 'image/png',
        dimensions: '1920x1080'
      }
    },
    {
      id: 'demo-7',
      title: 'Vite vs Webpack: Performance Comparison',
      type: 'url',
      content: 'https://vitejs.dev/guide/why.html',
      status: 'processed',
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      size: 28000,
      tags: ['vite', 'webpack', 'bundlers'],
      category: 'article',
      metadata: {
        source_url: 'https://vitejs.dev/guide/why.html',
        word_count: 1200,
        reading_time: '5 min read'
      }
    },
    {
      id: 'demo-8',
      title: 'API Design Best Practices',
      type: 'text',
      content: 'REST API design patterns and best practices for modern web applications...',
      status: 'pending',
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      size: 18000,
      tags: ['api', 'rest', 'backend'],
      category: 'note',
      metadata: {
        word_count: 920,
        reading_time: '4 min read'
      }
    }
  ]

  return mockItems
}

export function shouldUseMockData(): boolean {
  // Use mock data if localStorage is empty or in demo mode
  const demoMode = localStorage.getItem('content-stack-demo-mode')
  const existingQueue = localStorage.getItem('content-inbox-queue')

  return demoMode === 'true' || !existingQueue || existingQueue === '[]'
}

export function enableDemoMode() {
  localStorage.setItem('content-stack-demo-mode', 'true')
}

export function disableDemoMode() {
  localStorage.removeItem('content-stack-demo-mode')
}
