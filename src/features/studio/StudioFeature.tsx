/**
 * @file features/studio/StudioFeature.tsx
 * @purpose Multi-channel content creation studio feature
 * @layer feature
 * @deps [Tab components, platform editors]
 * @used-by [StudioPage]
 * @css features/studio.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role content-creation
 */

import { useState } from 'react';
import { TwitterEditor } from './components/TwitterEditor';
import { InstagramEditor } from './components/InstagramEditor';
import { TikTokEditor } from './components/TikTokEditor';
import { SubstackEditor } from './components/SubstackEditor';
import { LinkedInEditor } from './components/LinkedInEditor';
import { NewsletterEditor } from './components/NewsletterEditor';
import { ArticleEditor } from './components/ArticleEditor';
import '../../styles/features/studio.css';

type Platform = 'twitter' | 'instagram' | 'tiktok' | 'substack' | 'linkedin' | 'newsletter' | 'article';

interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  color: string;
}

const platforms: PlatformConfig[] = [
  { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2' },
  { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
  { id: 'substack', name: 'Substack', icon: 'fas fa-rss', color: '#FF6719' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0A66C2' },
  { id: 'newsletter', name: 'Newsletter', icon: 'fas fa-envelope', color: '#6366F1' },
  { id: 'article', name: 'Article', icon: 'fas fa-newspaper', color: '#10B981' }
];

export function StudioFeature() {
  const [activePlatform, setActivePlatform] = useState<Platform>('twitter');

  const renderEditor = () => {
    switch (activePlatform) {
      case 'twitter':
        return <TwitterEditor />;
      case 'instagram':
        return <InstagramEditor />;
      case 'tiktok':
        return <TikTokEditor />;
      case 'substack':
        return <SubstackEditor />;
      case 'linkedin':
        return <LinkedInEditor />;
      case 'newsletter':
        return <NewsletterEditor />;
      case 'article':
        return <ArticleEditor />;
      default:
        return <TwitterEditor />;
    }
  };

  return (
    <div className="studio-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%'
    }}>
      {/* Tab Navigation */}
      <div className="studio-tabs" style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '16px', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        overflowX: 'auto',
        flexShrink: 0
      }}>
        {platforms.map((platform) => (
          <button
            key={platform.id}
            className={`studio-tab ${activePlatform === platform.id ? 'active' : ''}`}
            onClick={() => setActivePlatform(platform.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: activePlatform === platform.id ? platform.color : 'transparent',
              color: activePlatform === platform.id ? 'white' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: activePlatform === platform.id ? '600' : '400',
              whiteSpace: 'nowrap',
              '--tab-color': platform.color
            } as React.CSSProperties}
          >
            <i className={`${platform.icon} studio-tab-icon`} style={{ fontSize: '16px' }} />
            <span className="studio-tab-name">{platform.name}</span>
          </button>
        ))}
      </div>

      {/* Content Editor Area */}
      <div className="studio-content" style={{ 
        flex: 1, 
        padding: '24px',
        backgroundColor: '#f9fafb',
        minHeight: 0,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="studio-editor-wrapper" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {renderEditor()}
        </div>
      </div>
    </div>
  );
}