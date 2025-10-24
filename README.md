# Content Stack Components

**React component library and design system** with strict BEM methodology, social media studio editors, and comprehensive audit tooling. Built with React 19, TypeScript, and modern component architecture.

📚 **Portfolio**: [Prompt Stack](https://prompt-stack.github.io)
🔧 **Developer Guide**: [LLM Navigation Guide](./LLM-NAVIGATION-GUIDE.md)
🚀 **Production App**: [Content Engine](https://github.com/prompt-stack/content-engine) - See this library's concepts in production

## Status

⚠️ **Development / Component Library** - Not deployed. This is a component library and design system playground.

For the production-deployed content processing platform, see [Content Engine](https://github.com/prompt-stack/content-engine).

## What It Is

Content Stack Components is a comprehensive React component library featuring:

- **36+ Primitive Components**: Buttons, inputs, cards, modals, dropzones, and more
- **Social Media Studio Editors**: Pre-built editors for Twitter, Instagram, TikTok, LinkedIn, Substack, and newsletters
- **Content Inbox System**: Queue management with bulk operations, export, and metadata editing
- **Design System Tooling**: Automated CSS validation, BEM compliance checking, and component audits
- **Component Playground**: Interactive development environment for testing components
- **Strict Architecture**: Layer-based component organization (primitives → composed → features → pages)

## Key Features

### Component Library
- **Primitives** (36 components): Box, Button, Badge, Card, Input, Textarea, Modal, Dropdown, Spinner, etc.
- **Composed Components**: EditableField, PromptSelector, ProgressIndicator, EmptyState, LoadingState, ErrorState
- **Feature Components**: Content Inbox, Studio Editors, Storage, Search

### Studio Editors
Located at `src/features/studio/components/`:
- **TwitterEditor** (45KB) - Comprehensive Twitter/X post editor
- **InstagramEditor** (6.8KB) - Instagram post formatting
- **SubstackEditor** (6.7KB) - Newsletter content editor
- **TikTokEditor** (2.4KB) - Short-form video script editor
- **LinkedInEditor** (1.9KB) - Professional content editor
- **ArticleEditor** (1.9KB) - Long-form article editor
- **NewsletterEditor** (1.9KB) - Email newsletter composer

### Design System
- **BEM Naming**: Strict Block-Element-Modifier methodology enforced by audit scripts
- **Layer Isolation**: Components can only import from lower layers
- **CSS Auditing**: Automated validation with `grammar-ops/scripts/audit/`
- **Component Documentation**: Every component has LLM-optimized metadata headers
- **Type Safety**: Full TypeScript implementation

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast hot module replacement
- **Styling**: CSS with strict BEM naming conventions
- **Architecture**: Component-driven with layer separation (primitives → composed → features → pages)
- **Testing**: Jest + React Testing Library

### Backend (Example/Development)
- **Framework**: Express.js (TypeScript)
- **Purpose**: Development API for testing components

## Quick Start

```bash
# Clone the repository
git clone https://github.com/prompt-stack/content-stack.git
cd content-stack-components

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run component playground
npm run dev  # Navigate to /playground
```

## Component Development

### Component Playground

Interactive playground available at `/playground` when running `npm run dev`:

- **ButtonPlayground** - Test button variants and states
- **CardPlayground** - Card component examples
- **FormPlayground** - Form components and validation
- **ModalPlayground** - Modal dialogs and overlays
- **CompositionPlayground** - Component composition patterns
- **LayoutPlayground** - Layout components
- **UtilityPlayground** - Utility components

### Design System Audits

```bash
# Component validation
npm run audit:component Button    # Check single component
npm run audit:quick Card          # Alias for component audit

# System validation
npm run audit:system              # Check entire codebase BEM compliance
npm run audit:full                # Alias for system audit

# CSS auditing
./grammar-ops/scripts/audit/components/audit-css.sh
```

## Architecture

Content Stack Components follows a strict 4-layer architecture:

### 1. Primitives (`src/components/`)
Base components that map directly to HTML elements:
```
Box, Button, Badge, Card, Input, Textarea, Select, Checkbox,
Radio, Link, Image, Text, Label, Dropdown, Modal, Spinner, etc.
```

**Rules**:
- ✅ Can use React hooks
- ✅ Can use utility functions
- ❌ Cannot import other components
- ❌ No business logic

### 2. Composed (`src/components/composed/`)
Components built from primitives:
```
EditableField, PromptSelector, ProgressIndicator, Accordion,
EmptyState, LoadingState, ErrorState, ResultsModal
```

**Rules**:
- ✅ Can import primitives
- ✅ Can use React hooks
- ❌ Cannot import other composed components
- ❌ No business logic

### 3. Features (`src/features/`)
Business logic components:
```
content-inbox/    # Queue management system
studio/           # Social media editors
storage/          # Storage components
search/           # Search functionality
```

**Rules**:
- ✅ Can import primitives and composed components
- ✅ Can contain business logic
- ✅ Can use API calls
- ❌ Cannot import from other features

### 4. Pages (`src/pages/`)
Full page components combining features

**Rules**:
- ✅ Can import from any lower layer
- ✅ Handle routing
- ✅ Orchestrate features

## Component Metadata

Every component includes LLM-optimized documentation headers:

```typescript
/**
 * @file components/Button.tsx
 * @purpose Core button component
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [App, Header, Form, ...]
 * @cssFile /styles/components/button.css
 * @llm-read true
 * @llm-write full-edit
 * @test-coverage 100
 */
```

This enables AI assistants to navigate the codebase efficiently.

## Project Structure

```
content-stack-components/
├── src/
│   ├── components/              # Primitive components (36+)
│   ├── features/                # Feature modules
│   │   ├── content-inbox/      # Queue management system
│   │   ├── studio/             # Social media editors
│   │   ├── storage/            # Storage components
│   │   └── search/             # Search functionality
│   ├── playground/             # Component playground
│   │   └── components/         # Playground demos
│   ├── styles/                 # BEM-compliant CSS
│   │   ├── components/        # Component styles
│   │   ├── features/          # Feature styles
│   │   ├── pages/             # Page styles
│   │   └── globals.css        # Global styles
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript types
├── grammar-ops/                # Design system audit tools (submodule)
│   └── scripts/               # Automated validation scripts
├── backend/                    # Development API (Express.js)
├── tests/                      # Jest unit tests
├── cypress/                    # E2E tests
├── scripts/                    # Build and maintenance scripts
├── config/                     # Configuration files
└── docs/                       # Documentation
```

## Development Guidelines

### Before Committing

1. **Run Audits**: `npm run audit:system`
2. **Check Build**: `npm run build`
3. **Run Tests**: `npm run test`
4. **Verify BEM**: Check CSS naming follows `block__element--modifier`

### Component Checklist

- [ ] Component in correct layer (primitive/composed/feature/page)
- [ ] BEM naming in CSS (e.g., `.button`, `.button__icon`, `.button--primary`)
- [ ] Metadata header with `@layer`, `@deps`, `@cssFile`
- [ ] TypeScript props interface
- [ ] CSS file in matching directory
- [ ] No layer violations (don't import from higher layers)

### Naming Conventions

**Components** (PascalCase):
```typescript
Button.tsx, ContentInboxFeature.tsx, EditableField.tsx
```

**CSS** (kebab-case):
```css
button.css, content-inbox.css, editable-field.css
```

**BEM Classes** (lowercase + hyphens):
```css
.content-inbox__header
.content-inbox__item--selected
.btn--primary
```

## Documentation

- **[LLM Navigation Guide](LLM-NAVIGATION-GUIDE.md)** - Guide for AI assistants
- **[Component Architecture](grammar-ops/knowledge-library/)** - Detailed architecture docs
- **[CSS Audit Reports](docs/dev_log/css-audit/)** - Historical audit results

## Relationship to Content Engine

This component library was the original development environment for components now used in [Content Engine](https://github.com/prompt-stack/content-engine), the production-deployed content processing platform.

**Content Engine** (Production):
- ✅ Deployed on Vercel + Railway
- ✅ Next.js 15 + FastAPI backend
- ✅ Live content extraction and LLM processing
- ✅ Focus: Production features and user workflows

**Content Stack Components** (This Repo):
- ⚠️ Not deployed (development only)
- ⚠️ React 19 + Vite
- ⚠️ Component library and design system
- ⚠️ Focus: Reusable components and patterns

## Contributing

This is an open-source project built with AI-assisted development. Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-component`)
3. Follow the component architecture guidelines
4. Run audit scripts: `npm run audit:system`
5. Ensure tests pass: `npm run test`
6. Commit your changes (`git commit -m 'Add amazing component'`)
7. Push to the branch (`git push origin feature/amazing-component`)
8. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Links

- **GitHub**: [prompt-stack/content-stack](https://github.com/prompt-stack/content-stack)
- **Production App**: [Content Engine](https://github.com/prompt-stack/content-engine)
- **Portfolio**: [Prompt Stack](https://prompt-stack.github.io)
- **Organization**: [prompt-stack](https://github.com/prompt-stack)

---

**Built with AI-assisted development.** Strict component architecture, automated validation, and comprehensive design system. Real components, real patterns, reusable everywhere.
