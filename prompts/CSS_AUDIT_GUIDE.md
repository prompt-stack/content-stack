# CSS Naming Convention Audit Guide

> **📁 IMPORTANT FOR LLMs**: Document all audit findings in `/dev_log/css-audit/` directory with individual `.md` files for each CSS file audited.

## Purpose
Systematically audit and refactor CSS files to ensure consistent BEM naming conventions across the entire codebase, eliminating random one-offs and creating a maintainable style architecture.

## Current Context
We are conducting a comprehensive CSS audit to standardize naming conventions. This is critical because inconsistent naming leads to:
- Developer confusion about where to add new styles
- Duplicate code and larger bundle sizes
- Difficulty maintaining and scaling the codebase
- Risk of style conflicts between components

## BEM Naming Convention Rules

### 1. Block Element Modifier Structure
```css
/* Block - The component */
.component-name

/* Element - A child of the component */
.component-name__element

/* Modifier - A variation of the component or element */
.component-name--modifier
.component-name__element--modifier

/* State - Temporary states */
.is-active, .is-loading, .has-error
```

### 2. File-Specific Naming Rules

#### Components (`/styles/components/`)
- Base class: `.component` (e.g., `.btn`, `.card`, `.modal`)
- Keep names short but descriptive
- One component per file

#### Pages (`/styles/pages/`)
- **MUST** use page prefix: `.page__element`
- Example: `.home__hero`, `.inbox__header`, `.playground__section`
- Never use generic names without page prefix

#### Features (`/styles/features/`)
- **MUST** use feature prefix: `.feature-name__element`
- Example: `.queue-manager__item`, `.content-inbox__title`
- Feature = a complex, reusable module

#### Layout (`/styles/layout/`)
- Layout components: `.header__nav`, `.sidebar__item`
- Structural elements only

#### Utilities (`/styles/utils/`)
- Single-purpose classes: `.text-center`, `.mb-4`
- **ONLY** define utilities in utilities.css
- Never create utilities in component files

## Audit Process for Each File

### 1. Create Audit Document
```markdown
# CSS Audit: [filename].css

**File**: `/src/styles/[category]/[filename].css`  
**Type**: [Component|Page|Feature|Layout|Utility]  
**Status**: [✅ COMPLIANT|⚠️ PARTIALLY COMPLIANT|❌ NEEDS REFACTORING]

## Current State Analysis
[Document current naming patterns]

## Issues Found
[List all naming violations]

## Task List
- [ ] Review naming convention compliance
- [ ] Document all classes
- [ ] [Specific refactoring tasks]

## Refactoring Plan
[Detailed plan for fixes]
```

### 2. Analyze Current State
Check for:
- BEM structure compliance
- Generic class names that need namespacing
- Utility classes that should be moved
- Duplicate or unused classes
- Browser compatibility issues (e.g., `:has()` selector)

### 3. Document Every Class
Create comprehensive inventory:
- Base classes
- Modifiers
- Child elements
- State classes
- Related/utility classes

### 4. Identify Issues
Rate compliance:
- ✅ 80-100% = Highly Compliant (minor fixes)
- ⚠️ 60-79% = Partially Compliant (some refactoring)
- ❌ 0-59% = Needs Full Refactoring

### 5. Create Refactoring Plan
Be specific:
```css
/* Old → New */
.content-section → .content-view-modal__section
.form-field → .form__field
.demo-section → .playground__demo-section
```

## Common Issues to Look For

### 1. Generic Class Names
```css
/* ❌ WRONG - Too generic */
.section, .wrapper, .container, .content

/* ✅ CORRECT - Namespaced */
.modal__section, .card__wrapper, .inbox__container
```

### 2. Inconsistent Patterns
```css
/* ❌ WRONG - Mixed patterns in same file */
.input-group__icon  /* BEM */
.form-field        /* Flat */

/* ✅ CORRECT - Consistent */
.form__group
.form__field
.form__icon
```

### 3. Utility Classes in Wrong Files
```css
/* ❌ WRONG - In component.css */
.mb-4 { margin-bottom: 1rem; }

/* ✅ CORRECT - Reference utilities */
/* Use .mb-4 from utilities.css */
```

### 4. Missing Prefixes
```css
/* ❌ WRONG - Page without prefix */
/* In home.css */
.hero-section

/* ✅ CORRECT */
.home__hero-section
```

## Decision Points

### Group/Container Classes
When you find `.component-group`:
1. If it only contains that component → `.component__group`
2. If it can contain various elements → Keep as separate utility

### Legacy Code
When you find duplicate naming systems:
1. Document both patterns
2. Create migration mapping
3. Plan phased removal

### Local vs Global
When you find animations/utilities:
1. Check if they exist globally
2. Move to appropriate global file
3. Remove local duplicates

## Output Requirements

### 1. Individual Audit Files
- One `.md` file per CSS file
- Numbered sequentially (01-badge-css-audit.md)
- Stored in `/dev_log/css-audit/`

### 2. Summary Documents
- `00-AUDIT-OVERVIEW.md` - Track progress
- `AUDIT-SUMMARY.md` - Findings and patterns

### 3. Update Style Guide
- Document any new patterns discovered
- Add examples of correct usage
- Update deprecated class list

## Quality Checklist

Before marking a file as audited:
- [ ] All classes documented
- [ ] Compliance percentage calculated
- [ ] Issues clearly identified
- [ ] Refactoring plan created
- [ ] React component impact noted
- [ ] Browser compatibility checked

## Priority Order

1. **Components** - Core building blocks
2. **Pages** - Need prefix compliance
3. **Features** - Complex modules
4. **Layout** - Structural elements
5. **Utilities** - Consolidation needed

## End Goal

A codebase where:
- Every developer knows exactly where to put new styles
- No duplicate or conflicting class names exist
- Clear, consistent naming patterns throughout
- Easy to maintain and scale
- No random one-offs or exceptions

## Current Progress Tracking

Update after each file:
```markdown
## Progress: X/26 files audited (X%)

### Completed
- ✅ Components: 9/9
- ⏳ Features: 0/6
- ⏳ Layout: 0/3
- ⏳ Pages: 0/5
- ⏳ Utils: 0/3
```

---

*Remember: Slow and methodical wins. Document everything. No shortcuts.*