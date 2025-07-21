# CSS Audit: forms.css

**File**: `/src/styles/components/forms.css`  
**Type**: Component  
**Status**: ⚠️ PARTIALLY COMPLIANT

## Current State Analysis

### ⚠️ Mixed BEM Convention
- Multiple base classes: `.input`, `.textarea`, `.select` ✅
- Modifiers: `.[base]--[modifier]` ✅
- Some non-BEM patterns for related elements ❌

### Class Inventory

#### Base Classes
- `.input` - Base input field
- `.textarea` - Base textarea 
- `.select` - Base select dropdown
- `.range` - Range slider

#### Input Modifiers
- `.input--glass` - Glass morphism style
- `.input--borderless` - No border style
- `.input--pill` - Rounded pill shape
- `.input--sm` - Small size
- `.input--lg` - Large size
- `.input--error` - Error state
- `.input--success` - Success state
- `.input--disabled` - Disabled state

#### Textarea Modifiers
- `.textarea--fixed` - Non-resizable
- `.textarea--code` - Monospace font

#### Input Group (BEM compliant)
- `.input-group` - Container
- `.input-group__icon` - Icon element
- `.input-group__icon--left` - Left icon modifier
- `.input-group__icon--right` - Right icon modifier
- `.input-group--icon-left` - Container modifier
- `.input-group--icon-right` - Container modifier
- `.input-group__addon` - Addon element
- `.input-group__addon--before` - Before addon
- `.input-group__addon--after` - After addon

#### Non-BEM Classes (Need refactoring)
- `.url-input-wrapper` ❌ Should be `.url-input` or removed
- `.url-input-field` ❌ Should be `.url-input__field`
- `.url-input-icon` ❌ Should be `.url-input__icon`
- `.form-field` ❌ Should be `.form__field`
- `.form-label` ❌ Should be `.form__label`
- `.form-label--required` ✅ Modifier is correct
- `.form-help` ❌ Should be `.form__help`
- `.form-error` ❌ Should be `.form__error`
- `.form-error__icon` ✅ Child element is correct
- `.form-actions` ❌ Should be `.form__actions`
- `.form-actions--end` ✅ Modifier is correct
- `.form-actions--center` ✅ Modifier is correct
- `.form-actions--between` ✅ Modifier is correct

#### Checkbox/Radio (Partial BEM)
- `.checkbox` - Base
- `.checkbox__input` - Input element
- `.checkbox__label` - Label element
- `.checkbox__box` - Custom box
- `.checkbox--custom` - Custom modifier
- `.radio` - Base
- `.radio__input` - Input element
- `.radio__label` - Label element
- `.radio__circle` - Custom circle
- `.radio--custom` - Custom modifier

## Issues Found

### 🟡 Medium Issues
1. **Inconsistent patterns**: Mix of proper BEM (input-group) and non-BEM (form-field)
2. **Legacy URL input**: Should be removed or refactored
3. **Form wrapper classes**: Need BEM structure

### 🟢 What's Working
- Input, textarea, select base classes and modifiers
- Input group follows perfect BEM
- Checkbox/radio mostly follows BEM

## Task List

- [x] Review naming convention compliance
- [x] Document all classes
- [ ] Refactor form wrapper classes to BEM
- [ ] Remove or refactor URL input classes
- [ ] Update React components using form classes
- [ ] Test form functionality after changes

## Refactoring Plan

```css
/* Form wrapper refactoring */
.form-field → .form__field
.form-label → .form__label
.form-help → .form__help
.form-error → .form__error
.form-actions → .form__actions

/* URL input - decide to remove or refactor */
.url-input-wrapper → .url-input (or remove)
.url-input-field → .url-input__field
.url-input-icon → .url-input__icon
```

## Recommendation

This file is **70% compliant**. The core form elements (input, textarea, select) follow good patterns, but the form wrapper classes need BEM refactoring. The URL input classes appear to be legacy and should be removed if not used.

## Usage Note

The `:has()` selector is used in line 232, which has limited browser support. Consider alternatives for better compatibility.

## Next Steps

1. Refactor form wrapper classes
2. Decide on URL input component
3. Update affected React components
4. Move to next file