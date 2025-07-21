# CSS Audit: button.css

**File**: `/src/styles/components/button.css`  
**Type**: Component  
**Status**: ✅ COMPLIANT (Minor issue)

## Current State Analysis

### ✅ Follows BEM Convention
- Base class: `.btn` ✅
- Modifiers: `.btn--[modifier]` ✅
- Child elements: `.btn__[element]` ✅
- State classes: `.is-[state]` ✅

### Class Inventory

#### Base
- `.btn` - Base button class

#### Variant Modifiers
- `.btn--primary` - Primary button with plasma gradient
- `.btn--secondary` - Secondary button with glass morphism
- `.btn--ghost` - Ghost button (minimal style)
- `.btn--danger` - Danger button for destructive actions

#### Size Modifiers
- `.btn--xs` - Extra small (for input groups)
- `.btn--sm` - Small
- `.btn--lg` - Large
- `.btn--full` - Full width

#### Type Modifiers
- `.btn--icon-only` - Icon-only button
- `.btn--glow` - With glow animation
- `.btn--pulse` - With pulse animation

#### State Classes
- `.is-disabled` - Disabled state
- `.is-loading` - Loading state

#### Child Elements
- `.btn__icon` - Icon within button

#### Button Group Classes
- `.btn-group` - Container for multiple buttons
- `.btn-group--attached` - Attached button group (no gaps)
- `.btn-group--vertical` - Vertical button group
- `.btn-group--stack-mobile` - Stack on mobile

## Issues Found

### 🟡 Minor Issue
1. **Inconsistent naming**: `.btn-group` and its modifiers should follow BEM more strictly
   - Current: `.btn-group`, `.btn-group--attached`
   - Consider: Should this be a separate component or `.btn__group`?

2. **Complex selectors**: Input group integration uses complex selectors that could be simplified
   - Lines 265-271 use `:has()` selector which has limited browser support

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Decide on `.btn-group` naming strategy
- [ ] Consider simplifying input group integration selectors
- [ ] Verify browser support for `:has()` selector
- [ ] Update React components if any changes made

## Usage Verification Needed

Check these files for button usage:
- Button component implementation
- Verify all button variants are used
- Check `.btn-group` usage patterns
- Verify input group integration works correctly

## Recommendation

This file is **95% compliant** with BEM naming conventions. The main decisions needed:

1. **Button Group**: Since `.btn-group` can contain non-button elements and has its own modifiers, it might be better as a separate component rather than a child element of `.btn`

2. **Input Integration**: The `:has()` selector (line 267) has limited browser support. Consider adding a utility class instead.

## Browser Compatibility Note

The `:has()` selector used in line 267 is not supported in:
- Firefox (before version 121)
- Older Safari versions

Consider using a class-based approach for better compatibility.

## Next Steps

1. Decide on `.btn-group` component strategy
2. Address browser compatibility for input integration
3. Update any affected React components
4. Move to next file