/**
 * @file playground/components/PlaygroundHome.tsx
 * @purpose [TODO: Add purpose]
 * @layer unknown
 * @deps none
 * @used-by [PlaygroundPage]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 */

import { Card } from '@/components/Card'

type PlaygroundSection = {
  id: string
  title: string
  description: string
  icon: string
  components: string[]
}

export function PlaygroundHome({ onNavigate }: { onNavigate: (section: string) => void }) {
  const sections: PlaygroundSection[] = [
    {
      id: 'buttons',
      title: 'Buttons',
      description: 'Interactive button components with various styles and states',
      icon: 'fa-square',
      components: ['Primary', 'Secondary', 'Danger', 'Sizes', 'Loading states', 'Icons']
    },
    {
      id: 'cards',
      title: 'Cards',
      description: 'Container components for content grouping',
      icon: 'fa-window-maximize',
      components: ['Basic', 'Elevated', 'Outlined', 'Interactive', 'Selected state']
    },
    {
      id: 'modals',
      title: 'Modals',
      description: 'Base modal component for overlays and dialogs',
      icon: 'fa-window-restore',
      components: ['Basic Modal', 'Sizes', 'Without Title', 'Scrollable', 'Props']
    },
    {
      id: 'forms',
      title: 'Form Components',
      description: 'Input fields and form controls',
      icon: 'fa-edit',
      components: ['Text inputs', 'Dropdowns', 'Checkboxes', 'Radio buttons', 'Dropzone']
    },
    {
      id: 'layouts',
      title: 'Layout Patterns',
      description: 'Common layout structures and grids',
      icon: 'fa-th-large',
      components: ['Spacing', 'Grids', 'Flexbox', 'Containers', 'Page layouts']
    },
    {
      id: 'utilities',
      title: 'Utilities',
      description: 'Helper classes and utility components',
      icon: 'fa-tools',
      components: ['Typography', 'Badges', 'Loading', 'Icons', 'Animations']
    },
    {
      id: 'composition',
      title: 'Composition',
      description: 'How components combine to create pages',
      icon: 'fa-puzzle-piece',
      components: ['Content Cards', 'List Views', 'Page Headers', 'Filters', 'Real Examples']
    },
    {
      id: 'inbox',
      title: 'Content Inbox 🚀',
      description: 'Production-ready MVP feature with complete content management',
      icon: 'fa-inbox',
      components: ['Live Demo', 'Multi-Input', 'Metadata Management', 'Bulk Operations', 'Export']
    }
  ]

  return (
    <div className="playground-home">
      <div className="playground-home__header">
        <h1>Component Playground</h1>
        <p className="text-lg text-secondary">
          Explore and test all components in an isolated environment
        </p>
      </div>

      {/* Component Architecture Overview */}
      <div className="playground-home__architecture">
        <Card variant="elevated" className="architecture-card">
          <h2>Component Architecture</h2>
          <p className="text-secondary mb-4">
            Our components follow a layered architecture for maintainability and reusability
          </p>
          
          <div className="architecture-layers">
            <div className="architecture-layer">
              <div className="layer-icon primitive">
                <i className="fas fa-cube"></i>
              </div>
              <div className="layer-content">
                <h3>Primitives</h3>
                <p className="text-sm text-secondary">
                  Zero dependencies • Maps to HTML elements
                </p>
                <div className="layer-examples">
                  <code>Button</code>
                  <code>Input</code>
                  <code>Text</code>
                  <code>Link</code>
                </div>
              </div>
            </div>

            <div className="architecture-arrow">↓</div>

            <div className="architecture-layer">
              <div className="layer-icon composed">
                <i className="fas fa-cubes"></i>
              </div>
              <div className="layer-content">
                <h3>Composed</h3>
                <p className="text-sm text-secondary">
                  Built from primitives • Reusable patterns
                </p>
                <div className="layer-examples">
                  <code>Card</code>
                  <code>Modal</code>
                  <code>Dropdown</code>
                  <code>FormField</code>
                </div>
              </div>
            </div>

            <div className="architecture-arrow">↓</div>

            <div className="architecture-layer">
              <div className="layer-icon feature">
                <i className="fas fa-puzzle-piece"></i>
              </div>
              <div className="layer-content">
                <h3>Features</h3>
                <p className="text-sm text-secondary">
                  Business logic • API integration • Domain-specific
                </p>
                <div className="layer-examples">
                  <code>ContentInbox</code>
                  <code>QueueManager</code>
                  <code>URLInput</code>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="playground-home__grid">
        {sections.map(section => (
          <Card 
            key={section.id}
            interactive
            onClick={() => onNavigate(section.id)}
            className="playground-home__card"
          >
            <div className="playground-home__icon">
              <i className={`fas ${section.icon}`}></i>
            </div>
            <h3 className="playground-home__title">{section.title}</h3>
            <p className="playground-home__description">{section.description}</p>
            <div className="playground-home__components">
              {section.components.slice(0, 3).map((comp, idx) => (
                <span key={idx} className="badge badge--small">
                  {comp}
                </span>
              ))}
              {section.components.length > 3 && (
                <span className="text-sm text-tertiary">
                  +{section.components.length - 3} more
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="playground-home__features">
        <h2>Features</h2>
        <div className="playground-home__feature-grid">
          <Card variant="outlined">
            <i className="fas fa-code" style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '1rem' }}></i>
            <h4>Live Code Examples</h4>
            <p className="text-secondary">See the exact code needed to implement each component</p>
          </Card>
          <Card variant="outlined">
            <i className="fas fa-palette" style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '1rem' }}></i>
            <h4>Interactive Demos</h4>
            <p className="text-secondary">Test components with different props and states</p>
          </Card>
          <Card variant="outlined">
            <i className="fas fa-mobile-alt" style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '1rem' }}></i>
            <h4>Responsive Design</h4>
            <p className="text-secondary">See how components adapt to different screen sizes</p>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .playground-home {
          max-width: 1200px;
          margin: 0 auto;
        }

        .playground-home__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .playground-home__header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .playground-home__architecture {
          margin-bottom: 3rem;
        }

        .architecture-card {
          padding: 2.5rem;
          text-align: center;
        }

        .architecture-card h2 {
          margin-bottom: 1rem;
        }

        .architecture-layers {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .architecture-layer {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          width: 100%;
          max-width: 500px;
        }

        .layer-icon {
          width: 4rem;
          height: 4rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .layer-icon.primitive {
          background: linear-gradient(135deg, var(--color-plasma), #0099ff);
          color: white;
        }

        .layer-icon.composed {
          background: linear-gradient(135deg, #0099ff, #00ff88);
          color: white;
        }

        .layer-icon.feature {
          background: linear-gradient(135deg, #00ff88, #ffaa00);
          color: white;
        }

        .layer-content {
          text-align: left;
          flex: 1;
        }

        .layer-content h3 {
          margin-bottom: 0.25rem;
        }

        .layer-examples {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .layer-examples code {
          background: var(--surface-secondary);
          padding: 0.125rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-primary);
        }

        .architecture-arrow {
          font-size: 1.5rem;
          color: var(--text-tertiary);
        }

        .mb-4 {
          margin-bottom: 1rem;
        }

        .playground-home__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .playground-home__card {
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .playground-home__card:hover {
          transform: translateY(-2px);
        }

        .playground-home__icon {
          width: 3rem;
          height: 3rem;
          background: var(--surface-secondary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          color: var(--brand-primary);
        }

        .playground-home__title {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .playground-home__description {
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .playground-home__components {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .playground-home__features {
          margin-top: 4rem;
        }

        .playground-home__features h2 {
          text-align: center;
          margin-bottom: 2rem;
        }

        .playground-home__feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .playground-home__feature-grid .card {
          text-align: center;
          padding: 2rem;
        }

        .playground-home__feature-grid h4 {
          margin-bottom: 0.5rem;
        }

        .badge--small {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
        }
      `}</style>
    </div>
  )
}
