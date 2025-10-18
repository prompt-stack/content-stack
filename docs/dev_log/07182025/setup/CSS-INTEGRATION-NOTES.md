# CSS Integration Notes

## Overview
The CSS from the original content-stack project will transfer well to the React version. The architecture uses modern CSS patterns that align perfectly with React component development.

## Key CSS Architecture Features

### 1. CSS Layers
The original uses `@layer` for cascade control:
```css
@layer reset, tokens, elements, components, layouts, pages, utilities;
```
This provides predictable specificity and easy overrides.

### 2. Design Tokens
CSS custom properties for consistent theming:
- `--space-*` for spacing scale
- `--text-*` for typography sizes
- `--radius-*` for border radius
- `--duration-*` for animations
- `--primary`, `--danger`, etc. for colors

### 3. Component Classes
BEM-style naming with modifiers:
```css
.input          /* Base component */
.input-lg       /* Size variant */
.input-group    /* Container variant */
```

This maps perfectly to React with clsx:
```tsx
<input className={clsx('input', size && `input-${size}`)} />
```

## Integration Strategy

### 1. File Organization
```
src/styles/
├── index.css          # Main entry with @layer imports
├── tokens.css         # Design system variables
├── reset.css          # Minimal reset
├── base/
│   ├── typography.css
│   └── forms.css
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── modal.css
│   └── inputs.css
└── pages/
    ├── inbox.css
    └── library.css
```

### 2. Vite Configuration
Ensure Vite handles @layer properly:
```js
// vite.config.ts
export default {
  css: {
    transformer: 'lightningcss', // Optional: for better @layer support
  }
}
```

### 3. Component Integration Pattern
```tsx
// components/Input.tsx
import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search';
  inputSize?: 'sm' | 'md' | 'lg';
  icon?: string;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, inputSize = 'md', icon, error, className, ...props }, ref) => {
    const wrapperClass = icon ? 'input-group' : undefined;
    
    const inputClass = clsx(
      'input',
      variant && `input-${variant}`,
      inputSize && `input-${inputSize}`,
      error && 'input-error',
      className
    );

    if (icon) {
      return (
        <div className={wrapperClass}>
          <i className={`input-icon fas fa-${icon}`} />
          <input ref={ref} className={inputClass} {...props} />
        </div>
      );
    }

    return <input ref={ref} className={inputClass} {...props} />;
  }
);
```

## Specific Form Components

### 1. Form Field Wrapper
The `.form-field` class with inline variant transfers directly:
```tsx
<div className={clsx('form-field', inline && 'form-field-inline')}>
  <label className="form-label required">Email</label>
  <Input type="email" required />
  <span className="form-help">We'll never share your email</span>
</div>
```

### 2. Switch Component
The CSS toggle/switch maps to a React component:
```tsx
export function Switch({ label, ...props }: SwitchProps) {
  return (
    <label className="switch">
      <input type="checkbox" {...props} />
      <span className="switch-track">
        <span className="switch-thumb" />
      </span>
      {label && <span className="switch-label">{label}</span>}
    </label>
  );
}
```

### 3. Search Bar
The search bar with icon positioning:
```tsx
export function SearchBar({ onSearch, ...props }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input 
        type="search" 
        className="search-input"
        onChange={e => onSearch(e.target.value)}
        {...props}
      />
      <span className="search-icon">
        <i className="fas fa-search" />
      </span>
    </div>
  );
}
```

## Key Benefits

1. **No CSS-in-JS Dependencies**: Pure CSS with modern features
2. **Framework Agnostic**: CSS can be reused if you switch frameworks
3. **Performance**: No runtime style generation
4. **Developer Experience**: Familiar CSS with IntelliSense support
5. **Accessibility Built-in**: Focus states, reduced motion, high contrast
6. **Responsive by Default**: Container queries for component-level responsiveness

## Migration Checklist

- [ ] Copy `/public/css/` to `/src/styles/`
- [ ] Update import paths in CSS files
- [ ] Create `index.css` with proper @layer imports
- [ ] Test @layer support in Vite
- [ ] Verify CSS custom properties are working
- [ ] Check container query support
- [ ] Test responsive breakpoints
- [ ] Validate accessibility features

## Potential Issues & Solutions

### 1. @layer Browser Support
- Modern browsers support @layer well
- For older browsers, consider PostCSS plugin

### 2. Container Queries
- Good modern browser support
- Polyfill available if needed

### 3. CSS Module Consideration
If you later want CSS Modules:
```tsx
// Can gradually migrate specific components
import styles from './Button.module.css';
<button className={styles.button} />
```

## Notes

- The form CSS is particularly well-architected with proper states (focus, disabled, error)
- The use of logical properties (`margin-inline-start`) supports RTL languages
- Custom properties make theming straightforward
- The existing CSS promotes consistency which is crucial for a design system