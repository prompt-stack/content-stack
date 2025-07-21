# Content Inbox Redesign Plan

## Overview
Redesign the Content Inbox page to include a collapsible sidebar and multiple view options (list, compact, card) while maintaining our design system principles.

## Current Issues
1. **Screen Real Estate**: Title and subtitle taking too much space
2. **No View Options**: Only card view available
3. **Fixed Sidebar**: Cannot collapse, wastes space
4. **Mobile Experience**: Not optimized

## Proposed Architecture

### 1. Layout Structure
```
InboxPage
├── CollapsibleSidebar (new)
│   ├── SidebarHeader
│   │   ├── Title (collapsible)
│   │   └── ToggleButton
│   ├── AddContentPanel
│   │   ├── URLInput
│   │   ├── PasteArea
│   │   └── FileUpload
│   └── FilterPanel
└── MainContent
    ├── ViewToggle (new)
    │   ├── CardView
    │   ├── ListView
    │   └── CompactView
    └── ContentInboxQueuePanel
```

### 2. Implementation Approach

#### Phase 1: Component Preparation
- Create reusable `CollapsibleSidebar` component
- Create `ViewToggle` component
- Create view-specific components (ListView, CompactView)

#### Phase 2: State Management
- Add sidebar collapsed state (persisted)
- Add view mode state (persisted)
- Update ContentInbox to support multiple views

#### Phase 3: Responsive Design
- Mobile: Sidebar as overlay
- Tablet: Auto-collapse sidebar
- Desktop: Full sidebar with collapse option

### 3. Design Decisions

#### Sidebar Behavior
- **Expanded Width**: 320px
- **Collapsed Width**: 64px (icon-only mode)
- **Animation**: 300ms ease-out
- **Persistence**: Remember user preference

#### View Modes
1. **Card View** (current)
   - Visual preview
   - Good for browsing
   - 2-3 columns responsive grid

2. **List View**
   - Compact rows
   - More items visible
   - Quick scanning

3. **Compact View**
   - Minimal height rows
   - Maximum density
   - Keyboard navigation optimized

### 4. Component Structure

```typescript
// New Components Needed
/src/components/CollapsibleSidebar/
  CollapsibleSidebar.tsx
  collapsible-sidebar.css

/src/components/ViewToggle/
  ViewToggle.tsx
  view-toggle.css

/src/features/content-inbox/views/
  ListView.tsx
  CompactView.tsx
  list-view.css
  compact-view.css
```

### 5. CSS Architecture
Following our BEM convention:
```css
/* Sidebar */
.collapsible-sidebar
.collapsible-sidebar--collapsed
.collapsible-sidebar__toggle
.collapsible-sidebar__content

/* View Toggle */
.view-toggle
.view-toggle__button
.view-toggle__button--active

/* List View */
.content-list
.content-list__item
.content-list__item--selected
```

### 6. Implementation Order

1. **Create CollapsibleSidebar component**
   - Build as composed component
   - Use existing primitives (Button, Box)
   - Add to component exports

2. **Refactor InboxPage layout**
   - Move add content panel to sidebar
   - Implement sidebar toggle
   - Update page structure

3. **Add View Options**
   - Create ViewToggle component
   - Implement ListView and CompactView
   - Add view switching logic

4. **Polish & Optimize**
   - Add animations
   - Implement keyboard shortcuts
   - Test responsive behavior

### 7. Git Strategy

**Option A: Feature Branch (Recommended)**
```bash
git checkout -b feature/inbox-redesign
# Implement changes
# Test thoroughly
git push origin feature/inbox-redesign
# Create PR for review
```

**Option B: Direct to Main**
- Only if you want immediate deployment
- Riskier, but faster

### 8. Benefits
- **More Content Visible**: Collapsible sidebar frees space
- **User Preference**: Multiple view options
- **Better Mobile**: Responsive sidebar
- **Consistent UX**: Follows modern app patterns (Notion, VS Code)

### 9. Risks & Mitigation
- **Breaking Changes**: Use feature flags if needed
- **Performance**: Virtual scrolling already implemented
- **Accessibility**: Ensure keyboard navigation works

## Next Steps
1. Confirm approach (feature branch vs main)
2. Start with CollapsibleSidebar component
3. Incrementally update InboxPage
4. Test across devices/browsers

## Questions to Consider
- Should we add a "zen mode" (hide everything but content)?
- Do we need density settings (comfortable/cozy/compact)?
- Should filter panel also be in sidebar?
- Add keyboard shortcuts (Cmd+B for toggle)?