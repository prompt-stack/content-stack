# CSS Architecture Refactor Plan

## Current Situation
The `components.css` file is currently 1004 lines and growing rapidly. It contains styles for:
- Base components (Button, Card, Badge)
- Page-specific styles (Inbox, Hero, App)
- Feature-specific components (ContentInbox, QueueManager, Modal)
- Mobile menu system
- Theme toggle
- Various UI elements

## Problems with Current Approach
1. **File size**: Already over 1000 lines, difficult to navigate
2. **No separation of concerns**: Base components mixed with page styles
3. **Difficult maintenance**: Finding specific styles requires scrolling
4. **Merge conflicts**: Multiple developers editing same file
5. **Performance**: Loading all styles even when not needed

## Proposed Architecture

### 1. Component-Based File Structure
```
src/styles/
├── base/
│   ├── reset.css          # CSS reset (if needed)
│   ├── animations.css     # Global animations
│   └── utilities.css      # Utility classes
├── components/
│   ├── button.css         # Button component
│   ├── card.css          # Card component
│   ├── badge.css         # Badge component
│   ├── modal.css         # Modal component
│   ├── forms.css         # Form elements
│   └── toggle.css        # Toggle switches
├── features/
│   ├── content-inbox.css  # Content inbox specific
│   ├── queue-manager.css  # Queue manager
│   ├── mobile-menu.css   # Mobile menu system
│   └── theme-toggle.css  # Theme toggle
├── pages/
│   ├── home.css          # Homepage/App styles
│   ├── inbox.css         # Inbox page
│   ├── library.css       # Library page
│   └── search.css        # Search page
├── layout/
│   ├── header.css        # Header styles
│   ├── navigation.css    # Navigation
│   └── responsive.css    # Media queries
└── index.css             # Main entry point
```

### 2. CSS Layers Strategy
Use CSS `@layer` for cascade control:

```css
/* index.css */
@layer reset, base, components, features, pages, utilities;

@import './base/reset.css' layer(reset);
@import './base/animations.css' layer(base);
@import './components/button.css' layer(components);
@import './components/card.css' layer(components);
/* ... etc */
```

### 3. Component Naming Convention
Adopt BEM-like naming with component prefixes:

```css
/* button.css */
.btn { /* base button */ }
.btn--primary { /* modifier */ }
.btn--large { /* modifier */ }
.btn__icon { /* element */ }
.btn__loading { /* element */ }

/* card.css */
.card { /* base card */ }
.card--elevated { /* modifier */ }
.card__header { /* element */ }
.card__body { /* element */ }
```

### 4. Migration Strategy

#### Phase 1: Setup Structure (Week 1)
1. Create new directory structure
2. Set up index.css with @layer imports
3. Configure build process if needed

#### Phase 2: Extract Base Components (Week 1-2)
Extract in order of dependency:
1. `animations.css` - All @keyframes
2. `button.css` - Button styles
3. `card.css` - Card styles
4. `badge.css` - Badge styles
5. `modal.css` - Modal styles
6. `forms.css` - Form elements
7. `toggle.css` - Toggle switches

#### Phase 3: Extract Features (Week 2)
1. `content-inbox.css` - Cosmic station styles
2. `queue-manager.css` - Queue functionality
3. `mobile-menu.css` - Mobile navigation
4. `theme-toggle.css` - Theme switching

#### Phase 4: Extract Pages (Week 2-3)
1. `home.css` - Hero, features, quick links
2. `inbox.css` - Inbox page layout
3. Create stubs for library.css, search.css

#### Phase 5: Cleanup (Week 3)
1. Remove old components.css
2. Update all imports
3. Test thoroughly
4. Document new structure

### 5. File Size Guidelines
- **Component files**: Max 200 lines
- **Feature files**: Max 300 lines
- **Page files**: Max 150 lines
- If larger, consider splitting further

### 6. Import Management

#### Option A: CSS @import (Recommended)
```css
/* index.css */
@import './components/button.css';
@import './components/card.css';
```
**Pros**: No build step required, native CSS
**Cons**: Multiple HTTP requests (mitigated by HTTP/2)

#### Option B: Build-time concatenation
Use Vite/build tool to combine files
**Pros**: Single file output
**Cons**: Requires build configuration

