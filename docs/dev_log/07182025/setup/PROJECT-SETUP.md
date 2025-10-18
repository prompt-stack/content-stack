# Content Stack React - Project Setup

## Why React?

After building Content Stack with vanilla JS, React would provide:

1. **Component Reusability** - No more duplicate modal/card/button code
2. **State Management** - Clean handling of inbox items, filters, selections
3. **Better Organization** - Clear component hierarchy
4. **Type Safety** - Can add TypeScript easily
5. **Modern Tooling** - Hot reload, better bundling, tree shaking
6. **Easier Testing** - Component testing with React Testing Library

## Project Structure

```
content-stack-react/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/           # Reusable components
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.css
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Dropdown/
│   │   │   └── Badge/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Navigation/
│   │   │   └── Container/
│   │   └── inbox/
│   │       ├── InboxDropzone/
│   │       ├── URLExtractor/
│   │       ├── PasteModal/
│   │       └── InboxItem/
│   ├── pages/               # Page components
│   │   ├── Inbox/
│   │   ├── Library/
│   │   ├── Search/
│   │   └── Settings/
│   ├── hooks/               # Custom React hooks
│   │   ├── useInbox.js
│   │   ├── useTheme.js
│   │   └── useTier.js
│   ├── services/            # API and data services
│   │   ├── api.js
│   │   ├── storage.js
│   │   └── extractors.js
│   ├── utils/               # Utility functions
│   │   ├── validation.js
│   │   └── formatting.js
│   ├── styles/              # Global styles
│   │   ├── index.css
│   │   ├── variables.css
│   │   └── reset.css
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
├── .gitignore
├── README.md
└── vite.config.js          # Using Vite for fast dev
```

## Quick Start Setup

```bash
# Create React app with Vite (much faster than CRA)
npm create vite@latest content-stack-react -- --template react

# Or with TypeScript
npm create vite@latest content-stack-react -- --template react-ts

cd content-stack-react
npm install

# Additional dependencies
npm install react-router-dom       # Routing
npm install @tanstack/react-query  # Data fetching
npm install zustand               # Simple state management
npm install react-dropzone        # Drag and drop
npm install clsx                  # Conditional classes
```

## Component Examples

### 1. Button Component (Reusable everywhere!)
```jsx
// src/components/common/Button/Button.jsx
import React from 'react';
import clsx from 'clsx';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  onClick,
  disabled,
  loading,
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
          'btn--disabled': disabled
        }
      )}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <i className="fas fa-spinner fa-spin" />
      ) : icon ? (
        <i className={`fas fa-${icon}`} />
      ) : null}
      {children}
    </button>
  );
};
```

### 2. Inbox Page Component
```jsx
// src/pages/Inbox/Inbox.jsx
import React, { useState } from 'react';
import { InboxDropzone } from '../../components/inbox/InboxDropzone';
import { URLExtractor } from '../../components/inbox/URLExtractor';
import { PasteModal } from '../../components/inbox/PasteModal';
import { InboxItem } from '../../components/inbox/InboxItem';
import { Button } from '../../components/common/Button';
import { useInbox } from '../../hooks/useInbox';
import './Inbox.css';

export const Inbox = () => {
  const { items, addItem, deleteItem, isLoading } = useInbox();
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className="inbox">
      {/* Input Section */}
      <section className="inbox__input">
        <h2>Add Content to Inbox</h2>
        <p>Drag files anywhere, paste with Ctrl+V, or enter a URL</p>
        
        <URLExtractor onExtract={addItem} />
        <InboxDropzone onDrop={addItem} />
        
        <div className="inbox__actions">
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
      <section className="inbox__items">
        <div className="inbox__header">
          <h3>Inbox Items ({items.length})</h3>
          {/* Filters, search, view toggle */}
        </div>
        
        <div className={`inbox__grid inbox__grid--${viewMode}`}>
          {items.map(item => (
            <InboxItem 
              key={item.id}
              item={item}
              onDelete={deleteItem}
            />
          ))}
        </div>
      </section>

      {/* Modals */}
      <PasteModal 
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onSave={addItem}
      />
    </div>
  );
};
```

### 3. Custom Hook for Inbox
```jsx
// src/hooks/useInbox.js
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

export const useInbox = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: api.getInboxItems
  });

  const addMutation = useMutation({
    mutationFn: api.addInboxItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['inbox']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteInboxItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['inbox']);
    }
  });

  return {
    items,
    isLoading,
    addItem: addMutation.mutate,
    deleteItem: deleteMutation.mutate
  };
};
```

## Migration Strategy

1. **Start Fresh** - Don't try to port everything at once
2. **Build Core First** - Inbox functionality, then expand
3. **Reuse Logic** - Your API endpoints stay the same
4. **Gradual Migration** - Can run both versions side by side

## Benefits Over Current Architecture

### Before (Vanilla JS):
- Scattered event handlers
- DOM manipulation everywhere
- Hard to track state
- Duplicate code for similar components
- Complex initialization

### After (React):
- Declarative components
- Centralized state
- Reusable everything
- Clear data flow
- Hot module replacement

## Next Steps

1. Set up the React project with Vite
2. Create the component structure
3. Build the Inbox page first
4. Add routing for other pages
5. Implement state management
6. Style with your existing CSS (mostly reusable!)
7. Connect to your existing backend

The React version will be much cleaner and easier to maintain!