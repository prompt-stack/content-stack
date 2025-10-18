# Content Stack React - Codebase Structure & Conventions

## Overview
This document captures the established conventions and structure of the Content Stack React project as of January 2025.

## 1. Component Architecture Layers

### Hierarchy (Dependencies flow downward only)
```
Pages → Features → Composed → Primitives
```

### Layer Definitions

#### Primitives (`/src/components/`)
- **Purpose**: Basic building blocks, zero dependencies
- **Examples**: `Button.tsx`, `Input.tsx`, `Box.tsx`, `Text.tsx`
- **CSS Location**: `/src/styles/components/[component-name].css`
- **Naming**: PascalCase components, kebab-case CSS

#### Composed (`/src/components/`)
- **Purpose**: Built from primitives only
- **Examples**: `Card.tsx`, `Modal.tsx`, `Dropdown.tsx`
- **CSS Location**: `/src/styles/components/[component-name].css`
- **Can Import**: Primitives only

#### Features (`/src/features/`)
- **Purpose**: Business logic, domain-specific components
- **Structure**:
  ```
  /features/content-inbox/
    ContentInboxFeature.tsx      # Main feature component
    components/                  # Feature-specific components
      ContentInboxInputPanel.tsx
      ContentInboxQueuePanel.tsx
    hooks/                      # Feature-specific hooks
      useContentQueue.ts
    types.ts                    # Feature types
    config.ts                   # Feature configuration
  ```
- **CSS Location**: `/src/styles/features/[feature-name].css`
- **Can Import**: Primitives, Composed components

#### Pages (`/src/pages/`)
- **Purpose**: Route-level components
- **Examples**: `InboxPage.tsx`, `PlaygroundPage.tsx`
- **CSS Location**: `/src/styles/pages/[page-name].css`
- **Can Import**: Features, Composed, Primitives

## 2. CSS Architecture

### BEM Naming Convention
```css
/* Block */
.content-inbox { }

/* Element */
.content-inbox__header { }
.content-inbox__item { }

/* Modifier */
.content-inbox--loading { }
.content-inbox__item--selected { }

/* State (temporary) */
.content-inbox.is-dragging { }
.content-inbox__item.is-processing { }
```

### CSS File Structure
```
/src/styles/
  ├── base/          # Global styles, animations
  ├── components/    # Primitive & composed component styles
  ├── features/      # Feature-specific styles
  ├── pages/         # Page-specific styles
  ├── layout/        # Layout component styles (header, nav)
  └── utils/         # Utility classes and fixes
```

### Component to CSS Mapping
- `Button.tsx` → `button.css`
- `ContentInboxFeature.tsx` → `content-inbox.css`
- `InboxPage.tsx` → `inbox.css`

## 3. Component Documentation Standard

Every component includes a JSDoc header:

```typescript
/**
 * @layer primitive|composed|feature
 * @cssFile /styles/components/[name].css
 * @dependencies List of components used
 * @className .component-name
 */
```

Example:
```typescript
/**
 * @layer primitive
 * @cssFile /styles/components/button.css
 * @dependencies None
 * @className .btn
 */
export function Button({ ... }) {
  // Component implementation
}
```

## 4. File Naming Conventions

### Frontend
- **Components**: `PascalCase.tsx` (e.g., `Button.tsx`)
- **Hooks**: `use[Name].ts` (e.g., `useContentQueue.ts`)
- **CSS**: `kebab-case.css` (e.g., `button.css`)
- **Utils**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Types**: `types.ts` or `[Domain]Types.ts`

### Backend (`/backend/`)
- **Services**: `PascalCaseService.ts` (e.g., `ContentInboxService.ts`)
- **Routes**: `camelCase.ts` (e.g., `contentInbox.ts`)
- **Utils**: `verbFirst.ts` (e.g., `generateContentId.ts`)

## 5. Import Organization

Standard import order:
```typescript
// 1. React/External libraries
import React, { useState } from 'react';
import clsx from 'clsx';

// 2. Internal components (absolute paths)
import { Button } from '@/components/Button';
import { useContentQueue } from '@/hooks/useContentQueue';

// 3. Local/relative imports
import { ContentItem } from './types';

// 4. Styles (always last)
import './styles.css';
```

## 6. State Management Patterns

### Component State
```typescript
// Boolean states
const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

// Data states
const [items, setItems] = useState<Item[]>([]);

// Complex state (use reducer)
const [state, dispatch] = useReducer(reducer, initialState);
```

### Props Naming
```typescript
interface ButtonProps {
  // Boolean props
  isLoading?: boolean;
  isDisabled?: boolean;
  
  // Event handlers
  onClick?: () => void;
  onChange?: (value: string) => void;
  
  // Data props
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}
```

## 7. API & Backend Patterns

### API Routes
- Format: `/api/[feature]/[resource]`
- Examples:
  - `/api/content-inbox/items`
  - `/api/content-inbox/process`
  - `/api/metadata/extract`

### Service Methods
```typescript
class ContentInboxService {
  // CRUD operations
  async getItems() { }
  async createItem(data: CreateItemDto) { }
  async updateItem(id: string, data: UpdateItemDto) { }
  async deleteItem(id: string) { }
  
  // Actions
  async processContent(data: ProcessDto) { }
  async bulkImport(items: ImportDto[]) { }
}
```

## 8. Quality Checks

### Available Scripts
- `npm run audit:naming` - Check naming conventions
- `npm run audit:css` - Validate CSS structure
- `npm run validate:components` - Ensure component-CSS mapping

### Component Checklist
- [ ] Has proper layer documentation
- [ ] CSS file exists and follows BEM
- [ ] Props interface defined with proper naming
- [ ] Follows import order convention
- [ ] No upward dependencies (features can't import pages)

## 9. Special Patterns

### Virtual Scrolling for Lists
```typescript
<VirtualList
  items={items}
  height={600}
  itemHeight={80}
  renderItem={(item) => <ItemComponent {...item} />}
/>
```

### Modal State Management
```typescript
// Single state object pattern
const [modalState, setModalState] = useState({
  isOpen: false,
  mode: 'create', // 'create' | 'edit' | 'view'
  data: null
});
```

### Error Handling
```typescript
// User-friendly errors
try {
  await api.processContent(data);
} catch (error) {
  if (error.code === 'FILE_TOO_LARGE') {
    showError('File is too large (max: 50MB)');
  } else {
    showError('Something went wrong. Please try again.');
  }
}
```

## 10. CSS Utility Classes

### Spacing Scale
- `m-0` through `m-5` (margin)
- `p-0` through `p-5` (padding)
- Scale: 0=0, 1=xs, 2=sm, 3=md, 4=lg, 5=xl

### Display Utilities
- `d-none`, `d-block`, `d-flex`, `d-grid`
- `flex-center`, `flex-between`, `flex-column`

### Text Utilities
- `text-center`, `text-left`, `text-right`
- `text-primary`, `text-secondary`, `text-muted`
- `font-bold`, `font-medium`

This structure ensures consistency, maintainability, and clear separation of concerns throughout the application.