# CSS Audit: theme-toggle.css

**File**: `/src/styles/features/theme-toggle.css`  
**Type**: Feature  
**Status**: ❌ NOT COMPLIANT

## Current State Analysis

### ❌ Hyphenated Naming Convention
- Uses `theme-toggle` and `theme-option` pattern
- Should use BEM: `theme-toggle__option`
- Has modifier patterns but wrong syntax

### Class Inventory

#### Base
- `.theme-toggle` - Base container ✅

#### Elements (All Hyphenated - Should be BEM)
- `.theme-option` ❌ → Should be `.theme-toggle__option`
- `.header-theme-toggle` ❌ → Should be `.theme-toggle--header` or in header.css

#### State Classes (Mixed)
- `.is-active` ✅ (proper state class)
- `.theme-option--active` ❌ (duplicate state pattern)
- `.is-transitioning` ✅ (proper state class)

#### Modifiers (Correct Pattern, Wrong Base)
- `.theme-toggle--compact` ✅ (correct modifier pattern)
- `.theme-toggle--pills` ✅ (correct modifier pattern)

#### CSS Selectors
- `.theme-option span` ❌ (element selector)
- `.theme-option i` ❌ (element selector)
- `.theme-option[data-tooltip]` ⚠️ (attribute selector)

#### Local Animation
- `@keyframes themeSwitch` ❌ Should be in animations.css

## Issues Found

### 🔴 Major Issues
1. **Wrong element naming** - `.theme-option` should be `.theme-toggle__option`
2. **Duplicate state patterns** - Both `.is-active` and `.theme-option--active`
3. **Local animation** - `themeSwitch` should be global
4. **Element selectors** - Using `span` and `i` selectors

### 🟡 Medium Issues
1. **Header integration class** - `.header-theme-toggle` doesn't follow pattern
2. **Complex selectors** - Many descendant selectors that could be simplified

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Refactor `.theme-option` to `.theme-toggle__option`
- [ ] Remove duplicate state class
- [ ] Move animation to animations.css
- [ ] Replace element selectors with proper classes
- [ ] Fix header integration naming
- [ ] Update ThemeToggle component
- [ ] Test functionality

## Refactoring Plan

### Primary Refactoring
```css
/* Current → New */
.theme-option → .theme-toggle__option
.theme-option--active → Remove (use .is-active)
.header-theme-toggle → .theme-toggle--header (or move to header.css)

/* Element selectors to fix */
.theme-option span → .theme-toggle__label
.theme-option i → .theme-toggle__icon
```

### Animation to Move
```css
/* Move to animations.css */
@keyframes themeSwitch {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```

### Update Modifier References
```css
/* These need updating after base class change */
.theme-toggle--compact .theme-option → .theme-toggle--compact .theme-toggle__option
.theme-toggle--pills .theme-option → .theme-toggle--pills .theme-toggle__option
```

## Recommendation

This file needs **significant refactoring** to follow BEM. While it has good features (variants, tooltips, animations), the naming convention is completely wrong.

## Good Practices Found

1. **Multiple variants** (compact, pills)
2. **Tooltip support** with data attributes
3. **Smooth transitions and animations**
4. **Dark mode considerations**
5. **Responsive design** with mobile optimizations

## Next Steps

1. Refactor all classes to BEM
2. Add specific classes for icons and labels
3. Move animation to global file
4. Update React component with new classes
5. Test all variants and states
6. Verify tooltip functionality
7. Test theme switching animation