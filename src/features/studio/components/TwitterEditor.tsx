/**
 * @file features/studio/components/TwitterEditor.tsx
 * @purpose Twitter/X content editor component
 * @layer feature-component
 * @deps [Button]
 * @used-by [StudioFeature]
 * @css included in studio.css
 * @llm-read true
 * @llm-write full-edit
 */

import { useState, useEffect } from 'react';
// Removed Textarea component - using native textarea for better performance
import { Button } from '../../../components/Button';
import { UserAvatar } from '../../../components/UserAvatar';
import { useStorageContent } from '../../../hooks/useStorageContent';
import { Api } from '../../../lib/api';

interface Tweet {
  id: string;
  type: 'single' | 'thread';
  status: 'draft' | 'published';
  created_at: string;
  content: any;
  metadata: any;
  source?: any;
}

export function TwitterEditor() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [editingTweet, setEditingTweet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTweetText, setNewTweetText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [textareaHeights, setTextareaHeights] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    loadTweets();
  }, []);
  
  const loadTweets = async () => {
    try {
      // Simulate loading tweets - in production this would call the backend
      const mockTweets: Tweet[] = [
        {
          id: 'grammar-ops-thread-2025-01-22',
          type: 'thread',
          status: 'draft',
          created_at: '2025-01-22T10:30:00Z',
          content: [
            {
              tweet_number: 1,
              text: '🧵 Is coding "creation" or just "pattern assembly"? \n\nThe Grammar Ops framework suggests we\'ve been thinking about code wrong. It\'s not about creating - it\'s about configuring pre-existing patterns.\n\nAI just makes this truth more obvious.',
              char_count: 234
            },
            {
              tweet_number: 2,
              text: 'Think about it: When you write a React component, are you "creating" or just assembling patterns?\n\nuseState ✓\nuseEffect ✓ \nProps interface ✓\nReturn JSX ✓\n\nIt\'s LEGO blocks, not sculpting.',
              char_count: 189
            }
          ],
          metadata: {
            title: 'Is Coding Creation or Pattern Assembly?',
            tags: ['grammar-ops', 'ai-native']
          }
        },
        {
          id: 'naming-conventions-tweet-2025-01-22',
          type: 'single',
          status: 'draft',
          created_at: '2025-01-22T11:00:00Z',
          content: {
            text: 'Your naming conventions are your codebase\'s immune system. \n\nInconsistent names = bugs slip through\nClear patterns = AI can audit your code better than humans\n\nThis is why Grammar Ops puts naming at the foundation of everything.',
            char_count: 233
          },
          metadata: {
            title: 'Naming Conventions as Immune System',
            tags: ['clean-code', 'best-practices']
          }
        },
        {
          id: 'ai-development-2025-01-22',
          type: 'single',
          status: 'draft',
          created_at: '2025-01-22T09:15:00Z',
          content: {
            text: 'Hot take: In 2025, the best developers won\'t be those who write the most code.\n\nThey\'ll be the ones who can architect systems that AI can understand and extend.\n\nThe future belongs to the prompt engineers who think in systems.',
            char_count: 237
          },
          metadata: {
            title: 'Future of AI Development',
            tags: ['ai', 'future-tech', 'development']
          }
        },
        {
          id: 'content-pipeline-2025-01-22',
          type: 'single',
          status: 'draft',
          created_at: '2025-01-22T08:45:00Z',
          content: {
            text: 'Building a content pipeline that goes:\n\nStorage → Metadata → Platform-specific content\n\nIt\'s like having a factory for ideas. Raw materials go in, polished content comes out. 🏭',
            char_count: 180
          },
          metadata: {
            title: 'Content Pipeline Architecture',
            tags: ['content-ops', 'automation']
          }
        },
        {
          id: 'ide-innovation-2025-01-22',
          type: 'single',
          status: 'draft',
          created_at: '2025-01-22T07:30:00Z',
          content: {
            text: 'Your IDE isn\'t just for code anymore.\n\nIt\'s becoming:\n- A content management system\n- A creative studio\n- A deployment pipeline\n- A collaboration hub\n\nThe IDE is eating the world.',
            char_count: 179
          },
          metadata: {
            title: 'IDE Evolution',
            tags: ['tools', 'development', 'future']
          }
        }
      ];
      
      setTweets(mockTweets);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load tweets:', error);
      setLoading(false);
    }
  };
  
  const updateTweetContent = (tweetId: string, newContent: string, tweetIndex?: number) => {
    setTweets(prev => prev.map(tweet => {
      if (tweet.id === tweetId) {
        if (tweet.type === 'thread' && tweetIndex !== undefined) {
          const updatedContent = [...tweet.content];
          updatedContent[tweetIndex] = {
            ...updatedContent[tweetIndex],
            text: newContent,
            char_count: newContent.length
          };
          return { ...tweet, content: updatedContent };
        } else if (tweet.type === 'single') {
          return {
            ...tweet,
            content: {
              ...tweet.content,
              text: newContent,
              char_count: newContent.length
            }
          };
        }
      }
      return tweet;
    }));
  };

  const characterLimit = 280;

  const toggleThreadExpansion = (threadId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const renderTweet = (text: string, isEditing: boolean, onEdit: (value: string) => void, charCount: number, tweetId: string) => {
    if (isEditing) {
      return (
        <textarea
          value={text}
          onChange={(e) => onEdit(e.target.value)}
          onMouseUp={(e) => {
            // Store the height after resize
            const target = e.target as HTMLTextAreaElement;
            setTextareaHeights(prev => ({
              ...prev,
              [tweetId]: target.style.height || `${target.offsetHeight}px`
            }));
          }}
          maxLength={characterLimit}
          rows={5}
          style={{
            width: '100%',
            border: '1px solid #e1e8ed',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '15px',
            lineHeight: '1.5',
            resize: 'vertical',
            minHeight: '120px',
            maxHeight: '300px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            height: textareaHeights[tweetId] || 'auto'
          }}
          autoFocus
        />
      );
    }
    
    return (
      <div style={{ 
        fontSize: '15px', 
        lineHeight: '1.4',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {text}
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Loading tweets...</div>;
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        
        .thread-container {
          animation: slideDown 0.3s ease-out;
        }
        
        /* Optimize textarea performance */
        textarea {
          /* Removed GPU acceleration - it was causing lag */
        }
        
        textarea::-webkit-resizer {
          background-image: linear-gradient(-45deg, transparent 5px, #1DA1F2 5px, #1DA1F2 6px, transparent 6px);
          background-size: 8px 8px;
          background-position: bottom right;
          background-repeat: no-repeat;
        }
      `}</style>
      <div style={{ 
        display: 'flex',
        gap: '24px',
        height: '100%',
        overflow: 'hidden'
      }}>
      {/* Main Twitter Feed */}
      <div className="twitter-container" style={{ 
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0
      }}>

      {/* Tweet Feed */}
      <div style={{ 
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#ffffff',
        paddingBottom: '20px' // Add bottom padding to prevent content being too close to edge
      }}>
        {/* Tweet Compose Box */}
        <div style={{
          borderBottom: '1px solid #e1e8ed',
          padding: '16px',
          backgroundColor: 'white'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <UserAvatar size={48} />
            <div style={{ flex: 1 }}>
              <textarea
                value={newTweetText}
                onChange={(e) => setNewTweetText(e.target.value)}
                placeholder="What's happening?"
                onClick={() => setIsComposing(true)}
                onMouseUp={(e) => {
                  if (isComposing) {
                    const target = e.target as HTMLTextAreaElement;
                    setTextareaHeights(prev => ({
                      ...prev,
                      'compose': target.style.height || `${target.offsetHeight}px`
                    }));
                  }
                }}
                style={{
                  width: '100%',
                  border: 'none',
                  fontSize: '20px',
                  lineHeight: '1.5',
                  resize: isComposing ? 'vertical' : 'none',
                  padding: '8px 0',
                  minHeight: isComposing ? '120px' : '50px',
                  maxHeight: isComposing ? '300px' : '50px',
                  transition: 'min-height 0.2s ease',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  outline: 'none',
                  height: isComposing ? (textareaHeights['compose'] || 'auto') : 'auto'
                }}
                rows={isComposing ? 5 : 1}
              />
              
              {isComposing && (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px',
                    padding: '12px 0',
                    borderBottom: '1px solid #e1e8ed',
                    marginBottom: '12px'
                  }}>
                    <button style={{ background: 'none', border: 'none', color: '#1DA1F2', cursor: 'pointer', padding: '8px' }}>
                      <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
                        <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"/>
                      </svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#1DA1F2', cursor: 'pointer', padding: '8px' }}>
                      <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
                        <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"/>
                      </svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#1DA1F2', cursor: 'pointer', padding: '8px' }}>
                      <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
                        <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"/>
                      </svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#1DA1F2', cursor: 'pointer', padding: '8px' }}>
                      <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
                        <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"/>
                      </svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#1DA1F2', cursor: 'pointer', padding: '8px' }}>
                      <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
                        <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '13px',
                      color: newTweetText.length > 280 ? '#f4212e' : '#536471'
                    }}>
                      {newTweetText.length}/280
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => {
                          setIsComposing(false);
                          setNewTweetText('');
                          setTextareaHeights(prev => {
                            const { compose, ...rest } = prev;
                            return rest;
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        size="small"
                        disabled={!newTweetText.trim() || newTweetText.length > 280}
                        onClick={() => {
                          // Add tweet logic here
                          const newTweet: Tweet = {
                            id: `new-${Date.now()}`,
                            type: 'single',
                            status: 'draft',
                            created_at: new Date().toISOString(),
                            content: {
                              text: newTweetText,
                              char_count: newTweetText.length
                            },
                            metadata: {
                              title: 'Manual Tweet',
                              tags: []
                            }
                          };
                          setTweets([newTweet, ...tweets]);
                          setNewTweetText('');
                          setIsComposing(false);
                          setTextareaHeights(prev => {
                            const { compose, ...rest } = prev;
                            return rest;
                          });
                        }}
                      >
                        Tweet
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {tweets.map((tweet) => {
            if (tweet.type === 'single') {
              return (
                <article key={tweet.id} 
                  role="article"
                  tabIndex={0}
                  style={{
                    borderBottom: '1px solid rgb(239, 243, 244)',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: editingTweet === tweet.id ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                    outline: 'none'
                  }}
                  onClick={() => setEditingTweet(editingTweet === tweet.id ? null : tweet.id)}
                  onMouseEnter={(e) => {
                    if (editingTweet !== tweet.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (editingTweet !== tweet.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Avatar */}
                  <UserAvatar size={48} />
                  
                  {/* Tweet Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>Your Name</span>
                      <span style={{ color: '#536471', fontSize: '15px' }}>@handle</span>
                      <span style={{ color: '#536471', fontSize: '15px' }}>· Draft</span>
                    </div>
                    
                    {renderTweet(
                      tweet.content.text,
                      editingTweet === tweet.id,
                      (value) => updateTweetContent(tweet.id, value),
                      tweet.content.char_count,
                      tweet.id
                    )}
                    
                    {editingTweet === tweet.id && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginTop: '8px' 
                      }}>
                        <span style={{ 
                          fontSize: '13px', 
                          color: tweet.content.char_count > 280 ? '#f4212e' : '#536471' 
                        }}>
                          {tweet.content.char_count}/280
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button size="small" variant="secondary" onClick={(e) => {
                            e.stopPropagation();
                            setEditingTweet(null);
                          }}>Cancel</Button>
                          <Button size="small" variant="primary" onClick={(e) => {
                            e.stopPropagation();
                            // Save to JSON file
                            console.log('Saving tweet:', tweet.id);
                            setEditingTweet(null);
                          }}>Save</Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Tweet Actions */}
                    {!editingTweet && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        maxWidth: '425px',
                        marginTop: '12px'
                      }}>
                        <button style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgb(83, 100, 113)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0',
                          fontSize: '13px',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(29, 155, 240)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(83, 100, 113)'}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>
                          </svg>
                          <span>2</span>
                        </button>
                        
                        <button style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgb(83, 100, 113)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0',
                          fontSize: '13px',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(0, 186, 124)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(83, 100, 113)'}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
                          </svg>
                          <span>5</span>
                        </button>
                        
                        <button style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgb(83, 100, 113)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0',
                          fontSize: '13px',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(249, 24, 128)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(83, 100, 113)'}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
                          </svg>
                          <span>12</span>
                        </button>
                        
                        <button style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgb(83, 100, 113)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0',
                          fontSize: '13px'
                        }}>
                          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                            <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/>
                          </svg>
                          <span>1.2K</span>
                        </button>
                        
                        <button style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgb(83, 100, 113)',
                          cursor: 'pointer',
                          padding: '0'
                        }}>
                          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                            <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {/* Metadata */}
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '8px',
                      backgroundColor: '#f7f9fa',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#536471'
                    }}>
                      {tweet.metadata.tags.map(tag => `#${tag}`).join(' ')}
                    </div>
                  </div>
                </div>
              </article>
            );
          } else {
            // Thread
            const isExpanded = expandedThreads.has(tweet.id);
            return (
              <div key={tweet.id} style={{
                borderBottom: '1px solid rgb(239, 243, 244)'
              }}>
                {/* Thread Header - Always visible */}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => toggleThreadExpansion(tweet.id)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Avatar with thread line indicator */}
                  <div style={{ position: 'relative', marginRight: '12px', flexShrink: 0 }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <UserAvatar size={48} />
                    </div>
                    {/* Thread line preview */}
                    {!isExpanded && (
                      <div style={{
                        position: 'absolute',
                        left: '24px',
                        top: '48px',
                        bottom: '-16px',
                        width: '2px',
                        backgroundColor: 'rgb(207, 217, 222)',
                        opacity: 0.6
                      }} />
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    {/* Thread info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>Your Name</span>
                      <span style={{ color: '#536471', fontSize: '15px' }}>@handle</span>
                      <span style={{ color: '#536471', fontSize: '15px' }}>· Draft Thread</span>
                    </div>
                    
                    {/* First tweet preview */}
                    <div style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.4',
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: '#0f1419'
                    }}>
                      {tweet.content[0].text}
                    </div>
                    
                    {/* Thread indicator */}
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#1DA1F2',
                      fontSize: '14px',
                      fontWeight: '500',
                      background: 'none',
                      border: 'none',
                      padding: '4px 0',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <svg viewBox="0 0 24 24" style={{ 
                        width: '16px', 
                        height: '16px', 
                        fill: 'currentColor',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}>
                        <path d="M7 10l5 5 5-5H7z"/>
                      </svg>
                      <span>{isExpanded ? 'Hide' : 'Show'} thread ({tweet.content.length} tweets)</span>
                    </button>
                  </div>
                </div>
                
                {/* Expandable thread content */}
                <div style={{
                  maxHeight: isExpanded ? '2000px' : '0',
                  overflow: 'hidden',
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: isExpanded ? 'rgba(0, 0, 0, 0.01)' : 'transparent'
                }}>
                {isExpanded && tweet.content.map((t: any, index: number) => (
                  <div key={index} style={{ 
                    padding: '12px 16px',
                    paddingTop: index === 0 ? '12px' : '0',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: editingTweet === `${tweet.id}-${index}` ? 'rgba(0, 0, 0, 0.03)' : 'transparent'
                  }}
                  onClick={() => setEditingTweet(editingTweet === `${tweet.id}-${index}` ? null : `${tweet.id}-${index}`)}
                  onMouseEnter={(e) => {
                    if (editingTweet !== `${tweet.id}-${index}`) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (editingTweet !== `${tweet.id}-${index}`) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px',
                      position: 'relative'
                    }}>
                      {/* Avatar with thread line */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <UserAvatar size={48} />
                        </div>
                        {/* Thread line */}
                        {index < tweet.content.length - 1 && (
                          <div style={{
                            position: 'absolute',
                            left: '24px',
                            top: '48px',
                            bottom: '-24px',
                            width: '2px',
                            backgroundColor: 'rgb(207, 217, 222)'
                          }} />
                        )}
                      </div>
                    
                    {/* Tweet Content */}
                    <div style={{ flex: 1 }}>
                      {renderTweet(
                        t.text,
                        editingTweet === `${tweet.id}-${index}`,
                        (value) => updateTweetContent(tweet.id, value, index),
                        t.char_count,
                        `${tweet.id}-${index}`
                      )}
                      
                      {editingTweet === `${tweet.id}-${index}` && (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '8px' 
                        }}>
                          <span style={{ 
                            fontSize: '13px', 
                            color: t.char_count > 280 ? '#f4212e' : '#536471' 
                          }}>
                            {t.char_count}/280
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button size="small" variant="secondary" onClick={(e) => {
                              e.stopPropagation();
                              setEditingTweet(null);
                            }}>Cancel</Button>
                            <Button size="small" variant="primary" onClick={(e) => {
                              e.stopPropagation();
                              // Save to JSON file
                              console.log('Saving thread tweet:', tweet.id, index);
                              setEditingTweet(null);
                            }}>Save</Button>
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            );
          }
        })}
        </div>
        
        {/* End of feed indicator */}
        <div style={{
          padding: '40px 20px 60px',
          textAlign: 'center',
          borderTop: '1px solid rgb(239, 243, 244)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            color: '#536471'
          }}>
            <svg viewBox="0 0 24 24" style={{ 
              width: '32px', 
              height: '32px', 
              fill: 'currentColor',
              opacity: 0.5
            }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8zm8-2c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1zm0-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
            </svg>
            <p style={{ 
              fontSize: '15px',
              margin: 0,
              fontWeight: '400'
            }}>
              You've reached the end
            </p>
            <p style={{ 
              fontSize: '13px',
              margin: 0,
              opacity: 0.8
            }}>
              No more drafts to show
            </p>
          </div>
        </div>
      </div>
      </div>
      
      {/* Right Sidebar - Scheduled Tweets */}
      <div style={{
        width: '320px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflow: 'hidden'
      }}>
        <div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '16px' 
          }}>
            <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor', marginRight: '8px' }}>
              <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"/>
            </svg>
            Scheduled Tweets
          </h3>
          
          {/* Scheduled tweets list */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f7f9fa',
              borderRadius: '8px',
              border: '1px solid #e1e8ed'
            }}>
              <div style={{ 
                fontSize: '13px', 
                color: '#536471',
                marginBottom: '4px'
              }}>
                Tomorrow at 9:00 AM
              </div>
              <div style={{ fontSize: '14px' }}>
                Excited to announce our new feature launch! 🚀 Stay tuned for more updates...
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              backgroundColor: '#f7f9fa',
              borderRadius: '8px',
              border: '1px solid #e1e8ed'
            }}>
              <div style={{ 
                fontSize: '13px', 
                color: '#536471',
                marginBottom: '4px'
              }}>
                Friday at 2:00 PM
              </div>
              <div style={{ fontSize: '14px' }}>
                Weekend reading: Check out this amazing article about the future of AI...
              </div>
            </div>
          </div>
        </div>
        
        {/* Tweet Analytics */}
        <div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '12px' 
          }}>
            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor', marginRight: '8px' }}>
              <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/>
            </svg>
            Draft Analytics
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '14px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #e1e8ed'
            }}>
              <span style={{ color: '#536471' }}>Total Drafts</span>
              <span style={{ fontWeight: '600' }}>{tweets.length}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #e1e8ed'
            }}>
              <span style={{ color: '#536471' }}>Threads</span>
              <span style={{ fontWeight: '600' }}>{tweets.filter(t => t.type === 'thread').length}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0'
            }}>
              <span style={{ color: '#536471' }}>Single Tweets</span>
              <span style={{ fontWeight: '600' }}>{tweets.filter(t => t.type === 'single').length}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '12px' 
          }}>
            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor', marginRight: '8px' }}>
              <path d="M3.75 12c0-4.56 3.69-8.25 8.25-8.25s8.25 3.69 8.25 8.25-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12zM12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-4.75 11.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25S6 11.31 6 12s.56 1.25 1.25 1.25zm9.5 0c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zM13.25 12c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25z"/>
            </svg>
            Quick Actions
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <Button 
              variant="secondary" 
              size="small"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor', marginRight: '8px' }}>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"/>
              </svg>
              Import from Storage
            </Button>
            <Button 
              variant="secondary" 
              size="small"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor', marginRight: '8px' }}>
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
              </svg>
              Export All Drafts
            </Button>
            <Button 
              variant="secondary" 
              size="small"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor', marginRight: '8px' }}>
                <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"/>
              </svg>
              Schedule Tweet
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}