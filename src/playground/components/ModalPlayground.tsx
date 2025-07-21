import { useState } from 'react'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { DemoSection } from '../PlaygroundLayout'

export function ModalPlayground() {
  const [showSmall, setShowSmall] = useState(false)
  const [showMedium, setShowMedium] = useState(false)
  const [showLarge, setShowLarge] = useState(false)
  const [showNoTitle, setShowNoTitle] = useState(false)
  const [showLongContent, setShowLongContent] = useState(false)

  return (
    <div className="playground__component">
      <h2>Modal Component</h2>
      <p className="playground__component-description">
        Base modal component for overlays and dialogs. Can be composed into specialized modals as needed.
      </p>

      <DemoSection 
        title="Basic Modal" 
        code={`<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  <p>Modal content goes here</p>
</Modal>`}
      >
        <Button onClick={() => setShowMedium(true)}>Open Modal</Button>
        <Modal 
          isOpen={showMedium} 
          onClose={() => setShowMedium(false)}
          title="Example Modal"
        >
          <p>This is a basic modal with a title and close button.</p>
          <p>The modal centers itself on the screen and dims the background.</p>
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <Button onClick={() => setShowMedium(false)}>Got it</Button>
          </div>
        </Modal>
      </DemoSection>

      <DemoSection 
        title="Modal Sizes" 
        code={`<Modal size="small">Small modal (400px)</Modal>
<Modal size="medium">Medium modal (600px)</Modal>
<Modal size="large">Large modal (800px)</Modal>`}
      >
        <div className="playground__demo-row">
          <Button onClick={() => setShowSmall(true)}>Small Modal</Button>
          <Button onClick={() => setShowMedium(true)}>Medium Modal</Button>
          <Button onClick={() => setShowLarge(true)}>Large Modal</Button>
        </div>
        
        <Modal 
          isOpen={showSmall} 
          onClose={() => setShowSmall(false)}
          title="Small Modal"
          size="small"
        >
          <p>This is a small modal, perfect for confirmations.</p>
        </Modal>
        
        <Modal 
          isOpen={showLarge} 
          onClose={() => setShowLarge(false)}
          title="Large Modal"
          size="large"
        >
          <p>This is a large modal with more space for content.</p>
          <p>Use it when you need to display forms, tables, or detailed information.</p>
        </Modal>
      </DemoSection>

      <DemoSection 
        title="Modal Without Title" 
        code={`<Modal isOpen={isOpen} onClose={onClose}>
  <!-- No title prop = no header -->
  <p>Content only modal</p>
</Modal>`}
      >
        <Button onClick={() => setShowNoTitle(true)}>Open Modal (No Title)</Button>
        <Modal 
          isOpen={showNoTitle} 
          onClose={() => setShowNoTitle(false)}
        >
          <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
            <i className="fas fa-check-circle" style={{ 
              fontSize: '3rem', 
              color: 'var(--status-success)',
              marginBottom: 'var(--space-md)'
            }}></i>
            <h3>Success!</h3>
            <p>Your changes have been saved.</p>
            <Button 
              onClick={() => setShowNoTitle(false)}
              variant="primary"
              style={{ marginTop: 'var(--space-md)' }}
            >
              Continue
            </Button>
          </div>
        </Modal>
      </DemoSection>

      <DemoSection 
        title="Scrollable Content" 
        code={`<Modal title="Long Content">
  <!-- Modal body scrolls when content exceeds viewport -->
  <p>Lots of content...</p>
</Modal>`}
      >
        <Button onClick={() => setShowLongContent(true)}>Open Scrollable Modal</Button>
        <Modal 
          isOpen={showLongContent} 
          onClose={() => setShowLongContent(false)}
          title="Terms and Conditions"
        >
          <div>
            <h4>1. Introduction</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            
            <h4>2. User Agreement</h4>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <h4>3. Privacy Policy</h4>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            
            <h4>4. Terms of Service</h4>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            
            <h4>5. Additional Terms</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            
            <div style={{ 
              marginTop: 'var(--space-xl)',
              paddingTop: 'var(--space-lg)',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              gap: 'var(--space-sm)',
              justifyContent: 'flex-end'
            }}>
              <Button 
                variant="secondary"
                onClick={() => setShowLongContent(false)}
              >
                Decline
              </Button>
              <Button 
                variant="primary"
                onClick={() => setShowLongContent(false)}
              >
                Accept
              </Button>
            </div>
          </div>
        </Modal>
      </DemoSection>

      <DemoSection 
        title="Modal Props" 
        code={`interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  className?: string
  children: ReactNode
}`}
      >
        <div style={{ 
          background: 'var(--surface-secondary)', 
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h4>Available Props:</h4>
          <ul>
            <li><code>isOpen</code> - Controls modal visibility</li>
            <li><code>onClose</code> - Callback when modal should close</li>
            <li><code>title</code> - Optional header title</li>
            <li><code>size</code> - Preset sizes (small, medium, large, fullscreen)</li>
            <li><code>closeOnOverlayClick</code> - Click outside to close (default: true)</li>
            <li><code>closeOnEsc</code> - Press Escape to close (default: true)</li>
          </ul>
        </div>
      </DemoSection>
    </div>
  )
}