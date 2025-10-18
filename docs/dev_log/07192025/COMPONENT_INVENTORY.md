# Component Inventory - Content Stack React

## Overview
This document tracks all pages, components, and design explorations in the Content Stack React project.

## Pages (`/src/pages/`)

### Core Pages
1. **Inbox.tsx** - Main inbox interface
2. **Library.tsx** - Content library view
3. **Search.tsx** - Search functionality
4. **Settings.tsx** - Application settings
5. **Health.tsx** - System health monitoring

### Feature Pages
6. **Subscription.tsx** - Manage subscription/pricing tiers

### Design Exploration Pages
7. **InboxQueueDesigns.tsx** - 4 design variations for inbox queue
   - Grid/List View
   - Enhanced List
   - Metadata Rich
   - Compact Table
8. **InboxSimple.tsx** - Minimalist inbox approach
9. **InboxClean.tsx** - Clean, modern inbox design (BEM/Style Guide compliant)
10. **ContentInboxDesigns.tsx** - Original cosmic-themed inbox designs
11. **ModalShowcase.tsx** - Modal component demonstrations

## Components (`/src/components/`)

### Core UI Components
1. **Button.tsx** - Button component
2. **Card.tsx** - Card container
3. **Modal.tsx** - Base modal component
4. **Dropdown.tsx** - Dropdown menus

### Feature Components
5. **ContentInbox.tsx** - Content inbox feature
6. **QueueManager.tsx** - Queue management
7. **InboxItem.tsx** - Individual inbox item
8. **Dropzone.tsx** - Drag-and-drop file upload

### Modal Components
9. **PasteModal.tsx** - Text/content pasting
10. **ContentViewModal.tsx** - View full content
11. **JsonEditorModal.tsx** - JSON editing interface

### Layout Components
12. **Layout.tsx** - Main app layout wrapper
13. **Header.tsx** - Application header
14. **MobileMenu.tsx** - Mobile navigation

### Input Components
15. **URLInput.tsx** - URL input field
16. **ApiTest.tsx** - API connection testing

## Style Architecture

### Design Systems
- **Style Guide**: `/dev_log/07182025/css-design/STYLE-GUIDE.md`
- **Naming Conventions**: `/dev_log/07182025/setup/NAMING-CONVENTIONS.md`

### CSS Structure
```
src/styles/
├── base/          # Reset, animations, variables
├── components/    # Reusable UI components
├── features/      # Feature-specific styles
├── pages/         # Page-specific styles
├── layout/        # Layout components
└── utils/         # Utility classes
```

## Design Exploration Summary

### Current State
- **InboxQueueDesigns**: Complex, 4 variations, 900+ lines CSS (too cramped)
- **InboxSimple**: Minimal approach, 300 lines CSS
- **InboxClean**: Best practice implementation following style guide

### Issues Identified
1. Too many design variations causing confusion
2. Cramped layouts with insufficient spacing
3. Inconsistent naming conventions
4. Over-engineered state management

## Proposed: Component Playground

### Why We Need It
1. **Isolation**: Build components without affecting production code
2. **Documentation**: Live examples of component usage
3. **Testing**: Try variations quickly
4. **Design System**: Enforce consistency

### Playground Structure
```
/src/playground/
├── index.tsx              # Playground home
├── components/            # Component demos
│   ├── ButtonPlayground.tsx
│   ├── CardPlayground.tsx
│   ├── ModalPlayground.tsx
│   └── FormPlayground.tsx
├── patterns/              # Design patterns
│   ├── LayoutPatterns.tsx
│   ├── DataDisplay.tsx
│   └── InteractionPatterns.tsx
└── experiments/           # New ideas
    ├── InboxExperiments.tsx
    └── NavigationExperiments.tsx
```

### Features
1. **Component Viewer**: See all variations
2. **Props Playground**: Interactive prop editing
3. **Code Examples**: Copy-paste ready code
4. **Theme Testing**: Light/dark mode preview
5. **Responsive Preview**: Mobile/tablet/desktop views

## Next Steps

### Immediate Actions
1. Create `/playground` route and base component
2. Move experimental designs to playground
3. Document component APIs
4. Create component templates

### Long-term Goals
1. Component library documentation
2. Storybook integration (optional)
3. Visual regression testing
4. Design token management

## Component Status

| Component | Status | Playground | Documentation |
|-----------|--------|-----------|---------------|
| Button | ✅ Stable | ❌ Needed | ❌ Needed |
| Card | ✅ Stable | ❌ Needed | ❌ Needed |
| Modal | ✅ Stable | ✅ Showcase exists | ⚠️ Basic |
| InboxItem | 🔄 Multiple versions | ❌ Needed | ❌ Needed |
| Dropzone | ✅ Stable | ❌ Needed | ❌ Needed |
| ContentViewModal | ✅ Stable | ❌ Needed | ❌ Needed |
| JsonEditorModal | ✅ Stable | ❌ Needed | ❌ Needed |

### Legend
- ✅ Complete/Stable
- 🔄 In Progress/Multiple Versions
- ⚠️ Needs Improvement
- ❌ Not Started