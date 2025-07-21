/**
 * @file pages/PlaygroundPage.tsx
 * @purpose Playground page component
 * @layer page
 * @deps none
 * @used-by [main]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role entrypoint
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'

// Import playground components
import { PlaygroundHome } from '@/playground/components/PlaygroundHome'
import { ButtonPlayground } from '@/playground/components/ButtonPlayground'
import { CardPlayground } from '@/playground/components/CardPlayground'
import { ModalPlayground } from '@/playground/components/ModalPlayground'
import { FormPlayground } from '@/playground/components/FormPlayground'
import { LayoutPlayground } from '@/playground/components/LayoutPlayground'
import { UtilityPlayground } from '@/playground/components/UtilityPlayground'
import { CompositionPlayground } from '@/playground/components/CompositionPlayground'
import { InboxPlayground } from '@/playground/InboxPlayground'
import { InboxWorkflowDemo } from '@/playground/InboxWorkflowDemo'

export function PlaygroundPage() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="playground">
      <div className="playground__header">
        <h1 className="playground__title">Component Playground</h1>
        <p className="playground__description">
          Explore and test components in isolation
        </p>
      </div>

      {/* Navigation */}
      <nav className="playground__nav">
        <button 
          className={`playground__nav-item ${activeSection === 'home' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('home')}
        >
          <i className="fas fa-home"></i> Home
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'buttons' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('buttons')}
        >
          Buttons
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'cards' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('cards')}
        >
          Cards
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'modals' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('modals')}
        >
          Modals
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'forms' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('forms')}
        >
          Forms
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'layouts' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('layouts')}
        >
          Layouts
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'utilities' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('utilities')}
        >
          Utilities
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'composition' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('composition')}
        >
          Composition
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'inbox' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('inbox')}
        >
          <i className="fas fa-inbox"></i> Content Inbox
        </button>
        <button 
          className={`playground__nav-item ${activeSection === 'inbox-workflow' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('inbox-workflow')}
        >
          <i className="fas fa-stream"></i> Inbox Workflow
        </button>
      </nav>

      {/* Content */}
      <div className="playground__content">
        {activeSection === 'home' && <PlaygroundHome onNavigate={setActiveSection} />}
        {activeSection === 'buttons' && <ButtonPlayground />}
        {activeSection === 'cards' && <CardPlayground />}
        {activeSection === 'modals' && <ModalPlayground />}
        {activeSection === 'forms' && <FormPlayground />}
        {activeSection === 'layouts' && <LayoutPlayground />}
        {activeSection === 'utilities' && <UtilityPlayground />}
        {activeSection === 'composition' && <CompositionPlayground />}
        {activeSection === 'inbox' && <InboxPlayground />}
        {activeSection === 'inbox-workflow' && <InboxWorkflowDemo />}
      </div>
    </div>
  )
}