#### Option C: CSS Modules
```typescript
import styles from './Button.module.css'
```
**Pros**: Scoped styles, tree-shaking
**Cons**: Requires refactoring components

### 7. Code Splitting Benefits
1. **Parallel development**: Multiple devs can work on different components
2. **Easier testing**: Test component styles in isolation
3. **Better caching**: Only changed files need re-download
4. **Clearer dependencies**: Easy to see what styles belong where
5. **Potential for lazy loading**: Load page styles on demand

### 8. Example Migration

#### Before (components.css):
```css
/* Button Component */
.button { /* 75 lines of button styles */ }

/* Card Component */
.card { /* 30 lines of card styles */ }

/* ... 900+ more lines */
```

#### After:

**button.css**:
```css
/* Button Component Styles */
.btn {
  display: inline-flex;
  align-items: center;
  /* ... */
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-plasma), #0099ff);
  /* ... */
}
```

**card.css**:
```css
/* Card Component Styles */
.card {
  background: var(--surface-primary);
  border-radius: var(--radius-lg);
  /* ... */
}

.card--elevated {
  background: var(--surface-elevated);
  /* ... */
}
```

### 9. Tooling Recommendations

#### VS Code Extensions
- **CSS Peek**: Navigate between CSS and HTML
- **CSS Modules**: If using CSS modules
- **Import Cost**: See file sizes

#### Build Optimizations
```javascript
// vite.config.js
export default {
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      css: {
        charset: false // Reduce file size
      }
    }
  }
}
```

### 10. Documentation Structure
Create a `styles/README.md`:
```markdown
# Styles Architecture

## Structure
- `/base` - Foundational styles
- `/components` - Reusable component styles
- `/features` - Feature-specific styles
- `/pages` - Page-level styles
- `/layout` - Layout and structure

## Adding New Styles
1. Determine category (component/feature/page)
2. Create new file or add to existing
3. Import in index.css
4. Follow naming conventions

## Naming Conventions
- Components: `.component-name`
- Modifiers: `.component--modifier`
- Elements: `.component__element`
```

### 11. Performance Considerations

#### Critical CSS
Inline critical styles for above-the-fold content:
```html
<style>
  /* Critical styles */
  .hero { /* ... */ }
</style>
<link rel="stylesheet" href="/styles/index.css">
```

#### Lazy Loading
Load page-specific styles on demand:
```javascript
// For non-critical pages
if (route === '/library') {
  import('./styles/pages/library.css')
}
```

### 12. Migration Checklist
- [ ] Create directory structure
- [ ] Set up index.css with imports
- [ ] Extract animations
- [ ] Extract button styles
- [ ] Extract card styles
- [ ] Extract badge styles
- [ ] Extract modal styles
- [ ] Extract form styles
- [ ] Extract toggle styles
- [ ] Extract content-inbox styles
- [ ] Extract queue-manager styles
- [ ] Extract mobile-menu styles
- [ ] Extract theme-toggle styles
- [ ] Extract home page styles
- [ ] Extract inbox page styles
- [ ] Remove old components.css
- [ ] Update component imports
- [ ] Test all pages
- [ ] Update documentation

### 13. Benefits Summary
1. **Maintainability**: Easier to find and update styles
2. **Scalability**: Can grow without becoming unwieldy
3. **Performance**: Potential for code splitting
4. **Developer Experience**: Clearer mental model
5. **Collaboration**: Less merge conflicts
6. **Reusability**: Easier to share components

### 14. Alternative Approaches

#### Approach A: Tailwind CSS
Replace custom CSS with utility classes
**Pros**: No custom CSS to maintain
**Cons**: Learning curve, different philosophy

#### Approach B: CSS-in-JS
Use styled-components or emotion
**Pros**: Component-scoped styles
**Cons**: Runtime overhead, different paradigm

#### Approach C: Sass/SCSS
Use preprocessor for organization
**Pros**: Variables, mixins, nesting
**Cons**: Build step required

### 15. Recommended Next Steps
1. **Immediate**: Start with Phase 1 setup
2. **This Week**: Complete base component extraction
3. **Next Sprint**: Complete full migration
4. **Future**: Consider CSS modules for new components

This architecture will scale well as the application grows and make the codebase more maintainable for the team.