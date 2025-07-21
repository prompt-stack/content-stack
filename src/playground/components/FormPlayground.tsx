/**
 * @file playground/components/FormPlayground.tsx
 * @purpose [TODO: Add purpose]
 * @layer unknown
 * @deps none
 * @used-by [PlaygroundPage]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 */

import { useState } from 'react'
import { Button } from '@/components/Button'
import { Dropzone } from '@/components/Dropzone'
import { DemoSection } from '../PlaygroundLayout'

export function FormPlayground() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className="playground__component">
      <h2>Form Components</h2>
      <p className="playground__component-description">
        Form inputs, controls, and specialized components.
      </p>

      <DemoSection 
        title="Text Inputs" 
        code={`<input 
  type="text" 
  className="input" 
  placeholder="Enter text..."
/>

<input 
  type="email" 
  className="input input--error" 
  placeholder="Invalid email"
/>`}
      >
        <div className="form-group">
          <label>Standard Input</label>
          <input 
            type="text" 
            className="input" 
            placeholder="Enter text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>With Error State</label>
          <input 
            type="email" 
            className="input input--error" 
            placeholder="Invalid email"
            defaultValue="not-an-email"
          />
          <span className="input-error">Please enter a valid email</span>
        </div>

        <div className="form-group">
          <label>Disabled Input</label>
          <input 
            type="text" 
            className="input" 
            placeholder="Disabled"
            disabled
          />
        </div>
      </DemoSection>

      <DemoSection 
        title="Input with Icons" 
        code={`<div className="input-group">
  <i className="fas fa-search input-group__icon"></i>
  <input type="text" className="input" placeholder="Search...">
</div>`}
      >
        <div className="form-group">
          <label>Search Input</label>
          <div className="input-group__wrapper">
            <i className="fas fa-search input-group__icon"></i>
            <input 
              type="text" 
              className="input" 
              placeholder="Search..."
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Password Input</label>
          <div className="input-group__wrapper">
            <i className="fas fa-lock input-group__icon"></i>
            <input 
              type="password" 
              className="input" 
              placeholder="Enter password..."
            />
          </div>
        </div>
      </DemoSection>

      <DemoSection 
        title="Textarea" 
        code={`<textarea 
  className="input" 
  rows={4} 
  placeholder="Enter description..."
></textarea>`}
      >
        <div className="form-group">
          <label>Description</label>
          <textarea 
            className="input" 
            rows={4} 
            placeholder="Enter description..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
          <span className="input-hint">{textareaValue.length} characters</span>
        </div>
      </DemoSection>

      <DemoSection 
        title="Select Dropdown" 
        code={`<select className="input">
  <option value="">Choose an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>`}
      >
        <div className="form-group">
          <label>Category</label>
          <select 
            className="input" 
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <option value="">Choose a category</option>
            <option value="tech">Technology</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
          </select>
        </div>
      </DemoSection>

      <DemoSection 
        title="Checkboxes & Radios" 
        code={`<label className="checkbox-label">
  <input type="checkbox" />
  <span>Accept terms</span>
</label>

<label className="radio-label">
  <input type="radio" name="option" />
  <span>Option 1</span>
</label>`}
      >
        <div className="form-group">
          <label>Preferences</label>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={checkboxValue}
              onChange={(e) => setCheckboxValue(e.target.checked)}
            />
            <span>Send me updates</span>
          </label>
        </div>
        
        <div className="form-group">
          <label>Select Option</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="radio-label">
              <input 
                type="radio" 
                name="demo-option" 
                value="option1"
                checked={radioValue === 'option1'}
                onChange={(e) => setRadioValue(e.target.value)}
              />
              <span>Option 1</span>
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="demo-option" 
                value="option2"
                checked={radioValue === 'option2'}
                onChange={(e) => setRadioValue(e.target.value)}
              />
              <span>Option 2</span>
            </label>
          </div>
        </div>
      </DemoSection>

      <DemoSection 
        title="Input with Button" 
        code={`<div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
  <input type="text" className="input" placeholder="Enter URL..." style={{ flex: 1 }} />
  <Button variant="primary" size="xs">Extract</Button>
</div>`}
      >
        <div className="form-group">
          <label>Input + Button Combination</label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Paste a URL to extract content..."
              style={{ flex: 1 }}
            />
            <Button variant="primary" size="xs">Extract</Button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Search Example</label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <input 
              type="search" 
              className="input" 
              placeholder="Search content..."
              style={{ flex: 1 }}
            />
            <Button icon="search" size="xs">Search</Button>
          </div>
        </div>
      </DemoSection>

      <DemoSection 
        title="Dropzone Component" 
        code={`<Dropzone onDrop={(files) => console.log(files)}>
  <div className="dropzone-content">
    <i className="fas fa-cloud-upload-alt"></i>
    <p>Drop files here</p>
  </div>
</Dropzone>`}
      >
        <Dropzone onDrop={(droppedFiles) => {
          setFiles(droppedFiles)
          console.log('Dropped files:', droppedFiles)
        }}>
          <div className="dropzone-content">
            <i className="fas fa-cloud-upload-alt dropzone-icon"></i>
            <p className="dropzone-text">Drop files here or click to browse</p>
            <p className="dropzone-hint">Supports images, documents, and archives</p>
            {files.length > 0 && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <p className="text-sm text-secondary">
                  {files.length} file(s) selected
                </p>
              </div>
            )}
          </div>
        </Dropzone>
      </DemoSection>

      <DemoSection 
        title="Form Layout Example" 
        code={`<form className="form">
  <div className="form-row">
    <div className="form-group">
      <label>First Name</label>
      <input type="text" className="input" />
    </div>
    <div className="form-group">
      <label>Last Name</label>
      <input type="text" className="input" />
    </div>
  </div>
  <Button type="submit">Submit</Button>
</form>`}
      >
        <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: '500px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" className="input" placeholder="John" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" className="input" placeholder="Doe" />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="input" placeholder="john@example.com" />
          </div>
          
          <div className="form-group">
            <label>Message</label>
            <textarea className="input" rows={3} placeholder="Your message..." />
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <Button type="submit" variant="primary">Submit Form</Button>
            <Button type="button" variant="secondary" style={{ marginLeft: '0.5rem' }}>
              Cancel
            </Button>
          </div>
        </form>
      </DemoSection>
    </div>
  )
}
