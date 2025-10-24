/**
 * @file features/studio/components/InstagramEditor.tsx
 * @purpose Instagram content editor component
 * @layer feature-component
 * @deps [Textarea, Button, Dropzone]
 * @used-by [StudioFeature]
 * @css included in studio.css
 * @llm-read true
 * @llm-write full-edit
 */

import { useState } from 'react';
import { Textarea } from '../../../components/Textarea';
import { Button } from '../../../components/Button';
import { Dropzone } from '../../../components/Dropzone';

const EXAMPLE_CAPTION = `Just shipped a new feature! 🚀

Built a complete component library with 36+ reusable React components following strict BEM methodology. The architecture enforces a 4-layer system:

Primitives → Composed → Features → Pages

Each component has automated validation to prevent architectural decay. Clean code isn't just about formatting - it's about enforceability.

#ReactJS #WebDevelopment #ComponentLibrary #CleanCode #TypeScript #Frontend`;

export function InstagramEditor() {
  const [caption, setCaption] = useState(EXAMPLE_CAPTION);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [postType, setPostType] = useState<'post' | 'reel' | 'story'>('post');

  const handleImageUpload = (files: File[]) => {
    setImages(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Clean up old URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setImages(newImages);
    setPreviewUrls(newUrls);
  };

  return (
    <div className="instagram-editor">
      <div className="editor-header">
        <h2>Create Instagram Content</h2>
        <div className="post-type-selector">
          <Button
            variant={postType === 'post' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPostType('post')}
          >
            📷 Post
          </Button>
          <Button
            variant={postType === 'reel' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPostType('reel')}
          >
            🎬 Reel
          </Button>
          <Button
            variant={postType === 'story' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPostType('story')}
          >
            ⭕ Story
          </Button>
        </div>
      </div>

      <div className="instagram-composer">
        {/* Media Upload */}
        <div className="media-section">
          <h3>Media</h3>
          {previewUrls.length === 0 ? (
            <Dropzone
              onDrop={handleImageUpload}
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                'video/*': postType === 'reel' ? ['.mp4', '.mov'] : []
              }}
              maxFiles={postType === 'post' ? 10 : 1}
            >
              <div className="dropzone-content">
                <span className="upload-icon">📸</span>
                <p>Drop {postType === 'reel' ? 'video' : 'images'} here or click to upload</p>
                <p className="upload-hint">
                  {postType === 'post' && 'Up to 10 images'}
                  {postType === 'reel' && 'One video (up to 90 seconds)'}
                  {postType === 'story' && 'One image or video'}
                </p>
              </div>
            </Dropzone>
          ) : (
            <div className="media-grid">
              {previewUrls.map((url, index) => (
                <div key={index} className="media-preview">
                  <img src={url} alt={`Upload ${index + 1}`} />
                  <button
                    className="remove-media"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                  {index === 0 && images.length > 1 && (
                    <span className="cover-badge">Cover</span>
                  )}
                </div>
              ))}
              {images.length < (postType === 'post' ? 10 : 1) && (
                <Dropzone
                  onDrop={(files) => handleImageUpload([...images, ...files])}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                  maxFiles={1}
                >
                  <div className="add-more-media">
                    <span>+</span>
                  </div>
                </Dropzone>
              )}
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="caption-section">
          <h3>Caption</h3>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows={6}
            className="instagram-caption"
          />
          <div className="caption-hints">
            <span>💡 Use #hashtags</span>
            <span>👥 Tag people with @</span>
            <span>{caption.length}/2,200</span>
          </div>
        </div>

        {/* Preview */}
        <div className="instagram-preview">
          <h3>Preview</h3>
          <div className="phone-mockup">
            <div className="instagram-post">
              <div className="post-header">
                <div className="user-info">
                  <div className="avatar">👤</div>
                  <span className="username">your_username</span>
                </div>
                <span className="more-options">•••</span>
              </div>
              
              <div className="post-media">
                {previewUrls.length > 0 ? (
                  <>
                    <img src={previewUrls[0]} alt="Preview" />
                    {images.length > 1 && (
                      <div className="media-indicators">
                        {images.map((_, i) => (
                          <span key={i} className={`indicator ${i === 0 ? 'active' : ''}`} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-media">
                    <span>📷</span>
                    <p>Your media will appear here</p>
                  </div>
                )}
              </div>
              
              <div className="post-actions">
                <div className="left-actions">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>📤</span>
                </div>
                <span>🔖</span>
              </div>
              
              <div className="post-caption">
                <span className="username">your_username</span>
                <span className="caption-text">
                  {caption || 'Your caption will appear here...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-actions">
        <Button variant="outline">Save Draft</Button>
        <Button variant="primary">Publish</Button>
      </div>
    </div>
  );
}