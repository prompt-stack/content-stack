# CSS Naming Convention Audit Overview

## Purpose
Systematically audit and fix CSS naming conventions across the entire codebase to ensure consistency and maintainability.

## Naming Convention Standards

### 1. Components (`/styles/components/`)
- Base: `.component-name` (e.g., `.btn`, `.card`, `.modal`)
- Modifier: `.component-name--modifier` (e.g., `.btn--primary`, `.card--elevated`)
- Child: `.component-name__element` (e.g., `.btn__icon`, `.card__header`)
- State: `.is-state` or `.has-state` (e.g., `.is-active`, `.has-error`)

### 2. Pages (`/styles/pages/`)
- All classes must use page prefix
- Pattern: `.page__element` (e.g., `.home__hero`, `.inbox__header`)
- Modifiers: `.page__element--modifier`

### 3. Features (`/styles/features/`)
- All classes must use feature prefix
- Pattern: `.feature-name__element` (e.g., `.queue-manager__item`)
- Modifiers: `.feature-name__element--modifier`

### 4. Layout (`/styles/layout/`)
- Pattern: `.layout-component__element` (e.g., `.header__nav`, `.sidebar__item`)

### 5. Utilities (`/styles/utils/`)
- Single purpose classes
- Pattern: `.utility-name` (e.g., `.text-center`, `.mb-4`)

## Audit Process
1. Create individual audit file for each CSS file
2. Document current state and violations
3. Create task list for fixes
4. Implement fixes
5. Verify changes
6. Update corresponding React components
7. Mark as complete

## Files to Audit

### Base (1 file)
- [x] animations.css - Audit complete

### Components (9 files) ✅ COMPLETE
- [x] badge.css - ✅ 95% Compliant (minor: .badge-group)
- [x] button.css - ✅ 95% Compliant (minor: .btn-group)
- [x] card.css - ✅ 100% Compliant (perfect example)
- [x] content-view-modal.css - ❌ Needs full refactoring
- [x] forms.css - ⚠️ 70% Compliant (form wrapper classes need BEM)
- [x] json-editor-modal.css - ❌ Needs full refactoring
- [x] modal.css - ✅ 85% Compliant (minor: duplicate classes)
- [x] spinner.css - ✅ 90% Compliant (minor: related class naming)
- [x] toggle.css - ⚠️ 60% Compliant (legacy class support)

### Features (6 files) ✅ COMPLETE
- [x] dropzone.css - ⚠️ 75% Compliant (main area class needs BEM)
- [x] inbox-variables.css - ✅ 100% Compliant (perfect variable file)
- [x] mobile-menu.css - ❌ Needs standardization (dual naming system)
- [x] paste-modal.css - ❌ Not compliant (hyphenated naming)
- [x] queue-manager.css - ⚠️ 60% Compliant (mixed patterns, generic status classes)
- [x] theme-toggle.css - ❌ Not compliant (hyphenated naming)

### Layout (3 files) ✅ COMPLETE
- [x] header.css - ✅ 100% Compliant (perfect BEM example)
- [x] navigation.css - ✅ 100% Compliant (multiple nav components, all BEM)
- [x] responsive.css - ⚠️ 75% Compliant (mixed components/utilities, flex class issues)

### Pages (5 files) ✅ COMPLETE
- [x] health.css - ❌ Not compliant (no page prefix, generic names)
- [x] home.css - ❌ Not compliant (no page prefix, duplicate patterns)
- [x] inbox.css - ⚠️ 60% Compliant (inconsistent prefix usage)
- [x] playground.css - ⚠️ 75% Compliant (mostly good, some BEM violations)
- [x] subscription.css - ❌ Not compliant (zero page prefixing)

### Utils (3 files) ✅ COMPLETE
- [x] input-fixes.css - ⚠️ 40% Compliant (contains component implementations)
- [x] spacing-fixes.css - ❌ 0% Compliant (600+ lines of components!)
- [x] utilities.css - ✅ 100% Compliant (perfect utility implementation)

## Total Files: 26 ✅ AUDIT COMPLETE