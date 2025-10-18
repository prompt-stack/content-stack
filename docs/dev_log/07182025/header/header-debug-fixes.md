# Header Visibility Debug and Fixes

## Issue
The header HTML is rendering but appears empty/invisible. All elements are in the DOM but not visible.

## Possible Causes
1. Font Awesome icons not loading
2. CSS variables not defined
3. Color contrast issues (white on white or black on black)
4. CSS not loading properly

## Debug Steps

### 1. Check Font Awesome
Make sure Font Awesome is included in your index.html:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
```

### 2. Add Fallback Styles
Add explicit colors and styles to ensure visibility:

```css
/* Debug styles - add to index.css temporarily */
.header {
  background-color: #1a1a1a !important;
  border-bottom: 1px solid #333 !important;
}

.header-brand {
  color: #fff !important;
}

.header-brand-icon {
  color: #646cff !important;
}

.hamburger-button {
  color: #fff !important;
}

.button {
  color: #fff !important;
  border: 1px solid #666 !important;
}

.menu-trigger {
  color: #fff !important;
  border: 1px solid #666 !important;
}
```

### 3. CSS Variable Fallbacks
Ensure CSS variables have fallbacks:

```css
:root {
  --primary: #646cff;
  --text-primary: #fff;
  --surface-base: #1a1a1a;
  --border: rgba(255, 255, 255, 0.1);
}
```

## Immediate Fix

Add this to the beginning of your index.css to ensure basic visibility:

```css
/* Temporary debug styles */
.header * {
  color: inherit !important;
}

.header i::before {
  content: attr(class) !important;
  font-size: 12px !important;
}
```