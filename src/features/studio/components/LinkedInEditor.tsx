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

const EXAMPLE_POST = `🚀 Excited to share my latest project: A production-ready component library with 36+ reusable React components!

Key achievements:
✅ Strict 4-layer architecture (Primitives → Composed → Features → Pages)
✅ BEM methodology with automated validation
✅ 100% TypeScript with comprehensive type safety
✅ Component playground for interactive testing
✅ Automated audit scripts to prevent architectural decay

What I learned:
• Architecture matters more than individual components
• Enforceability > documentation
• Layer isolation prevents technical debt
• AI-assisted development works best with clear patterns

The challenge wasn't building components—it was building a system that stays maintainable at scale.

Check out the live demo and source code in the comments! 👇

#ReactJS #WebDevelopment #SoftwareEngineering #Frontend #TypeScript #ComponentLibrary #CleanCode`;

export function LinkedInEditor() {
  const [content, setContent] = useState(EXAMPLE_POST);

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