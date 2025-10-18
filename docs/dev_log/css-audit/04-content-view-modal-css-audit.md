# CSS Audit: content-view-modal.css

**File**: `/src/styles/components/content-view-modal.css`  
**Type**: Component  
**Status**: ❌ NEEDS REFACTORING

## Current State Analysis

### ❌ Does NOT Follow BEM Convention
- Base class: `.content-view-modal` ✅ (correct)
- Child elements: Using flat naming instead of BEM ❌
- Missing proper parent-child relationship in naming

### Class Inventory

#### Base
- `.content-view-modal` - Base modal class

#### Current Classes (Non-BEM)
- `.content-view-header` ❌ Should be `.content-view-modal__header`
- `.content-view-meta` ❌ Should be `.content-view-modal__meta`
- `.content-view-body` ❌ Should be `.content-view-modal__body`
- `.content-view-footer` ❌ Should be `.content-view-modal__footer`
- `.content-view-actions` ❌ Should be `.content-view-modal__actions`

#### Generic Classes (Should be namespaced)
- `.content-section` ❌ Should be `.content-view-modal__section`
- `.content-text` ❌ Should be `.content-view-modal__text`
- `.metadata-grid` ❌ Should be `.content-view-modal__metadata-grid`
- `.metadata-item` ❌ Should be `.content-view-modal__metadata-item`
- `.metadata-item--full` ✅ Modifier pattern is correct
- `.metadata-label` ❌ Should be `.content-view-modal__metadata-label`
- `.metadata-value` ❌ Should be `.content-view-modal__metadata-value`
- `.metadata-link` ❌ Should be `.content-view-modal__metadata-link`
- `.enrichment-content` ❌ Should be `.content-view-modal__enrichment`
- `.enrichment-item` ❌ Should be `.content-view-modal__enrichment-item`
- `.topic-tags` ❌ Should be `.content-view-modal__topic-tags`

#### Utility Class (Should not be here)
- `.font-mono` ❌ This is a utility class, should be in utilities.css

## Issues Found

### 🔴 Major Issues
1. **No BEM structure**: Almost all classes use flat naming
2. **Generic class names**: Classes like `.content-section`, `.metadata-grid` are too generic
3. **Utility class**: `.font-mono` should be in utilities.css
4. **Risk of conflicts**: Generic names can clash with other components

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Refactor all classes to use BEM structure
- [ ] Move `.font-mono` to utilities.css
- [ ] Update ContentViewModal.tsx component
- [ ] Test modal functionality after refactoring

## Refactoring Plan

```css
/* Old → New */
.content-view-header → .content-view-modal__header
.content-view-meta → .content-view-modal__meta
.content-view-body → .content-view-modal__body
.content-section → .content-view-modal__section
.content-text → .content-view-modal__text
.metadata-grid → .content-view-modal__metadata-grid
.metadata-item → .content-view-modal__metadata-item
.metadata-label → .content-view-modal__metadata-label
.metadata-value → .content-view-modal__metadata-value
.metadata-link → .content-view-modal__metadata-link
.enrichment-content → .content-view-modal__enrichment
.enrichment-item → .content-view-modal__enrichment-item
.topic-tags → .content-view-modal__topic-tags
.content-view-footer → .content-view-modal__footer
.content-view-actions → .content-view-modal__actions
```

## Recommendation

This file requires **complete refactoring** to follow BEM conventions. The current naming is too generic and risks conflicts with other components. All classes should be prefixed with the component name.

## Next Steps

1. Refactor CSS to use BEM naming
2. Update ContentViewModal.tsx to use new class names
3. Remove utility class
4. Test modal functionality
5. Document changes