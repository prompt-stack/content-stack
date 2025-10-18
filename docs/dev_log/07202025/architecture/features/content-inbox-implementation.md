# Content Inbox Feature Implementation Guide

> **LLM INSTRUCTIONS**: This document provides exact implementation steps for the Content Inbox feature. Follow these rails precisely.

## 📍 Feature Overview

**Purpose**: Intelligent content ingestion system with metadata tagging  
**Location**: `/inbox` route  
**Core Functions**: Upload, Drag & Drop, Paste, URL extraction  
**Architecture**: Queue-based processing with metadata enrichment  

## 🎯 Implementation Phases

### Phase 1: Basic Infrastructure
```
1. Clear existing inbox page
2. Set up basic layout structure
3. Implement single input method (paste)
4. Create simple content queue display
5. Add basic metadata structure
```

### Phase 2: Multi-Input Support
```
1. Add drag & drop functionality
2. Implement file upload
3. Add URL input with extraction
4. Unify submission pipeline
```

### Phase 3: Queue Management
```
1. Sortable content queue
2. Metadata editing interface
3. Batch operations
4. Export functionality
```

## 🏗️ Component Architecture

### Required Components

#### Primitives Needed
```typescript
// Already exist:
- Box (spacing, layout)
- Button (actions)
- Text (typography)

// Need to create:
- TextArea (paste input)
- FileInput (upload)
- UrlInput (URL entry)
```

#### Composed Components
```typescript
// Need to create:
- ContentCard (queue item display)
- DropZone (drag & drop area)
- MetadataPanel (tag display/edit)
- QueueList (sortable list)
```

#### Feature Components
```typescript
// Main feature module:
- ContentInboxFeature
  ├── InputPanel (4 input methods)
  ├── QueuePanel (content list)
  └── MetadataPanel (tag management)
```

## 📁 File Structure

```
src/
├── pages/
│   └── Inbox.tsx                    # Page orchestrator
├── features/
│   └── content-inbox/
│       ├── ContentInboxFeature.tsx  # Main feature component
│       ├── components/
│       │   ├── InputPanel.tsx       # Input methods container
│       │   ├── QueuePanel.tsx       # Queue display
│       │   └── MetadataPanel.tsx    # Metadata editor
│       ├── hooks/
│       │   ├── useContentQueue.ts   # Queue state management
│       │   └── useMetadataExtract.ts # Metadata extraction
│       └── types.ts                 # Feature types
├── styles/
│   ├── pages/
│   │   └── inbox.css               # .inbox__ prefixed styles
│   └── features/
│       └── content-inbox.css       # .content-inbox__ prefixed
└── server/
    └── routes/
        └── content-inbox.js        # Backend endpoints
```

## 💾 Data Models

### Content Item
```typescript
interface ContentItem {
  id: string;
  type: 'paste' | 'upload' | 'url' | 'drop';
  content: string;
  metadata: ContentMetadata;
  timestamp: Date;
  status: 'pending' | 'processing' | 'complete';
  sourceUrl?: string;
}

interface ContentMetadata {
  title?: string;
  tags: string[];
  category?: string;
  wordCount: number;
  format: string;
  extractedAt: Date;
  customFields: Record<string, any>;
}
```

## 🚀 Implementation Steps

### Step 1: Page Setup
```bash
# Clear existing inbox
echo "" > src/pages/Inbox.tsx

# Create feature directory
mkdir -p src/features/content-inbox/components
mkdir -p src/features/content-inbox/hooks

# Create CSS files
touch src/styles/features/content-inbox.css
```

### Step 2: Basic Page Structure
```typescript
// src/pages/Inbox.tsx
/**
 * @page Inbox
 * @route /inbox
 * @cssFile /styles/pages/inbox.css
 * @features ContentInbox
 * @className .inbox__
 */
import { Box } from '@/components/Box';
import { ContentInboxFeature } from '@/features/content-inbox/ContentInboxFeature';

export function Inbox() {
  return (
    <Box className="inbox__container">
      <h1 className="inbox__title">Content Inbox</h1>
      <ContentInboxFeature />
    </Box>
  );
}
```

### Step 3: Feature Component
```typescript
// src/features/content-inbox/ContentInboxFeature.tsx
/**
 * @layer feature
 * @cssFile /styles/features/content-inbox.css
 * @dependencies Box, Button, Card
 * @className .content-inbox__
 */
import { useState } from 'react';
import { Box } from '@/components/Box';
import { InputPanel } from './components/InputPanel';
import { QueuePanel } from './components/QueuePanel';
import { useContentQueue } from './hooks/useContentQueue';

export function ContentInboxFeature() {
  const { queue, addContent, updateContent } = useContentQueue();
  
  return (
    <Box className="content-inbox__container">
      <InputPanel onSubmit={addContent} />
      <QueuePanel items={queue} onUpdate={updateContent} />
    </Box>
  );
}
```

### Step 4: CSS Structure
```css
/* src/styles/features/content-inbox.css */

/* Feature Container */
.content-inbox__container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-xl);
  height: calc(100vh - 200px);
}

/* Input Panel */
.content-inbox__input-panel {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.content-inbox__input-method {
  margin-bottom: var(--space-md);
  padding: var(--space-md);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.content-inbox__input-method--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

/* Queue Panel */
.content-inbox__queue-panel {
  overflow-y: auto;
}

.content-inbox__queue-item {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
  cursor: move;
}

.content-inbox__queue-item--processing {
  opacity: 0.6;
}
```

## 🔌 Backend Implementation

### API Endpoints
```javascript
// server/routes/content-inbox.js

// POST /api/content-inbox/submit
// Submit new content for processing
{
  type: 'paste|upload|url|drop',
  content: 'string|file|url',
  options: {}
}

// GET /api/content-inbox/queue
// Get current queue status

// PUT /api/content-inbox/:id/metadata
// Update metadata for item

// POST /api/content-inbox/extract
// Extract metadata from content
```

## ✅ Validation Checklist

### Before Each Component
```bash
# Check component doesn't exist
ls src/features/content-inbox/components/ComponentName.tsx

# Validate imports will work
npm run audit:component Box
```

### After Implementation
```bash
# Component level
npm run audit:component InputPanel

# System level
npm run audit:system

# Check CSS prefixes
grep -E "^\." src/styles/features/content-inbox.css | grep -v "^\.content-inbox__"
```

## 🎯 Success Criteria

1. **Phase 1 Complete When**:
   - Single paste input works
   - Content appears in queue
   - Basic metadata extracted

2. **Phase 2 Complete When**:
   - All 4 input methods functional
   - Unified queue display
   - Consistent metadata format

3. **Phase 3 Complete When**:
   - Drag-to-reorder works
   - Metadata editable
   - Export functionality ready

## 🚀 Quick Start Commands

```bash
# Start implementation
cd /Users/hoff/My Drive/dev/prompt-stack/content-stack-react

# Create feature structure
mkdir -p src/features/content-inbox/{components,hooks}

# Start with paste input
touch src/features/content-inbox/components/PasteInput.tsx

# Run dev server
npm run dev:all
```

## 📊 Progress Tracking

Use TodoWrite tool to track implementation:
1. Clear inbox page
2. Create feature directory structure
3. Implement PasteInput component
4. Create useContentQueue hook
5. Set up basic API endpoint
6. Style with content-inbox__ prefix
7. Add queue display
8. Test metadata extraction

**REMEMBER**: Start minimal, iterate frequently, validate constantly!