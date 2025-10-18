# CSS Audit Scripts - Implementation Guide

## ✅ Implemented Scripts

### 1. Component-Level Audit (IMPLEMENTED)
**Script:** `design-system/scripts/audit-component.sh`  
**NPM Command:** `npm run audit:component ComponentName`  
**Speed:** 1-2 seconds  

**Example:**
```bash
npm run audit:component Button
npm run audit:component Card
```

**What it checks:**
- CSS file exists for the component
- Component has proper metadata (@layer, @cssFile)
- CSS follows BEM naming conventions
- No page prefixes in component CSS
- Uses design tokens
- Proper className handling with clsx

### 2. System-Level Audit (IMPLEMENTED)
**Script:** `design-system/scripts/audit-css.sh`  
**NPM Command:** `npm run audit:system`  
**Speed:** 30-60 seconds  

**What it checks:**
- All CSS files across the entire codebase
- Page prefix compliance
- BEM naming patterns
- No component code in utility files
- Legacy patterns

## 📋 Available NPM Scripts

```json
{
  "audit:component": "./design-system/scripts/audit-component.sh",
  "audit:system": "./design-system/scripts/audit-css.sh",
  "audit:quick": "./design-system/scripts/audit-component.sh",
  "audit:full": "./design-system/scripts/audit-css.sh"
}
```

## 🎯 Usage Examples

### During Development (Fast Feedback)
```bash
# Check a single component
npm run audit:component Button

# Quick check alias
npm run audit:quick Card
```

### Before Commits (Comprehensive)
```bash
# Check entire system
npm run audit:system

# Full check alias
npm run audit:full
```

## 🚀 Coming Soon

### Feature-Level Audit
- Check entire feature modules
- Validate feature boundaries
- Cross-component relationships

### Page-Level Audit  
- Validate page-specific styles
- Check page isolation
- Feature orchestration

### IDE Integration
- VSCode extension for real-time feedback
- Git hooks for pre-commit validation
- CI/CD pipeline integration

## 📊 Current Status

| Audit Level | Status | Script | Speed |
|------------|---------|---------|--------|
| Component | ✅ Implemented | audit-component.sh | 1-2s |
| System | ✅ Implemented | audit-css.sh | 30-60s |
| Feature | 🚧 Planned | audit-feature.sh | 5-10s |
| Page | 🚧 Planned | audit-page.sh | 10-15s |

## 🔧 Development Workflow

1. **While coding:** Use `npm run audit:component ComponentName` for instant feedback
2. **Before PR:** Run `npm run audit:system` to catch any issues
3. **CI/CD:** System audit runs automatically on all commits

The component-level audit gives you the fastest feedback loop during development!