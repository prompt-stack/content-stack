/**
 * @file features/content-inbox/components/ContentInboxInputPanel.tsx
 * @purpose [TODO: Add purpose]
 * @layer feature
 * @deps none
 * @used-by [ContentInboxFeature]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState, useRef } from 'react';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Textarea';
import { FileInput } from '@/components/FileInput';
import { Card } from '@/components/Card';
import { Text } from '@/components/Text';
import { ContentSubmission } from '../types';

interface ContentInboxInputPanelProps {
  onSubmit: (submission: ContentSubmission) => Promise<any>;
}

export function ContentInboxInputPanel({ onSubmit }: ContentInboxInputPanelProps) {
  const [activeMethod, setActiveMethod] = useState<'paste' | 'upload' | 'url' | 'drop'>('paste');
  const [urlContent, setUrlContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const pasteContentRef = useRef<HTMLTextAreaElement>(null);

  const handlePasteSubmit = async () => {
    const content = pasteContentRef.current?.value || '';
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        type: 'paste',
        content: content
      });
      // Clear the textarea
      if (pasteContentRef.current) {
        pasteContentRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        await onSubmit({
          type: 'upload',
          content: file
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlContent.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        type: 'url',
        content: urlContent
      });
      setUrlContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract from URL');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setActiveMethod('drop');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileSelect(files);
    }
  };

  return (
    <Box 
      className="content-inbox__input-panel"
      onDragEnter={handleDragEnter}
    >
      <Text as="h2" className="content-inbox__panel-title">
        Add Content
      </Text>
      
      {/* Error Display */}
      {error && (
        <div className="content-inbox__error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="content-inbox__error-close">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="content-inbox__input-methods">
        {/* Paste Method */}
        <Card 
          className={`content-inbox__input-method ${
            activeMethod === 'paste' ? 'content-inbox__input-method--active' : ''
          }`}
          onClick={() => setActiveMethod('paste')}
        >
          <Box display="flex" align="center" gap="sm">
            <span className="btn__icon-left">
              <i className="fas fa-clipboard" />
            </span>
            <Text weight="medium">Paste Content</Text>
          </Box>
          {activeMethod === 'paste' && (
            <Box marginY="3">
              <Textarea
                ref={pasteContentRef}
                placeholder="Paste your content here..."
                rows={6}
                fullWidth
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                className="content-inbox__paste-textarea"
              />
              <Box marginY="2">
                <Button
                  onClick={handlePasteSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Processing...' : 'Add to Queue'}
                </Button>
              </Box>
            </Box>
          )}
        </Card>

        {/* Upload Method */}
        <Card 
          className={`content-inbox__input-method ${
            activeMethod === 'upload' ? 'content-inbox__input-method--active' : ''
          }`}
          onClick={() => setActiveMethod('upload')}
        >
          <Box display="flex" align="center" gap="sm">
            <span className="btn__icon-left">
              <i className="fas fa-upload" />
            </span>
            <Text weight="medium">Upload File</Text>
          </Box>
          {activeMethod === 'upload' && (
            <Box marginY="3">
              <FileInput
                accept=".txt,.md,.doc,.docx,.pdf"
                multiple
                onChange={handleFileSelect}
                disabled={isSubmitting}
              >
                <Box 
                  padding="4"
                  className="content-inbox__upload-area"
                  style={{ 
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <Text>Click to select files</Text>
                  <Text size="sm" variant="secondary">
                    Supports: .txt, .md, .doc, .docx, .pdf
                  </Text>
                </Box>
              </FileInput>
            </Box>
          )}
        </Card>

        {/* URL Method */}
        <Card 
          className={`content-inbox__input-method ${
            activeMethod === 'url' ? 'content-inbox__input-method--active' : ''
          }`}
          onClick={() => setActiveMethod('url')}
        >
          <Box display="flex" align="center" gap="sm">
            <span className="btn__icon-left">
              <i className="fas fa-link" />
            </span>
            <Text weight="medium">Extract from URL</Text>
          </Box>
          {activeMethod === 'url' && (
            <Box marginY="3">
              <input
                type="url"
                value={urlContent}
                onChange={(e) => setUrlContent(e.target.value)}
                placeholder="https://example.com/article"
                className="content-inbox__url-input"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)'
                }}
              />
              <Box marginY="2">
                <Button
                  onClick={handleUrlSubmit}
                  disabled={!urlContent.trim() || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Extracting...' : 'Extract Content'}
                </Button>
              </Box>
            </Box>
          )}
        </Card>

        {/* Drag & Drop */}
        <div
          ref={dropZoneRef}
          className={`content-inbox__input-method ${
            activeMethod === 'drop' ? 'content-inbox__input-method--active' : ''
          } ${isDragging ? 'content-inbox__input-method--dragging' : ''}`}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => setActiveMethod('drop')}
        >
          <Card variant="outlined">
            <Box display="flex" align="center" gap="sm">
              <span className="btn__icon-left">
                <i className="fas fa-file-arrow-down" />
              </span>
              <Text weight="medium">Drag & Drop</Text>
            </Box>
            {(activeMethod === 'drop' || isDragging) && (
              <Box marginY="3">
                <Box 
                  padding="5"
                  className="content-inbox__drop-zone"
                  style={{ 
                    border: `3px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    background: isDragging ? 'var(--color-primary-light)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Box display="flex" align="center" justify="center" gap="sm">
                    <span className="btn__icon-left content-inbox__icon-xl">
                      <i className="fas fa-file-arrow-down" />
                    </span>
                    <Text size="lg">
                      {isDragging ? 'Drop files here!' : 'Drag files here'}
                    </Text>
                  </Box>
                  <Text size="sm" variant="secondary">
                    Drop any text or document files
                  </Text>
                </Box>
              </Box>
            )}
          </Card>
        </div>
      </div>
    </Box>
  );
}
