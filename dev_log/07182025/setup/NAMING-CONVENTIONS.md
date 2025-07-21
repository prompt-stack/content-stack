# Content Stack React - Naming Conventions & Structure

## Core Principles
1. **Flat is better than nested** - Max 3 levels deep
2. **Explicit over clever** - Name should tell you what it does
3. **Consistent patterns** - Same naming for similar things
4. **Co-location** - Keep related files together

## Simplified File Structure

```
content-stack-react/
├── src/
│   ├── components/          # All UI components (flat)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropzone.tsx
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── InboxItem.tsx
│   │   ├── URLInput.tsx
│   │   └── PasteModal.tsx
│   ├── pages/              # Page components
│   │   ├── Inbox.tsx
│   │   ├── Library.tsx
│   │   ├── Search.tsx
│   │   └── Settings.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useInbox.ts
│   │   ├── useContent.ts
│   │   └── useTheme.ts
│   ├── services/           # External interactions
│   │   ├── api.ts
│   │   └── storage.ts
│   ├── lib/                # Utilities & helpers
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts        # All types in one file to start
│   ├── styles/
│   │   ├── globals.css     # Global styles & CSS variables
│   │   └── components.css  # Shared component styles
│   ├── App.tsx
│   └── main.tsx
```

## Naming Conventions

### 1. **Components**
```typescript
// ✅ PascalCase for components
// ✅ Descriptive single words or max 2 words
export function Button() {}
export function InboxItem() {}
export function URLInput() {}

// ❌ Avoid
export function MyButton() {}              // No "My" prefix
export function InboxItemCardComponent() {} // Too long
export function Btn() {}                   // No abbreviations
```

### 2. **Props Interfaces**
```typescript
// ✅ Component name + "Props"
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

interface InboxItemProps {
  item: ContentItem;
  onDelete: (id: string) => void;
}

// ❌ Avoid
interface IButtonProps {}    // No "I" prefix
interface ButtonInterface {} // Not "Interface"
```

### 3. **Hooks**
```typescript
// ✅ "use" + feature/resource
export function useInbox() {}
export function useContent(id: string) {}
export function useDebounce(value: string, delay: number) {}

// ❌ Avoid
export function useInboxData() {}     // Redundant "Data"
export function useGetContent() {}    // No "Get" in hook names
export function InboxHook() {}        // Must start with "use"
```

### 4. **Event Handlers**
```typescript
// ✅ "handle" + Event
const handleClick = () => {};
const handleSubmit = () => {};
const handleDrop = (files: File[]) => {};

// ✅ Or "on" + Event for props
interface ButtonProps {
  onClick?: () => void;
  onHover?: () => void;
}

// ❌ Avoid
const clickHandler = () => {};  // Use handleClick
const doClick = () => {};       // Use handleClick
```

### 5. **Utilities & Helpers**
```typescript
// ✅ Verb + Noun or descriptive name
export function formatDate(date: Date): string {}
export function validateEmail(email: string): boolean {}
export function extractVideoId(url: string): string {}

// ❌ Avoid
export function date(d: Date) {}        // Too vague
export function emailValidator() {}     // Use verb first
export function processURLString() {}   // Too verbose
```

### 6. **Types & Interfaces**
```typescript
// ✅ Clear, descriptive names
type ContentStatus = 'raw' | 'processed' | 'error';

interface ContentItem {
  id: string;
  title: string;
  content: string;
}

// ❌ Avoid
type TContentStatus = '';    // No "T" prefix
interface IContent {}        // No "I" prefix
type ContentType = '';       // Don't use "Type" suffix for types
```

### 7. **Constants**
```typescript
// ✅ SCREAMING_SNAKE_CASE for true constants
const API_BASE_URL = 'http://localhost:3468';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ✅ Regular case for constant objects
const tierLimits = {
  free: { maxItems: 100 },
  pro: { maxItems: 10000 }
};

// ❌ Avoid
const apiBaseUrl = '';        // Use SCREAMING_SNAKE for constants
const TIER_LIMITS = {};       // Use camelCase for objects
```

### 8. **Files & Folders**
```typescript
// ✅ Components: PascalCase
Button.tsx
InboxItem.tsx

// ✅ Everything else: camelCase
useInbox.ts
formatters.ts
api.ts

// ✅ Index files for exports
types/index.ts

// ❌ Avoid
button.component.tsx      // No .component suffix
use-inbox.ts             // Use camelCase, not kebab
API.ts                   // Should be lowercase
```

### 9. **CSS Classes (when needed)**
```css
/* ✅ Simple BEM-lite */
.button { }
.button--primary { }
.button--large { }

.inbox-item { }
.inbox-item--selected { }

/* ❌ Avoid */
.btn { }                    /* No abbreviations */
.button__inner__text { }    /* Too nested */
.primaryButton { }          /* Use modifiers */
```

### 10. **IDs (rarely needed in React)**
```typescript
// ✅ Only for accessibility or anchors
id="main-content"
id="search-input"
id="modal-title"

// ❌ Avoid IDs for styling or JS selection
id="inbox-container"  // Use refs or data attributes
```

## Data Attributes for Testing
```typescript
// ✅ Use data-testid for testing
<button data-testid="submit-button">Submit</button>
<div data-testid="inbox-item-5">...</div>

// ✅ Use data-* for state/behavior
<div data-state="loading">...</div>
<button data-action="delete">...</button>
```

## Import Organization
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal absolute imports
import { Button } from '@/components/Button';
import { useInbox } from '@/hooks/useInbox';

// 3. Relative imports
import { formatDate } from './utils';

// 4. Types
import type { ContentItem } from '@/types';

// 5. Styles (if needed)
import './InboxItem.css';
```

## Example Component Structure
```typescript
// Button.tsx - Everything in one file for simple components
import { forwardRef } from 'react';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', loading, className, children, ...props }, ref) => {
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
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

## Benefits of This Approach
1. **Easy to find files** - Flat structure, clear names
2. **Easy to understand** - Consistent patterns
3. **Easy to maintain** - Co-located code
4. **Easy to scale** - Can split files later if needed
5. **Fast development** - Less decision fatigue

Start simple, keep it flat, use clear names. You can always split things up later if a component gets complex!