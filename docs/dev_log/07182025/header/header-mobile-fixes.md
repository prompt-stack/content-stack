# Header Mobile Visibility Fixes

## Issue
The header was disappearing or getting squeezed on mobile screen sizes.

## Root Causes
1. Header elements were being hidden without proper layout management
2. No minimum height set for mobile header
3. Flex items not properly configured for shrinking
4. Spacing issues causing content overflow

## Fixes Applied

### 1. **Header Container Fixes**
```css
/* Ensure header stays visible on mobile */
@media (max-width: 768px) {
  .header {
    min-height: 56px; /* Ensure minimum height */
  }
  
  .header-content {
    justify-content: space-between; /* Proper spacing */
  }
}
```

### 2. **Hamburger Button Improvements**
```css
.hamburger-button {
  flex-shrink: 0; /* Prevent shrinking */
  display: flex; /* Proper flex display on mobile */
  align-items: center;
  justify-content: center;
}
```

### 3. **Flex Layout Fixes**
```css
.header-brand {
  min-width: 0; /* Allow text to shrink properly */
}

.menu-dropdown {
  flex-shrink: 0; /* Prevent dropdown from shrinking */
}

.menu-trigger {
  white-space: nowrap; /* Prevent text wrapping */
}
```

### 4. **Mobile Layout Structure**
On mobile (<768px), the header now maintains this structure:
```
[≡] [🔷 Content Stack] [▼]
 ^        ^              ^
 |        |              |
Hamburger Brand         Menu
(visible) (icon+text*)  (icon only)

* Brand text hidden <768px, icon always visible
```

## Result
- Header remains visible at all screen sizes
- Proper spacing between elements
- No content overflow or disappearing elements
- Hamburger menu properly positioned
- Brand icon always visible
- User menu dropdown remains accessible

## Testing Points
- ✅ Header visible on all screen sizes
- ✅ Hamburger button appears at 768px
- ✅ Brand icon always visible
- ✅ Menu dropdown accessible
- ✅ Proper spacing maintained
- ✅ No layout shifts or jumps