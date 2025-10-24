/**
 * @file features/studio/components/TikTokEditor.tsx
 * @purpose TikTok content editor component
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

const EXAMPLE_CAPTION = `POV: You built a component library with 36+ components and strict BEM validation 🚀

Watch me explain the 4-layer architecture that prevents spaghetti code!

Primitives → Composed → Features → Pages

Each layer can only import from below = clean code guaranteed ✨

#WebDev #ReactJS #Programming #CodeTok #TechTok #Developer #Frontend #CleanCode #fyp`;

const EXAMPLE_SOUND = "original sound - Tech Tutorials";

export function TikTokEditor() {
  const [caption, setCaption] = useState(EXAMPLE_CAPTION);
  const [sounds, setSounds] = useState(EXAMPLE_SOUND);
  const [hashtags, setHashtags] = useState<string[]>([]);

  return (
    <div className="tiktok-editor">
      <div className="editor-header">
        <h2>Create TikTok</h2>
      </div>

      <div className="tiktok-composer">
        <div className="video-section">
          <div className="video-placeholder">
            <span className="tiktok-icon">🎵</span>
            <h3>Video Upload</h3>
            <p>Upload your video (up to 10 minutes)</p>
            <Button variant="outline">Choose Video</Button>
          </div>
        </div>

        <div className="caption-section">
          <h3>Caption</h3>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Describe your video... #fyp #viral"
            rows={4}
            maxLength={2200}
          />
          <div className="caption-info">
            <span>{caption.length}/2,200</span>
          </div>
        </div>

        <div className="sounds-section">
          <h3>Sounds</h3>
          <input
            type="text"
            value={sounds}
            onChange={(e) => setSounds(e.target.value)}
            placeholder="Add sound or original audio"
            className="sound-input"
          />
        </div>

        <div className="hashtags-section">
          <h3>Trending Hashtags</h3>
          <div className="trending-tags">
            <span className="tag">#fyp</span>
            <span className="tag">#viral</span>
            <span className="tag">#foryou</span>
            <span className="tag">#trending</span>
            <span className="tag">#tiktok</span>
          </div>
        </div>
      </div>

      <div className="editor-actions">
        <Button variant="outline">Save Draft</Button>
        <Button variant="primary">Post Video</Button>
      </div>
    </div>
  );
}