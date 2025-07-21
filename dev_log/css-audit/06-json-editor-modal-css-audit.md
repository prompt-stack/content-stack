# CSS Audit: json-editor-modal.css

**File**: `/src/styles/components/json-editor-modal.css`  
**Type**: Component  
**Status**: ❌ NEEDS REFACTORING

## Current State Analysis

### ❌ Does NOT Follow BEM Convention
- Base class: `.json-editor-modal` ✅ (correct)
- Child elements: Using flat naming instead of BEM ❌
- Generic class names that could conflict ❌

### Class Inventory

#### Base
- `.json-editor-modal` - Base modal class

#### Current Classes (Non-BEM)
- `.json-editor-header` ❌ Should be `.json-editor-modal__header`
- `.json-editor-toolbar` ❌ Should be `.json-editor-modal__toolbar`
- `.json-editor-body` ❌ Should be `.json-editor-modal__body`
- `.json-editor-wrapper` ❌ Should be `.json-editor-modal__wrapper`
- `.json-editor-line-numbers` ❌ Should be `.json-editor-modal__line-numbers`
- `.line-number` ❌ Too generic! Should be `.json-editor-modal__line-number`
- `.json-editor-textarea` ❌ Should be `.json-editor-modal__textarea`
- `.json-editor-error` ❌ Should be `.json-editor-modal__error`
- `.json-editor-info` ❌ Should be `.json-editor-modal__info`
- `.json-editor-footer` ❌ Should be `.json-editor-modal__footer`

#### Other Issues
- **CSS Variables in component file** (lines 114-118) - Should be in globals.css

## Issues Found

### 🔴 Major Issues
1. **No BEM structure**: All classes use flat naming
2. **Very generic class**: `.line-number` could easily conflict
3. **CSS variables defined locally**: Should be in global variables file
4. **Risk of conflicts**: Generic names without proper namespacing

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Refactor all classes to use BEM structure
- [ ] Move CSS variables to globals.css
- [ ] Update JsonEditorModal.tsx component
- [ ] Test JSON editor functionality after refactoring

## Refactoring Plan

```css
/* Old → New */
.json-editor-header → .json-editor-modal__header
.json-editor-toolbar → .json-editor-modal__toolbar
.json-editor-body → .json-editor-modal__body
.json-editor-wrapper → .json-editor-modal__wrapper
.json-editor-line-numbers → .json-editor-modal__line-numbers
.line-number → .json-editor-modal__line-number
.json-editor-textarea → .json-editor-modal__textarea
.json-editor-error → .json-editor-modal__error
.json-editor-info → .json-editor-modal__info
.json-editor-footer → .json-editor-modal__footer
```

## CSS Variables to Move

```css
/* Move to globals.css */
--color-info: #0ea5e9;
--color-info-alpha: rgba(14, 165, 233, 0.1);
--color-surface-tertiary: #f1f5f9;
```

## Recommendation

This file requires **complete refactoring** to follow BEM conventions. The current naming is inconsistent with the rest of the codebase and uses generic names that could cause conflicts.

## Next Steps

1. Refactor CSS to use BEM naming
2. Move CSS variables to appropriate global file
3. Update JsonEditorModal.tsx component
4. Test functionality
5. Document changes