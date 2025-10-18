/**
 * @file playground/CloudDeploymentPlayground.tsx
 * @purpose Interactive demo of Prompt Stack cloud deployment architecture
 * @layer playground
 * @deps Box, Button, Card, Text
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

export function CloudDeploymentPlayground() {
  const [activeFlow, setActiveFlow] = useState<string>('overview')
  const [deploymentStage, setDeploymentStage] = useState<number>(0)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter'])

  const deploymentStages = [
    { id: 'local', label: 'Local IDE', icon: '💻', description: 'Create content in VS Code' },
    { id: 'process', label: 'AI Processing', icon: '🤖', description: 'Transform for platforms' },
    { id: 'preview', label: 'Cloud Preview', icon: '☁️', description: 'Review & optimize' },
    { id: 'deploy', label: 'Deploy', icon: '🚀', description: 'Publish to platforms' }
  ]

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077B5' },
    { id: 'blog', name: 'Blog', icon: '📝', color: '#4CAF50' }
  ]

  const handleDeploy = () => {
    if (deploymentStage < deploymentStages.length - 1) {
      setDeploymentStage(deploymentStage + 1)
    }
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  return (
    <div className="playground__component">
      <Box className="playground__header">
        <h2>Prompt Stack Cloud Deployment Architecture</h2>
        <Text variant="body" marginY="3">
          Experience how content flows from your IDE to multiple platforms through our cloud infrastructure
        </Text>
      </Box>

      {/* Navigation Tabs */}
      <Box display="flex" gap="sm" marginY="4">
        <Button
          variant={activeFlow === 'overview' ? 'primary' : 'secondary'}
          onClick={() => setActiveFlow('overview')}
          size="sm"
        >
          System Overview
        </Button>
        <Button
          variant={activeFlow === 'workflow' ? 'primary' : 'secondary'}
          onClick={() => setActiveFlow('workflow')}
          size="sm"
        >
          Deployment Flow
        </Button>
        <Button
          variant={activeFlow === 'platforms' ? 'primary' : 'secondary'}
          onClick={() => setActiveFlow('platforms')}
          size="sm"
        >
          Platform Config
        </Button>
      </Box>

      {/* Overview Section */}
      {activeFlow === 'overview' && (
        <Box className="cloud-demo__overview">
          <Card padding="xl">
            <Text variant="h3" marginY="3">The IDE-to-Cloud Pipeline</Text>
            
            <Box className="architecture-diagram" marginY="4">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginTop: '20px'
              }}>
                {/* Local Layer */}
                <Card variant="secondary" padding="lg">
                  <Text variant="h4" align="center">🏠 Local Layer</Text>
                  <Box marginY="3">
                    <Text variant="body-sm">• VS Code/Cursor IDE</Text>
                    <Text variant="body-sm">• File-based content</Text>
                    <Text variant="body-sm">• Git version control</Text>
                    <Text variant="body-sm">• Terminal agents</Text>
                  </Box>
                </Card>

                {/* Cloud Processing */}
                <Card variant="secondary" padding="lg">
                  <Text variant="h4" align="center">☁️ Cloud Layer</Text>
                  <Box marginY="3">
                    <Text variant="body-sm">• AI transformation</Text>
                    <Text variant="body-sm">• Platform optimization</Text>
                    <Text variant="body-sm">• Preview & scheduling</Text>
                    <Text variant="body-sm">• Analytics dashboard</Text>
                  </Box>
                </Card>

                {/* Platform Deployment */}
                <Card variant="secondary" padding="lg">
                  <Text variant="h4" align="center">🌐 Platform Layer</Text>
                  <Box marginY="3">
                    <Text variant="body-sm">• Multi-platform posting</Text>
                    <Text variant="body-sm">• API integrations</Text>
                    <Text variant="body-sm">• Performance tracking</Text>
                    <Text variant="body-sm">• Engagement metrics</Text>
                  </Box>
                </Card>
              </div>
            </Box>

            <Box className="key-features" marginY="4">
              <Text variant="h4" marginY="3">Key Features</Text>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <Card variant="subtle" padding="md">
                  <Text variant="body-sm">
                    <strong>🔄 Bi-directional Sync:</strong> Changes in IDE reflect instantly in cloud
                  </Text>
                </Card>
                <Card variant="subtle" padding="md">
                  <Text variant="body-sm">
                    <strong>🤖 AI Optimization:</strong> Content adapted for each platform
                  </Text>
                </Card>
                <Card variant="subtle" padding="md">
                  <Text variant="body-sm">
                    <strong>📊 Real-time Analytics:</strong> See performance as you create
                  </Text>
                </Card>
                <Card variant="subtle" padding="md">
                  <Text variant="body-sm">
                    <strong>⚡ One-click Deploy:</strong> From markdown to multi-platform
                  </Text>
                </Card>
              </div>
            </Box>
          </Card>
        </Box>
      )}

      {/* Workflow Section */}
      {activeFlow === 'workflow' && (
        <Box className="cloud-demo__workflow">
          <Card padding="xl">
            <Text variant="h3" marginY="3">Live Deployment Demo</Text>
            
            {/* Progress Indicator */}
            <Box className="deployment-progress" marginY="4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {deploymentStages.map((stage, index) => (
                  <div key={stage.id} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      margin: '0 auto',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      background: index <= deploymentStage ? '#4CAF50' : '#f0f0f0',
                      transition: 'all 0.3s ease'
                    }}>
                      {stage.icon}
                    </div>
                    <Text variant="body-sm" marginY="2">
                      <strong>{stage.label}</strong>
                    </Text>
                    <Text variant="caption">
                      {stage.description}
                    </Text>
                    {index < deploymentStages.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '30px',
                        left: '50%',
                        width: '100%',
                        height: '2px',
                        background: index < deploymentStage ? '#4CAF50' : '#e0e0e0',
                        zIndex: -1
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </Box>

            {/* Stage Details */}
            <Card variant="secondary" padding="lg" marginY="4">
              <Text variant="h4">
                {deploymentStages[deploymentStage].icon} {deploymentStages[deploymentStage].label}
              </Text>
              
              {deploymentStage === 0 && (
                <Box marginY="3">
                  <Text variant="body">Creating content in your IDE...</Text>
                  <pre style={{
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '10px',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  }}>
{`# AI Revolution Thread

🚀 AI is transforming content creation!

We're moving from manual workflows to 
intelligent automation that understands 
context and intent.

#AI #ContentCreation #FutureOfWork`}
                  </pre>
                </Box>
              )}

              {deploymentStage === 1 && (
                <Box marginY="3">
                  <Text variant="body">AI processing your content...</Text>
                  <Box marginY="3">
                    <Text variant="body-sm">✅ Analyzing content structure</Text>
                    <Text variant="body-sm">✅ Optimizing for Twitter thread</Text>
                    <Text variant="body-sm">✅ Generating hashtags</Text>
                    <Text variant="body-sm">✅ Creating visual suggestions</Text>
                  </Box>
                </Box>
              )}

              {deploymentStage === 2 && (
                <Box marginY="3">
                  <Text variant="body">Preview your content across platforms:</Text>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginTop: '15px'
                  }}>
                    <Card padding="md">
                      <Text variant="body-sm">🐦 Twitter: 3-part thread</Text>
                    </Card>
                    <Card padding="md">
                      <Text variant="body-sm">📷 Instagram: Carousel post</Text>
                    </Card>
                    <Card padding="md">
                      <Text variant="body-sm">💼 LinkedIn: Article</Text>
                    </Card>
                    <Card padding="md">
                      <Text variant="body-sm">📝 Blog: Full post</Text>
                    </Card>
                  </div>
                </Box>
              )}

              {deploymentStage === 3 && (
                <Box marginY="3">
                  <Text variant="body">🎉 Successfully deployed!</Text>
                  <Box marginY="3">
                    <Text variant="body-sm">✅ Twitter thread posted</Text>
                    <Text variant="body-sm">✅ Instagram scheduled for 6 PM</Text>
                    <Text variant="body-sm">✅ LinkedIn article published</Text>
                    <Text variant="body-sm">✅ Blog post live</Text>
                  </Box>
                </Box>
              )}
            </Card>

            <Box display="flex" justify="center" marginY="4">
              {deploymentStage < 3 ? (
                <Button variant="primary" onClick={handleDeploy}>
                  Continue to {deploymentStages[deploymentStage + 1].label} →
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setDeploymentStage(0)}>
                  Start New Deployment
                </Button>
              )}
            </Box>
          </Card>
        </Box>
      )}

      {/* Platform Configuration */}
      {activeFlow === 'platforms' && (
        <Box className="cloud-demo__platforms">
          <Card padding="xl">
            <Text variant="h3" marginY="3">Platform Configuration</Text>
            <Text variant="body" marginY="2">
              Select which platforms to deploy to and configure settings
            </Text>

            <Box className="platform-grid" marginY="4">
              {platforms.map(platform => (
                <Card
                  key={platform.id}
                  variant={selectedPlatforms.includes(platform.id) ? 'primary' : 'secondary'}
                  padding="lg"
                  onClick={() => togglePlatform(platform.id)}
                  style={{
                    cursor: 'pointer',
                    marginBottom: '15px',
                    borderColor: selectedPlatforms.includes(platform.id) ? platform.color : undefined
                  }}
                >
                  <Box display="flex" align="center" justify="between">
                    <Box display="flex" align="center" gap="md">
                      <Text variant="h2">{platform.icon}</Text>
                      <div>
                        <Text variant="h4">{platform.name}</Text>
                        <Text variant="caption">
                          {selectedPlatforms.includes(platform.id) ? 'Enabled' : 'Disabled'}
                        </Text>
                      </div>
                    </Box>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: selectedPlatforms.includes(platform.id) ? platform.color : '#ccc',
                      background: selectedPlatforms.includes(platform.id) ? platform.color : 'transparent'
                    }} />
                  </Box>
                </Card>
              ))}
            </Box>

            <Card variant="subtle" padding="lg" marginY="4">
              <Text variant="h4" marginY="2">Deployment Command</Text>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '15px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
{`# Deploy to selected platforms
add PS content.md → ${selectedPlatforms.join(', ')}

# With scheduling
add PS content.md → all --schedule "2pm tomorrow"

# Platform-specific options
add PS content.md → instagram --carousel --music`}
              </pre>
            </Card>
          </Card>
        </Box>
      )}
    </div>
  )
}