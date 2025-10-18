# CSS Audit: home.css

**File**: `/src/styles/pages/home.css`  
**Type**: Page  
**Status**: ❌ NOT COMPLIANT

## Current State Analysis

### ❌ Missing Page Prefix
- Uses generic names like `.app`, `.hero`, `.features`
- Should use `.home__` prefix for all classes
- Many generic class names that will conflict

### Class Inventory

#### Generic App/Page Classes (Should be home-prefixed)
- `.app` ❌ → `.home__container`
- `.hero` ❌ → `.home__hero`
- `.features` ❌ → `.home__features`
- `.quick-links` ❌ → `.home__quick-links`
- `.stats` ❌ → `.home__stats`
- `.cta` ❌ → `.home__cta`

#### Mixed Naming (Both BEM and Hyphenated)
- `.hero__subtitle` / `.hero-subtitle` ❌ (duplicate pattern)
- `.hero__actions` / `.hero-actions` ❌ (duplicate pattern)

#### Generic Component Classes (Wrong Pattern)
- `.features-grid` ❌ → `.home__features-grid`
- `.feature-card` ❌ → `.home__feature-card`
- `.feature-card__icon` / `.feature-icon` ❌ (duplicate pattern)
- `.feature-card__title` ⚠️ (should be `.home__feature-title`)
- `.feature-card__description` ⚠️ (should be `.home__feature-description`)

#### Quick Links (Wrong Pattern)
- `.quick-links-grid` ❌ → `.home__quick-links-grid`
- `.quick-link` ❌ → `.home__quick-link`
- `.quick-link__icon` ⚠️ (should be `.home__quick-link-icon`)
- `.quick-link__label` ⚠️ (should be `.home__quick-link-label`)

#### Stats Section (Generic Names)
- `.stat` ❌ → `.home__stat`
- `.stat__value` ⚠️ (should be `.home__stat-value`)
- `.stat__label` ⚠️ (should be `.home__stat-label`)

#### CTA Section (Generic Names)
- `.cta__title` ⚠️ (should be `.home__cta-title`)
- `.cta__description` ⚠️ (should be `.home__cta-description`)

#### Element Selectors
- `.hero h1` ❌ (element selector)
- `.features h2` ❌ (element selector)
- `.quick-links h2` ❌ (element selector)
- `.quick-link i` ❌ (element selector)

#### Cross-Component References
- `.feature-card:hover .feature-card__icon` ❌
- `.feature-card:hover .feature-icon` ❌
- `.quick-link:hover .quick-link__icon` ❌
- `.quick-link:hover i` ❌

#### Local Animation
- References `fadeIn` animation ❌ (should be from animations.css)

## Issues Found

### 🔴 Major Issues
1. **No page prefix** - All classes should start with `.home__`
2. **Generic top-level names** - `.app`, `.hero`, `.features` will conflict
3. **Duplicate naming patterns** - Both BEM and hyphenated versions
4. **Element selectors** - Multiple h1, h2, i selectors
5. **Wrong BEM structure** - Using `__` where `-` should be used within page namespace

### 🟡 Medium Issues
1. **Animation dependency** - Uses `fadeIn` not defined locally
2. **Cross-selector references** - Complex hover selectors

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Add `.home__` prefix to all classes
- [ ] Remove duplicate naming patterns
- [ ] Fix BEM structure within page namespace
- [ ] Replace element selectors
- [ ] Update Home page component
- [ ] Test functionality

## Refactoring Plan

### Complete Restructure
```css
/* Current → New */
.app → .home__container
.hero → .home__hero
.hero h1 → .home__hero-title
.hero__subtitle, .hero-subtitle → .home__hero-subtitle
.hero__actions, .hero-actions → .home__hero-actions

.features → .home__features
.features h2 → .home__features-title
.features-grid → .home__features-grid
.feature-card → .home__feature-card
.feature-card__icon, .feature-icon → .home__feature-icon
.feature-card__title → .home__feature-title
.feature-card__description → .home__feature-description

.quick-links → .home__quick-links
.quick-links h2 → .home__quick-links-title
.quick-links-grid → .home__quick-links-grid
.quick-link → .home__quick-link
.quick-link__icon → .home__quick-link-icon
.quick-link i → .home__quick-link-icon
.quick-link__label → .home__quick-link-label

.stats → .home__stats
.stat → .home__stat
.stat__value → .home__stat-value
.stat__label → .home__stat-label

.cta → .home__cta
.cta__title → .home__cta-title
.cta__description → .home__cta-description
```

## Recommendation

This file needs **complete refactoring**. The lack of page prefix and use of generic names creates high risk of style conflicts. The duplicate naming patterns suggest incomplete migration.

## Page CSS Standards Reminder

For page CSS files:
1. **Always use page prefix** (`.home__`)
2. **Within page namespace**, use single dash for elements
3. **Never use generic top-level classes**
4. **Avoid element selectors**

Example structure:
```css
.home__hero { }
.home__hero-title { }  /* NOT .home__hero__title */
.home__hero-subtitle { }
```

## Next Steps

1. Complete refactoring with `.home__` prefix
2. Remove all duplicate patterns
3. Add classes for all element selectors
4. Update React component
5. Test all sections and animations