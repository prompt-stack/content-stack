# Content Stack React - Implementation Plan

## Phase 1: Project Setup & Core Types

### 1. Initialize Project
```bash
cd ~/My\ Drive/dev/prompt-stack/
npm create vite@latest content-stack-react -- --template react-ts
cd content-stack-react
npm install
```

### 2. Install Dependencies
```bash
npm install \
  react-router-dom \
  @tanstack/react-query \
  zustand \
  react-dropzone \
  clsx \
  react-hot-toast

npm install -D \
  @types/react-router-dom \
  prettier \
  eslint-config-prettier
```

### 3. Create Folder Structure
```bash
# Clean, flat structure
mkdir -p src/{components,pages,hooks,services,lib,types,styles}
```

## Phase 2: Core Types & Constants

### types/index.ts
```typescript
// Content types
export type ContentSource = 'youtube' | 'tiktok' | 'reddit' | 'article' | 'file-upload' | 'paste';
export type ContentType = 'file' | 'url' | 'text' | 'paste';
export type ContentStatus = 'raw' | 'processing' | 'processed' | 'error';
export type TierLevel = 'free' | 'pro' | 'enterprise';

export interface ContentItem {
  id: string;
  type: ContentType;
  source: ContentSource;
  status: ContentStatus;
  title: string;
  content?: string;
  metadata: {
    created_at: string;
    updated_at: string;
    size?: number;
    url?: string;
    file_type?: string;
    content_hash: string;
  };
  enrichment?: {
    summary: string;
    key_points: string[];
    topics: string[];
    category: string;
  };
}

export interface User {
  email: string;
  tier: TierLevel;
}

export interface TierCapabilities {
  urlExtraction: boolean;
  maxInboxItems: number;
  pluginAccess: boolean;
  advancedSearch: boolean;
}
```

### lib/constants.ts
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3468/api';

export const TIER_LIMITS: Record<TierLevel, TierCapabilities> = {
  free: {
    urlExtraction: false,
    maxInboxItems: 100,
    pluginAccess: false,
    advancedSearch: false,
  },
  pro: {
    urlExtraction: true,
    maxInboxItems: 10000,
    pluginAccess: true,
    advancedSearch: true,
  },
  enterprise: {
    urlExtraction: true,
    maxInboxItems: Infinity,
    pluginAccess: true,
    advancedSearch: true,
  },
};

export const ACCEPTED_FILE_TYPES = [
  '.txt', '.md', '.pdf', '.doc', '.docx',
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.csv', '.json', '.xml', '.html'
];
```

## Phase 3: Core Components

### components/Button.tsx
```typescript
import { forwardRef } from 'react';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', loading, icon, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'button',
          `button--${variant}`,
          `button--${size}`,
          loading && 'button--loading',
          className
        )}
        disabled={loading || props.disabled}
        data-loading={loading}
        {...props}
      >
        {loading && <i className="fas fa-spinner fa-spin" />}
        {!loading && icon && <i className={`fas fa-${icon}`} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### components/Card.tsx
```typescript
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({ children, selected, onClick, className }: CardProps) {
  return (
    <div 
      className={clsx(
        'card',
        selected && 'card--selected',
        onClick && 'card--interactive',
        className
      )}
      onClick={onClick}
      data-selected={selected}
    >
      {children}
    </div>
  );
}
```

## Phase 4: Services Layer

### services/api.ts
```typescript
import { API_BASE_URL } from '@/lib/constants';
import type { ContentItem } from '@/types';

class ApiService {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Inbox operations
  async getInboxItems(): Promise<ContentItem[]> {
    return this.request('/inbox');
  }

  async addInboxItem(data: FormData | Partial<ContentItem>): Promise<ContentItem> {
    const isFormData = data instanceof FormData;
    return this.request('/inbox', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
  }

  async deleteInboxItem(id: string): Promise<void> {
    return this.request(`/inbox/${id}`, { method: 'DELETE' });
  }

  async extractURL(url: string): Promise<ContentItem> {
    return this.request('/extract-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  }
}

export const api = new ApiService();
```

## Phase 5: Custom Hooks

### hooks/useInbox.ts
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { ContentItem } from '@/types';

export function useInbox() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['inbox'],
    queryFn: api.getInboxItems,
  });

  const addMutation = useMutation({
    mutationFn: api.addInboxItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteInboxItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });

  return {
    items,
    isLoading,
    error,
    addItem: addMutation.mutate,
    deleteItem: deleteMutation.mutate,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
```

## Phase 6: Pages

### pages/Inbox.tsx
```typescript
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Dropzone } from '@/components/Dropzone';
import { URLInput } from '@/components/URLInput';
import { PasteModal } from '@/components/PasteModal';
import { InboxItem } from '@/components/InboxItem';
import { useInbox } from '@/hooks/useInbox';

export function Inbox() {
  const { items, isLoading, addItem, deleteItem } = useInbox();
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleFileDrop = (files: File[]) => {
    files.forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      addItem(formData);
    });
  };

  return (
    <div className="inbox">
      {/* Input Section */}
      <section className="inbox-input">
        <h2>Add Content to Inbox</h2>
        <p>Drag files anywhere, paste with Ctrl+V, or enter a URL</p>
        
        <URLInput onExtract={addItem} />
        <Dropzone onDrop={handleFileDrop} />
        
        <div className="inbox-actions">
          <Button icon="folder-open" variant="secondary">
            Browse Files
          </Button>
          <Button 
            icon="clipboard" 
            variant="secondary"
            onClick={() => setShowPasteModal(true)}
          >
            Paste Content
          </Button>
        </div>
      </section>

      {/* Items Section */}
      <section className="inbox-items">
        <header className="inbox-header">
          <h3>Inbox Items ({items.length})</h3>
          <div className="inbox-controls">
            {/* Add filters, search, view toggle */}
          </div>
        </header>
        
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className={`inbox-grid inbox-grid--${viewMode}`}>
            {items.map(item => (
              <InboxItem 
                key={item.id}
                item={item}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </div>
        )}
      </section>

      <PasteModal 
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onSave={addItem}
      />
    </div>
  );
}
```

## Next Steps

1. **Set up the project** with this structure
2. **Copy over your existing CSS** and adapt it
3. **Build components one by one** starting with Button, Card
4. **Test with the existing backend** at localhost:3468
5. **Add features incrementally** - don't try to port everything at once

This gives you a clean, maintainable React app that follows our naming conventions!