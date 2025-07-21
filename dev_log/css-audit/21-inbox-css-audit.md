# CSS Audit: inbox.css

**File**: `/src/styles/pages/inbox.css`  
**Type**: Page  
**Status**: ⚠️ PARTIALLY COMPLIANT

## Current State Analysis

### ⚠️ Mixed Compliance
- Some classes use page prefix (`.inbox-page__`)
- Others use generic names (`.inbox-stats`, `.inbox-stat`)
- Inconsistent naming patterns throughout

### Class Inventory

#### Properly Prefixed Classes ✅
- `.inbox-page` - Base container ✅
- `.inbox-page__header` - Header section ✅
- `.inbox-page__title` - Page title ✅
- `.inbox-page__subtitle` - Page subtitle ✅
- `.inbox-page__section` - Section container ✅
- `.inbox-page__section-title` - Section title ✅

#### Inconsistent Naming (Missing page prefix)
- `.inbox-queue` ❌ → `.inbox__queue` or `.inbox-page__queue`
- `.inbox-stats` ❌ → `.inbox__stats`
- `.inbox-stat` ❌ → `.inbox__stat`
- `.inbox-stat__icon` ❌ → `.inbox__stat-icon`
- `.inbox-stat__value` ❌ → `.inbox__stat-value`
- `.inbox-stat__label` ❌ → `.inbox__stat-label`
- `.inbox-empty` ❌ → `.inbox__empty`
- `.inbox-empty__icon` ❌ → `.inbox__empty-icon`
- `.inbox-empty__title` ❌ → `.inbox__empty-title`
- `.inbox-empty__description` ❌ → `.inbox__empty-description`
- `.inbox-loading` ❌ → `.inbox__loading`
- `.inbox-loading__spinner` ❌ → `.inbox__loading-spinner`
- `.inbox-loading__text` ❌ → `.inbox__loading-text`

#### Generic/Unclear Classes
- `.content-inbox-info` ❌ → `.inbox__info`
- `.content-inbox-info-item` ❌ → `.inbox__info-item`

#### Element Selectors
- `.inbox-page__section-title i` ❌ (element selector)
- `.content-inbox-info-item i` ❌ (element selector)

#### Local Animation
- References `fadeIn` animation ❌ (should be from animations.css)
- References `spin` animation ❌ (should be from animations.css)

## Issues Found

### 🔴 Major Issues
1. **Inconsistent prefix usage** - Some use `.inbox-page__`, others just `.inbox-`
2. **Wrong BEM pattern** - Using `__` within already namespaced classes
3. **Generic class names** - `.content-inbox-info` is confusing

### 🟡 Medium Issues
1. **Element selectors** - Using `i` selectors
2. **Animation dependencies** - Uses animations not defined locally

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Standardize prefix (choose `.inbox__` or `.inbox-page__`)
- [ ] Fix BEM patterns within namespace
- [ ] Replace element selectors
- [ ] Update Inbox page component
- [ ] Test functionality

## Refactoring Plan

### Option 1: Use `.inbox__` prefix (Recommended)
```css
/* Current → New */
.inbox-page → .inbox
.inbox-page__header → .inbox__header
.inbox-page__title → .inbox__title
.inbox-page__subtitle → .inbox__subtitle
.inbox-page__section → .inbox__section
.inbox-page__section-title → .inbox__section-title
.inbox-page__section-title i → .inbox__section-icon

.inbox-queue → .inbox__queue
.inbox-stats → .inbox__stats
.inbox-stat → .inbox__stat
.inbox-stat__icon → .inbox__stat-icon
.inbox-stat__value → .inbox__stat-value
.inbox-stat__label → .inbox__stat-label

.inbox-empty → .inbox__empty
.inbox-empty__icon → .inbox__empty-icon
.inbox-empty__title → .inbox__empty-title
.inbox-empty__description → .inbox__empty-description

.inbox-loading → .inbox__loading
.inbox-loading__spinner → .inbox__loading-spinner
.inbox-loading__text → .inbox__loading-text

.content-inbox-info → .inbox__info
.content-inbox-info-item → .inbox__info-item
.content-inbox-info-item i → .inbox__info-icon
```

## Recommendation

This file is **60% compliant**. While it attempts to use page prefixes, the execution is inconsistent with mixed patterns. The main issues are:

1. Two different prefix patterns (`.inbox-page__` vs `.inbox-`)
2. Incorrect use of BEM double underscores within namespace
3. Some confusing class names

## Best Practices for Page CSS

Within a page namespace, use single dash for elements:
```css
/* Good */
.inbox__stat { }
.inbox__stat-icon { }
.inbox__stat-value { }

/* Bad */
.inbox-stat { }
.inbox-stat__icon { }
```

## Next Steps

1. Choose consistent prefix (recommend `.inbox__`)
2. Fix all BEM patterns
3. Add classes for icon elements
4. Update React component
5. Verify animations exist in animations.css