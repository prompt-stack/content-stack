# CSS Audit: queue-manager.css

**File**: `/src/styles/features/queue-manager.css`  
**Type**: Feature  
**Status**: ⚠️ PARTIALLY COMPLIANT

## Current State Analysis

### ⚠️ Mixed Patterns Throughout
- Uses both BEM (`.queue-manager__[element]`) and hyphenated (`.queue-[element]`)
- Also has `.queue-item` which could be its own block or part of queue-manager
- Some legacy class names from `.inbox-item-list`

### Class Inventory

#### Base
- `.queue-manager` - Base container ✅

#### Header Section (Mixed)
- `.queue-manager__header` ✅ BEM version
- `.queue-header` ❌ Non-BEM duplicate

#### Stats Section (Mixed)
- `.queue-manager__stats` ✅ BEM version
- `.queue-stats` ❌ Non-BEM duplicate
- `.queue-manager__title` ✅
- `.queue-stats h3` ❌ Element selector
- `.queue-manager__subtitle` ✅
- `.queue-manager__badges` ✅ BEM version
- `.queue-stats-badges` ❌ Hyphenated duplicate

#### Controls (Mixed)
- `.queue-manager__controls` ✅
- `.queue-manager__search` ✅ BEM version
- `.queue-search` ❌ Non-BEM duplicate
- `.queue-manager__filter` ✅
- `.queue-manager__sort` ✅
- `.queue-filter` ❌ Non-BEM duplicate
- `.queue-sort` ❌ Non-BEM duplicate

#### Actions & Views
- `.queue-manager__actions` ✅
- `.queue-manager__action` ✅
- `.queue-manager__view-toggle` ✅
- `.queue-manager__view-option` ✅
- `.queue-manager__view-option.is-active` ✅

#### Content Section
- `.queue-manager__content` ✅
- `.queue-manager__empty` ✅
- `.queue-manager__empty-icon` ✅
- `.queue-manager__empty-text` ✅
- `.queue-manager__empty-hint` ✅
- `.queue-manager__loading` ✅
- `.queue-manager__loading-spinner` ✅
- `.queue-manager__list` ✅
- `.queue-manager__grid` ✅

#### Queue Item (Separate Block?)
- `.queue-item` ⚠️ Should this be `.queue-manager__item`?
- `.inbox-item-list` ❌ Legacy class
- `.queue-item__checkbox` ✅
- `.queue-item__icon` ✅
- `.queue-item__content` ✅
- `.queue-item__title` ✅
- `.queue-item__meta` ✅
- `.queue-item__meta-item` ✅
- `.queue-item__status` ✅
- `.queue-item__actions` ✅
- `.queue-item__action` ✅
- `.queue-item__progress` ✅
- `.queue-item__progress-bar` ✅
- `.queue-item--grid` ✅ Modifier

#### Status Classes (Generic)
- `.status-raw` ❌ Too generic
- `.status-blue` ❌ Too generic
- `.status-processing` ❌ Too generic
- `.status-yellow` ❌ Too generic
- `.status-processed` ❌ Too generic
- `.status-green` ❌ Too generic
- `.status-error` ❌ Too generic
- `.status-red` ❌ Too generic

#### Batch Actions
- `.queue-manager__batch-bar` ✅
- `.queue-manager__batch-count` ✅
- `.queue-manager__batch-actions` ✅

#### Local Animations
- References `fadeIn` ❌ Should be from animations.css
- References `spin` ❌ Should be from animations.css
- References `slideUp` ❌ Should be from animations.css

## Issues Found

### 🔴 Major Issues
1. **Dual naming system** - Many elements have both BEM and non-BEM versions
2. **Generic status classes** - Could conflict with other features
3. **Legacy inbox class** - `.inbox-item-list` shouldn't be here
4. **Animation dependencies** - Uses animations not defined locally

### 🟡 Medium Issues
1. **Queue item ambiguity** - Could be `.queue-manager__item` for clarity
2. **Element selectors** - `.queue-stats h3` breaks convention

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Remove all non-BEM duplicate classes
- [ ] Decide on queue-item structure
- [ ] Namespace status classes
- [ ] Remove legacy inbox class
- [ ] Verify animations exist globally
- [ ] Update QueueManager component
- [ ] Test functionality

## Refactoring Plan

### Remove Duplicates
```css
/* Remove these */
.queue-header
.queue-stats
.queue-stats h3
.queue-stats-badges
.queue-search
.queue-filter
.queue-sort
.inbox-item-list

/* Keep BEM versions */
.queue-manager__header
.queue-manager__stats
.queue-manager__title
.queue-manager__badges
.queue-manager__search
.queue-manager__filter
.queue-manager__sort
```

### Namespace Status Classes
```css
/* Current → New */
.status-raw → .queue-manager__status--raw
.status-blue → .queue-manager__status--blue
.status-processing → .queue-manager__status--processing
.status-yellow → .queue-manager__status--yellow
.status-processed → .queue-manager__status--processed
.status-green → .queue-manager__status--green
.status-error → .queue-manager__status--error
.status-red → .queue-manager__status--red
```

### Queue Item Decision
Either:
1. Keep as separate block (`.queue-item`) if reused elsewhere
2. Change to `.queue-manager__item` if only used here

## Recommendation

This file is **60% compliant**. The BEM structure exists but is undermined by duplicate non-BEM classes. The generic status classes need namespacing to prevent conflicts.

## Good Practices Found

1. **Comprehensive feature set** - search, filter, sort, views, batch actions
2. **Grid and list views** with proper modifiers
3. **Loading and empty states**
4. **Responsive design**
5. **Progress indicators**

## Next Steps

1. Remove all duplicate non-BEM classes
2. Namespace status classes
3. Decide on queue-item structure
4. Remove legacy inbox reference
5. Verify animation dependencies
6. Update React component
7. Test all functionality