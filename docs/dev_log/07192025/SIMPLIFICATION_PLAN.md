# Simplification Plan for Inbox Queue

## Current State - Bloated
- 4 different design variations (Grid/List, Enhanced, Metadata Rich, Compact Table)
- Complex nested components
- Too many CSS classes and layers
- Overly complicated state management
- Multiple ways to do the same thing

## Proposed Simplified Design

### Core Principles
1. **One design that works well** - Not 4 variations
2. **Minimal CSS** - Use existing design tokens, avoid custom classes
3. **Clear information hierarchy** - What matters most?
4. **Fast interactions** - Click to select, double-click to open
5. **Mobile-first** - Works great on all devices

### What Users Actually Need
1. **See their content** - Title, type, status
2. **Select items** - For bulk operations
3. **Quick actions** - View, Edit, Delete
4. **Sort/Filter** - Find what they need
5. **Responsive** - Works on mobile

### Simplified Component Structure
```
InboxQueue/
├── InboxQueue.tsx       # Main component (< 200 lines)
├── InboxItem.tsx        # Single item (< 50 lines)
└── inbox-queue.css      # Minimal styles (< 150 lines)
```

### Simplified Data Model
```typescript
interface QueueItem {
  id: string
  title: string
  type: 'file' | 'url' | 'text'
  status: 'raw' | 'processing' | 'done' | 'error'
  size?: number
  created: Date
}
```

### CSS Approach
- Use CSS Grid for layout (no flexbox gymnastics)
- Leverage CSS variables from existing system
- No BEM, just simple classes
- Use :has() and :where() for state styling
- Container queries for responsive design

### Example Implementation

```tsx
// Super simple queue item
function QueueItem({ item, selected, onSelect, onAction }) {
  return (
    <div 
      className={`queue-item ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(item.id)}
    >
      <span className="icon">{getIcon(item.type)}</span>
      <span className="title">{item.title}</span>
      <span className={`status ${item.status}`}>{item.status}</span>
      <button onClick={(e) => { e.stopPropagation(); onAction('view', item); }}>
        View
      </button>
    </div>
  )
}
```

```css
/* Entire CSS file */
.queue {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
}

.queue-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  cursor: pointer;
}

.queue-item:hover {
  border-color: var(--primary);
}

.queue-item.selected {
  background: var(--primary-alpha);
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.status.raw { background: var(--blue-100); color: var(--blue-700); }
.status.processing { background: var(--yellow-100); color: var(--yellow-700); }
.status.done { background: var(--green-100); color: var(--green-700); }
.status.error { background: var(--red-100); color: var(--red-700); }

/* Responsive */
@container (width < 600px) {
  .queue-item {
    grid-template-columns: 1fr auto;
  }
  .icon, .status { display: none; }
}
```

## Benefits of Simplification
1. **Performance** - Less DOM nodes, faster renders
2. **Maintainability** - Easy to understand and modify
3. **Accessibility** - Semantic HTML, keyboard navigation
4. **Developer Experience** - Quick to implement features
5. **User Experience** - Fast, predictable, works everywhere

## Migration Path
1. Keep existing complex version for now
2. Build simplified version alongside
3. A/B test with users
4. Gradually migrate features that prove valuable
5. Delete the complex version

## What We're NOT Building
- Drag and drop reordering
- Inline editing
- Complex filtering UI
- Multiple view modes
- Animations and transitions (beyond basics)
- Custom context menus
- Virtualization (until we need it)

## Measuring Success
- Page load time < 100ms
- Interaction response < 50ms
- Code size < 10KB (component + CSS)
- Works without JavaScript (progressive enhancement)
- 100% keyboard accessible