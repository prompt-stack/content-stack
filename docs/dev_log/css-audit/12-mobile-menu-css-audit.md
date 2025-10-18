# CSS Audit: mobile-menu.css

**File**: `/src/styles/features/mobile-menu.css`  
**Type**: Feature  
**Status**: ❌ NEEDS STANDARDIZATION

## Current State Analysis

### ❌ Dual Naming System Throughout
- Uses BOTH BEM (`.mobile-menu__element`) and hyphenated (`.mobile-menu-element`) styles
- Every single class has a duplicate with different naming
- Creates confusion and code bloat

### Class Inventory

#### Base
- `.mobile-menu` - Base container ✅

#### Backdrop (Duplicated)
- `.mobile-menu__backdrop` ✅ BEM version
- `.mobile-menu-backdrop` ❌ Hyphenated duplicate
- `.mobile-menu__backdrop.is-open` ✅ State class
- `.mobile-menu-backdrop--open` ❌ Different state pattern

#### Container States (Duplicated)
- `.mobile-menu.is-open` ✅ State class  
- `.mobile-menu--open` ❌ Modifier duplicate

#### Header Section (All Duplicated)
- `.mobile-menu__header` / `.mobile-menu-header`
- `.mobile-menu__brand` / `.mobile-menu-brand`
- `.mobile-menu__close` / `.mobile-menu-close`

#### User Section (All Duplicated)
- `.mobile-menu__user` / `.mobile-menu-user`
- `.mobile-menu__email` / `.mobile-menu-email`

#### Navigation (All Duplicated)
- `.mobile-menu__nav` / `.mobile-menu-nav`
- `.mobile-menu__link` / `.mobile-menu-link`
- `.mobile-menu__link.is-active` / `.mobile-menu-link--active`

#### Theme Section (All Duplicated)
- `.mobile-menu__theme` / `.mobile-menu-theme`
- `.mobile-menu__theme-label` / `.mobile-menu-theme-label`

#### Actions Section (All Duplicated)
- `.mobile-menu__actions` / `.mobile-menu-actions`

#### Other Elements
- `.mobile-menu__divider` ✅ (no duplicate)
- `.mobile-menu__badge` ✅ (no duplicate)

#### Local Animations
- `@keyframes slideInFromRight` ❌ Should be in animations.css
- `@keyframes fadeIn` ❌ Already exists in animations.css

## Issues Found

### 🔴 Major Issues
1. **Complete dual naming system** - Every class has two versions
2. **Inconsistent state patterns** - `.is-open` vs `--open`
3. **Duplicate animations** - fadeIn already exists globally
4. **Code bloat** - File is nearly twice as large as needed

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Choose ONE naming convention (BEM recommended)
- [ ] Remove all duplicate classes
- [ ] Standardize state classes to `.is-*`
- [ ] Remove duplicate animations
- [ ] Update MobileMenu component
- [ ] Test functionality

## Refactoring Plan

### Choose BEM, Remove Hyphenated
```css
/* Keep these (BEM) */
.mobile-menu
.mobile-menu__backdrop
.mobile-menu__header
.mobile-menu__brand
.mobile-menu__close
.mobile-menu__user
.mobile-menu__email
.mobile-menu__nav
.mobile-menu__link
.mobile-menu__theme
.mobile-menu__theme-label
.mobile-menu__actions
.mobile-menu__divider
.mobile-menu__badge

/* Remove these (hyphenated) */
.mobile-menu-backdrop
.mobile-menu-header
.mobile-menu-brand
.mobile-menu-close
.mobile-menu-user
.mobile-menu-email
.mobile-menu-nav
.mobile-menu-link
.mobile-menu-theme
.mobile-menu-theme-label
.mobile-menu-actions
```

### Standardize States
```css
/* Keep */
.is-open
.is-active

/* Remove */
.mobile-menu-backdrop--open
.mobile-menu--open
.mobile-menu-link--active
```

### Remove Duplicate Animations
- Remove local `fadeIn` (use from animations.css)
- Move `slideInFromRight` to animations.css or rename to `mobileMenuSlideIn`

## Recommendation

This file needs **complete standardization**. While it has good structure, the dual naming system makes it:
- Confusing for developers
- Harder to maintain
- Unnecessarily large
- Prone to inconsistency

## Migration Impact

This will require updating the MobileMenu React component to use only BEM classes. The component likely supports both for backwards compatibility, but this should be cleaned up.

## Next Steps

1. Decision: Confirm BEM as the standard
2. Update React component to use only BEM classes
3. Remove all hyphenated duplicate classes
4. Remove duplicate animations
5. Test mobile menu functionality
6. Update any other components that might use mobile menu classes