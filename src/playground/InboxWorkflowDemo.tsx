import { useState } from 'react';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Text } from '@/components/Text';
import { Input } from '@/components/Input';
import { ScrollContainer } from '@/components/ScrollContainer';
import { Badge } from '@/components/Badge';

interface QueueItem {
  id: string;
  type: 'article' | 'image' | 'data' | 'voice' | 'link';
  title: string;
  meta: string[];
  status: 'processing' | 'ready' | 'completed';
  addedTime: string;
  icon: string;
}

export function InboxWorkflowDemo() {
  const [commandInput, setCommandInput] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Mock data
  const queueItems: QueueItem[] = [
    {
      id: '1',
      type: 'article',
      title: 'ai-content-revolution.md',
      meta: ['2.3k words', 'Added 2 min ago'],
      status: 'processing',
      addedTime: '2 min ago',
      icon: '📄'
    },
    {
      id: '2',
      type: 'image',
      title: 'product-screenshot.png',
      meta: ['1.2 MB', 'Added 15 min ago'],
      status: 'ready',
      addedTime: '15 min ago',
      icon: '🖼️'
    },
    {
      id: '3',
      type: 'data',
      title: 'q4-earnings-data.csv',
      meta: ['156 KB', 'Added 1 hour ago', 'Tagged: #finance #quarterly'],
      status: 'ready',
      addedTime: '1 hour ago',
      icon: '📊'
    },
    {
      id: '4',
      type: 'voice',
      title: 'voice-note-20240120.mp3',
      meta: ['3:45 duration', 'Added 2 hours ago', 'Transcribed'],
      status: 'ready',
      addedTime: '2 hours ago',
      icon: '🎙️'
    },
    {
      id: '5',
      type: 'link',
      title: 'https://techcrunch.com/2024/ai-trends...',
      meta: ['Web article', 'Added 3 hours ago', 'Scraped & ready'],
      status: 'ready',
      addedTime: '3 hours ago',
      icon: '🔗'
    }
  ];

  const inputMethods = [
    { id: 'web', icon: '🌐', title: 'Web Clipper', desc: 'Save articles, threads, and web content directly to your inbox' },
    { id: 'email', icon: '📧', title: 'Email Gateway', desc: 'Forward emails to inbox@promptstack.io with transformation commands' },
    { id: 'voice', icon: '🎙️', title: 'Voice Notes', desc: 'Record ideas on the go, auto-transcribed and ready to process' },
    { id: 'screenshot', icon: '📸', title: 'Screenshot OCR', desc: 'Capture any text from images and screenshots automatically' },
    { id: 'api', icon: '🔗', title: 'API Webhook', desc: 'Connect any service via webhooks for automated ingestion' },
    { id: 'file', icon: '📁', title: 'File Upload', desc: 'Drag and drop documents, CSVs, images, and more' }
  ];

  const stats = [
    { value: '247', label: 'Items Processed Today' },
    { value: '1.2k', label: 'Content Pieces Created' },
    { value: '89%', label: 'Automation Rate' },
    { value: '5.3h', label: 'Time Saved' }
  ];

  return (
    <ScrollContainer className="inbox-workflow-demo" fadeEdges smooth>
      {/* Header */}
      <Box className="inbox-workflow__header" padding="5">
        <Text as="h1" size="4xl" weight="bold" className="inbox-workflow__title">
          Content Inbox
        </Text>
        
        <Box className="inbox-workflow__actions" display="flex" gap="md" align="center">
          {/* Command Input */}
          <Box className="inbox-workflow__command" display="flex" gap="sm" align="center">
            <Text size="xl">🚀</Text>
            <Input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="add PS article.md → tweet thread + blog post"
              className="inbox-workflow__command-input"
            />
            <Button variant="primary" size="small">
              Execute
            </Button>
          </Box>
          
          <Button variant="secondary" iconLeft={<span>⚙️</span>}>
            Batch Process
          </Button>
        </Box>
      </Box>

      {/* Input Methods Grid */}
      <Box className="inbox-workflow__methods" padding="5">
        <Box className="inbox-workflow__methods-grid">
          {inputMethods.map((method) => (
            <Card
              key={method.id}
              variant="outlined"
              className={`inbox-workflow__method-card ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <Text size="3xl" className="inbox-workflow__method-icon">
                {method.icon}
              </Text>
              <Text size="lg" weight="semibold" className="inbox-workflow__method-title">
                {method.title}
              </Text>
              <Text size="sm" className="inbox-workflow__method-desc">
                {method.desc}
              </Text>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Queue Section */}
      <Box className="inbox-workflow__queue" padding="5">
        <Box display="flex" justify="between" align="center" marginY="4">
          <Text as="h2" size="xl" weight="semibold">Queue</Text>
          <Badge variant="primary" size="sm">5 items pending</Badge>
        </Box>

        <Box className="inbox-workflow__queue-items" display="flex" direction="column" gap="md">
          {queueItems.map((item) => (
            <Card
              key={item.id}
              variant="default"
              className={`inbox-workflow__queue-item ${item.status === 'processing' ? 'processing' : ''}`}
            >
              <Box display="flex" align="center" gap="md">
                {/* File Icon */}
                <Box className={`inbox-workflow__file-icon inbox-workflow__file-icon--${item.type}`}>
                  <Text size="xl">{item.icon}</Text>
                </Box>

                {/* Content */}
                <Box flex="1">
                  <Text weight="medium" className="inbox-workflow__filename">
                    {item.title}
                  </Text>
                  <Box display="flex" gap="md" className="inbox-workflow__meta">
                    {item.meta.map((meta, idx) => (
                      <Text key={idx} size="sm" variant="secondary">
                        {meta}
                      </Text>
                    ))}
                    {item.status === 'processing' && (
                      <Box display="flex" align="center" gap="xs">
                        <Text size="sm" variant="primary">Processing</Text>
                        <Box className="inbox-workflow__processing-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Actions */}
                <Box display="flex" gap="sm">
                  {item.status === 'processing' ? (
                    <Button size="small" variant="secondary">View</Button>
                  ) : (
                    <>
                      <Button size="small" variant="primary">Transform</Button>
                      <Button size="small" variant="secondary">
                        {item.type === 'voice' ? 'View Transcript' : 'Configure'}
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Recently Processed */}
      <Box className="inbox-workflow__recent" padding="5">
        <Text as="h2" size="xl" weight="semibold" marginY="4">
          Recently Processed
        </Text>
        
        <Card variant="default" className="inbox-workflow__completed-item">
          <Box display="flex" align="center" gap="md">
            <Box className="inbox-workflow__file-icon inbox-workflow__file-icon--completed">
              <Text size="xl">✅</Text>
            </Box>
            <Box flex="1">
              <Text weight="medium">weekly-newsletter.md</Text>
              <Text size="sm" variant="secondary">
                Transformed to: Email + Blog + Twitter Thread • Completed 30 min ago
              </Text>
            </Box>
            <Button size="small" variant="secondary">View Results</Button>
          </Box>
        </Card>
      </Box>

      {/* Stats Grid */}
      <Box className="inbox-workflow__stats" padding="5">
        <Box className="inbox-workflow__stats-grid">
          {stats.map((stat, idx) => (
            <Card key={idx} variant="outlined" className="inbox-workflow__stat-card">
              <Text size="3xl" weight="bold" className="inbox-workflow__stat-value">
                {stat.value}
              </Text>
              <Text size="sm" variant="secondary">
                {stat.label}
              </Text>
            </Card>
          ))}
        </Box>
      </Box>
    </ScrollContainer>
  );
}