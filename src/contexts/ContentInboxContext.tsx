/**
 * @file contexts/ContentInboxContext.tsx
 * @purpose Context for sharing ContentInbox functionality
 * @layer feature
 * @deps [ContentSubmission, ContentItem]
 * @used-by [InboxPage, InboxLayout]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { createContext, useContext, ReactNode } from 'react';
import type { ContentSubmission, ContentItem } from '@/features/content-inbox/types';

interface ContentInboxContextValue {
  addContent: (submission: ContentSubmission) => Promise<void>;
  queue: ContentItem[];
  isProcessing: boolean;
}

const ContentInboxContext = createContext<ContentInboxContextValue | null>(null);

export interface ContentInboxProviderProps {
  children: ReactNode;
  value: ContentInboxContextValue;
}

export function ContentInboxProvider({ children, value }: ContentInboxProviderProps) {
  return (
    <ContentInboxContext.Provider value={value}>
      {children}
    </ContentInboxContext.Provider>
  );
}

export function useContentInbox() {
  const context = useContext(ContentInboxContext);
  if (!context) {
    throw new Error('useContentInbox must be used within ContentInboxProvider');
  }
  return context;
}