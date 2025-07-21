# CSS Audit: subscription.css

**File**: `/src/styles/pages/subscription.css`  
**Type**: Page  
**Status**: ❌ NOT COMPLIANT

## Current State Analysis

### ❌ Missing Page Prefix
- Uses generic names throughout
- No consistent `.subscription__` prefix
- High risk of style conflicts

### Class Inventory

#### Page Container (Has prefix but wrong pattern)
- `.subscription-page` ❌ → `.subscription`
- `.subscription-header` ❌ → `.subscription__header`
- `.subscription-header-content` ❌ → `.subscription__header-content`
- `.subscription-title` ❌ → `.subscription__title`
- `.subscription-subtitle` ❌ → `.subscription__subtitle`
- `.subscription-footer` ❌ → `.subscription__footer`

#### Generic Component Classes (No prefix)
- `.back-button` ❌ → `.subscription__back-button`
- `.billing-toggle` ❌ → `.subscription__billing-toggle`
- `.billing-option` ❌ → `.subscription__billing-option`
- `.billing-option--active` ❌ → `.subscription__billing-option--active`
- `.billing-badge` ❌ → `.subscription__billing-badge`

#### Pricing Section (Generic names)
- `.pricing-grid` ❌ → `.subscription__pricing-grid`
- `.pricing-card` ❌ → `.subscription__pricing-card`
- `.pricing-card--popular` ❌ → `.subscription__pricing-card--popular`
- `.pricing-card--current` ❌ → `.subscription__pricing-card--current`
- `.pricing-card-header` ❌ → `.subscription__card-header`
- `.pricing-card-features` ❌ → `.subscription__card-features`
- `.pricing-card-footer` ❌ → `.subscription__card-footer`
- `.pricing-cta` ❌ → `.subscription__cta`

#### Tier Elements (Generic names)
- `.popular-badge` ❌ → `.subscription__popular-badge`
- `.tier-name` ❌ → `.subscription__tier-name`
- `.tier-price` ❌ → `.subscription__tier-price`
- `.tier-description` ❌ → `.subscription__tier-description`
- `.price-amount` ❌ → `.subscription__price-amount`
- `.price-interval` ❌ → `.subscription__price-interval`

#### Features/Limitations (Generic names)
- `.features-list` ❌ → `.subscription__features-list`
- `.limitations-list` ❌ → `.subscription__limitations-list`
- `.feature-item` ❌ → `.subscription__feature-item`
- `.limitation-item` ❌ → `.subscription__limitation-item`
- `.feature-icon` ❌ → `.subscription__feature-icon`
- `.limitation-icon` ❌ → `.subscription__limitation-icon`

#### FAQ Section (Generic names)
- `.faq-section` ❌ → `.subscription__faq-section`
- `.faq-grid` ❌ → `.subscription__faq-grid`
- `.faq-item` ❌ → `.subscription__faq-item`

#### Guarantee Section (Generic names)
- `.money-back-guarantee` ❌ → `.subscription__guarantee`
- `.guarantee-icon` ❌ → `.subscription__guarantee-icon`
- `.guarantee-content` ❌ → `.subscription__guarantee-content`

#### Element Selectors
- `.faq-section h2` ❌ (element selector)
- `.faq-item h3` ❌ (element selector)
- `.faq-item p` ❌ (element selector)
- `.guarantee-content h3` ❌ (element selector)
- `.guarantee-content p` ❌ (element selector)

## Issues Found

### 🔴 Major Issues
1. **No page prefix** - Every single class is generic
2. **Extremely high conflict risk** - Classes like `.pricing-card`, `.faq-item` could exist anywhere
3. **Wrong naming patterns** - Using hyphens instead of BEM within namespace
4. **Element selectors** - Multiple h2, h3, p selectors

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Add `.subscription__` prefix to ALL classes
- [ ] Convert hyphenated names to BEM pattern
- [ ] Replace element selectors
- [ ] Update Subscription page component
- [ ] Test functionality

## Refactoring Plan

### Complete Restructure Required
```css
/* Current → New */
.subscription-page → .subscription
.subscription-header → .subscription__header
.back-button → .subscription__back-button

.billing-toggle → .subscription__billing-toggle
.billing-option → .subscription__billing-option
.billing-option--active → .subscription__billing-option--active
.billing-badge → .subscription__billing-badge

.pricing-grid → .subscription__pricing-grid
.pricing-card → .subscription__pricing-card
.pricing-card--popular → .subscription__pricing-card--popular
.pricing-card--current → .subscription__pricing-card--current

.tier-name → .subscription__tier-name
.tier-price → .subscription__tier-price
.price-amount → .subscription__price-amount
.price-interval → .subscription__price-interval

.features-list → .subscription__features-list
.feature-item → .subscription__feature-item
.feature-icon → .subscription__feature-icon

.faq-section → .subscription__faq
.faq-section h2 → .subscription__faq-title
.faq-grid → .subscription__faq-grid
.faq-item → .subscription__faq-item
.faq-item h3 → .subscription__faq-question
.faq-item p → .subscription__faq-answer

.money-back-guarantee → .subscription__guarantee
.guarantee-icon → .subscription__guarantee-icon
.guarantee-content h3 → .subscription__guarantee-title
.guarantee-content p → .subscription__guarantee-text
```

## Recommendation

This file needs **complete refactoring**. It's the worst example of page CSS in the audit - zero adherence to page namespacing rules. Every single class is generic and will likely conflict with other styles.

## Critical Issues

1. **Pricing classes** - Will definitely conflict with any other pricing components
2. **FAQ classes** - Too generic, will conflict with other FAQ implementations
3. **Feature/limitation lists** - These generic names are used everywhere

## Next Steps

1. Add `.subscription__` prefix to EVERY class
2. Convert all naming to proper BEM within namespace
3. Replace ALL element selectors
4. Update React component (massive changes needed)
5. Test thoroughly - this is a breaking change