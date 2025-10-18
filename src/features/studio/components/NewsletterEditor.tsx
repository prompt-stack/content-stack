/**
 * @file features/studio/components/NewsletterEditor.tsx
 * @purpose Newsletter editor component
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

export function NewsletterEditor() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="newsletter-editor" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="editor-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Create Newsletter</h2>
      </div>

      <div className="newsletter-composer" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email subject line..."
          className="subject-input"
          style={{ width: '100%', fontSize: '18px', fontWeight: '500' }}
        />
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your newsletter..."
          rows={15}
          className="newsletter-textarea"
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div className="editor-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button variant="secondary">Save Draft</Button>
        <Button variant="primary">Send Newsletter</Button>
      </div>
    </div>
  );
}