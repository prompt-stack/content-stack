/**
 * @file layout/InboxLayout.tsx
 * @purpose Layout wrapper with sidebar for inbox page
 * @layer feature
 * @deps [SidebarProvider, Sidebar, Box, useSidebarShortcuts]
 * @used-by [InboxPage]
 * @css /src/styles/layout/inbox-layout.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from '../components/ToastContainer';
import { useToast } from '../hooks/useToast';
import { 
  Home, 
  Inbox, 
  Settings, 
  HelpCircle,
  FileText,
  Upload,
  Link,
  Clipboard,
  FolderOpen,
  Search
} from 'lucide-react';
import { SidebarProvider } from '../contexts/SidebarContext';
import { Sidebar, SidebarToggle } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { useSidebarShortcuts } from '../hooks/useSidebarShortcuts';
import { useContentInbox } from '../contexts/ContentInboxContext';
import { Modal } from '../components/Modal';
import { Box } from '../components/Box';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { LogoUploader } from '../components/LogoUploader';
import type { SidebarSection } from '../components/Sidebar/types';

interface InboxLayoutContentProps {
  children: ReactNode;
}

function InboxLayoutContent({ children }: InboxLayoutContentProps) {
  const { isCollapsed, isMobile, setCollapsed } = useSidebar();
  const { addContent, queue } = useContentInbox();
  const location = useLocation();
  const toast = useToast();
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  useSidebarShortcuts();

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      try {
        for (const file of files) {
          await addContent({
            type: 'drop',
            content: file
          });
        }
        toast.success(`${files.length} file${files.length > 1 ? 's' : ''} dropped into inbox`);
      } catch (error) {
        toast.error('Failed to add dropped files');
      }
    }
  };

  // Calculate storage usage
  const storageUsed = queue.reduce((total, item) => total + (item.size || 0), 0);
  const isLocalStorage = true; // This can be determined from config later
  const storageLimit = isLocalStorage ? 0 : 10 * 1024 * 1024; // 0 means unlimited
  const storagePercent = isLocalStorage ? 0 : (storageUsed / storageLimit) * 100;
  const queueCount = queue.length;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const sidebarSections: SidebarSection[] = [
  {
    id: 'actions',
    title: 'Add Content',
    items: [
      {
        id: 'upload',
        label: 'Upload Files',
        icon: <Upload size={20} />,
        onClick: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.addEventListener('change', async (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
              try {
                for (const file of Array.from(files)) {
                  await addContent({
                    type: 'upload',
                    content: file
                  });
                }
                toast.success(`${files.length} file${files.length > 1 ? 's' : ''} added to inbox`);
              } catch (error) {
                toast.error('Failed to upload files');
              }
            }
          });
          input.click();
        }
      },
      {
        id: 'paste',
        label: 'Paste Content',
        icon: <Clipboard size={20} />,
        onClick: () => {
          setPasteModalOpen(true);
        }
      },
      {
        id: 'url',
        label: 'Link',
        icon: <Link size={20} />,
        isInput: !isCollapsed,
        placeholder: 'Paste URL here...',
        onClick: isCollapsed ? () => setLinkModalOpen(true) : undefined,
        onSubmit: async (url: string) => {
          try {
            await addContent({
              type: 'url',
              content: url
            });
            toast.success('Link added to inbox');
          } catch (error) {
            toast.error('Failed to add link');
          }
        }
      },
      {
        id: 'dragdrop',
        label: isDragging ? 'Drop files here!' : 'Drag & Drop',
        icon: <FolderOpen size={20} className={isDragging ? 'animate-pulse' : ''} />,
        isDisabled: !isDragging,
        className: isDragging ? 'sidebar__item--drop-active' : '',
        tooltip: isDragging ? 'Release to add files' : 'Drag files anywhere on the sidebar'
      },
    ]
  },
  {
    id: 'main',
    items: [
      {
        id: 'inbox',
        label: 'Inbox',
        icon: <Inbox size={20} />,
        href: '/inbox',
        badge: queue.length > 0 ? queue.length : undefined,
        active: location.pathname === '/inbox'
      },
      {
        id: 'storage',
        label: 'Storage',
        icon: <FileText size={20} />,
        href: '/storage',
        active: location.pathname === '/storage'
      },
      {
        id: 'search',
        label: 'Search',
        icon: <Search size={20} />,
        href: '/search',
        active: location.pathname === '/search'
      }
    ]
  }
];

  const mainClasses = [
    'inbox-layout__main',
    !isMobile && isCollapsed && 'inbox-layout__main--expanded'
  ].filter(Boolean).join(' ');

  return (
    <div className="inbox-layout">
      <div 
        className="sidebar-wrapper"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Sidebar 
          sections={sidebarSections}
          header={
            <div className="sidebar__brand">
              <LogoUploader size={24} showUploadHint={!isCollapsed} />
              {!isCollapsed && <span className="sidebar__brand-text">Content Stack</span>}
            </div>
          }
          footer={
            <Box className="sidebar__footer-content">
              <Box className="sidebar__footer-items">
                <a href="/settings" className="sidebar__footer-item">
                  <Settings size={18} />
                  {!isCollapsed && <span className="sidebar__footer-label">Settings</span>}
                </a>
                <a href="/help" className="sidebar__footer-item">
                  <HelpCircle size={18} />
                  {!isCollapsed && <span className="sidebar__footer-label">Help</span>}
                </a>
              </Box>
              {!isCollapsed && (
                <div className="sidebar__storage-footer">
                <div className="sidebar__storage-item">
                  <div className="sidebar__storage-header">
                    <Text size="sm" color="muted">Local Storage</Text>
                    <Text size="sm">
                      {isLocalStorage ? (
                        <span><strong>{formatBytes(storageUsed)}</strong> / Unlimited</span>
                      ) : (
                        <span><strong>{formatBytes(storageUsed)}</strong> / {formatBytes(storageLimit)}</span>
                      )}
                    </Text>
                  </div>
                  {!isLocalStorage && (
                    <div className="sidebar__storage-progress">
                      <div 
                        className="sidebar__storage-progress-bar" 
                        style={{ 
                          width: `${Math.min(storagePercent, 100)}%`,
                          backgroundColor: storagePercent > 90 ? 'var(--color-error)' : 'var(--color-primary)'
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="sidebar__storage-item">
                  <div className="sidebar__storage-header">
                    <Text size="sm" color="muted">Items in Queue</Text>
                    <Text size="sm">
                      <strong>{queueCount}</strong> items
                    </Text>
                  </div>
                </div>
              </div>
              )}
            </Box>
          }
        />
        {isDragging && (
          <div className="sidebar__drop-indicator">
            <FolderOpen size={32} />
            <p>Drop to add to inbox</p>
          </div>
        )}
      </div>
      
      <main className={mainClasses}>
        {/* Mobile header with toggle */}
        {isMobile && (
          <header className="inbox-layout__mobile-header">
            <SidebarToggle />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogoUploader size={20} showUploadHint={false} />
              <h1 className="inbox-layout__mobile-title">Content Stack</h1>
            </div>
          </header>
        )}
        
        <div className="inbox-layout__content">
          {children}
        </div>
      </main>
      
      {/* Paste Content Modal */}
      <Modal
        isOpen={pasteModalOpen}
        onClose={() => {
          setPasteModalOpen(false);
          setPasteContent('');
          setPasteUrl('');
        }}
        title="Paste Content"
        size="medium"
      >
        <Box>
          <Box marginY="2">
            <Text>
              Paste your content below. Supported formats include text, code, URLs, and more.
            </Text>
          </Box>
          <textarea
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder="Paste your content here..."
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'inherit',
              fontSize: '14px',
              resize: 'vertical'
            }}
            autoFocus
          />
          <Box marginTop="3">
            <Box marginBottom="1">
              <Text size="sm" color="muted">
                Optional: Add a reference URL
              </Text>
            </Box>
            <input
              type="url"
              value={pasteUrl}
              onChange={(e) => setPasteUrl(e.target.value)}
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'inherit',
                fontSize: '14px'
              }}
            />
          </Box>
          <Box display="flex" justify="end" gap="sm" marginY="4">
            <Button
              variant="secondary"
              onClick={() => {
                setPasteModalOpen(false);
                setPasteContent('');
                setPasteUrl('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (pasteContent.trim()) {
                  try {
                    await addContent({
                      type: 'paste',
                      content: pasteContent.trim(),
                      metadata: pasteUrl ? { reference_url: pasteUrl } : undefined
                    });
                    setPasteModalOpen(false);
                    setPasteContent('');
                    setPasteUrl('');
                    toast.success('Content pasted to inbox');
                  } catch (error) {
                    toast.error('Failed to paste content');
                  }
                }
              }}
              disabled={!pasteContent.trim()}
            >
              Add to Inbox
            </Button>
          </Box>
        </Box>
      </Modal>
      
      {/* Link URL Modal */}
      <Modal
        isOpen={linkModalOpen}
        onClose={() => {
          setLinkModalOpen(false);
          setLinkUrl('');
        }}
        title="Add Link"
        size="small"
      >
        <Box>
          <Box marginY="2">
            <Text>
              Enter a URL to add to your inbox.
            </Text>
          </Box>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'inherit',
              fontSize: '14px'
            }}
            autoFocus
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && linkUrl.trim()) {
                try {
                  await addContent({
                    type: 'url',
                    content: linkUrl.trim()
                  });
                  setLinkModalOpen(false);
                  setLinkUrl('');
                  toast.success('Link added to inbox');
                } catch (error) {
                  toast.error('Failed to add link');
                }
              }
            }}
          />
          <Box display="flex" justify="end" gap="sm" marginY="4">
            <Button
              variant="secondary"
              onClick={() => {
                setLinkModalOpen(false);
                setLinkUrl('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (linkUrl.trim()) {
                  try {
                    await addContent({
                      type: 'url',
                      content: linkUrl.trim()
                    });
                    setLinkModalOpen(false);
                    setLinkUrl('');
                    toast.success('Link added to inbox');
                  } catch (error) {
                    toast.error('Failed to add link');
                  }
                }
              }}
              disabled={!linkUrl.trim()}
            >
              Add Link
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export interface InboxLayoutProps {
  children: ReactNode;
}

export function InboxLayout({ children }: InboxLayoutProps) {
  return (
    <SidebarProvider config={{ 
      defaultCollapsed: false,
      persistState: true,
      breakpoint: 1024 
    }}>
      <InboxLayoutContent>
        {children}
      </InboxLayoutContent>
      <ToastContainer />
    </SidebarProvider>
  );
}