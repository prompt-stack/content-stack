/**
 * @file features/studio/components/LinkedInEditor.tsx
 * @purpose LinkedIn post editor component
 * @layer feature-component
 * @deps [Textarea, Button]
 * @used-by [StudioFeature]
 * @css included in studio.css
 * @llm-read true
 * @llm-write full-edit
 */

import { useState } from 'react';
import { Textarea } from '../../../components/Textarea';
import { Button } from '../../../components/Button';

export function LinkedInEditor() {
  const [content, setContent] = useState('');

  return (
    <div className="linkedin-editor" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="editor-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Create LinkedIn Post</h2>
      </div>

      <div className="linkedin-composer" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What would you like to share?"
          rows={8}
          className="linkedin-textarea"
          style={{ width: '100%', resize: 'vertical', fontSize: '16px', lineHeight: '1.5' }}
        />
        <div className="post-options" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="small">📷 Photo</Button>
          <Button variant="secondary" size="small">🎥 Video</Button>
          <Button variant="secondary" size="small">📄 Document</Button>
          <Button variant="secondary" size="small">🎉 Event</Button>
        </div>
      </div>

      <div className="editor-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <Button variant="secondary">Save Draft</Button>
        <Button variant="primary">Post</Button>
      </div>
    </div>
  );
}