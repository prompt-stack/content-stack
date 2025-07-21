import { Card } from '@/components/Card'
import { DemoSection } from '../PlaygroundLayout'

export function LayoutPlayground() {
  return (
    <div className="playground__component">
      <h2>Layout Patterns</h2>
      <p className="playground__component-description">
        Common layout patterns and utilities used throughout the application.
      </p>

      <DemoSection 
        title="Spacing Utilities" 
        code={`<!-- Using design tokens for consistent spacing -->
<div style={{ padding: 'var(--space-md)' }}>
  <p style={{ marginBottom: 'var(--space-sm)' }}>Content</p>
</div>`}
      >
        <div className="playground__demo-grid">
          <Card>
            <h4>Space XS</h4>
            <div style={{ 
              height: 'var(--space-xs)', 
              background: 'var(--brand-primary)',
              marginBottom: '0.5rem'
            }}></div>
            <code>--space-xs: 0.25rem</code>
          </Card>
          <Card>
            <h4>Space SM</h4>
            <div style={{ 
              height: 'var(--space-sm)', 
              background: 'var(--brand-primary)',
              marginBottom: '0.5rem'
            }}></div>
            <code>--space-sm: 0.5rem</code>
          </Card>
          <Card>
            <h4>Space MD</h4>
            <div style={{ 
              height: 'var(--space-md)', 
              background: 'var(--brand-primary)',
              marginBottom: '0.5rem'
            }}></div>
            <code>--space-md: 1rem</code>
          </Card>
          <Card>
            <h4>Space LG</h4>
            <div style={{ 
              height: 'var(--space-lg)', 
              background: 'var(--brand-primary)',
              marginBottom: '0.5rem'
            }}></div>
            <code>--space-lg: 1.5rem</code>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Grid Layouts" 
        code={`<div className="grid grid--2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>`}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h4>2 Column Grid</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 'var(--space-md)',
            marginTop: '1rem'
          }}>
            <Card>Column 1</Card>
            <Card>Column 2</Card>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4>3 Column Grid</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: 'var(--space-md)',
            marginTop: '1rem'
          }}>
            <Card>Col 1</Card>
            <Card>Col 2</Card>
            <Card>Col 3</Card>
          </div>
        </div>

        <div>
          <h4>Responsive Grid</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 'var(--space-md)',
            marginTop: '1rem'
          }}>
            <Card>Auto 1</Card>
            <Card>Auto 2</Card>
            <Card>Auto 3</Card>
            <Card>Auto 4</Card>
          </div>
        </div>
      </DemoSection>

      <DemoSection 
        title="Flex Layouts" 
        code={`<div style={{ display: 'flex', gap: 'var(--space-md)' }}>
  <div style={{ flex: 1 }}>Flexible</div>
  <div>Fixed</div>
</div>`}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h4>Horizontal Flex</h4>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-md)',
            marginTop: '1rem'
          }}>
            <Card style={{ flex: 1 }}>Flex: 1</Card>
            <Card style={{ flex: 2 }}>Flex: 2</Card>
            <Card>Auto</Card>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4>Centered Content</h4>
          <Card style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '150px',
            marginTop: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-check-circle" style={{ 
                fontSize: '3rem', 
                color: 'var(--status-success)',
                marginBottom: '0.5rem'
              }}></i>
              <p>Centered Content</p>
            </div>
          </Card>
        </div>

        <div>
          <h4>Space Between</h4>
          <Card style={{ marginTop: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Container Widths" 
        code={`<div className="container container--sm">Small Container</div>
<div className="container">Default Container</div>
<div className="container container--lg">Large Container</div>`}
      >
        <div style={{ background: 'var(--surface-secondary)', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            background: 'var(--surface-primary)',
            padding: 'var(--space-md)',
            textAlign: 'center'
          }}>
            Small Container (600px)
          </div>
        </div>

        <div style={{ background: 'var(--surface-secondary)', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            background: 'var(--surface-primary)',
            padding: 'var(--space-md)',
            textAlign: 'center'
          }}>
            Default Container (1200px)
          </div>
        </div>

        <div style={{ background: 'var(--surface-secondary)', padding: '1rem' }}>
          <div style={{ 
            maxWidth: '1400px', 
            margin: '0 auto', 
            background: 'var(--surface-primary)',
            padding: 'var(--space-md)',
            textAlign: 'center'
          }}>
            Large Container (1400px)
          </div>
        </div>
      </DemoSection>

      <DemoSection 
        title="Common Page Layouts" 
        code={`<!-- Header + Content + Sidebar -->
<div className="page-layout">
  <header className="page-header">Header</header>
  <main className="page-content">Content</main>
  <aside className="page-sidebar">Sidebar</aside>
</div>`}
      >
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 300px',
            gridTemplateRows: 'auto 1fr',
            minHeight: '400px'
          }}>
            <div style={{ 
              gridColumn: '1 / -1',
              background: 'var(--surface-secondary)',
              padding: 'var(--space-md)',
              borderBottom: '1px solid var(--border-light)'
            }}>
              Header Area
            </div>
            <div style={{ 
              padding: 'var(--space-lg)'
            }}>
              Main Content Area
            </div>
            <div style={{ 
              background: 'var(--surface-secondary)',
              padding: 'var(--space-md)',
              borderLeft: '1px solid var(--border-light)'
            }}>
              Sidebar
            </div>
          </div>
        </Card>
      </DemoSection>

      <DemoSection 
        title="Card-based Layout" 
        code={`<div className="dashboard-grid">
  <Card className="dashboard-card">
    <h3>Metric 1</h3>
    <p className="metric-value">1,234</p>
  </Card>
  <!-- More cards... -->
</div>`}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 'var(--space-md)'
        }}>
          <Card>
            <h4 style={{ marginBottom: '0.5rem' }}>Total Items</h4>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              margin: 0
            }}>1,234</p>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--text-tertiary)',
              marginTop: '0.25rem'
            }}>
              +12% from last month
            </p>
          </Card>
          <Card>
            <h4 style={{ marginBottom: '0.5rem' }}>Active Users</h4>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              margin: 0
            }}>567</p>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--status-success)',
              marginTop: '0.25rem'
            }}>
              +5% from last week
            </p>
          </Card>
          <Card>
            <h4 style={{ marginBottom: '0.5rem' }}>Processing</h4>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              margin: 0
            }}>89</p>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--text-tertiary)',
              marginTop: '0.25rem'
            }}>
              In queue
            </p>
          </Card>
        </div>
      </DemoSection>
    </div>
  )
}