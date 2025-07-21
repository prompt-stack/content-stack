# CSS Audit: toggle.css

**File**: `/src/styles/components/toggle.css`  
**Type**: Component  
**Status**: ⚠️ PARTIALLY COMPLIANT (Legacy support)

## Current State Analysis

### ⚠️ Mixed Naming - BEM + Legacy
- Base class: `.toggle` ✅
- BEM elements: `.toggle__[element]` ✅
- Legacy support: Also supports old class names
- Modifiers: `.toggle--[modifier]` ✅

### Class Inventory

#### Base
- `.toggle` - Base container (BEM) ✅
- `.toggle-label` - Legacy container support ⚠️

#### Input Element
- `.toggle__input` - Hidden input (BEM) ✅
- `.toggle-input` - Legacy support ⚠️

#### Switch Element
- `.toggle__switch` - Switch track (BEM) ✅
- `.toggle-slider` - Legacy support ⚠️

#### Label Element
- `.toggle__label` - Label text (BEM) ✅
- `.toggle-text` - Legacy support ⚠️

#### Size Modifiers
- `.toggle--sm` - Small size
- `.toggle--lg` - Large size

#### Position Modifiers
- `.toggle--label-left` - Label on left
- `.toggle--label-top` - Label on top

#### Variant Modifiers
- `.toggle--icons` - With check/x icons
- `.toggle--success` - Success color
- `.toggle--warning` - Warning color
- `.toggle--danger` - Danger color

#### State Modifiers
- `.toggle--loading` - Loading animation
- `.toggle--indeterminate` - Indeterminate state

#### Child Elements
- `.toggle__description` - Description text ✅

#### Related Classes
- `.toggle-group` ⚠️ Should be `.toggle__group` or separate
- `.toggle-group--inline` ⚠️ Modifier for toggle-group

## Issues Found

### 🟡 Medium Issues
1. **Dual naming system**: Supporting both BEM and legacy names
2. **Inconsistent group naming**: `.toggle-group` doesn't follow BEM
3. **Code duplication**: Same styles applied to both BEM and legacy classes

### 🟢 What's Working
- Proper BEM structure exists alongside legacy
- Comprehensive modifier system
- Good state and variant support

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Decide on legacy class removal strategy
- [ ] Fix `.toggle-group` naming
- [ ] Update components to use BEM classes only
- [ ] Remove legacy class support

## Legacy Class Mapping

```css
/* Legacy → BEM */
.toggle-label → .toggle
.toggle-input → .toggle__input
.toggle-slider → .toggle__switch
.toggle-text → .toggle__label
```

## Recommendation

This file is **60% compliant** due to the dual naming system. While it properly implements BEM, it also maintains legacy support which creates:
1. Code duplication
2. Confusion about which classes to use
3. Larger CSS file size

## Migration Strategy

1. **Phase 1**: Update all React components to use BEM classes
2. **Phase 2**: Add deprecation comments to legacy classes
3. **Phase 3**: Remove legacy classes after verification

## Best Practices Demonstrated

1. **Comprehensive modifier system** for all use cases
2. **Smooth migration path** with dual support
3. **Rich variant options** (icons, colors, states)
4. **Responsive considerations**

## Next Steps

1. Create migration plan for legacy classes
2. Update all toggle usage in components
3. Fix `.toggle-group` naming
4. Remove legacy support after migration
5. Document in style guide