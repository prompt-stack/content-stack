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

const EXAMPLE_SUBJECT = "🚀 How I Built 36+ React Components with Zero Architectural Decay";
const EXAMPLE_CONTENT = `Hey there,

This week I shipped something I'm really proud of: a component library with 36+ reusable React components that actually stays maintainable.

Here's what makes it different:

**Strict 4-Layer Architecture**
Every component lives in one of four layers: Primitives → Composed → Features → Pages. Each layer can only import from layers below. No exceptions.

**Automated Validation**
I built audit scripts that run on every commit. They check:
• BEM naming conventions (100% compliance)
• Layer import restrictions
• Component metadata completeness
• TypeScript type safety

If you break the rules, the build fails. Architecture isn't optional—it's enforced.

**The Results**
After 3 months:
✅ Zero architectural decay
✅ AI assistants navigate the code easily
✅ New developers productive in minutes
✅ Refactoring is predictable and safe

The lesson? Good architecture + automated validation beats lengthy style guides every time.

Want to see the code? Reply to this email and I'll send you the GitHub link.

Keep building,
[Your Name]

P.S. What's your biggest challenge with component libraries? Hit reply and let me know!`;

export function NewsletterEditor() {
  const [subject, setSubject] = useState(EXAMPLE_SUBJECT);
  const [content, setContent] = useState(EXAMPLE_CONTENT);

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