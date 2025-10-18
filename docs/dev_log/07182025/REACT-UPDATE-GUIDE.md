# React Component Update Guide

> 🔄 **Purpose**: Guide for updating React components after CSS refactor

## Required Changes

### 1. Button Components 🔴 HIGH PRIORITY

All button classes need to be updated:

```jsx
// OLD
<button className="button button--primary button--large">
  Submit
</button>

// NEW
<button className="btn btn--primary btn--large">
  Submit
</button>
```

**Find & Replace:**
- `className="button"` → `className="btn"`
- `className="button ` → `className="btn `
- `"button--` → `"btn--`
- `button--loading` → `btn is-loading`

### 2. Import Updates 🟡 MEDIUM PRIORITY

The main CSS import in `index.css` now includes all modular files. No changes needed to React imports.

### 3. No Changes Required 🟢 SAFE

All these components work as-is:
- ✅ Cards (`.card`, `.card--elevated`, etc.)
- ✅ Badges (`.badge`, `.badge--blue`, etc.)
- ✅ Modals (`.modal`, `.modal-overlay`, etc.)
- ✅ Content Inbox (`.cosmic-header`, `.unified-input`, etc.)
- ✅ Queue Manager (`.queue-manager`, `.queue-stats`, etc.)
- ✅ Mobile Menu (`.mobile-menu`, `.mobile-menu-brand`, etc.)
- ✅ Theme Toggle (`.theme-toggle`, `.theme-option`, etc.)
- ✅ Forms (`.url-input-wrapper`, etc.)
- ✅ Homepage (`.hero`, `.feature-card`, etc.)

## Quick Search Commands

### Find all button references:
```bash
# In your React components folder
grep -r "className.*button" src/components/
grep -r 'className.*button' src/components/
```

### VSCode Search & Replace:
1. Open Search: `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows)
2. Enable regex mode
3. Search: `className=(["'])([^"']*\b)button(\b[^"']*)`
4. Replace: `className=$1$2btn$3`

## Testing Checklist

- [ ] Update all button components
- [ ] Test primary buttons
- [ ] Test secondary buttons
- [ ] Test button sizes (small, large)
- [ ] Test loading states
- [ ] Verify all other components render correctly
- [ ] Check responsive behavior
- [ ] Test theme switching

## Benefits After Update

1. **Faster Development**: Easy to find component styles
2. **Better Performance**: Potential for code splitting
3. **Maintainability**: Clear file organization
4. **Scalability**: Simple to add new components
5. **Type Safety**: Ready for CSS Modules if needed

---

**Note**: Only button classes need updating. Everything else works without changes!