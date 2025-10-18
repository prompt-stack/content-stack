import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Text } from '@/components/Text';
import { ScrollContainer } from '@/components/ScrollContainer';

interface Article {
  original_title: string;
  url: string;
  extracted_title: string;
  content: string;
  htmlContent?: string;
  description?: string;
  author?: string;
  date?: string;
  wordCount: number;
  images?: Array<{ src: string; alt: string }>;
  extractedAt: string;
}

interface EmailContent {
  newsletter: string;
  date: string;
  platform: string;
  total_articles: number;
  extracted_count: number;
  articles: Article[];
  filename?: string;
}

export const EmailIntakePlayground: React.FC = () => {
  const [emails, setEmails] = useState<EmailContent[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailContent | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'content'>('list');

  useEffect(() => {
    fetchProcessedEmails();
  }, []);

  const fetchProcessedEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3457/api/email-intake/processed?type=full_content');
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Expected JSON but got:', contentType, text.substring(0, 200));
        throw new TypeError("Response is not JSON!");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setEmails(data.emails);
        if (data.emails.length > 0) {
          setSelectedEmail(data.emails[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching processed emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text>Loading processed emails...</Text>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mb-4">
        <Text variant="title">Email Intake - Article Viewer</Text>
        <Text variant="caption" className="text-gray-500">
          View and read articles extracted from your newsletters
        </Text>
      </div>
      
      <div className="flex h-[calc(100%-5rem)] gap-4">
        {/* Email List */}
        <div className="w-1/3 max-w-sm">
          <Card className="h-full p-4">
            <Text variant="subtitle" className="mb-4">Processed Newsletters</Text>
            <ScrollContainer className="h-[calc(100%-2rem)]">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className={`p-3 mb-2 rounded cursor-pointer transition-colors ${
                    selectedEmail === email ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedEmail(email);
                    setSelectedArticle(null);
                    setViewMode('list');
                  }}
                >
                  <Text className="font-medium truncate">{email.newsletter}</Text>
                  <Text variant="caption" className="text-gray-500">
                    {formatDate(email.date)}
                  </Text>
                  <div className="mt-1">
                    <Badge variant="secondary" size="sm">
                      {email.extracted_count}/{email.total_articles} articles
                    </Badge>
                  </div>
                </div>
              ))}
            </ScrollContainer>
          </Card>
        </div>

        {/* Article List / Content View */}
        <div className="flex-1">
          <Card className="h-full p-4">
            {selectedEmail && viewMode === 'list' && (
              <>
                <div className="mb-4">
                  <Text variant="subtitle">{selectedEmail.newsletter}</Text>
                  <Text variant="caption" className="text-gray-500">
                    {formatDate(selectedEmail.date)} • {selectedEmail.extracted_count} articles extracted
                  </Text>
                </div>
                <ScrollContainer className="h-[calc(100%-4rem)]">
                  {selectedEmail.articles.map((article, index) => (
                    <div
                      key={index}
                      className="p-4 mb-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedArticle(article);
                        setViewMode('content');
                      }}
                    >
                      <Text className="font-medium mb-1">
                        {article.extracted_title || article.original_title}
                      </Text>
                      {article.author && (
                        <Text variant="caption" className="text-gray-600">
                          By {article.author}
                        </Text>
                      )}
                      {article.description && (
                        <Text variant="body2" className="text-gray-600 mt-2 line-clamp-2">
                          {article.description}
                        </Text>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" size="sm">
                          {article.wordCount} words
                        </Badge>
                        <Text variant="caption" className="text-gray-500">
                          {new URL(article.url).hostname}
                        </Text>
                      </div>
                    </div>
                  ))}
                </ScrollContainer>
              </>
            )}

            {selectedArticle && viewMode === 'content' && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setViewMode('list');
                      setSelectedArticle(null);
                    }}
                  >
                    ← Back to articles
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(selectedArticle.url, '_blank')}
                  >
                    Open Original →
                  </Button>
                </div>
                <ScrollContainer className="h-[calc(100%-4rem)]">
                  <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold mb-2">
                      {selectedArticle.extracted_title || selectedArticle.original_title}
                    </h1>
                    {selectedArticle.author && (
                      <Text className="text-gray-600 mb-1">By {selectedArticle.author}</Text>
                    )}
                    {selectedArticle.date && (
                      <Text variant="caption" className="text-gray-500">
                        Published: {formatDate(selectedArticle.date)}
                      </Text>
                    )}
                    <div className="my-4 flex items-center gap-2">
                      <Badge variant="secondary">{selectedArticle.wordCount} words</Badge>
                      <Badge variant="secondary">{new URL(selectedArticle.url).hostname}</Badge>
                    </div>
                    {selectedArticle.description && (
                      <div className="my-4 p-4 bg-gray-50 rounded-lg">
                        <Text className="italic">{selectedArticle.description}</Text>
                      </div>
                    )}
                    <div className="mt-6 prose prose-sm max-w-none">
                      {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {selectedArticle.images && selectedArticle.images.length > 0 && (
                      <div className="mt-8">
                        <Text variant="subtitle" className="mb-4">Images</Text>
                        {selectedArticle.images.map((image, index) => (
                          <div key={index} className="mb-4">
                            <img 
                              src={image.src} 
                              alt={image.alt} 
                              className="max-w-full rounded-lg"
                            />
                            {image.alt && (
                              <Text variant="caption" className="text-gray-500 mt-1">
                                {image.alt}
                              </Text>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollContainer>
              </>
            )}

            {!selectedEmail && (
              <div className="flex items-center justify-center h-full">
                <Text className="text-gray-500">Select a newsletter to view articles</Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};