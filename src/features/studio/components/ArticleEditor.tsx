/**
 * @file features/studio/components/ArticleEditor.tsx
 * @purpose Generic article editor component
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

export function ArticleEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="article-editor" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="editor-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Write Article</h2>
      </div>

      <div className="article-composer" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title..."
          className="article-title-input"
          style={{ width: '100%', fontSize: '24px', fontWeight: '600' }}
        />
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          rows={15}
          className="article-textarea"
          style={{ width: '100%', resize: 'vertical', lineHeight: '1.6' }}
        />
      </div>

      <div className="editor-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button variant="secondary">Save Draft</Button>
        <Button variant="primary">Publish</Button>
      </div>
    </div>
  );
}