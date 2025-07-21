# Styles Directory - LLM Rails

> **LLM INSTRUCTIONS**: This directory contains all CSS files. Follow these exact coordinates.

## 📍 Directory Structure

```
src/styles/
├── base/       → Global resets, animations, typography
├── components/ → Component styles (BEM required)
├── features/   → Feature module styles  
├── layout/     → Layout component styles
├── pages/      → Page-specific styles (prefix required)
├── utils/      → Utility classes ONLY
├── globals.css → Design tokens & CSS variables
└── main.css    → Import aggregator
```

## 🎯 File Placement Decision Tree

```
IF styling a reusable component → components/
  THEN use .component-name base class
  AND follow BEM: .component-name__element--modifier

IF styling a page → pages/
  THEN use .pagename__ prefix for ALL classes
  EXAMPLE: .health__container, .health__title

IF creating utilities → utils/
  THEN only spacing, display, text utilities
  NEVER component implementations

IF feature module → features/
  THEN use .feature-name__ prefix
  AND scope all styles to feature
```

## 🚦 Naming Convention Matrix

| Location | Base Class Pattern | Example | Import In |
|----------|-------------------|---------|-----------|
| components/ | .component-name | .button, .card | Component.tsx |
| pages/ | .pagename__ | .health__, .home__ | PageName.tsx |
| features/ | .feature-name__ | .inbox-feature__ | Feature components |
| layout/ | .layout-name | .navbar, .sidebar | Layout components |
| utils/ | .property-value | .mb-4, .text-center | main.css only |

## 📏 BEM Rules

### Components (components/)
```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }

/* Modifier */
.card--elevated { }
.card__header--compact { }
```

### Pages (pages/)
```css
/* Page namespace required */
.health__container { }
.health__metrics-grid { }
.health__metric-card { }
.health__metric-card--warning { }
```

## 🚨 Common Violations to Avoid

### ❌ WRONG: Generic names in pages/
```css
/* pages/health.css */
.container { }  /* Missing page prefix */
.title { }      /* Too generic */
```

### ✅ CORRECT: Page-prefixed names
```css
/* pages/health.css */
.health__container { }
.health__title { }
```

### ❌ WRONG: Components in utils/
```css
/* utils/spacing-fixes.css */
.card {         /* Component implementation */
  padding: 1rem;
}
```

### ✅ CORRECT: Only utilities
```css
/* utils/spacing-fixes.css */
.mb-0 { margin-bottom: 0; }
.p-md { padding: var(--space-md); }
```

## 🎨 Design Token Usage

**ALWAYS** use design tokens from globals.css:

```css
/* ❌ WRONG */
.button {
  padding: 8px 16px;
  color: #007bff;
}

/* ✅ CORRECT */
.button {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-primary);
}
```

## 📁 Current File Index

### Base Directory
- `animations.css` - Keyframe animations
- `reset.css` - CSS reset/normalize
- `typography.css` - Font scales, line heights

### Components Directory
- `badge.css` - .badge classes
- `button.css` - .btn classes (exception to naming)
- `card.css` - .card classes
- `modal.css` - .modal classes
- `navbar.css` - .navbar classes
- `theme-toggle.css` - .theme-toggle classes

### Pages Directory
- `health.css` - .health__ prefixed classes
- `home.css` - .home__ prefixed classes
- `inbox.css` - .inbox__ prefixed classes
- `playground.css` - .playground__ prefixed classes
- `subscription.css` - .subscription__ prefixed classes

### Utils Directory
- `spacing-fixes.css` - Margin/padding utilities ONLY
- `utilities.css` - Display, text, position utilities

## ✅ Validation Commands

Before ANY changes:
```bash
# Check specific component
npm run audit:component Button

# Check entire system
npm run audit:system
```

## 🔍 Finding CSS Files

### From React Component
1. Check component metadata for `@cssFile`
2. Look in corresponding directory based on component type
3. File naming: ComponentName.tsx → componentname.css (lowercase)

### From Browser DevTools
1. Inspect element to find class name
2. Use class prefix to determine file location:
   - `.btn` → components/button.css
   - `.health__` → pages/health.css
   - `.mb-4` → utils/utilities.css

## 🚀 Quick Reference

```bash
# Component CSS
echo "src/styles/components/[componentname].css"

# Page CSS  
echo "src/styles/pages/[pagename].css"

# Check violations
./design-system/scripts/audit-css.sh | grep "violations"
```

**CRITICAL**: Never guess file locations. Always verify using the patterns above.