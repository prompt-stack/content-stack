# CSS Audit: health.css

**File**: `/src/styles/pages/health.css`  
**Type**: Page  
**Status**: ❌ NOT COMPLIANT

## Current State Analysis

### ❌ Missing Page Prefix
- Uses generic names like `.page-container`, `.page-header`
- Should use `.health__` prefix for all classes
- Multiple generic class names that could conflict

### Class Inventory

#### Generic Page Classes (Should be health-prefixed)
- `.page-container` ❌ → `.health__container`
- `.page-header` ❌ → `.health__header`
- `.page-title` ❌ → `.health__title`
- `.page-subtitle` ❌ → `.health__subtitle`

#### Health-Specific Classes (Wrong Pattern)
- `.health-grid` ❌ → `.health__grid`
- `.health-card` ❌ → `.health__card`
- `.health-card-header` ❌ → `.health__card-header`
- `.health-metrics` ❌ → `.health__metrics`

#### Generic Component Classes (Too Generic)
- `.status-indicator` ❌ → `.health__status-indicator`
- `.status-indicator--success` ❌ → `.health__status-indicator--success`
- `.status-indicator--error` ❌ → `.health__status-indicator--error`
- `.status-indicator--warning` ❌ → `.health__status-indicator--warning`

#### Other Generic Classes
- `.metric` ❌ → `.health__metric`
- `.metric-label` ❌ → `.health__metric-label`
- `.metric-value` ❌ → `.health__metric-value`
- `.endpoint-list` ❌ → `.health__endpoint-list`
- `.endpoint` ❌ → `.health__endpoint`
- `.endpoint-status` ❌ → `.health__endpoint-status`
- `.endpoint-status--success` ❌ → `.health__endpoint-status--success`
- `.endpoint-status--error` ❌ → `.health__endpoint-status--error`
- `.error-banner` ❌ → `.health__error-banner`
- `.loading-spinner` ❌ → `.health__loading-spinner`

#### Element Selectors
- `.health-card-header h3` ❌ (element selector)
- `.health-card-header i` ❌ (element selector)
- `.endpoint code` ❌ (element selector)
- `.error-banner i` ❌ (element selector)
- `.error-banner span` ❌ (element selector)
- `.error-banner .btn` ❌ (cross-component reference)

#### Local Animation
- References `spin` animation ❌ (should be from animations.css)

## Issues Found

### 🔴 Major Issues
1. **No page prefix** - All classes should start with `.health__`
2. **Generic class names** - High risk of conflicts
3. **Wrong naming patterns** - Using hyphens instead of BEM
4. **Element selectors** - Multiple instances of element selectors
5. **Cross-component references** - `.error-banner .btn`

### 🟡 Medium Issues
1. **Animation dependency** - Uses `spin` animation not defined locally

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Add `.health__` prefix to all classes
- [ ] Convert hyphenated names to BEM
- [ ] Replace element selectors with proper classes
- [ ] Update Health page component
- [ ] Test functionality

## Refactoring Plan

### Complete BEM Conversion
```css
/* Current → New */
.page-container → .health__container
.page-header → .health__header
.page-title → .health__title
.page-subtitle → .health__subtitle
.health-grid → .health__grid
.health-card → .health__card
.health-card-header → .health__card-header
.health-metrics → .health__metrics
.status-indicator → .health__status-indicator
.status-indicator--success → .health__status-indicator--success
.metric → .health__metric
.metric-label → .health__metric-label
.metric-value → .health__metric-value
.endpoint-list → .health__endpoint-list
.endpoint → .health__endpoint
.endpoint-status → .health__endpoint-status
.error-banner → .health__error-banner
.loading-spinner → .health__loading-spinner
```

### Element Selectors to Fix
```css
.health-card-header h3 → .health__card-title
.health-card-header i → .health__card-icon
.endpoint code → .health__endpoint-code
.error-banner i → .health__error-icon
.error-banner span → .health__error-text
.error-banner .btn → .health__error-action
```

## Recommendation

This file needs **complete refactoring** to follow page CSS standards. Every class must be prefixed with `.health__` to avoid conflicts with other pages and components.

## Page CSS Standards Reminder

All page CSS files must:
1. Use page prefix for ALL classes (e.g., `.health__`)
2. Follow BEM naming within the page namespace
3. Never use generic class names
4. Avoid cross-component references

## Next Steps

1. Refactor all classes to use `.health__` prefix
2. Convert to proper BEM naming
3. Add specific classes for elements
4. Update React component
5. Verify no style conflicts with other pages