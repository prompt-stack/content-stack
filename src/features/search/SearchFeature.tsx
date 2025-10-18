/**
 * @file features/search/SearchFeature.tsx
 * @purpose Main search feature component for searching all content metadata
 * @layer feature
 * @deps [Box, Text, Card, Button, Api]
 * @used-by [SearchPage]
 * @css /features/search/styles/search.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role feature
 */

import { useState, useEffect, useCallback } from 'react';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Api } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import './styles/search.css';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: string;
  source: string;
  category?: string;
  tags: string[];
  createdAt: Date;
  size: number;
  metadata: {
    url?: string;
    reference_url?: string;
    file_type?: string;
    wordCount?: number;
  };
  score?: number; // relevance score
}

export function SearchFeature() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'size'>('relevance');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Extract platform from URL
  const getPlatformFromUrl = (url: string): string => {
    if (!url) return 'web';
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      if (domain.includes('youtube.com') || domain.includes('youtu.be')) return 'youtube';
      if (domain.includes('tiktok.com')) return 'tiktok';
      if (domain.includes('reddit.com')) return 'reddit';
      if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';
      if (domain.includes('medium.com')) return 'article';
      if (domain.includes('substack.com')) return 'article';
      if (domain.includes('github.com')) return 'github';
      
      // Default to article for other URLs
      return 'article';
    } catch {
      return 'web';
    }
  };

  // Get available platforms dynamically from data
  const [availablePlatforms, setAvailablePlatforms] = useState<Set<string>>(new Set());
  
  // Perform search
  const performSearch = useCallback(async () => {
    console.log('Performing search:', { debouncedSearchQuery, selectedTypes, selectedPlatforms });
    
    if (!debouncedSearchQuery.trim() && selectedTypes.length === 0 && selectedPlatforms.length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Search both inbox and storage
      const [inboxResponse, storageResponse] = await Promise.all([
        Api.get('/api/content-inbox/items'),
        Api.get('/api/storage/files')
      ]);
      
      console.log('API responses:', { inboxResponse, storageResponse });

      const searchResults: SearchResult[] = [];
      const platformsFound = new Set<string>();
      
      // Process inbox items
      if (inboxResponse.success && inboxResponse.items) {
        console.log('Processing inbox items:', inboxResponse.items);
        inboxResponse.items.forEach((item: any) => {
          console.log('Processing item:', item);
          
          // The API returns items with a different structure
          // Extract the necessary fields from the backend format
          const title = item.content?.title || item.metadata?.title || 'Untitled';
          const content = item.content?.full_text || item.content?.text || item.metadata?.content || '';
          const tags = item.tags || item.metadata?.tags || [];
          const category = item.llm_analysis?.category || item.metadata?.category;
          const type = item.content?.type || item.type || 'text';
          // Map source values to match our filter options
          let source = item.source?.type || item.source || 'unknown';
          // Normalize source values
          if (source === 'file-upload') source = 'upload';
          if (source === 'article') source = 'url';
          
          console.log('Item source:', { original: item.source, mapped: source });
          
          // Deep search in metadata
          const searchInMetadata = (obj: any, query: string): boolean => {
            const lowerQuery = query.toLowerCase();
            
            // Search in string values
            if (typeof obj === 'string') {
              return obj.toLowerCase().includes(lowerQuery);
            }
            
            // Search in arrays
            if (Array.isArray(obj)) {
              return obj.some(item => searchInMetadata(item, query));
            }
            
            // Search in objects
            if (obj && typeof obj === 'object') {
              return Object.values(obj).some(value => searchInMetadata(value, query));
            }
            
            return false;
          };
          
          const matchesQuery = !debouncedSearchQuery || 
            title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
            (category && category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
            searchInMetadata(item.metadata, debouncedSearchQuery) ||
            searchInMetadata(item.llm_analysis, debouncedSearchQuery);

          // Determine platform for URL sources
          let platform = 'other';
          if (source === 'url' || source === 'article') {
            const url = item.source?.url || item.metadata?.url || item.metadata?.reference_url;
            platform = getPlatformFromUrl(url);
            if (platform && platform !== 'web' && platform !== 'other') {
              platformsFound.add(platform);
            }
          }
          
          const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
          const matchesPlatform = selectedPlatforms.length === 0 || 
            (source === 'url' && selectedPlatforms.includes(platform));

          if (matchesQuery && matchesType && matchesPlatform) {
            searchResults.push({
              id: item.id,
              title: title,
              content: content,
              type: type,
              source: source,
              category: category,
              tags: tags,
              createdAt: new Date(item.created_at || item.timestamp),
              size: item.content?.full_text?.length || 0,
              metadata: {
                url: item.source?.url || item.metadata?.url,
                reference_url: item.source?.reference_url || item.metadata?.reference_url,
                file_type: type,
                wordCount: item.content?.word_count || item.metadata?.wordCount
              },
              score: calculateRelevanceScore({ title, content, tags, category }, debouncedSearchQuery)
            });
          }
        });
      }

      // Process storage files
      if (storageResponse.success && storageResponse.filesByType) {
        Object.entries(storageResponse.filesByType).forEach(([type, files]: [string, any]) => {
          (files || []).forEach((file: any) => {
            const matchesQuery = !debouncedSearchQuery || 
              file.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
              file.metadata?.tags?.some((tag: string) => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
            const matchesPlatform = selectedPlatforms.length === 0; // Storage files don't have platforms

            if (matchesQuery && matchesType && matchesPlatform) {
              searchResults.push({
                id: file.name,
                title: file.name,
                content: '',
                type: type,
                source: file.metadata?.source || 'upload',
                category: file.metadata?.category,
                tags: file.metadata?.tags || [],
                createdAt: new Date(file.created),
                size: file.size,
                metadata: {
                  reference_url: file.metadata?.reference_url,
                  file_type: type,
                  wordCount: file.metadata?.wordCount
                },
                score: calculateRelevanceScore({ title: file.name, tags: file.metadata?.tags || [] }, debouncedSearchQuery)
              });
            }
          });
        });
      }

      // Sort results
      const sortedResults = sortResults(searchResults, sortBy);
      console.log('Search results:', sortedResults);
      console.log('Platforms found:', Array.from(platformsFound));
      
      // Update available platforms
      setAvailablePlatforms(platformsFound);
      setResults(sortedResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedTypes, selectedPlatforms, sortBy]);

  // Calculate relevance score
  const calculateRelevanceScore = (item: any, query: string): number => {
    if (!query) return 0;
    
    let score = 0;
    const lowerQuery = query.toLowerCase();
    
    // Title match (highest priority)
    if (item.title?.toLowerCase().includes(lowerQuery)) {
      score += 10;
    }
    
    // Tag match
    if (item.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))) {
      score += 5;
    }
    
    // Content match
    if (item.content?.toLowerCase().includes(lowerQuery)) {
      score += 3;
    }
    
    // Category match
    if (item.category?.toLowerCase().includes(lowerQuery)) {
      score += 2;
    }
    
    return score;
  };

  // Sort results
  const sortResults = (results: SearchResult[], sortBy: 'relevance' | 'date' | 'size'): SearchResult[] => {
    switch (sortBy) {
      case 'relevance':
        return [...results].sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'date':
        return [...results].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'size':
        return [...results].sort((a, b) => b.size - a.size);
      default:
        return results;
    }
  };

  // Perform search on query/filter change
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      text: 'fa-file-alt',
      code: 'fa-code',
      image: 'fa-image',
      video: 'fa-video',
      audio: 'fa-music',
      document: 'fa-file-word',
      data: 'fa-database',
      web: 'fa-globe',
      url: 'fa-link'
    };
    return icons[type] || 'fa-file';
  };

  const getSourceIcon = (source: string | any) => {
    const sourceType = typeof source === 'string' ? source : source?.type || 'unknown';
    const icons: Record<string, string> = {
      paste: 'fa-clipboard',
      upload: 'fa-upload',
      url: 'fa-link',
      drop: 'fa-folder-open'
    };
    return icons[sourceType] || 'fa-file';
  };

  return (
    <div className="search">
      <div className="search__header">
        <h1 className="search__title">Search</h1>
        <p className="search__subtitle">Search across all your content and metadata</p>
      </div>

      <div className="search__controls">
        <div className="search__input-wrapper">
          <i className="fas fa-search search__input-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, content, tags, or category..."
            className="search__input"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search__clear-btn"
              aria-label="Clear search"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        <div className="search__filters">
          <div className="search__filter-group">
            <Text size="sm" color="muted" className="search__filter-label">Type:</Text>
            <div className="search__filter-chips">
              {['text', 'code', 'image', 'video', 'audio', 'document'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedTypes(prev => 
                    prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                  )}
                  className={`search__filter-chip ${selectedTypes.includes(type) ? 'search__filter-chip--active' : ''}`}
                >
                  <i className={`fas ${getTypeIcon(type)}`} />
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="search__filter-group">
            <Text size="sm" color="muted" className="search__filter-label">Platform:</Text>
            <div className="search__filter-chips">
              {[
                { id: 'youtube', label: 'YouTube', icon: 'fa-youtube' },
                { id: 'tiktok', label: 'TikTok', icon: 'fa-tiktok' },
                { id: 'reddit', label: 'Reddit', icon: 'fa-reddit' },
                { id: 'twitter', label: 'Twitter', icon: 'fa-twitter' },
                { id: 'article', label: 'Article', icon: 'fa-newspaper' },
                { id: 'github', label: 'GitHub', icon: 'fa-github' }
              ].map(platform => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatforms(prev => 
                    prev.includes(platform.id) ? prev.filter(p => p !== platform.id) : [...prev, platform.id]
                  )}
                  className={`search__filter-chip ${selectedPlatforms.includes(platform.id) ? 'search__filter-chip--active' : ''}`}
                >
                  <i className={`fab ${platform.icon}`} />
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          <div className="search__filter-group">
            <Text size="sm" color="muted" className="search__filter-label">Sort by:</Text>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'size')}
              className="search__sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
            </select>
          </div>
        </div>
      </div>

      <div className="search__results">
        {loading ? (
          <div className="search__loading">
            <i className="fas fa-circle-notch fa-spin" />
            <Text>Searching...</Text>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="search__results-header">
              <Text size="sm" color="muted">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </Text>
            </div>
            <div className="search__results-list">
              {results.map(result => (
                <Card key={result.id} className="search__result-card" variant="bordered">
                  <div className="search__result-header">
                    <div className="search__result-title-row">
                      <i className={`fas ${getTypeIcon(result.type)} search__result-type-icon`} />
                      <h3 className="search__result-title">{result.title}</h3>
                      {result.score !== undefined && result.score > 0 && (
                        <span className="search__result-score" title="Relevance score">
                          {result.score}
                        </span>
                      )}
                    </div>
                    <div className="search__result-meta">
                      <span className="search__result-meta-item">
                        <i className={`fas ${getSourceIcon(result.source)}`} />
                        {typeof result.source === 'string' ? result.source : result.source?.type || 'unknown'}
                      </span>
                      <span className="search__result-meta-item">
                        <i className="fas fa-clock" />
                        {formatDate(result.createdAt)}
                      </span>
                      <span className="search__result-meta-item">
                        <i className="fas fa-hdd" />
                        {formatBytes(result.size)}
                      </span>
                    </div>
                  </div>

                  {result.content && typeof result.content === 'string' && (
                    <p className="search__result-content">
                      {result.content.substring(0, 200)}
                      {result.content.length > 200 && '...'}
                    </p>
                  )}
                  
                  {/* Display rich metadata for platforms */}
                  {result.metadata && Object.keys(result.metadata).length > 0 && (
                    <div className="search__result-metadata">
                      {result.metadata.author && (
                        <span className="search__result-meta-field">
                          <i className="fas fa-user" /> {result.metadata.author}
                        </span>
                      )}
                      {result.metadata.duration && (
                        <span className="search__result-meta-field">
                          <i className="fas fa-clock" /> {result.metadata.duration}
                        </span>
                      )}
                      {result.metadata.views && (
                        <span className="search__result-meta-field">
                          <i className="fas fa-eye" /> {result.metadata.views} views
                        </span>
                      )}
                      {result.metadata.language && (
                        <span className="search__result-meta-field">
                          <i className="fas fa-language" /> {result.metadata.language}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="search__result-footer">
                    <div className="search__result-tags">
                      {result.category && (
                        <span className="search__result-category">{result.category}</span>
                      )}
                      {result.tags.map(tag => (
                        <span key={tag} className="search__result-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="search__result-actions">
                      {result.metadata.url && (
                        <a 
                          href={result.metadata.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="search__result-link"
                        >
                          <i className="fas fa-external-link-alt" />
                        </a>
                      )}
                      <button className="search__result-action">
                        <i className="fas fa-eye" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : searchQuery || selectedTypes.length > 0 || selectedPlatforms.length > 0 ? (
          <div className="search__empty">
            <i className="fas fa-search search__empty-icon" />
            <Text size="lg" color="muted">No results found</Text>
            <Text size="sm" color="muted">Try adjusting your search terms or filters</Text>
          </div>
        ) : (
          <div className="search__empty">
            <i className="fas fa-search search__empty-icon" />
            <Text size="lg" color="muted">Start searching</Text>
            <Text size="sm" color="muted">Enter a search term or select filters to find content</Text>
          </div>
        )}
      </div>
    </div>
  );
}