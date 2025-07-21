import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { DemoSection } from '../PlaygroundLayout'

export function UtilityPlayground() {
  return (
    <div className="playground__component">
      <h2>Utility Classes & Helpers</h2>
      <p className="playground__component-description">
        Common utility classes and helper components for rapid development.
      </p>

      <DemoSection 
        title="Text Utilities" 
        code={`<p className="text-sm">Small text</p>
<p className="text-lg">Large text</p>
<p className="text-muted">Muted text</p>
<p className="text-danger">Error text</p>`}
      >
        <div className="playground__demo-grid">
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Small Text (text-sm)
            </p>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              Default Text
            </p>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              Large Text (text-lg)
            </p>
            <p style={{ fontSize: '1.5rem' }}>
              Extra Large (text-xl)
            </p>
          </div>
          
          <div>
            <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Primary Text
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Secondary Text
            </p>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Tertiary Text
            </p>
            <p style={{ color: 'var(--status-error)' }}>
              Error Text
            </p>
          </div>
        </div>
      </DemoSection>

      <DemoSection 
        title="Status Badges" 
        code={`<span className="badge">Default</span>
<span className="badge badge--green">Success</span>
<span className="badge badge--yellow">Warning</span>
<span className="badge badge--red">Error</span>
<span className="badge badge--blue">Info</span>`}
      >
        <div className="playground__demo-row">
          <span className="badge">Default</span>
          <span className="badge badge--green">Success</span>
          <span className="badge badge--yellow">Warning</span>
          <span className="badge badge--red">Error</span>
          <span className="badge badge--blue">Info</span>
        </div>
      </DemoSection>

      <DemoSection 
        title="Badge Sizes" 
        code={`<span className="badge badge--xs">Extra Small</span>
<span className="badge badge--sm">Small</span>
<span className="badge badge--md">Medium</span>
<span className="badge badge--lg">Large</span>`}
      >
        <div className="playground__demo-row" style={{ alignItems: 'center' }}>
          <span className="badge badge--xs">XS Badge</span>
          <span className="badge badge--sm">Small Badge</span>
          <span className="badge badge--md">Medium Badge</span>
          <span className="badge badge--lg">Large Badge</span>
        </div>
      </DemoSection>

      <DemoSection 
        title="Category Tags" 
        code={`<span className="badge badge--tag badge--blue">Technology</span>
<span className="badge badge--tag badge--green">Business</span>
<span className="badge badge--tag badge--removable">
  Design <i className="fas fa-times badge__remove"></i>
</span>`}
      >
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Category Tags (Pills)</h4>
          <div className="playground__demo-row">
            <span className="badge badge--tag badge--blue badge--sm">Technology</span>
            <span className="badge badge--tag badge--green badge--sm">Business</span>
            <span className="badge badge--tag badge--yellow badge--sm">Marketing</span>
            <span className="badge badge--tag badge--red badge--sm">Urgent</span>
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>With Icons</h4>
          <div className="playground__demo-row">
            <span className="badge badge--tag badge--blue badge--md">
              <i className="fas fa-tag badge__icon"></i> Featured
            </span>
            <span className="badge badge--tag badge--green badge--md">
              <i className="fas fa-check-circle badge__icon"></i> Verified
            </span>
            <span className="badge badge--tag badge--md">
              <i className="fas fa-clock badge__icon"></i> Recent
            </span>
          </div>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Removable Tags</h4>
          <div className="playground__demo-row">
            <span className="badge badge--tag badge--removable badge--md">
              JavaScript <i className="fas fa-times badge__remove"></i>
            </span>
            <span className="badge badge--tag badge--removable badge--md">
              React <i className="fas fa-times badge__remove"></i>
            </span>
            <span className="badge badge--tag badge--removable badge--md">
              TypeScript <i className="fas fa-times badge__remove"></i>
            </span>
          </div>
        </div>
      </DemoSection>

      <DemoSection 
        title="Loading States" 
        code={`<div className="loading-spinner"></div>
<div className="skeleton skeleton--text"></div>
<div className="skeleton skeleton--card"></div>`}
      >
        <div className="playground__demo-grid">
          <Card>
            <h4>Spinner</h4>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '2rem' 
            }}>
              <div className="spinner"></div>
            </div>
          </Card>
          
          <Card>
            <h4>Skeleton Text</h4>
            <div style={{ padding: '1rem' }}>
              <div style={{ 
                height: '1rem', 
                background: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.5rem',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
              <div style={{ 
                height: '1rem', 
                width: '80%',
                background: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-sm)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
            </div>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Icons" 
        code={`<i className="fas fa-check"></i>
<i className="fas fa-times"></i>
<i className="fas fa-exclamation-triangle"></i>
<i className="fas fa-info-circle"></i>`}
      >
        <div className="playground__demo-grid">
          <Card>
            <h4>Status Icons</h4>
            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              fontSize: '1.5rem',
              marginTop: '1rem'
            }}>
              <i className="fas fa-check-circle" style={{ color: 'var(--status-success)' }}></i>
              <i className="fas fa-times-circle" style={{ color: 'var(--status-error)' }}></i>
              <i className="fas fa-exclamation-circle" style={{ color: 'var(--status-warning)' }}></i>
              <i className="fas fa-info-circle" style={{ color: 'var(--status-info)' }}></i>
            </div>
          </Card>
          
          <Card>
            <h4>Action Icons</h4>
            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              fontSize: '1.5rem',
              marginTop: '1rem'
            }}>
              <i className="fas fa-edit"></i>
              <i className="fas fa-trash"></i>
              <i className="fas fa-download"></i>
              <i className="fas fa-share"></i>
              <i className="fas fa-copy"></i>
            </div>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Visibility Utilities" 
        code={`<!-- Hide on mobile -->
<div className="hide-mobile">Hidden on mobile</div>

<!-- Show only on mobile -->
<div className="show-mobile">Visible only on mobile</div>

<!-- Screen reader only -->
<span className="sr-only">Screen reader text</span>`}
      >
        <Card>
          <p style={{ marginBottom: '1rem' }}>
            Resize your browser to see different elements appear/disappear
          </p>
          <div style={{ 
            display: 'none',
            '@media (min-width: 768px)': { display: 'block' }
          }}>
            <span className="badge badge--blue">Desktop Only</span>
          </div>
          <div style={{ 
            display: 'block',
            '@media (min-width: 768px)': { display: 'none' }
          }}>
            <span className="badge badge--green">Mobile Only</span>
          </div>
        </Card>
      </DemoSection>

      <DemoSection 
        title="Overflow & Truncation" 
        code={`<p className="truncate">
  This very long text will be truncated with an ellipsis...
</p>

<div className="overflow-auto" style={{ maxHeight: '100px' }}>
  Scrollable content
</div>`}
      >
        <div className="playground__demo-grid">
          <Card>
            <h4>Text Truncation</h4>
            <p style={{ 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '0.5rem'
            }}>
              This is a very long text that will be truncated with an ellipsis when it exceeds the container width
            </p>
          </Card>
          
          <Card>
            <h4>Scrollable Container</h4>
            <div style={{ 
              maxHeight: '100px',
              overflow: 'auto',
              padding: '0.5rem',
              background: 'var(--surface-secondary)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <p>Line 1</p>
              <p>Line 2</p>
              <p>Line 3</p>
              <p>Line 4</p>
              <p>Line 5</p>
              <p>Line 6</p>
              <p>Line 7</p>
            </div>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Animations" 
        code={`<div className="fade-in">Fade in animation</div>
<div className="slide-up">Slide up animation</div>
<button className="hover-grow">Hover to grow</button>`}
      >
        <div className="playground__demo-grid">
          <Card>
            <h4>Hover Effects</h4>
            <div style={{ marginTop: '1rem' }}>
              <Button 
                style={{ 
                  transition: 'transform 0.2s ease',
                  ':hover': { transform: 'scale(1.05)' }
                }}
              >
                Hover to Grow
              </Button>
            </div>
          </Card>
          
          <Card>
            <h4>Pulse Animation</h4>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem'
            }}>
              <div style={{ 
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: 'var(--brand-primary)',
                animation: 'pulse 2s ease-in-out infinite'
              }}></div>
            </div>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Accessibility Helpers" 
        code={`<!-- Skip to main content link -->
<a href="#main" className="skip-link">Skip to main content</a>

<!-- Focus trap container -->
<div className="focus-trap" tabIndex={-1}>
  Modal content with trapped focus
</div>

<!-- Accessible label -->
<button aria-label="Close dialog" className="icon-button">
  <i className="fas fa-times"></i>
</button>`}
      >
        <Card>
          <h4>Accessibility Features</h4>
          <ul style={{ marginTop: '1rem' }}>
            <li>Skip links for keyboard navigation</li>
            <li>Focus trap for modals</li>
            <li>ARIA labels for icon buttons</li>
            <li>Proper heading hierarchy</li>
            <li>Color contrast compliance</li>
          </ul>
          
          <div style={{ marginTop: '1rem' }}>
            <button 
              aria-label="Delete item"
              style={{ 
                padding: '0.5rem',
                background: 'transparent',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-trash" aria-hidden="true"></i>
            </button>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Icon button with aria-label
            </span>
          </div>
        </Card>
      </DemoSection>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}