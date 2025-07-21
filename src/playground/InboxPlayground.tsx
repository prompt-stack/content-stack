/**
 * @page playground
 * @title Content Inbox Interface
 * @description Interactive demonstration of the Prompt Stack content inbox system
 * @status experimental
 * @since 2025-07-20
 */

import { useState } from 'react'
import { PlaygroundLayout, DemoSection } from './PlaygroundLayout'
import { ContentInboxFeature } from '../features/content-inbox/ContentInboxFeature'
import { Box } from '../components/Box'
import { Text } from '../components/Text'
import { Button } from '../components/Button'
import { Card } from '../components/Card'

// Feature demo data
const features = [
  {
    title: 'Multi-Input Support',
    description: 'Paste, upload files, drag & drop, or extract from URLs',
    icon: '📥',
    status: 'complete'
  },
  {
    title: 'Smart Metadata',
    description: 'Automatic categorization, tagging, and content analysis',
    icon: '🧠',
    status: 'complete'
  },
  {
    title: 'Bulk Operations',
    description: 'Multi-select, batch editing, and export functionality',
    icon: '⚡',
    status: 'complete'
  },
  {
    title: 'Security Hardened',
    description: 'Content sanitization, file validation, and error handling',
    icon: '🔒',
    status: 'complete'
  }
]

export function InboxPlayground() {
  const [activeDemo, setActiveDemo] = useState<'full' | 'features'>('full')

  return (
    <PlaygroundLayout
      title="Content Inbox - Production Ready MVP"
      description="A secure, feature-complete content management system ready for production deployment"
    >
      {/* Demo Toggle */}
      <Box display="flex" gap="sm" marginY="lg">
        <Button
          variant={activeDemo === 'full' ? 'primary' : 'secondary'}
          onClick={() => setActiveDemo('full')}
          size="small"
        >
          Live Demo
        </Button>
        <Button
          variant={activeDemo === 'features' ? 'primary' : 'secondary'}
          onClick={() => setActiveDemo('features')}
          size="small"
        >
          Feature Overview
        </Button>
      </Box>

      {/* Live Demo */}
      {activeDemo === 'full' && (
        <DemoSection title="🚀 Interactive Content Inbox">
          <Box 
            style={{ 
              border: '2px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              minHeight: '600px'
            }}
          >
            <ContentInboxFeature />
          </Box>
          <Box marginY="md">
            <Text size="sm" className="text-secondary">
              💡 Try pasting text, uploading files, or dragging content into the input area above!
            </Text>
          </Box>
        </DemoSection>
      )}

      {/* Feature Overview */}
      {activeDemo === 'features' && (
        <>
          <DemoSection title="✅ MVP Features Complete">
            <div className="playground__demo-grid">
              {features.map((feature, index) => (
                <Card key={index} variant="outlined" className="p-lg">
                  <Box display="flex" align="center" gap="md" marginY="sm">
                    <span style={{ fontSize: '2rem' }}>{feature.icon}</span>
                    <Box>
                      <Text weight="semibold" marginY="xs">{feature.title}</Text>
                      <Text size="sm" className="text-secondary">{feature.description}</Text>
                      <Box marginY="xs">
                        <span className="badge badge--success badge--sm">✅ {feature.status}</span>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
            </div>
          </DemoSection>

          <DemoSection title="🔒 Security & Validation">
            <div className="playground__demo-row">
              <Card variant="outlined" className="p-md">
                <Text size="sm" weight="medium" marginY="xs">Content Sanitization</Text>
                <Text size="xs" className="text-secondary">All user input is sanitized to prevent XSS attacks</Text>
              </Card>
              <Card variant="outlined" className="p-md">
                <Text size="sm" weight="medium" marginY="xs">File Validation</Text>
                <Text size="xs" className="text-secondary">10MB limit, type checking, and error handling</Text>
              </Card>
              <Card variant="outlined" className="p-md">
                <Text size="sm" weight="medium" marginY="xs">Error Handling</Text>
                <Text size="xs" className="text-secondary">Comprehensive error states and user feedback</Text>
              </Card>
            </div>
          </DemoSection>

          <DemoSection title="💰 Monetization Ready">
            <div className="playground__demo-row">
              <Card variant="outlined" className="p-md">
                <Text size="sm" weight="medium" marginY="xs">🆓 Free Tier (Current)</Text>
                <Text size="xs" className="text-secondary">Basic content management, local storage, export features</Text>
              </Card>
              <Card variant="outlined" className="p-md">
                <Text size="sm" weight="medium" marginY="xs">💎 Pro Tier ($9/mo)</Text>
                <Text size="xs" className="text-secondary">Cloud sync, advanced URL extraction, premium features</Text>
              </Card>
              <Card variant="outlined" className="p-md">
                <Text size="sm" weight="medium" marginY="xs">🏢 Enterprise ($99/mo)</Text>
                <Text size="xs" className="text-secondary">Team collaboration, API access, custom integrations</Text>
              </Card>
            </div>
          </DemoSection>
        </>
      )}

      {/* Implementation Guide */}
      <DemoSection 
        title="📋 Implementation Status"
        code={`✅ Phase 1: Basic Infrastructure (COMPLETE)
✅ Phase 2: Multi-Input Support (COMPLETE) 
✅ Phase 3: Queue Management (COMPLETE)
✅ Phase 4: Security & Validation (COMPLETE)

🚀 STATUS: PRODUCTION READY MVP

// Key Features Implemented:
- Multi-input content ingestion (paste, upload, URL, drag & drop)
- Rich metadata management with categories and tags
- Bulk operations and multi-select functionality
- Export in multiple formats (JSON, CSV, Markdown)
- XSS protection and content sanitization
- File size limits and validation
- Comprehensive error handling
- Loading states and user feedback
- Responsive design with list/grid views
- Design system compliance (0 violations)

// Ready for:
✅ Production deployment
✅ User onboarding
✅ Premium feature development
✅ Backend integration`}
      />
    </PlaygroundLayout>
  )
}