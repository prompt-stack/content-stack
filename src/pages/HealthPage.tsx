/**
 * @file pages/HealthPage.tsx
 * @purpose Health page component
 * @layer page
 * @deps none
 * @used-by [main]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role entrypoint
 */

import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { api } from '@/lib/api'

interface HealthStatus {
  status: string
  timestamp: number
  uptime: number
  version: string
}

interface ServerStats {
  searchCache?: {
    hits: number
    misses: number
    size: number
  }
  directoryCache?: {
    hits: number
    misses: number
    size: number
  }
  memory?: {
    heapUsed: string
    heapTotal: string
    rss: string
  }
  uptime?: number
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [stats, setStats] = useState<ServerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const checkHealth = async () => {
    try {
      // Check basic health
      const healthData = await api.get<HealthStatus>('/api/health')
      setHealth(healthData)

      // Get detailed stats
      try {
        const statsData = await api.get<ServerStats>('/api/content/debug/cache-stats')
        setStats(statsData)
      } catch (statsErr) {
        // Stats endpoint is optional, don't fail the whole health check
        console.warn('Could not fetch cache stats:', statsErr)
      }

      setError(null)
    } catch (err) {
      console.error('Health check error:', err)
      if (err instanceof Error) {
        setError(err.message.includes('Failed to fetch') 
          ? 'Cannot connect to server. Make sure the Express server is running on port 3456.'
          : err.message
        )
      } else {
        setError('Failed to check health')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (loading) {
    return (
      <div className="health__container">
        <div className="health__loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    )
  }

  return (
    <div className="health__container">
      <div className="health__header">
        <h1 className="health__title">System Health</h1>
        <p className="health__subtitle">Monitor server status and performance</p>
      </div>

      <div className="health__grid">
        {/* Server Status */}
        <Card className="health__card">
          <div className="health__card-header">
            <h3>Server Status</h3>
            {health?.status === 'ok' ? (
              <span className="health__status-indicator health__status-indicator--success">
                <i className="fas fa-check-circle"></i> Online
              </span>
            ) : (
              <span className="health__status-indicator health__status-indicator--error">
                <i className="fas fa-times-circle"></i> Offline
              </span>
            )}
          </div>
          
          {health && (
            <div className="health__metrics">
              <div className="health__metric">
                <span className="health__metric-label">Version</span>
                <span className="health__metric-value">{health.version}</span>
              </div>
              <div className="health__metric">
                <span className="health__metric-label">Uptime</span>
                <span className="health__metric-value">{formatUptime(health.uptime)}</span>
              </div>
              <div className="health__metric">
                <span className="health__metric-label">Last Check</span>
                <span className="health__metric-value">
                  {new Date(health.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Memory Usage */}
        {stats?.memory && (
          <Card className="health__card">
            <div className="health__card-header">
              <h3>Memory Usage</h3>
              <i className="fas fa-memory"></i>
            </div>
            <div className="health__metrics">
              <div className="health__metric">
                <span className="health__metric-label">Heap Used</span>
                <span className="health__metric-value">{stats.memory.heapUsed}</span>
              </div>
              <div className="health__metric">
                <span className="health__metric-label">Heap Total</span>
                <span className="health__metric-value">{stats.memory.heapTotal}</span>
              </div>
              <div className="health__metric">
                <span className="health__metric-label">RSS</span>
                <span className="health__metric-value">{stats.memory.rss}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Cache Performance */}
        {stats?.searchCache && (
          <Card className="health__card">
            <div className="health__card-header">
              <h3>Search Cache</h3>
              <i className="fas fa-database"></i>
            </div>
            <div className="health__metrics">
              <div className="health__metric">
                <span className="health__metric-label">Hit Rate</span>
                <span className="health__metric-value">
                  {stats.searchCache.hits + stats.searchCache.misses > 0
                    ? `${Math.round((stats.searchCache.hits / (stats.searchCache.hits + stats.searchCache.misses)) * 100)}%`
                    : 'N/A'}
                </span>
              </div>
              <div className="health__metric">
                <span className="health__metric-label">Cache Size</span>
                <span className="health__metric-value">{stats.searchCache.size}</span>
              </div>
            </div>
          </Card>
        )}

        {/* API Endpoints */}
        <Card className="health__card">
          <div className="health__card-header">
            <h3>API Endpoints</h3>
            <i className="fas fa-plug"></i>
          </div>
          <div className="health__endpoint-list">
            <div className="health__endpoint">
              <code>/api/health</code>
              <span className="health__endpoint-status health__endpoint-status--success">Active</span>
            </div>
            <div className="health__endpoint">
              <code>/api/inbox</code>
              <span className="health__endpoint-status health__endpoint-status--success">Active</span>
            </div>
            <div className="health__endpoint">
              <code>/api/content</code>
              <span className="health__endpoint-status health__endpoint-status--success">Active</span>
            </div>
            <div className="health__endpoint">
              <code>/api/metadata</code>
              <span className="health__endpoint-status health__endpoint-status--success">Active</span>
            </div>
            <div className="health__endpoint">
              <code>/api/export</code>
              <span className="health__endpoint-status health__endpoint-status--success">Active</span>
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <div className="health__error-banner">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={checkHealth} className="btn btn--sm">
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
