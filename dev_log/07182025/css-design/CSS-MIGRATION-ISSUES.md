# CSS Migration Issues & Fixes

## 🔴 CRITICAL ISSUE FOUND

The homepage is broken because the Button component still uses old `.button` classes!

## Issues Identified

### 1. Button Component Uses Old Classes 🔴

**File**: `src/components/Button.tsx`

**Problem**: The component is using:
- `'button'` (should be `'btn'`)
- `'button--${variant}'` (should be `'btn--${variant}'`)
- `'button--${size}'` (should be `'btn--${size}'`)
- `'button--loading'` (should be `'btn is-loading'`)

**Impact**: All buttons on the homepage (and entire app) are unstyled!

### 2. Duplicate CSS Definitions 🟡

**Files**: `src/index.css` and `src/styles/pages/home.css`

Duplicate definitions for:
- `.app` (lines 319-323 & 364-368 in index.css)
- `.features` (lines 325-333 & 370-372 in index.css)
- `.features-grid` (lines 336-340 & 384-389 in index.css)
- `.quick-links` (lines 344-352 & 392-394 in index.css)
- `.quick-links-grid` (lines 355-361 & 403-409 in index.css)

### 3. Empty CSS Import 🟢

**File**: `src/App.tsx` line 4
- Imports `'./App.css'` which is likely empty or doesn't exist

## Required Fixes

### Fix 1: Update Button Component (URGENT)

```tsx
// src/components/Button.tsx
// CHANGE THIS:
className={clsx(
  'button',
  `button--${variant}`,
  `button--${size}`,
  loading && 'button--loading',
  className
)}

// TO THIS:
className={clsx(
  'btn',
  `btn--${variant}`,
  `btn--${size}`,
  loading && 'btn is-loading',
  className
)}
```

### Fix 2: Remove Duplicate CSS from index.css

Remove lines 314-456 from `src/index.css` (the duplicate app/homepage styles).

These are properly defined in `src/styles/pages/home.css`.

### Fix 3: Remove Empty Import

In `src/App.tsx`, remove line 4:
```tsx
import './App.css'  // DELETE THIS LINE
```

## Other Components to Check

### Card Component ✅
- Uses `.card` classes - these are correct and working
- No changes needed

### All Other Classes ✅
- `.hero`, `.hero-subtitle`, `.hero-actions` - Working
- `.features`, `.features-grid`, `.feature-card` - Working
- `.quick-links`, `.quick-links-grid`, `.quick-link` - Working

## Summary

**The main issue is the Button component still using old class names.** This is why the homepage buttons appear broken. Once the Button component is updated to use `.btn` instead of `.button`, the homepage should work perfectly.

All other CSS migrations were successful and classes are properly defined.