# Content Stack React - Project Structure

## Overview
This document outlines the current project structure and its equivalents to the previous content-stack-1 implementation.

## Current Project Architecture

### **1. Frontend Framework**
- **Technology**: React 18 with TypeScript (vs. Vanilla JS in content-stack-1)
- **Build Tool**: Vite (vs. custom build scripts)
- **Routing**: React Router v7
- **State Management**: React hooks and context

### **2. Directory Structure**
```
/content-stack-react/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and helpers
│   ├── styles/         # Modular CSS architecture
│   └── assets/         # Static assets
├── public/             # Public assets
├── server/             # Backend (TO BE IMPLEMENTED)
└── dev_log/            # Development tracking (TO BE CREATED)
```

### **3. Current Dependencies**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1",
    "clsx": "^2.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-toggle": "^1.1.0"
  },
  "devDependencies": {
    "typescript": "~5.6.2",
    "vite": "^7.0.5",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2"
  }
}
```

### **4. CSS Architecture**
- **Approach**: Layer-based CSS with @layer directives
- **Organization**:
  ```
  src/styles/
  ├── base/           # Reset, variables, animations
  ├── components/     # Component styles
  ├── features/       # Feature-specific styles
  ├── pages/          # Page-specific styles
  ├── layout/         # Layout components
  └── utils/          # Utility classes
  ```
- **Documentation**: STYLE-GUIDE.md for naming conventions

### **5. Component Structure**
- **Atomic Design**: Small, reusable components
- **TypeScript**: Full type safety
- **Examples**:
  - `Button.tsx` - Primary action component
  - `Modal.tsx` - Dialog system
  - `Card.tsx` - Content containers
  - `PasteModal.tsx` - Specialized modals

### **6. Routing Structure**
```
/                   # Home page
/inbox              # Content inbox
/library            # Content library
/search             # Search interface
/settings           # User settings
/modal-showcase     # Design showcase
/inbox-designs      # Legacy designs
```

## Equivalents to content-stack-1

### **Server Implementation (Planned)**
```
/server/
├── index.js              # Express server
├── routes/
│   ├── content.js        # Content management
│   ├── inbox.js          # Inbox operations
│   ├── metadata.js       # Metadata handling
│   └── export.js         # Export functionality
├── services/
│   ├── contentProcessor.js
│   ├── storageService.js
│   └── validationService.js
├── middleware/
│   ├── auth.js
│   ├── cors.js
│   └── errorHandler.js
└── utils/
    ├── fileOperations.js
    └── caching.js
```

### **Development Tracking (To Implement)**
```
/dev_log/
├── 2025-01/
│   ├── 01-19-architecture.md
│   ├── 01-19-css-refactor.md
│   └── 01-19-component-fixes.md
└── README.md
```

### **Configuration (To Create)**
```
/config/
├── paths.js            # Path configuration
├── contentTypes.json   # Content type definitions
├── categories.js       # Category system
└── metadata.js         # Metadata schema
```

### **Scripts to Add**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "server": "node server/index.js",
    "server:dev": "nodemon server/index.js"
  }
}
```

## Migration Path from content-stack-1

### **Phase 1: Frontend Enhancement** ✅
- Migrate to React/TypeScript
- Implement modern CSS architecture
- Create component library
- Set up routing

### **Phase 2: Backend Integration** (Next)
- Port Express server
- Implement API routes
- Set up file storage
- Configure metadata system

### **Phase 3: Content Pipeline**
- Implement content processing
- Set up inbox system
- Create export functionality
- Add search capabilities

### **Phase 4: Advanced Features**
- Plugin system
- Content extractors
- Batch operations
- Analytics

## Key Differences

1. **Frontend**: React/TypeScript vs. Vanilla JS
2. **Build System**: Vite vs. custom scripts
3. **CSS**: Modern layers vs. traditional approach
4. **Components**: Atomic design vs. monolithic
5. **Type Safety**: Full TypeScript coverage
6. **Routing**: React Router vs. server-side

## Development Guidelines

1. **Component Creation**:
   - Use TypeScript interfaces
   - Follow atomic design principles
   - Document with JSDoc comments

2. **Styling**:
   - Follow BEM naming when possible
   - Use CSS custom properties
   - Maintain layer hierarchy

3. **State Management**:
   - Prefer local state
   - Use context for global state
   - Consider Redux for complex state

4. **Testing**:
   - Unit tests for utilities
   - Component tests with React Testing Library
   - E2E tests with Playwright

## Next Steps

1. **Immediate**:
   - Set up Express server
   - Create dev_log structure
   - Add configuration files

2. **Short Term**:
   - Implement content API
   - Add file upload
   - Create search functionality

3. **Long Term**:
   - Plugin system
   - Content extractors
   - Advanced metadata

## Resources

- [Original Project](./content-stack-1/) - Reference implementation
- [Style Guide](./STYLE-GUIDE.md) - CSS conventions
- [API Design](./docs/api-design.md) - Planned API structure