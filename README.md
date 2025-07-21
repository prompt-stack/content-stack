# Content Stack React - LLM Navigation Guide

> **FOR LLMs**: This README provides exact coordinates for navigating and modifying this codebase. Follow these rails precisely.

## 🎯 Project Coordinates

**Root Directory**: `/Users/hoff/My Drive/dev/prompt-stack/content-stack-react`  
**Architecture**: React 19 + TypeScript + Vite + Express API  
**Design System**: Component-driven with strict layer separation  

## 📍 Critical Navigation Points

### When Asked About Components
```
LOCATION: src/components/
PATTERN: ComponentName.tsx
METADATA: Check first 20 lines for @layer, @cssFile, @dependencies
CSS: src/styles/components/componentname.css (lowercase)
```

### When Asked About Pages
```
LOCATION: src/pages/
PATTERN: PageName.tsx
CSS: src/styles/pages/pagename.css
PREFIX: All classes must use .pagename__ prefix
```

### When Asked About Styles
```
LOCATION: src/styles/
STRUCTURE:
├── base/       → Global resets, animations
├── components/ → Component CSS (BEM required)
├── features/   → Feature-specific styles
├── layout/     → Layout components
├── pages/      → Page-specific (prefix required)
└── utils/      → Utilities ONLY (no components)
```

## 🚦 Decision Matrix for LLMs

### "Where should this CSS go?"
```
IF component reusable across pages → src/styles/components/
IF page-specific styling → src/styles/pages/ WITH .pagename__ prefix
IF utility class → src/styles/utils/utilities.css ONLY
IF feature module → src/styles/features/ WITH .feature-name__ prefix
```

### "How should I name this class?"
```
IF component → .component-name, .component-name--modifier, .component-name__element
IF page → .pagename__element, .pagename__element--modifier
IF state → .is-active, .is-loading, .has-error
IF utility → .property-value (e.g., .mb-4, .text-center)
```

### "What imports are allowed?"
```
Primitives → Can import: nothing
Composed → Can import: primitives only
Features → Can import: primitives, composed
Pages → Can import: primitives, composed, features
```

## 🛠️ Task Execution Rails

### To Add a New Component
1. `CREATE src/components/ComponentName.tsx`
2. `ADD metadata block with @layer, @cssFile, @dependencies`
3. `CREATE src/styles/components/componentname.css` (lowercase)
4. `USE .component-name as base class`
5. `RUN npm run audit:component ComponentName`

### To Modify CSS
1. `RUN npm run audit:component ComponentName` FIRST
2. `VERIFY correct file location per rules above`
3. `FOLLOW BEM naming strictly`
4. `USE design tokens from globals.css`
5. `RUN npm run audit:system` AFTER

### To Fix Styling Issues
1. `IDENTIFY component via React DevTools`
2. `LOCATE CSS file via @cssFile metadata`
3. `CHECK design system docs: design-system/docs/`
4. `MODIFY following BEM patterns`
5. `TEST with audit scripts`

## 📊 Validation Checkpoints

### Before ANY CSS Changes
```bash
npm run audit:component ComponentName  # 1-2 seconds
```

### Before ANY Commit
```bash
npm run audit:system  # 30-60 seconds
```

### Quick Health Check
```bash
./design-system/scripts/css-audit.sh | grep "violations"
# Expected: "Total violations: 0"
```

## 🚨 Critical Rules - NEVER VIOLATE

1. **NEVER** put component styles in utils/
2. **NEVER** use generic class names in pages/ (must use page prefix)
3. **NEVER** import across layers (features can't import other features)
4. **NEVER** create CSS without running audit first
5. **NEVER** use inline styles except for dynamic values

## 📁 File Mapping Index

| React Component | CSS File | Class Prefix |
|----------------|----------|--------------|
| App.tsx | - | .home__ (uses home.css) |
| Button.tsx | button.css | .btn |
| Card.tsx | card.css | .card |
| Modal.tsx | modal.css | .modal |
| Health.tsx | health.css | .health__ |
| Subscription.tsx | subscription.css | .subscription__ |

## 🔧 Available Commands

```bash
# Component Development
npm run audit:component Button     # Check single component
npm run audit:quick Card           # Alias for component audit

# System Validation  
npm run audit:system              # Check entire codebase
npm run audit:full                # Alias for system audit

# Development
npm run dev                       # Start Vite dev server
npm run server:dev                # Start Express API
npm run dev:all                   # Start both concurrently
```

## 📚 Deep Dive Documentation

- **Design System**: `design-system/docs/`
- **Component Guide**: `design-system/docs/COMPONENT-ARCHITECTURE.md`
- **Style Contract**: `design-system/docs/COMPONENT-STYLE-CONTRACT.md`
- **CSS Audit Results**: `dev_log/css-audit/`

## 🎯 LLM Quick Reference

**When in doubt**:
1. Check component metadata (`@layer`, `@cssFile`)
2. Run audit script before changes
3. Follow BEM naming strictly
4. Use design tokens always
5. Validate after changes

**Error Recovery**:
- If audit fails → Check naming conventions
- If styles don't apply → Verify file location
- If conflicts occur → Check specificity and layer order

---

## Original Vite + React Setup

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh