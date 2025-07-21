# CSS Refactoring Implementation Tasks

## Overview
This document tracks the step-by-step implementation of the CSS architecture refactor, ensuring consistency with STYLE-GUIDE.md throughout the process.

## Pre-Implementation Checklist
- [ ] Review STYLE-GUIDE.md
- [ ] Review CSS-ARCHITECTURE-REFACTOR-PLAN.md
- [ ] Backup current CSS files
- [ ] Ensure all tests pass
- [ ] Document current import structure

## Phase 1: Setup Structure (Day 1)

### 1.1 Create Directory Structure
- [ ] Create `/src/styles/base/` directory
- [ ] Create `/src/styles/components/` directory
- [ ] Create `/src/styles/features/` directory
- [ ] Create `/src/styles/pages/` directory
- [ ] Create `/src/styles/layout/` directory
- [ ] Create `/src/styles/utils/` directory

### 1.2 Create Foundation Files
- [ ] Create `/src/styles/base/animations.css`
  - Extract all @keyframes from components.css
  - Extract all @keyframes from globals.css
- [ ] Create `/src/styles/base/reset.css` (if needed)
- [ ] Create `/src/styles/utils/utilities.css`
  - Move utility classes from globals.css

### 1.3 Update Index.css
- [ ] Add @layer definitions
- [ ] Set up import structure (commented out initially)
- [ ] Keep existing imports for backward compatibility

## Phase 2: Extract Base Components (Day 1-2)

### 2.1 Button Component
- [ ] Create `/src/styles/components/button.css`
- [ ] Extract lines 4-77 from components.css
- [ ] Rename classes according to STYLE-GUIDE.md:
  - `.button` → `.btn`
  - `.button--primary` → `.btn--primary`
  - `.button--secondary` → `.btn--secondary`
  - `.button--small` → `.btn--sm`
  - `.button--large` → `.btn--lg`
  - `.button--loading` → `.btn.is-loading`
- [ ] Add missing button variants from style guide
- [ ] Test Button component still works
- [ ] Update Button.tsx imports if needed

### 2.2 Card Component
- [ ] Create `/src/styles/components/card.css`
- [ ] Extract lines 79-106 from components.css
- [ ] Verify naming matches STYLE-GUIDE.md
- [ ] Add BEM elements:
  - `.card__header`
  - `.card__body`
  - `.card__footer`
- [ ] Test Card component functionality

### 2.3 Badge Component
- [ ] Create `/src/styles/components/badge.css`
- [ ] Extract lines 503-529 from components.css
- [ ] Ensure color variants match style guide
- [ ] Add size variants if missing
- [ ] Test badge displays correctly

### 2.4 Modal Component
- [ ] Create `/src/styles/components/modal.css`
- [ ] Extract lines 574-644 from components.css
- [ ] Add BEM structure:
  - `.modal__header`
  - `.modal__body`
  - `.modal__footer`
- [ ] Include paste modal styles (lines 626-644)
- [ ] Test modal functionality

### 2.5 Toggle Component
- [ ] Create `/src/styles/components/toggle.css`
- [ ] Extract lines 350-391 from components.css
- [ ] Ensure futuristic styling intact
- [ ] Test toggle functionality

### 2.6 Form Elements
- [ ] Create `/src/styles/components/forms.css`
- [ ] Extract URL input styles (lines 394-422)
- [ ] Extract other input styles
- [ ] Add consistent form patterns

## Phase 3: Extract Features (Day 2-3)

### 3.1 Content Inbox (Cosmic Station)
- [ ] Create `/src/styles/features/content-inbox.css`
- [ ] Extract lines 123-347 from components.css
- [ ] Rename classes per STYLE-GUIDE.md:
  - `.inbox-cosmic` → `.content-inbox`
  - `.cosmic-header` → `.content-inbox__header`
  - `.cosmic-title` → `.content-inbox__title`
- [ ] Preserve all animations and effects
- [ ] Test Cosmic Station functionality

### 3.2 Queue Manager
- [ ] Create `/src/styles/features/queue-manager.css`
- [ ] Extract lines 474-500, 553-571 from components.css
- [ ] Ensure all queue-related styles included
- [ ] Test queue displays correctly

