#!/bin/bash

# @script setup
# @purpose Script for setup operations
# @output console
# @llm-read true
# @llm-write full-edit
# @llm-role utility

# Content Stack React Setup Script

echo "🚀 Setting up Content Stack React..."

# Navigate to the parent directory
cd ~/My\ Drive/dev/prompt-stack/

# Create React + TypeScript project with Vite
echo "📦 Creating React project with TypeScript..."
npm create vite@latest content-stack-react -- --template react-ts

# Enter project directory
cd content-stack-react

# Install dependencies
echo "📥 Installing dependencies..."
npm install \
  react-router-dom \
  @tanstack/react-query \
  zustand \
  react-dropzone \
  clsx \
  react-hot-toast

# Install dev dependencies
npm install -D \
  @types/react-router-dom \
  prettier \
  eslint-config-prettier

# Create folder structure
echo "📁 Creating folder structure..."
mkdir -p src/{components,pages,hooks,services,lib,types,styles}

# Create type definitions
cat > src/types/index.ts << 'EOF'
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

export interface TierCapabilities {
  urlExtraction: boolean;
  maxInboxItems: number;
  pluginAccess: boolean;
  advancedSearch: boolean;
}
EOF

# Create constants
cat > src/lib/constants.ts << 'EOF'
import type { TierLevel, TierCapabilities } from '@/types';

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
EOF

# Update vite.config.ts for path aliases
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
EOF

# Update tsconfig.json for path aliases
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create a simple Button component to test
cat > src/components/Button.tsx << 'EOF'
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
EOF

# Update App.tsx to test
cat > src/App.tsx << 'EOF'
import { Button } from './components/Button'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Content Stack React</h1>
      <p>Ready to build! 🚀</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Button>Primary Button</Button>
        <Button variant="secondary" icon="inbox">
          Secondary with Icon
        </Button>
        <Button variant="danger" loading>
          Loading...
        </Button>
      </div>
    </div>
  )
}

export default App
EOF

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. cd content-stack-react"
echo "2. npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "The React app is ready to connect to your existing backend at http://localhost:3468"
