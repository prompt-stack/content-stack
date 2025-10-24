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

const EXAMPLE_TITLE = "The 4-Layer Architecture Pattern for Scalable React Applications";
const EXAMPLE_CONTENT = `Introduction

Building maintainable React applications at scale requires more than just writing clean components. It requires architectural patterns that prevent code from becoming spaghetti over time.

After building a component library with 36+ reusable components, I've refined a 4-layer architecture pattern that enforces clean boundaries and prevents architectural decay.

Layer 1: Primitives

The foundation. These are atomic components that map directly to HTML elements or basic UI patterns:
- Button, Input, Card, Modal, Dropdown
- Zero dependencies on other components
- Highly reusable and generic
- Fully tested and documented

Layer 2: Composed Components

Built by combining primitives. These components handle common UI patterns:
- EditableField (Input + Button)
- ProgressIndicator (multiple primitives)
- FilterPanel (Select + Input + Button)
- Can only import from Layer 1

Layer 3: Features

Business logic lives here. Feature components orchestrate multiple composed components:
- ContentInbox (complete feature with state management)
- StudioEditor (multi-platform content creation)
- Can import from Layers 1 and 2

Layer 4: Pages

Full page components that combine features:
- InboxPage, PlaygroundPage, StudioPage
- Handle routing and page-level state
- Can import from any lower layer

Automated Enforcement

The key insight: Architecture without enforcement is just documentation.

I built audit scripts that validate:
✅ Import restrictions (layers can only import from below)
✅ Naming conventions (BEM methodology)
✅ Component metadata (purpose, dependencies, usage)
✅ TypeScript compliance

Benefits

After 3 months of development:
- Zero architectural violations
- AI assistants can navigate the codebase
- New developers productive immediately
- Refactoring is predictable and safe

Conclusion

Good architecture isn't about following rules—it's about enforcing them automatically. Build systems that make it hard to do the wrong thing.`;

export function ArticleEditor() {
  const [title, setTitle] = useState(EXAMPLE_TITLE);
  const [content, setContent] = useState(EXAMPLE_CONTENT);

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