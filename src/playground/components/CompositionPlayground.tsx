import { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { DemoSection } from '../PlaygroundLayout'

export function CompositionPlayground() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Example content items showing composition
  const contentItems = [
    {
      id: 1,
      title: 'Building Scalable React Applications',
      type: 'article',
      status: 'published',
      categories: ['Technology', 'React', 'JavaScript'],
      date: '2024-01-15',
      excerpt: 'Learn the best practices for building large-scale React applications...'
    },
    {
      id: 2,
      title: 'Q4 Business Strategy Review',
      type: 'document',
      status: 'draft',
      categories: ['Business', 'Strategy'],
      date: '2024-01-14',
      excerpt: 'Comprehensive review of our Q4 performance and future planning...'
    },
    {
      id: 3,
      title: 'Marketing Campaign Results',
      type: 'report',
      status: 'archived',
      categories: ['Marketing', 'Analytics'],
      date: '2024-01-10',
      excerpt: 'Analysis of our latest marketing campaign performance metrics...'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return 'fa-newspaper'
      case 'document': return 'fa-file-alt'
      case 'report': return 'fa-chart-line'
      default: return 'fa-file'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return 'badge--green'
      case 'draft': return 'badge--yellow'
      case 'archived': return 'badge--blue'
      default: return ''
    }
  }

  return (
    <div className="playground__component">
      <h2>Component Composition</h2>
      <p className="playground__component-description">
        See how atomic components combine to create rich, functional interfaces. 
        This is how pages are built - by composing smaller, reusable components.
      </p>

      <DemoSection 
        title="Content Card Example" 
        code={`// Composed from: Card, Badge, Button, Icons
<Card interactive>
  <div className="content-card__header">
    <h3>{item.title}</h3>
    <Badge variant={getStatusVariant(item.status)}>
      {item.status}
    </Badge>
  </div>
  <div className="content-card__categories">
    {item.categories.map(cat => (
      <Badge variant="tag" size="sm">{cat}</Badge>
    ))}
  </div>
  <div className="content-card__actions">
    <Button size="small" icon="eye">View</Button>
    <Button size="small" variant="secondary" icon="edit">
      Edit
    </Button>
  </div>
</Card>`}
      >
        <div style={{ maxWidth: '400px' }}>
          {contentItems.slice(0, 1).map(item => (
            <Card key={item.id} interactive>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: 'var(--space-md)'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: 'var(--space-xs)' }}>
                    <i className={`fas ${getTypeIcon(item.type)}`} style={{ 
                      marginRight: 'var(--space-sm)',
                      color: 'var(--text-tertiary)',
                      fontSize: '0.875em'
                    }}></i>
                    {item.title}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    {item.excerpt}
                  </p>
                </div>
                <span className={`badge badge--sm ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-xs)',
                marginBottom: 'var(--space-md)'
              }}>
                {item.categories.map(cat => (
                  <span key={cat} className="badge badge--tag badge--sm">
                    {cat}
                  </span>
                ))}
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--text-tertiary)' 
                }}>
                  {item.date}
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <Button size="small" icon="eye">View</Button>
                  <Button size="small" variant="secondary" icon="edit">Edit</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DemoSection>

      <DemoSection 
        title="Content List View" 
        code={`// Combines multiple components into a functional list
<div className="content-filters">
  <Badge variant="tag" onClick={() => filter('all')}>All</Badge>
  <Badge variant="tag" onClick={() => filter('tech')}>Technology</Badge>
  <Badge variant="tag" onClick={() => filter('business')}>Business</Badge>
</div>
<div className="content-list">
  {items.map(item => <ContentCard {...item} />)}
</div>`}
      >
        <div>
          {/* Filter badges */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ marginBottom: 'var(--space-sm)' }}>Filter by Category</h4>
            <div className="playground__demo-row">
              <span 
                className={`badge badge--tag badge--md ${selectedCategory === 'all' ? 'badge--blue' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedCategory('all')}
              >
                All Items
              </span>
              <span 
                className={`badge badge--tag badge--md ${selectedCategory === 'Technology' ? 'badge--blue' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedCategory('Technology')}
              >
                Technology
              </span>
              <span 
                className={`badge badge--tag badge--md ${selectedCategory === 'Business' ? 'badge--blue' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedCategory('Business')}
              >
                Business
              </span>
              <span 
                className={`badge badge--tag badge--md ${selectedCategory === 'Marketing' ? 'badge--blue' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedCategory('Marketing')}
              >
                Marketing
              </span>
            </div>
          </div>

          {/* Content list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {contentItems
              .filter(item => selectedCategory === 'all' || item.categories.includes(selectedCategory))
              .map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  background: 'var(--surface-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-base)'
                }}>
                  <i className={`fas ${getTypeIcon(item.type)}`} style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-tertiary)',
                    width: '2rem',
                    textAlign: 'center'
                  }}></i>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, marginBottom: 'var(--space-xs)' }}>
                      {item.title}
                    </h4>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      {item.categories.map(cat => (
                        <span key={cat} className="badge badge--tag badge--xs">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <span className={`badge badge--sm ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  
                  <Button size="small" icon="arrow-right">Open</Button>
                </div>
              ))}
          </div>
        </div>
      </DemoSection>

      <DemoSection 
        title="Page Header Composition" 
        code={`// Header composed from multiple elements
<div className="page-header">
  <div className="page-header__content">
    <h1>
      <i className="fas fa-inbox"></i>
      Content Inbox
    </h1>
    <div className="page-header__meta">
      <Badge variant="blue">{itemCount} items</Badge>
      <Badge variant="green">{newCount} new</Badge>
    </div>
  </div>
  <div className="page-header__actions">
    <Button icon="filter">Filter</Button>
    <Button variant="primary" icon="plus">Add New</Button>
  </div>
</div>`}
      >
        <div style={{
          padding: 'var(--space-lg)',
          background: 'var(--surface-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                marginBottom: 'var(--space-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)'
              }}>
                <i className="fas fa-inbox" style={{ color: 'var(--brand-primary)' }}></i>
                Content Inbox
              </h1>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <span className="badge badge--blue badge--md">24 items</span>
                <span className="badge badge--green badge--md">3 new today</span>
                <span className="badge badge--yellow badge--md">2 pending</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <Button icon="filter">Filter</Button>
              <Button icon="sort">Sort</Button>
              <Button variant="primary" icon="plus">Add New</Button>
            </div>
          </div>
        </div>
      </DemoSection>
    </div>
  )
}