# Pages Directory - LLM Rails

> **LLM INSTRUCTIONS**: This directory contains page-level React components. Follow these exact coordinates.

## 📍 Page Component Rules

```
LOCATION: src/pages/
PATTERN: PageName.tsx
CSS: src/styles/pages/pagename.css (lowercase)
PREFIX: ALL classes MUST use .pagename__
```

## 🚦 Page Creation Checklist

1. **CREATE** `PageName.tsx` in this directory
2. **ADD** metadata header:
```typescript
/**
 * @page PageName
 * @route /page-route
 * @cssFile /styles/pages/pagename.css
 * @features FeatureName1, FeatureName2
 * @className .pagename__
 */
```
3. **CREATE** CSS at `src/styles/pages/pagename.css`
4. **USE** `.pagename__` prefix for ALL classes
5. **IMPORT** components from allowed layers only
6. **RUN** `npm run audit:system` to validate

## 🎯 Class Naming Requirements

### ✅ CORRECT Page Classes
```tsx
// Health.tsx
<div className="health__container">
  <h1 className="health__title">System Health</h1>
  <div className="health__metrics-grid">
    <div className="health__metric-card">
```

### ❌ WRONG Generic Classes
```tsx
// Health.tsx
<div className="container">     // Missing page prefix
  <h1 className="title">        // Too generic
  <div className="metrics-grid"> // Will conflict
```

## 📁 Current Pages

| Page | Route | CSS Prefix | Key Features |
|------|-------|------------|--------------|
| App.tsx | / | .home__ | Homepage, uses home.css |
| Health.tsx | /health | .health__ | System metrics, status cards |
| Subscription.tsx | /subscription | .subscription__ | Plan management, usage |
| Inbox.tsx | /inbox | .inbox__ | Message list, filters |
| Playground.tsx | /playground | .playground__ | API testing interface |

## 🏗️ Page Architecture

### Import Hierarchy
```
Pages can import from:
├── primitives (Box, Text, Button)
├── composed (Card, Modal, Badge)
├── features (specific feature modules)
└── hooks (useStore, useQuery)

Pages CANNOT import:
❌ Other pages
❌ Internal feature components
```

### State Management
```typescript
// Pages orchestrate features
import { useHealthStore } from '@/stores/healthStore'
import { MetricsFeature } from '@/features/metrics'
import { Card } from '@/components/Card'

export function Health() {
  const metrics = useHealthStore()
  
  return (
    <div className="health__container">
      <MetricsFeature data={metrics} />
    </div>
  )
}
```

## 🎨 CSS Organization

### Page CSS Structure
```css
/* pages/health.css */

/* Page Container */
.health__container {
  padding: var(--space-2xl);
  max-width: 1400px;
}

/* Page Sections */
.health__header { }
.health__metrics-section { }
.health__alerts-section { }

/* Page-Specific Components */
.health__metric-card { }
.health__metric-card--warning { }
.health__metric-value { }
```

## 🚨 Common Mistakes

### 1. Missing Page Prefix
```css
/* ❌ WRONG */
.container { }
.header { }

/* ✅ CORRECT */
.health__container { }
.health__header { }
```

### 2. Importing Across Pages
```typescript
/* ❌ WRONG */
import { HealthMetric } from './Health'

/* ✅ CORRECT */
// Move shared components to components/ or features/
import { MetricCard } from '@/components/MetricCard'
```

### 3. Component Styles in Page CSS
```css
/* ❌ WRONG in pages/health.css */
.btn { }  /* This belongs in components/button.css */

/* ✅ CORRECT */
.health__submit-button { }  /* Page-specific modifier */
```

## ✅ Validation

After creating/modifying a page:
```bash
# Quick validation
grep -E "^\." src/styles/pages/pagename.css | grep -v "^\.pagename__"
# Should return nothing

# Full validation
npm run audit:system
```

## 🔧 Page Template

```typescript
/**
 * @page ExamplePage
 * @route /example
 * @cssFile /styles/pages/example.css
 * @features ExampleFeature
 * @className .example__
 */
import { Box } from '@/components/Box'
import { Card } from '@/components/Card'
import { ExampleFeature } from '@/features/example'

export function ExamplePage() {
  return (
    <Box className="example__container">
      <h1 className="example__title">Example Page</h1>
      <div className="example__content">
        <ExampleFeature />
      </div>
    </Box>
  )
}
```

## 🚀 Quick Commands

```bash
# List all page CSS violations
find src/styles/pages -name "*.css" -exec grep -l "^\.[^a-z]*{" {} \;

# Check specific page compliance
grep -E "^\." src/styles/pages/health.css | grep -v "^\.health__"

# Validate all pages
npm run audit:system
```

**REMEMBER**: Every class in a page CSS file MUST start with the page prefix!