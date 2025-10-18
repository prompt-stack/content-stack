/**
 * @file layout/BaseLayout.tsx
 * @purpose Basic layout wrapper without ContentInbox dependency
 * @layer layout
 * @deps [Sidebar, SidebarProvider]
 * @used-by [StoragePage, other non-inbox pages]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { Sidebar, SidebarToggle } from '@/components/Sidebar';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from '@/components/ToastContainer';
import { LogoUploader } from '@/components/LogoUploader';
import { 
  Home, 
  Inbox, 
  FileText, 
  HelpCircle,
  Settings,
  Upload,
  Link,
  Clipboard,
  FolderOpen,
  Search,
  Twitter,
  Linkedin,
  Sparkles
} from 'lucide-react';
import type { SidebarSection } from '@/components/Sidebar/types';
import { AppHeader } from '@/components/AppHeader';
import '../styles/layout/base-layout.css';
import '../styles/components/app-header.css';

interface BaseLayoutProps {
  children: ReactNode;
}

interface BaseLayoutContentProps {
  children: ReactNode;
}

function BaseLayoutContent({ children }: BaseLayoutContentProps) {
  const { isCollapsed, isMobile } = useSidebar();
  const location = useLocation();
  
  // Content pipeline pages that should not have main scroll
  const noScrollPaths = ['/inbox', '/storage', '/search', '/studio'];
  const isNoScrollPage = noScrollPaths.includes(location.pathname);
  const [storageStats, setStorageStats] = useState<{
    totalSize: number;
    fileCount: number;
    embeddingCount: number;
  }>({ totalSize: 0, fileCount: 0, embeddingCount: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    try {
      const response = await Api.get('/api/storage/stats');
      if (response.success && response.stats) {
        let totalSize = 0;
        let fileCount = 0;
        
        Object.values(response.stats).forEach((stat: any) => {
          totalSize += stat.size;
          fileCount += stat.count;
        });
        
        // Mock embedding count for now
        const embeddingCount = Math.floor(fileCount * 0.3);
        
        setStorageStats({ totalSize, fileCount, embeddingCount });
      }
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  // For local storage, we show unlimited capacity
  const isLocalStorage = true; // This can be determined from config later
  const storageLimit = isLocalStorage ? 0 : 10 * 1024 * 1024; // 0 means unlimited
  const storagePercent = isLocalStorage ? 0 : (storageStats.totalSize / storageLimit) * 100;
  const queueCount = storageStats.fileCount; // Using file count as queue count for non-inbox pages

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const sidebarSections: SidebarSection[] = [
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      items: [
        {
          id: 'new-tweet',
          label: 'New Tweet',
          icon: <Twitter size={20} />,
          onClick: () => navigate('/studio?tab=twitter&action=new')
        },
        {
          id: 'new-post',
          label: 'New LinkedIn Post',
          icon: <Linkedin size={20} />,
          onClick: () => navigate('/studio?tab=linkedin&action=new')
        },
        {
          id: 'batch-enrich',
          label: 'Enrich Storage',
          icon: <Sparkles size={20} />,
          onClick: () => navigate('/storage?action=enrich')
        },
      ]
    },
    {
      id: 'actions',
      title: 'Add Content',
      items: [
        {
          id: 'upload',
          label: 'Upload Files',
          icon: <Upload size={20} />,
          onClick: () => {
            // Navigate to inbox and trigger upload
            window.location.href = '/inbox';
            setTimeout(() => {
              const uploadBtn = document.querySelector('[data-action="upload"]') as HTMLElement;
              if (uploadBtn) uploadBtn.click();
            }, 100);
          }
        },
        {
          id: 'paste',
          label: 'Paste Content',
          icon: <Clipboard size={20} />,
          onClick: () => {
            // Navigate to inbox and trigger paste modal
            window.location.href = '/inbox';
            setTimeout(() => {
              const pasteBtn = document.querySelector('[data-action="paste"]') as HTMLElement;
              if (pasteBtn) pasteBtn.click();
            }, 100);
          }
        },
        {
          id: 'url',
          label: 'Link',
          icon: <Link size={20} />,
          isInput: true,
          placeholder: 'Paste URL here...',
          onSubmit: async (url: string) => {
            // Navigate to inbox with URL parameter
            window.location.href = `/inbox?url=${encodeURIComponent(url)}`;
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
  ];

  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Navigate to inbox with the dropped files
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Store files in sessionStorage to pass to inbox
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      sessionStorage.setItem('droppedFiles', JSON.stringify(fileData));
      navigate('/inbox');
    }
  };

  return (
    <div className={`base-layout ${isNoScrollPage ? 'base-layout--no-scroll' : ''}`}>
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
            {!isCollapsed && (
              <div className="sidebar__storage-footer">
                <div className="sidebar__storage-item">
                  <div className="sidebar__storage-header">
                    <Text size="sm" color="muted">Local Storage</Text>
                    <Text size="sm">
                      {isLocalStorage ? (
                        <span><strong>{formatBytes(storageStats.totalSize)}</strong> / Unlimited</span>
                      ) : (
                        <span><strong>{formatBytes(storageStats.totalSize)}</strong> / {formatBytes(storageLimit)}</span>
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
                    <Text size="sm" color="muted">Total Files</Text>
                    <Text size="sm">
                      <strong>{queueCount}</strong> {queueCount === 1 ? 'file' : 'files'}
                    </Text>
                  </div>
                </div>
              </div>
            )}
            <Box className="sidebar__footer-items">
              <a href="/studio" className="sidebar__footer-item">
                <FileText size={18} />
                {!isCollapsed && <span className="sidebar__footer-label">Studio</span>}
              </a>
              <a href="/settings" className="sidebar__footer-item">
                <Settings size={18} />
                {!isCollapsed && <span className="sidebar__footer-label">Settings</span>}
              </a>
              <a href="/help" className="sidebar__footer-item">
                <HelpCircle size={18} />
                {!isCollapsed && <span className="sidebar__footer-label">Help</span>}
              </a>
            </Box>
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
      
      <main className={`base-layout__main ${isCollapsed && !isMobile ? 'base-layout__main--expanded' : ''}`}>
        <AppHeader />
        <div className="base-layout__content">
          {children}
        </div>
      </main>
    </div>
  );
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <SidebarProvider config={{ 
      defaultCollapsed: false,
      persistState: true,
      breakpoint: 1024 
    }}>
      <BaseLayoutContent>
        {children}
      </BaseLayoutContent>
      <ToastContainer />
    </SidebarProvider>
  );
}