# Content Stack

**AI-powered content management platform** with media processing, terminal orchestration, and multi-platform integration capabilities. Built with React 19, TypeScript, and modern component architecture.

📚 **Portfolio**: [Prompt Stack](https://prompt-stack.github.io)
🔧 **Developer Guide**: [LLM Navigation Guide](./LLM-NAVIGATION-GUIDE.md)

## What It Does

Content Stack is a comprehensive media processing platform that provides:

- **Media Analysis**: Analyze images, videos, and audio files with AI
- **Content Generation**: Generate media with AI models
- **Content Transformation**: Transform media between formats and styles
- **Terminal Agent Orchestration**: Coordinate multiple AI agents for complex workflows
- **Platform Integrations**: Connect to multiple content platforms and services

## Key Features

- **Media Processor**: Analyze, generate, and transform media with AI models
- **Terminal Agent**: Orchestrate complex multi-step workflows with AI agents
- **Component Library**: Reusable React components with strict BEM methodology
- **Design System**: Comprehensive design system with CSS audit tooling
- **Type-Safe**: Full TypeScript implementation
- **Modern Stack**: React 19 + Vite for fast development

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast hot module replacement
- **Styling**: CSS with strict BEM naming conventions
- **Architecture**: Component-driven with layer separation
- **Design System**: Custom design tokens and component contracts

### Backend API
- **Framework**: Express.js
- **Language**: TypeScript
- **Architecture**: RESTful API design

## Architecture

Content Stack follows a strict component architecture with layer separation:

1. **Primitives** - Base components (buttons, inputs, cards)
2. **Composed** - Components built from primitives
3. **Features** - Feature-specific components
4. **Pages** - Full page components

Key architectural principles:
- **BEM Naming**: Strict Block-Element-Modifier methodology
- **Layer Isolation**: Components can only import from lower layers
- **CSS Auditing**: Automated validation of styles and naming
- **Design Tokens**: Centralized design system variables
- **Component Contracts**: Documented interfaces for all components

## Local Development

```bash
# Clone the repository
git clone https://github.com/prompt-stack/content-stack.git
cd content-stack

# Install dependencies
npm install

# Start development servers
npm run dev:all

# Or run separately:
npm run dev           # Frontend only
npm run server:dev    # Backend API only
```

### Development Tools

```bash
# Component validation
npm run audit:component Button    # Check single component
npm run audit:quick Card          # Alias for component audit

# System validation
npm run audit:system              # Check entire codebase
npm run audit:full                # Alias for system audit
```

## Design System

Content Stack includes a comprehensive design system with:

- **Component Documentation**: `design-system/docs/COMPONENT-ARCHITECTURE.md`
- **Style Contracts**: `design-system/docs/COMPONENT-STYLE-CONTRACT.md`
- **Audit Scripts**: Automated CSS validation and naming checks
- **Design Tokens**: Centralized color, spacing, and typography systems

## Documentation

- **[Component Architecture](design-system/docs/COMPONENT-ARCHITECTURE.md)** - Component design patterns
- **[Style Contract](design-system/docs/COMPONENT-STYLE-CONTRACT.md)** - CSS conventions and rules
- **[LLM Navigation Guide](LLM-NAVIGATION-GUIDE.md)** - Guide for AI assistants working with the codebase

## Project Structure

```
content-stack/
├── src/
│   ├── components/        # React components
│   │   ├── primitives/   # Base components
│   │   ├── composed/     # Composite components
│   │   └── features/     # Feature components
│   ├── pages/            # Page components
│   ├── styles/           # CSS organized by layer
│   │   ├── base/        # Global styles
│   │   ├── components/  # Component styles
│   │   ├── features/    # Feature styles
│   │   └── pages/       # Page styles
│   └── utils/           # Utilities and helpers
├── design-system/       # Design system documentation
│   ├── docs/           # Architecture docs
│   └── scripts/        # Audit and validation
└── server/             # Express API backend
```

## Contributing

This is an open-source project built with AI-assisted development. Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the component architecture guidelines
4. Run audit scripts before committing
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow BEM naming conventions strictly
- Use design tokens for all styling values
- Run `npm run audit:component` before and after changes
- Document component metadata (@layer, @cssFile, @dependencies)
- Validate with `npm run audit:system` before commits

## License

MIT License - see LICENSE file for details

## Links

- **GitHub**: [prompt-stack/content-stack](https://github.com/prompt-stack/content-stack)
- **Portfolio**: [Prompt Stack](https://prompt-stack.github.io)
- **Organization**: [prompt-stack](https://github.com/prompt-stack)

---

**Built with AI-assisted development.** Component-driven architecture with automated validation and strict design system contracts. Real code, real patterns, real results.
