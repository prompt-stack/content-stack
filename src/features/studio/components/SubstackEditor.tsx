/**
 * @file features/studio/components/SubstackEditor.tsx
 * @purpose Substack article editor component
 * @layer feature-component
 * @deps [Textarea, Input, Button]
 * @used-by [StudioFeature]
 * @css included in studio.css
 * @llm-read true
 * @llm-write full-edit
 */

import { useState } from 'react';
import { Textarea } from '../../../components/Textarea';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

export function SubstackEditor() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="substack-editor" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="editor-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Write Substack Article</h2>
        <Button 
          variant="secondary" 
          size="small"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      <div className="substack-composer" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="article-header-section" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="article-title-input"
            style={{ fontSize: '28px', fontWeight: '700', border: 'none', borderBottom: '2px solid #e5e7eb', padding: '8px 0' }}
          />
          
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle (optional)..."
            className="article-subtitle-input"
            style={{ fontSize: '18px', color: '#6b7280', border: 'none', borderBottom: '1px solid #e5e7eb', padding: '8px 0' }}
          />
        </div>

        <div className="article-content-section" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="writing-toolbar" style={{ display: 'flex', gap: '4px', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <button className="toolbar-btn" style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', borderRadius: '4px' }}>B</button>
            <button className="toolbar-btn" style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontStyle: 'italic', borderRadius: '4px' }}>I</button>
            <button className="toolbar-btn" style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', textDecoration: 'underline', borderRadius: '4px' }}>U</button>
            <span className="toolbar-divider" style={{ color: '#d1d5db', margin: '0 4px' }}>|</span>
            <button className="toolbar-btn" style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', borderRadius: '4px' }}>H1</button>
            <button className="toolbar-btn" style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', borderRadius: '4px' }}>H2</button>
            <span className="toolbar-divider" style={{ color: '#d1d5db', margin: '0 4px' }}>|</span>
            <button className="toolbar-btn" style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', borderRadius: '4px' }}>🔗</button>
            <button className="toolbar-btn" style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', borderRadius: '4px' }}>📷</button>
            <button className="toolbar-btn" style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', borderRadius: '4px' }}>💬</button>
          </div>
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your article..."
            rows={showPreview ? 10 : 20}
            className="article-editor"
            style={{ width: '100%', resize: 'vertical', fontSize: '16px', lineHeight: '1.8' }}
          />
        </div>

        {showPreview && (
          <div className="article-preview" style={{ 
          backgroundColor: '#f9fafb', 
          padding: '24px', 
          borderRadius: '8px',
          marginTop: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#6b7280' }}>Preview</h3>
          <div className="substack-preview" style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '680px',
            margin: '0 auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h1 className="preview-title" style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#111827'
            }}>{title || 'Your Article Title'}</h1>
            {subtitle && <h2 className="preview-subtitle" style={{
              fontSize: '20px',
              fontWeight: '400',
              color: '#6b7280',
              marginBottom: '16px'
            }}>{subtitle}</h2>}
            <div className="preview-meta" style={{
              display: 'flex',
              gap: '8px',
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '24px'
            }}>
              <span>Your Name</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="preview-content" style={{
              fontSize: '16px',
              lineHeight: '1.7',
              color: '#374151',
              whiteSpace: 'pre-wrap'
            }}>
              {content || 'Your article content will appear here...'}
            </div>
          </div>
        </div>
        )}
      </div>

      <div className="editor-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <Button variant="secondary">Save Draft</Button>
        <Button variant="primary">Publish</Button>
      </div>
    </div>
  );
}