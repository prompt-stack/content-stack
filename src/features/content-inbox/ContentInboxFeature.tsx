/**
 * @layer feature
 * @cssFile /styles/features/content-inbox.css
 * @dependencies Box, Button, Card
 * @className .content-inbox__
 */
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Text';
import { useCallback } from 'react';
import { ContentInboxInputPanel } from './components/ContentInboxInputPanel';
import { ContentInboxQueuePanel } from './components/ContentInboxQueuePanel';
import { useContentQueue } from './hooks/useContentQueue';

export function ContentInboxFeature() {
  const { queue, isProcessing, error, duplicateDialog, bulkDeleteDialog, addContent, updateContent, removeContent, bulkRemove, bulkUpdate, clearError, refreshQueue, checkSync } = useContentQueue();
  
  // console.log('ContentInboxFeature: removeContent function type:', typeof removeContent);
  
  const handleExport = useCallback((items: any[], format: 'json' | 'csv' | 'markdown') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `content-export-${timestamp}.${format}`;
    
    let content = '';
    let mimeType = '';
    
    switch (format) {
      case 'json':
        content = JSON.stringify(items, null, 2);
        mimeType = 'application/json';
        break;
      case 'csv':
        const headers = ['Title', 'Type', 'Category', 'Tags', 'Word Count', 'Timestamp', 'Content Preview'];
        const rows = items.map(item => [
          item.metadata.title || 'Untitled',
          item.type,
          item.metadata.category || 'Uncategorized',
          item.metadata.tags.join('; '),
          item.metadata.wordCount,
          item.timestamp.toISOString(),
          item.content.slice(0, 100).replace(/["\r\n]/g, ' ')
        ]);
        content = [headers, ...rows].map(row => 
          row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
        mimeType = 'text/csv';
        break;
      case 'markdown':
        content = `# Content Export - ${timestamp}\n\n`;
        items.forEach(item => {
          content += `## ${item.metadata.title || 'Untitled'}\n\n`;
          content += `**Type:** ${item.type}\n`;
          content += `**Category:** ${item.metadata.category || 'Uncategorized'}\n`;
          content += `**Tags:** ${item.metadata.tags.join(', ')}\n`;
          content += `**Words:** ${item.metadata.wordCount}\n`;
          content += `**Added:** ${item.timestamp.toISOString()}\n\n`;
          content += `${item.content}\n\n---\n\n`;
        });
        mimeType = 'text/markdown';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);
  
  return (
    <Box className="content-inbox__container">
      {/* Global Error Display */}
      {error && (
        <div className="content-inbox__error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={clearError} className="content-inbox__error-close">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="content-inbox__layout">
        <ContentInboxInputPanel onSubmit={addContent} />
        <ContentInboxQueuePanel 
          items={queue} 
          onUpdate={updateContent}
          onRemove={removeContent}
          onBulkRemove={bulkRemove}
          onBulkUpdate={bulkUpdate}
          onExport={handleExport}
          onRefresh={refreshQueue}
          onSyncCheck={checkSync}
        />
      </div>
      
      {/* Global Loading Overlay */}
      {isProcessing && (
        <div className="content-inbox__loading-overlay">
          <div className="content-inbox__loading-spinner"></div>
        </div>
      )}
      
      {/* Duplicate Content Dialog */}
      <Modal
        isOpen={!!duplicateDialog}
        onClose={() => duplicateDialog?.onCancel()}
        title="Duplicate Content Detected"
        size="medium"
      >
        {duplicateDialog && (
          <Box>
            <Text marginY="3">
              This content already exists in your inbox. Would you like to add it anyway as a duplicate?
            </Text>
            
            <Box display="flex" justify="end" gap="sm" marginY="4">
              <Button
                variant="secondary"
                onClick={duplicateDialog.onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={duplicateDialog.onApprove}
              >
                Add Anyway
              </Button>
            </Box>
          </Box>
        )}
      </Modal>
      
      {/* Bulk Delete Confirmation Dialog */}
      <Modal
        isOpen={!!bulkDeleteDialog}
        onClose={() => bulkDeleteDialog?.onCancel()}
        title="Confirm Bulk Delete"
        size="medium"
      >
        {bulkDeleteDialog && (
          <Box>
            <Text marginY="3">
              Are you sure you want to delete {bulkDeleteDialog.itemCount} item{bulkDeleteDialog.itemCount === 1 ? '' : 's'}? This action cannot be undone.
            </Text>
            
            <Box display="flex" justify="end" gap="sm" marginY="4">
              <Button
                variant="secondary"
                onClick={bulkDeleteDialog.onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={bulkDeleteDialog.onConfirm}
              >
                Delete {bulkDeleteDialog.itemCount} Item{bulkDeleteDialog.itemCount === 1 ? '' : 's'}
              </Button>
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
}