# Components Directory - LLM Rails

> **LLM INSTRUCTIONS**: This directory contains reusable React components. Follow these exact rules.

## 📍 Location Rules

```
CURRENT DIRECTORY: src/components/
FILE PATTERN: ComponentName.tsx
CSS LOCATION: ../../styles/components/componentname.css
```

## 🚦 Component Creation Checklist

1. **CREATE** `ComponentName.tsx` here
2. **ADD** metadata header:
```typescript
/**
 * @layer primitive|composed
 * @cssFile /styles/components/componentname.css
 * @dependencies Box, Text (if any)
 * @utilities spacing, shadow (via Box)
 * @variants ["default", "elevated", "outlined"]
 * @className .component-name
 */
```
3. **CREATE** CSS file at `src/styles/components/componentname.css`
4. **USE** base class `.component-name` (or `.btn` for Button)
5. **RUN** `npm run audit:component ComponentName`

## 🎯 Import Rules

| Component Type | Can Import | Cannot Import |
|---------------|------------|---------------|
| Primitive | Nothing | Any other component |
| Composed | Primitives only | Other composed, features |

## 📁 Current Components

| Component | Type | CSS Base Class | Special Notes |
|-----------|------|----------------|---------------|
| Box.tsx | Primitive | none | Utility-only component |
| Text.tsx | Primitive | none | Typography component |
| Button.tsx | Primitive | .btn | Uses 'btn' not 'button' |
| Card.tsx | Composed | .card | Uses Box for utilities |
| Modal.tsx | Composed | .modal | Portal-based |
| Badge.tsx | Composed | .badge | Status indicators |

## 🚨 Common Mistakes to Avoid

1. **DON'T** create CSS in utils/ directory
2. **DON'T** use inline styles (use Box props)
3. **DON'T** forget metadata annotations
4. **DON'T** import across layers
5. **DON'T** use generic class names

## ✅ Correct Examples

### Primitive Component
```typescript
/**
 * @layer primitive
 * @cssFile /styles/components/button.css
 * @className .btn
 */
export const Button = () => {
  // No imports from other components
}
```

### Composed Component
```typescript
/**
 * @layer composed
 * @cssFile /styles/components/card.css
 * @dependencies Box
 * @className .card
 */
import { Box } from './Box'
export const Card = () => {
  // Can import primitives
}
```

## 🔧 Validation

Always validate after creating/modifying:
```bash
npm run audit:component YourComponentName
```