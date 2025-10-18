/**
 * @file playground/SocialStudioPlayground.tsx
 * @purpose Interactive mockup of Prompt Stack Social Studio command center
 * @layer playground
 * @deps Box, Button, Card, Text, Badge
 * @used-by [PlaygroundPage]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role demo
 */

import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

interface ContentItem {
  id: string
  title: string
  type: 'twitter' | 'instagram' | 'tiktok' | 'blog' | 'linkedin'
  status: 'ready' | 'scheduled' | 'published' | 'draft'
  time: string
  metrics?: {
    reach?: string
    engagement?: string
    trend?: string
  }
}

export function SocialStudioPlayground() {
  const [activeContent, setActiveContent] = useState<string>('ai-thread')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter'])
  const [showAnalytics, setShowAnalytics] = useState(false)

  const contentItems: ContentItem[] = [
    {
      id: 'ai-thread',
      title: 'AI Revolution Thread',
      type: 'twitter',
      status: 'ready',
      time: 'Just now',
      metrics: { reach: '5.2k', engagement: '12%', trend: '#AI' }
    },
    {
      id: 'sunset-photo',
      title: 'Golden Hour Magic',
      type: 'instagram',
      status: 'ready',
      time: '5 min ago',
      metrics: { reach: '8.5k', engagement: '8.5%' }
    },
    {
      id: 'content-tips',
      title: 'Content Creation Tips',
      type: 'tiktok',
      status: 'draft',
      time: '1 hour ago'
    },
    {
      id: 'thought-leadership',
      title: 'Future of Content Creation',
      type: 'linkedin',
      status: 'scheduled',
      time: 'Tomorrow 2pm'
    }
  ]

  const platformIcons = {
    twitter: '🐦',
    instagram: '📷',
    tiktok: '🎵',
    blog: '📝',
    linkedin: '💼'
  }

  const platformColors = {
    twitter: '#1DA1F2',
    instagram: '#E4405F',
    tiktok: '#000000',
    blog: '#4CAF50',
    linkedin: '#0077B5'
  }

  const statusColors = {
    ready: 'var(--color-success)',
    scheduled: 'var(--color-warning)',
    published: 'var(--color-info)',
    draft: 'var(--color-neutral)'
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const activeItem = contentItems.find(item => item.id === activeContent)

  return (
    <div className="social-studio">
      {/* Header */}
      <Box className="studio-header" padding="md" display="flex" align="center" justify="between">
        <Box display="flex" align="center" gap="sm">
          <Text variant="h2" style={{ fontSize: '28px' }}>📚</Text>
          <div>
            <Text variant="h4" weight="semibold">Social Studio</Text>
            <Text variant="caption" style={{ fontSize: '12px' }}>Command Center for Multi-Platform Content</Text>
          </div>
        </Box>
        
        <Box display="flex" align="center" gap="sm">
          <Card variant="subtle" padding="xs" style={{ borderRadius: '16px' }}>
            <Box display="flex" align="center" gap="xs">
              <div style={{
                width: '6px',
                height: '6px',
                background: '#4CAF50',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
              <Text variant="caption" style={{ fontSize: '12px' }}>Synced with VS Code</Text>
            </Box>
          </Card>
          <Button variant="primary" size="sm" style={{ padding: '6px 12px', fontSize: '13px' }}>
            <i className="fas fa-plus" style={{ fontSize: '12px' }} /> Create in IDE
          </Button>
        </Box>
      </Box>

      <Box className="studio-layout" display="flex" style={{ height: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <Box className="studio-sidebar" style={{ width: '260px', background: 'var(--color-bg-secondary)', padding: '12px', overflowY: 'auto' }}>
          {/* URL Input */}
          <Box marginY="2">
            <Card variant="secondary" padding="xs" style={{ background: 'var(--color-bg-primary)' }}>
              <Box display="flex" align="center" gap="xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.5 }}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <input 
                  type="text"
                  placeholder="Paste URL here..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    color: 'var(--color-text-primary)',
                    padding: '4px 0'
                  }}
                />
              </Box>
            </Card>
          </Box>

          {/* Ready to Deploy */}
          <Box marginY="2">
            <Text variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px', opacity: 0.7 }}>
              Ready to Deploy
            </Text>
            <Box marginY="2">
              {contentItems.filter(item => item.status === 'ready').map(item => (
                <Card
                  key={item.id}
                  variant={activeContent === item.id ? 'primary' : 'secondary'}
                  padding="sm"
                  onClick={() => setActiveContent(item.id)}
                  style={{ 
                    cursor: 'pointer', 
                    marginBottom: '6px',
                    borderColor: activeContent === item.id ? platformColors[item.type] : undefined
                  }}
                >
                  <Box display="flex" align="center" gap="xs">
                    <Box 
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: `${platformColors[item.type]}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        flexShrink: 0
                      }}
                    >
                      {platformIcons[item.type]}
                    </Box>
                    <Box flex="1" style={{ minWidth: 0 }}>
                      <Text variant="caption" weight="medium" style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</Text>
                      <Text variant="caption" style={{ fontSize: '11px', opacity: 0.7 }}>{item.type} • {item.time}</Text>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Scheduled */}
          <Box marginY="2">
            <Text variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px', opacity: 0.7 }}>
              Scheduled
            </Text>
            <Box marginY="2">
              {contentItems.filter(item => item.status === 'scheduled').map(item => (
                <Card
                  key={item.id}
                  variant="secondary"
                  padding="sm"
                  onClick={() => setActiveContent(item.id)}
                  style={{ cursor: 'pointer', marginBottom: '6px' }}
                >
                  <Box display="flex" align="center" gap="xs">
                    <Box 
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'var(--color-warning-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        flexShrink: 0
                      }}
                    >
                      📅
                    </Box>
                    <Box flex="1" style={{ minWidth: 0 }}>
                      <Text variant="caption" weight="medium" style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</Text>
                      <Text variant="caption" style={{ fontSize: '11px', opacity: 0.7 }}>{item.time}</Text>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Drafts */}
          <Box marginY="2">
            <Text variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px', opacity: 0.7 }}>
              Drafts
            </Text>
            <Box marginY="2">
              {contentItems.filter(item => item.status === 'draft').length > 0 ? (
                contentItems.filter(item => item.status === 'draft').map(item => (
                  <Card
                    key={item.id}
                    variant="secondary"
                    padding="sm"
                    onClick={() => setActiveContent(item.id)}
                    style={{ cursor: 'pointer', marginBottom: '6px', opacity: 0.7 }}
                  >
                    <Box display="flex" align="center" gap="xs">
                      <Box 
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'var(--color-bg-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          flexShrink: 0
                        }}
                      >
                        ✏️
                      </Box>
                      <Box flex="1" style={{ minWidth: 0 }}>
                        <Text variant="caption" weight="medium" style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</Text>
                        <Text variant="caption" style={{ fontSize: '11px', opacity: 0.7 }}>{item.type} • {item.time}</Text>
                      </Box>
                    </Box>
                  </Card>
                ))
              ) : (
                <Text variant="caption" color="secondary" align="center" style={{ padding: '12px', fontSize: '12px' }}>
                  No drafts
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box flex="1" className="studio-content" padding="lg" style={{ background: 'var(--color-bg-primary)', overflowY: 'auto' }}>
          {activeItem && (
            <>
              {/* Content Header */}
              <Card padding="lg" marginY="3">
                <Box display="flex" align="center" justify="between">
                  <Box>
                    <Text variant="h3">{activeItem.title}</Text>
                    <Box display="flex" align="center" gap="md" marginY="2">
                      <Box display="flex" align="center" gap="sm">
                        <div style={{
                          width: '8px',
                          height: '8px',
                          background: statusColors[activeItem.status],
                          borderRadius: '50%'
                        }} />
                        <Text variant="body-sm" transform="capitalize">{activeItem.status}</Text>
                      </Box>
                      {activeItem.metrics && (
                        <>
                          <Text variant="body-sm">📊 Est. reach: {activeItem.metrics.reach}</Text>
                          <Text variant="body-sm">💹 Engagement: {activeItem.metrics.engagement}</Text>
                          {activeItem.metrics.trend && (
                            <Text variant="body-sm">🔥 Trending: {activeItem.metrics.trend}</Text>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                  <Button variant="secondary" size="sm" onClick={() => setShowAnalytics(!showAnalytics)}>
                    <i className="fas fa-chart-line" /> Analytics
                  </Button>
                </Box>
              </Card>

              {/* Platform Preview */}
              {activeItem.type === 'twitter' && (
                <Card padding="xl" marginY="3">
                  <Text variant="h4" marginY="3">Twitter Thread Preview</Text>
                  
                  {/* Tweet 1 */}
                  <Card variant="secondary" padding="lg" marginY="3">
                    <Box display="flex" gap="md">
                      <Box 
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: platformColors.twitter,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}
                      >
                        PS
                      </Box>
                      <Box flex="1">
                        <Box display="flex" align="center" gap="sm">
                          <Text weight="bold">Prompt Stack</Text>
                          <Text variant="body-sm" color="secondary">@promptstack</Text>
                        </Box>
                        <Text marginY="2">
                          🚀 AI is transforming content creation! We're moving from manual workflows to intelligent automation that understands context and intent.
                          <br /><br />
                          Thread 👇 (1/3)
                        </Text>
                        <Box display="flex" gap="xl" marginY="3">
                          <Text variant="body-sm" color="secondary">💬 Reply</Text>
                          <Text variant="body-sm" color="secondary">🔁 Retweet</Text>
                          <Text variant="body-sm" color="secondary">❤️ Like</Text>
                          <Text variant="body-sm" color="secondary">📊 Analytics</Text>
                        </Box>
                      </Box>
                    </Box>
                  </Card>

                  {/* Thread connector */}
                  <Box display="flex" justify="center" marginY="2">
                    <div style={{ width: '2px', height: '30px', background: 'var(--color-border)' }} />
                  </Box>

                  {/* Tweet 2 */}
                  <Card variant="secondary" padding="lg" marginY="3">
                    <Box display="flex" gap="md">
                      <Box 
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: platformColors.twitter,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}
                      >
                        PS
                      </Box>
                      <Box flex="1">
                        <Box display="flex" align="center" gap="sm">
                          <Text weight="bold">Prompt Stack</Text>
                          <Text variant="body-sm" color="secondary">@promptstack</Text>
                        </Box>
                        <Text marginY="2">
                          IDEs aren't just for code anymore. Imagine using the same powerful environment for:
                          <br /><br />
                          ✅ Writing scripts<br />
                          ✅ Creating social content<br />
                          ✅ Managing campaigns<br />
                          ✅ Automating distribution
                          <br /><br />
                          All with simple commands! (2/3)
                        </Text>
                        <Box display="flex" gap="xl" marginY="3">
                          <Text variant="body-sm" color="secondary">💬 Reply</Text>
                          <Text variant="body-sm" color="secondary">🔁 Retweet</Text>
                          <Text variant="body-sm" color="secondary">❤️ Like</Text>
                          <Text variant="body-sm" color="secondary">📊 Analytics</Text>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Card>
              )}

              {activeItem.type === 'instagram' && (
                <Card padding="xl" marginY="3">
                  <Text variant="h4" marginY="3">Instagram Post Preview</Text>
                  
                  <Card variant="secondary" padding="none" style={{ overflow: 'hidden' }}>
                    {/* IG Header */}
                    <Box padding="md" display="flex" align="center" justify="between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <Box display="flex" align="center" gap="md">
                        <Box 
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: platformColors.instagram,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          PS
                        </Box>
                        <div>
                          <Text weight="bold">promptstack</Text>
                          <Text variant="caption">San Francisco, CA</Text>
                        </div>
                      </Box>
                      <Text>•••</Text>
                    </Box>

                    {/* IG Image */}
                    <Box 
                      style={{
                        height: '400px',
                        background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '100px'
                      }}
                    >
                      🌅
                    </Box>

                    {/* IG Actions & Caption */}
                    <Box padding="md">
                      <Box display="flex" gap="md" marginY="2" style={{ fontSize: '24px' }}>
                        <span>❤️</span>
                        <span>💬</span>
                        <span>📤</span>
                        <span style={{ marginLeft: 'auto' }}>🔖</span>
                      </Box>
                      <Text>
                        <strong>promptstack</strong> Capturing the magic of golden hour 🌅✨
                        <br /><br />
                        There's something special about watching the day transform into night...
                        <br /><br />
                        #sunset #goldenhour #nature #photography
                      </Text>
                    </Box>
                  </Card>
                </Card>
              )}
            </>
          )}

          {/* Analytics Panel (when toggled) */}
          {showAnalytics && activeItem && (
            <Card padding="lg" marginY="3">
              <Text variant="h4" marginY="3">Performance Analytics</Text>
              <Box display="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <Card variant="subtle" padding="md">
                  <Text variant="caption">Predicted Reach</Text>
                  <Text variant="h3">{activeItem.metrics?.reach || 'N/A'}</Text>
                </Card>
                <Card variant="subtle" padding="md">
                  <Text variant="caption">Engagement Rate</Text>
                  <Text variant="h3">{activeItem.metrics?.engagement || 'N/A'}</Text>
                </Card>
                <Card variant="subtle" padding="md">
                  <Text variant="caption">Best Time</Text>
                  <Text variant="h3">2:00 PM</Text>
                </Card>
                <Card variant="subtle" padding="md">
                  <Text variant="caption">Trending Topics</Text>
                  <Text variant="h3">{activeItem.metrics?.trend || 'None'}</Text>
                </Card>
              </Box>
            </Card>
          )}
        </Box>

        {/* Action Panel */}
        <Box className="studio-actions" style={{ width: '280px', background: 'var(--color-bg-secondary)', padding: '16px', overflowY: 'auto' }}>
          <Text variant="body" weight="semibold" marginY="2" style={{ fontSize: '15px' }}>Deployment Options</Text>

          {/* Schedule */}
          <Box marginY="3">
            <Text variant="body-sm" weight="medium" marginY="1" style={{ fontSize: '13px' }}>Schedule</Text>
            <input 
              type="datetime-local" 
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                background: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
                fontSize: '13px'
              }}
            />
            <Box marginY="1">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" defaultChecked style={{ width: '14px', height: '14px' }} />
                <Text variant="caption" style={{ fontSize: '12px' }}>Post at optimal time</Text>
              </label>
            </Box>
          </Box>

          {/* Cross-post Options */}
          <Box marginY="3">
            <Text variant="body-sm" weight="medium" marginY="1" style={{ fontSize: '13px' }}>Cross-post to</Text>
            <Box display="flex" direction="column" gap="xs">
              {Object.entries(platformIcons).map(([platform, icon]) => (
                <Card
                  key={platform}
                  variant="secondary"
                  padding="sm"
                  onClick={() => togglePlatform(platform)}
                  style={{ cursor: 'pointer' }}
                >
                  <Box display="flex" align="center" justify="between">
                    <Box display="flex" align="center" gap="xs">
                      <Text style={{ fontSize: '14px' }}>{icon}</Text>
                      <Text variant="caption" transform="capitalize" style={{ fontSize: '13px' }}>{platform}</Text>
                    </Box>
                    <div style={{
                      width: '36px',
                      height: '20px',
                      background: selectedPlatforms.includes(platform) ? platformColors[platform as keyof typeof platformColors] : 'var(--color-bg-tertiary)',
                      borderRadius: '10px',
                      position: 'relative',
                      transition: 'background 0.3s'
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        background: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: selectedPlatforms.includes(platform) ? '18px' : '2px',
                        transition: 'left 0.3s'
                      }} />
                    </div>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box marginY="3">
            <Button variant="primary" fullWidth marginY="1" size="sm" style={{ fontSize: '13px', padding: '8px' }}>
              🚀 Deploy Now
            </Button>
            <Button variant="secondary" fullWidth marginY="1" size="sm" style={{ fontSize: '13px', padding: '8px' }}>
              📅 Schedule Post
            </Button>
            <Button variant="secondary" fullWidth marginY="1" size="sm" style={{ fontSize: '13px', padding: '8px' }}>
              ✏️ Edit in VS Code
            </Button>
          </Box>

          {/* Source Info */}
          <Box marginY="3">
            <Text variant="body-sm" weight="medium" marginY="1" style={{ fontSize: '13px' }}>Source File</Text>
            <Card variant="subtle" padding="sm">
              <Text variant="caption" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                ~/content/social/ai-revolution.md
              </Text>
              <Text variant="caption" style={{ fontSize: '11px', opacity: 0.7 }}>Last synced: Just now</Text>
            </Card>
          </Box>

          {/* Command Preview */}
          <Box marginY="3">
            <Text variant="body-sm" weight="medium" marginY="1" style={{ fontSize: '13px' }}>Terminal Command</Text>
            <Card variant="subtle" padding="sm" style={{ background: 'var(--color-bg-tertiary)' }}>
              <code style={{ fontSize: '11px', color: 'var(--color-plasma)' }}>
                add PS {activeItem?.title.toLowerCase().replace(/\s+/g, '-')}.md → {selectedPlatforms.join(', ')}
              </code>
            </Card>
          </Box>
        </Box>
      </Box>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .social-studio {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--color-bg-primary);
        }

        .studio-header {
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
        }

        .studio-layout {
          flex: 1;
          overflow: hidden;
        }

        .studio-sidebar {
          border-right: 1px solid var(--color-border);
          overflow-y: auto;
        }

        .studio-content {
          overflow-y: auto;
        }

        .studio-actions {
          border-left: 1px solid var(--color-border);
          overflow-y: auto;
        }

        input[type="datetime-local"] {
          font-family: inherit;
        }

        input[type="checkbox"] {
          cursor: pointer;
        }

        code {
          font-family: 'Fira Code', 'Consolas', monospace;
        }
      `}</style>
    </div>
  )
}