### 3.3 Mobile Menu
- [ ] Create `/src/styles/features/mobile-menu.css`
- [ ] Extract lines 727-885 from components.css
- [ ] Include mobile menu theme section
- [ ] Test mobile menu animations

### 3.4 Theme Toggle
- [ ] Create `/src/styles/features/theme-toggle.css`
- [ ] Extract lines 921-983 from components.css
- [ ] Ensure dark mode media queries included
- [ ] Test theme switching

### 3.5 Dropzone Styles
- [ ] Create `/src/styles/features/dropzone.css`
- [ ] Extract lines 425-449 from components.css
- [ ] Maintain hover states and animations

## Phase 4: Extract Page Styles (Day 3)

### 4.1 Homepage/App Styles
- [ ] Create `/src/styles/pages/home.css`
- [ ] Extract hero section (lines 647-674)
- [ ] Extract feature cards (lines 677-697)
- [ ] Extract quick links (lines 699-725)
- [ ] Test homepage layout

### 4.2 Inbox Page
- [ ] Create `/src/styles/pages/inbox.css`
- [ ] Extract lines 109-120
- [ ] Add any inbox-specific layout styles
- [ ] Test inbox page

### 4.3 Create Placeholder Pages
- [ ] Create `/src/styles/pages/library.css` (empty template)
- [ ] Create `/src/styles/pages/search.css` (empty template)
- [ ] Create `/src/styles/pages/settings.css` (empty template)

## Phase 5: Layout & Responsive (Day 3-4)

### 5.1 Extract Layout Styles
- [ ] Create `/src/styles/layout/header.css`
- [ ] Move header styles from index.css
- [ ] Create `/src/styles/layout/navigation.css`
- [ ] Move nav styles from index.css

### 5.2 Responsive Styles
- [ ] Create `/src/styles/layout/responsive.css`
- [ ] Extract all @media queries
- [ ] Organize by breakpoint
- [ ] Test all responsive behaviors

## Phase 6: Integration & Cleanup (Day 4)

### 6.1 Update Imports
- [ ] Update `/src/index.css` with new imports
- [ ] Remove old components.css import
- [ ] Test full application

### 6.2 Component Updates
- [ ] Update Button.tsx to use new `.btn` classes
- [ ] Update any hardcoded class names
- [ ] Search and replace old class names

### 6.3 Cleanup
- [ ] Delete old components.css
- [ ] Remove duplicate styles
- [ ] Optimize import order
- [ ] Run build to check for errors

### 6.4 Documentation
- [ ] Update STYLE-GUIDE.md migration status
- [ ] Document any deviations
- [ ] Create migration notes
- [ ] Update component documentation

## Phase 7: Testing & Validation (Day 4-5)

### 7.1 Visual Testing
- [ ] Test all buttons (variants, sizes, states)
- [ ] Test all cards
- [ ] Test modals
- [ ] Test forms
- [ ] Test mobile menu
- [ ] Test theme switching
- [ ] Test content inbox
- [ ] Test queue manager

### 7.2 Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 7.3 Responsive Testing
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)

### 7.4 Performance Testing
- [ ] Check CSS file sizes
- [ ] Verify no duplicate styles
- [ ] Check load times

## Validation Checklist (Run after each component)
- [ ] Classes match STYLE-GUIDE.md naming
- [ ] No hardcoded colors (use tokens)
- [ ] File in correct directory
- [ ] Imports added to index.css
- [ ] Component still functions
- [ ] No console errors
- [ ] Responsive behavior intact

## Common Issues to Watch For
1. **Specificity conflicts** - New modular styles may have different specificity
2. **Missing animations** - Ensure @keyframes are imported
3. **Token references** - Verify all custom properties are available
4. **Import order** - CSS cascade matters
5. **State classes** - Ensure `.is-*` pattern is consistent

## Success Criteria
- [ ] All styles modularized
- [ ] No visual regressions
- [ ] File sizes reasonable (<300 lines per file)
- [ ] Consistent naming throughout
- [ ] All tests pass
- [ ] Documentation complete

## Rollback Plan
1. Keep backup of original CSS files
2. Git commit after each phase
3. Test thoroughly before deleting old files
4. Maintain old class names during transition if needed

---

## Notes
- Reference STYLE-GUIDE.md constantly
- Commit after each completed section
- Test incrementally, not all at once
- Ask for review if unsure about naming