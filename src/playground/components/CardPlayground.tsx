/**
 * @file playground/components/CardPlayground.tsx
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
import { Button } from '@/components/Button'
import { DemoSection } from '../PlaygroundLayout'

export function CardPlayground() {
  return (
    <div className="playground__component">
      <h2>Card Component</h2>
      <p className="playground__component-description">
        Versatile container component with multiple variants and states.
      </p>

      <DemoSection 
        title="Basic Cards" 
        code={`<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>`}
      >
        <div className="playground__demo-grid">
          <Card>
            <h3>Default Card</h3>
            <p>This is a basic card with default styling.</p>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Card Variants" 
        code={`<Card variant="default">Default</Card>
<Card variant="elevated">Elevated</Card>
<Card variant="outlined">Outlined</Card>`}
      >
        <div className="playground__demo-grid">
          <Card variant="default">
            <h4>Default Card</h4>
            <p>Standard appearance</p>
          </Card>
          <Card variant="elevated">
            <h4>Elevated Card</h4>
            <p>With shadow effect</p>
          </Card>
          <Card variant="outlined">
            <h4>Outlined Card</h4>
            <p>Simple border style</p>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Interactive Cards" 
        code={`<Card interactive>
  <h4>Hover Me!</h4>
  <p>This card responds to hover</p>
</Card>`}
      >
        <div className="playground__demo-grid">
          <Card interactive>
            <h4>Interactive Card</h4>
            <p>Hover to see the effect</p>
          </Card>
          <Card interactive variant="elevated">
            <h4>Elevated Interactive</h4>
            <p>Combines elevation with hover</p>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Selected State" 
        code={`<Card selected>
  <h4>Selected Card</h4>
  <p>This card is selected</p>
</Card>`}
      >
        <div className="playground__demo-grid">
          <Card>
            <h4>Normal Card</h4>
            <p>Not selected</p>
          </Card>
          <Card selected>
            <h4>Selected Card</h4>
            <p>This one is selected</p>
          </Card>
        </div>
      </DemoSection>

      <DemoSection 
        title="Complex Card Example" 
        code={`<Card variant="elevated" interactive>
  <div className="card__header">
    <h3>Project Status</h3>
    <span className="badge badge--green">Active</span>
  </div>
  <div className="card__body">
    <p>Project description...</p>
  </div>
  <div className="card__footer">
    <Button size="small">View Details</Button>
  </div>
</Card>`}
      >
        <Card variant="elevated" interactive style={{ maxWidth: '400px' }}>
          <div className="card__header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem' 
          }}>
            <h3 style={{ margin: 0 }}>Project Status</h3>
            <span className="badge badge--green">Active</span>
          </div>
          <div className="card__body" style={{ marginBottom: '1rem' }}>
            <p style={{ margin: 0 }}>
              This is a more complex card example showing how to structure
              content with header, body, and footer sections.
            </p>
          </div>
          <div className="card__footer" style={{ 
            borderTop: '1px solid var(--border-light)', 
            paddingTop: '1rem' 
          }}>
            <Button size="small" variant="primary">View Details</Button>
            <Button size="small" variant="secondary" style={{ marginLeft: '0.5rem' }}>
              Edit
            </Button>
          </div>
        </Card>
      </DemoSection>

      <DemoSection 
        title="Card Grid Layout" 
        code={`<div className="card-grid">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>`}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <Card interactive>
            <h4>Card 1</h4>
            <p>Grid item</p>
          </Card>
          <Card interactive>
            <h4>Card 2</h4>
            <p>Grid item</p>
          </Card>
          <Card interactive>
            <h4>Card 3</h4>
            <p>Grid item</p>
          </Card>
        </div>
      </DemoSection>
    </div>
  )
}
