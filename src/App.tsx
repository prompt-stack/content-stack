/**
 * @file App.tsx
 * @purpose [TODO: Add purpose]
 * @layer unknown
 * @deps none
 * @used-by [main]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 */

import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

function App() {
  return (
    <div className="home__container">
      <div className="home__hero">
        <h1 className="home__hero-title">Welcome to Content Stack</h1>
        <p className="home__hero-subtitle">
          Your intelligent content management system
        </p>
        
        <div className="home__hero-actions">
          <Link to="/inbox">
            <Button size="large" iconLeft={<i className="fas fa-inbox" />}>
              Go to Inbox
            </Button>
          </Link>
          <Link to="/playground">
            <Button variant="secondary" size="large" iconLeft={<i className="fas fa-flask" />}>
              Component Playground
            </Button>
          </Link>
        </div>
      </div>

      <div className="home__features">
        <h2 className="home__features-title">What you can do</h2>
        <div className="home__features-grid">
          <Card className="home__feature-card">
            <i className="fas fa-link home__feature-icon" />
            <h3 className="home__feature-title">Extract URLs</h3>
            <p className="home__feature-description">Extract content from YouTube, TikTok, Reddit, and more</p>
          </Card>
          
          <Card className="home__feature-card">
            <i className="fas fa-upload home__feature-icon" />
            <h3 className="home__feature-title">Upload Files</h3>
            <p className="home__feature-description">Drag and drop or browse to upload documents and images</p>
          </Card>
          
          <Card className="home__feature-card">
            <i className="fas fa-clipboard home__feature-icon" />
            <h3 className="home__feature-title">Paste Content</h3>
            <p className="home__feature-description">Quickly paste text or URLs with Ctrl+V anywhere</p>
          </Card>
          
          <Card className="home__feature-card">
            <i className="fas fa-search home__feature-icon" />
            <h3 className="home__feature-title">Smart Search</h3>
            <p className="home__feature-description">Find anything in your content library instantly</p>
          </Card>
        </div>
      </div>

      <div className="home__quick-links">
        <h2 className="home__quick-links-title">Quick Navigation</h2>
        <div className="home__quick-links-grid">
          <Link to="/inbox" className="home__quick-link">
            <i className="fas fa-inbox home__quick-link-icon" />
            <span className="home__quick-link-label">Inbox</span>
          </Link>
          <Link to="/playground" className="home__quick-link">
            <i className="fas fa-flask home__quick-link-icon" />
            <span className="home__quick-link-label">Playground</span>
          </Link>
          <Link to="/health" className="home__quick-link">
            <i className="fas fa-heartbeat home__quick-link-icon" />
            <span className="home__quick-link-label">Health</span>
          </Link>
          <Link to="/subscription" className="home__quick-link">
            <i className="fas fa-credit-card home__quick-link-icon" />
            <span className="home__quick-link-label">Subscription</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
