import { ReactNode } from 'react'

interface PlaygroundLayoutProps {
  title: string
  description?: string
  children: ReactNode
}

export function PlaygroundLayout({ title, description, children }: PlaygroundLayoutProps) {
  return (
    <div className="playground-layout">
      <div className="playground-layout__header">
        <h1 className="playground-layout__title">{title}</h1>
        {description && (
          <p className="playground-layout__description">{description}</p>
        )}
      </div>
      <div className="playground-layout__content">
        {children}
      </div>
    </div>
  )
}

interface DemoSectionProps {
  title: string
  code?: string
  children: ReactNode
}

export function DemoSection({ title, code, children }: DemoSectionProps) {
  return (
    <div className="playground__demo-section">
      <div className="playground__demo-section__header">
        <h3 className="playground__demo-section__title">{title}</h3>
      </div>
      <div className="playground__demo-section__content">
        {children}
      </div>
      {code && (
        <div className="playground__demo-section__code">
          <pre><code>{code}</code></pre>
        </div>
      )}
    </div>
  )
}