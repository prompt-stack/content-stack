Yes—reorganizing exactly that way is the right move *if* you also tighten a few supporting practices so it actually delivers the clarity you’re after. Here’s what I’d do and what to watch for.

---

## 1. Proposed Top-Level Structure

```
/components
  /primitives        # Zero custom-component deps
  /composed          # Only depend on primitives
  /features          # Depend on composed (+ optionally primitives)
  /pages             # Route-level assembly
  /utilities         # Non-visual helpers (hooks, formatters)
  /icons             # SVG primitives (treat like primitives)
```

Optionally:

```
/design-tokens (or /theme)
  colors.js
  spacing.js
  typography.js
```

---

## 2. Enforced Boundaries (Critical)

| Layer      | Can Import From                 | Cannot Import From           |
| ---------- | ------------------------------- | ---------------------------- |
| primitives | (nothing but tokens, utilities) | composed, features, pages    |
| composed   | primitives, utilities, tokens   | features, pages              |
| features   | composed, primitives, utilities | pages (circular), other apps |
| pages      | all (but avoid importing pages) | (n/a)                        |

Add an **ESLint rule + lint import plugin** (e.g. `eslint-plugin-boundaries` or `eslint-plugin-import` with path groups) to enforce. Without automation, drift is inevitable.

---

## 3. Naming Conventions

* **Primitives**: `Button`, `Input`, `Heading`, `Text`, `Checkbox`, `Radio`, `Select`, `Link`, `Image`.
* **Composed**: Prefix with semantic role if helpful: `Card`, `Modal`, `Dropdown`, `FormField`, `RadioGroup`, `CheckboxGroup`, `Tooltip`.
* **Features**: Domain + role: `InboxComposer`, `SearchBar`, `ContentInbox`, `UserProfilePanel`.
* **Pages**: Route-aligned: `InboxPage`, `SettingsPage`.

Avoid adding “Base” prefixes; folder placement + lint rules express “baseness” better than naming noise.

---

## 4. File Layout Inside a Component

For primitives keep them flat (avoid micro-folders):

```
/primitives
  Button.jsx
  Button.test.jsx (or /__tests__)
  Button.stories.jsx (if Storybook)
  button.css (or Tailwind classes inline)
```

For composed & feature components that grow:

```
/features/ContentInbox/
  ContentInbox.jsx
  ContentInboxHeader.jsx
  ContentInboxItem.jsx
  useContentInboxState.js
  index.js            # export surface
  styles.css (if needed)
```

---

## 5. Documentation Layer (Make It LLM-Friendly)

Create **three docs**:

1. `COMPONENT-LAYERS.md` – Defines the philosophy + import rules + a simple dependency diagram.
2. `PRIMITIVES.md` – One table: name, HTML tag(s), core props, accessibility note.
3. `COMPOSED-MAP.json` (machine readable) – Each composed/feature component lists which primitives it uses. Example:

```json
{
  "Card": { "layer": "composed", "primitives": ["Box", "Heading", "Text"] },
  "FormField": { "layer": "composed", "primitives": ["Label", "Input"] },
  "ContentInbox": { "layer": "feature", "composed": ["Card", "Dropdown"], "primitives": ["Button"] }
}
```

Why: an LLM can ingest this JSON to answer “what does X depend on?” without traversing the entire tree.

---

## 6. Story / Playground Ordering

**Left nav order:**

1. *Foundations* (tokens, spacing scale, color palette)
2. *Primitives*
3. *Composed*
4. *Features*
5. *Patterns / Recipes* (optional)
6. *Pages / Demos*

Every story for a composed or feature component should *link down* to the primitives it uses (and programmatically could read from `COMPOSED-MAP.json`).

---

## 7. Versioning & Stability Signals

Add stability metadata (so you don’t prematurely lock unstable primitives):

```ts
// At top of each primitive file:
export const meta = {
  layer: 'primitive',
  status: 'stable', // 'experimental' | 'deprecated'
  a11y: 'aria-pressed handled' // short note
};
```

LLMs can read this to avoid suggesting deprecated pieces.

---

## 8. Criteria for Promoting Something to a Primitive

Before adding *another* primitive ask:

* **Is this just a styled variant?** If yes → keep as variant (props) not a new primitive.
* **Does it wrap a semantic HTML element 1:1?** If no → probably composed.
* **Will 3+ composed components need this identical abstraction?** If no → premature.

Write these bullets in `COMPONENT-LAYERS.md`—prevents primitive sprawl.

---

## 9. Refactor Strategy (Minimize Disruption)

1. **Inventory**: Script to scan your codebase for `import ... from '.../Button'` etc., categorize.
2. **Create new folders** with empty index exports.
3. **Move primitives first** (lowest ripple).
4. Fix imports via codemod (`jscodeshift` or simple regex).
5. Move composed next, then features.
6. Add lint rule **after** moves (otherwise every intermediate commit breaks CI).
7. Regenerate `COMPOSED-MAP.json` automatically in a build step (AST scan).

---

## 10. Pitfalls / Things to Avoid

| Pitfall                                                           | Why It Hurts        | Mitigation                                                 |
| ----------------------------------------------------------------- | ------------------- | ---------------------------------------------------------- |
| Styling logic leaking upward                                      | Causes duplication  | Keep tokens + variants defined only in primitives          |
| “Micro” primitives (e.g. `IconWrapper`, `FlexRow` etc. exploding) | Cognitive load      | Fold into `Box` with props (`display="flex" gap="2"` etc.) |
| Unscoped CSS in primitives                                        | Global side effects | Use CSS Modules, Tailwind, or BEM naming inside primitives |
| Feature back-importing a page util                                | Circular complexity | Enforce boundaries with lint rules                         |
| LLM mis-refactors (renaming primitives)                           | Breaks consistency  | Symbol map / export index + tests on public surface        |

---

## 11. Quick Litmus Tests

**If you delete the entire `/primitives` folder**: everything else should fail to compile (expected).
**If you delete `/features`**: primitives + composed should still build (healthy separation).
**Import Graph Depth**: Most pages should be depth 3–4 max (primitive → composed → feature → page). Any deeper = candidate for consolidation.

---

## 12. Optional Automation Hooks

* **Generate dependency graph**: simple Node script using `@babel/parser` → output DOT → visual.
* **Integrity test**: CI step that fails if a primitive imports from `/composed` or `/features`.
* **Doc sync**: Rebuild `PRIMITIVES.md` table from source JSDoc comments.

---

### Bottom Line

Yes—reorganize the playground to surface primitives first, then composed, then features. *But* the real leverage comes from enforcing the boundaries (lint + docs + machine-readable map) so the hierarchy stays meaningful and LLM assistants remain grounded.

Want a starter `COMPONENT-LAYERS.md` template or the dependency graph script next? Just say.
