# CSS Audit: input-fixes.css

**File**: `/src/styles/utils/input-fixes.css`  
**Type**: Utility (Specific Fixes)  
**Status**: ⚠️ MIXED COMPLIANCE

## Current State Analysis

### ⚠️ Mixed Approach
- Wrapped in `@layer utilities` ✅
- Contains both fixes (good) and component definitions (questionable)
- Heavy use of `!important` (necessary for fixes)
- Some classes belong in component CSS files

### Class Inventory

#### Input Group Classes (Should be in forms.css)
- `.input-group__wrapper` ⚠️ Component class
- `.input-group__icon` ⚠️ Component class
- `.input-group__wrapper .input` ⚠️ Component styling

#### Form Classes (Should be in forms.css)
- `.form-group` ⚠️ Component class
- `.form-group label` ⚠️ Component styling

#### Legitimate Fix Classes ✅
- Textarea performance fixes
- Icon alignment fixes
- Select dropdown appearance fixes
- Checkbox/radio alignment fixes

#### Component Classes (Don't belong here)
- `.checkbox-label` ❌ Should be in forms.css
- `.radio-label` ❌ Should be in forms.css
- `.url-input-wrapper` ❌ Should be in forms.css
- `.url-input-field` ❌ Should be in forms.css
- `.dropzone` ❌ Should be in dropzone.css
- `.dropzone-content` ❌ Should be in dropzone.css
- `.dropzone-icon` ❌ Should be in dropzone.css
- `.dropzone-text` ❌ Should be in dropzone.css
- `.dropzone-hint` ❌ Should be in dropzone.css
- `.full-screen-drop-overlay` ❌ Should be in dropzone.css
- `.full-screen-drop-content` ❌ Should be in dropzone.css
- `.full-screen-drop-icon` ❌ Should be in dropzone.css

#### Local Animation
- `@keyframes pulse` ❌ Should be in animations.css

#### Advanced Selectors
- `div:has(> .input):has(> .btn)` ⚠️ Complex selector
- Various attribute selectors for input types ✅ (appropriate for fixes)

## Issues Found

### 🔴 Major Issues
1. **Component definitions** - Contains full component implementations
2. **Wrong file purpose** - This should be fixes only, not components
3. **Dropzone components** - Entire dropzone implementation here
4. **Local animation** - `pulse` animation defined locally

### 🟡 Medium Issues
1. **Scope creep** - File has grown beyond "input fixes"
2. **Duplication risk** - Some classes might already exist in component files

### 🟢 What's Working Well
- Legitimate fixes for input icon alignment
- Textarea performance optimizations
- Select dropdown custom styling
- Proper use of `!important` for override fixes

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Move component classes to appropriate files
- [ ] Keep only legitimate fixes
- [ ] Move animation to animations.css
- [ ] Document what constitutes a "fix" vs component

## Refactoring Plan

### Classes to Move
```css
/* Move to forms.css */
.form-group
.checkbox-label
.radio-label  
.url-input-wrapper
.url-input-field

/* Move to dropzone.css */
.dropzone
.dropzone-content
.dropzone-icon
.dropzone-text
.dropzone-hint
.full-screen-drop-overlay
.full-screen-drop-content
.full-screen-drop-icon

/* Move to animations.css */
@keyframes pulse
```

### Classes to Keep (True Fixes)
- Input icon positioning fixes
- Textarea performance fixes
- Select dropdown arrow fixes
- Checkbox/radio alignment fixes
- Specific icon size adjustments

## Recommendation

This file is **40% compliant** with its intended purpose. It contains valuable fixes but has become a dumping ground for component implementations. The file needs to be split:

1. **input-fixes.css** - Keep only true fixes and overrides
2. Move component definitions to their respective files
3. Document clear guidelines for what belongs in "fixes" files

## Guidelines for Fix Files

Fix files should contain:
- Override styles to fix specific issues
- Performance optimizations
- Browser compatibility fixes
- Alignment corrections
- NOT full component implementations

## Next Steps

1. Extract component classes to proper files
2. Keep only legitimate fixes
3. Add comments explaining what each fix addresses
4. Move pulse animation to animations.css
5. Create clear documentation for fix file purposes