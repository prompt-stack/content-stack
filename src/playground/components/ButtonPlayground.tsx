/**
 * @file playground/components/ButtonPlayground.tsx
 * @purpose [TODO: Add purpose]
 * @layer unknown
 * @deps none
 * @used-by [PlaygroundPage]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 */

import { Button } from '@/components/Button'
import { DemoSection } from '../PlaygroundLayout'

export function ButtonPlayground() {
  return (
    <div className="playground__component">
      <h2>Button Component</h2>
      <p className="playground__component-description">
        Flexible button component with multiple variants, sizes, and states.
      </p>

      <DemoSection 
        title="Variants" 
        code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>`}
      >
        <div className="playground__demo-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </DemoSection>

      <DemoSection 
        title="Sizes" 
        code={`<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`}
      >
        <div className="playground__demo-row">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </DemoSection>

      <DemoSection 
        title="With Icons" 
        code={`<Button icon="rocket">Launch</Button>
<Button variant="secondary" icon="download">Download</Button>
<Button variant="danger" icon="trash">Delete</Button>`}
      >
        <div className="playground__demo-row">
          <Button icon="rocket">Launch</Button>
          <Button variant="secondary" icon="download">Download</Button>
          <Button variant="danger" icon="trash">Delete</Button>
        </div>
      </DemoSection>

      <DemoSection 
        title="States" 
        code={`<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>`}
      >
        <div className="playground__demo-row">
          <Button loading>Loading...</Button>
          <Button disabled>Disabled</Button>
        </div>
      </DemoSection>

      <DemoSection 
        title="Block Buttons" 
        code={`<Button className="w-full">Full Width Button</Button>`}
      >
        <Button className="w-full">Full Width Button</Button>
      </DemoSection>

      <DemoSection 
        title="Button Groups" 
        code={`<div className="btn-group">
  <Button size="small">Left</Button>
  <Button size="small">Center</Button>
  <Button size="small">Right</Button>
</div>`}
      >
        <div className="btn-group">
          <Button size="small">Left</Button>
          <Button size="small">Center</Button>
          <Button size="small">Right</Button>
        </div>
      </DemoSection>
    </div>
  )
}
