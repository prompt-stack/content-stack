# Content Stack React + TypeScript - Quick Start

## 1. Create the Project

```bash
# Navigate to where you want the project
cd ~/My\ Drive/dev/prompt-stack/

# Create React + TypeScript project
npm create vite@latest content-stack-react -- --template react-ts

# Go into the project
cd content-stack-react

# Install dependencies
npm install

# Install additional packages we'll need
npm install \
  react-router-dom \
  @tanstack/react-query \
  zustand \
  react-dropzone \
  clsx \
  react-hot-toast \
  @types/react-router-dom
```

## 2. Set Up Folder Structure

```bash
# Create our folder structure
mkdir -p src/{components/{common,layout,inbox},pages,hooks,services,types,styles,utils}

# Create type definition files
touch src/types/{content.ts,api.ts,tier.ts}

# Create base component files
touch src/components/common/{Button,Card,Modal,Badge}/index.ts
```

## 3. Define Core Types First

```typescript
// src/types/content.ts
export type ContentSource = 'youtube' | 'tiktok' | 'reddit' | 'article' | 'file-upload' | 'paste';
export type ContentType = 'file' | 'url' | 'text' | 'paste';
export type ContentStatus = 'raw' | 'processing' | 'processed' | 'error';

export interface ContentMetadata {
  title: string;
  created_at: string;
  content_hash: string;
  size?: number;
  url?: string;
  file_type?: string;
  author?: string;
  tags?: string[];
}

export interface ContentEnrichment {
  summary: string;
  key_points: string[];
  topics: string[];
  category: string;
  channel_fitness: Record<string, number>;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  source: ContentSource;
  metadata: ContentMetadata;
  enrichment?: ContentEnrichment;
  status: ContentStatus;
  original_content?: string;
}
```

## 4. Start with App.tsx

```typescript
// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { AppRoutes } from './routes';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

## 5. Run the Development Server

```bash
# Start Vite dev server
npm run dev

# Your app will be at http://localhost:5173
```

## 6. Connect to Existing Backend

```typescript
// src/services/api.ts
const API_BASE = 'http://localhost:3468/api';

export const api = {
  // Inbox operations
  async getInboxItems(): Promise<ContentItem[]> {
    const res = await fetch(`${API_BASE}/inbox`);
    if (!res.ok) throw new Error('Failed to fetch inbox items');
    return res.json();
  },

  async addInboxItem(item: FormData | ContentItem): Promise<ContentItem> {
    const res = await fetch(`${API_BASE}/inbox`, {
      method: 'POST',
      body: item instanceof FormData ? item : JSON.stringify(item),
      headers: item instanceof FormData ? {} : { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to add item');
    return res.json();
  },

  async extractURL(url: string): Promise<ContentItem> {
    const res = await fetch(`${API_BASE}/extract-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error('Failed to extract URL');
    return res.json();
  }
};
```

## Key Benefits Already

1. **Type Safety** - IDE knows exactly what `ContentItem` looks like
2. **Fast Refresh** - See changes instantly without losing state
3. **Modern Build** - Vite is incredibly fast
4. **Clean Architecture** - Clear separation of concerns

## Next: Build Your First Component

Start with a simple Button component to test the setup:

```typescript
// src/components/common/Button/Button.tsx
import { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        {
          'btn--loading': loading,
          'btn--disabled': disabled || loading
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <i className="fas fa-spinner fa-spin" />}
      {!loading && icon && <i className={`fas fa-${icon}`} />}
      {children}
    </button>
  );
};
```

You're ready to start building! The TypeScript + React combination will make Content Stack much more maintainable and enjoyable to work with.