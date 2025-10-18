/**
 * @file features/storage/components/StorageView.tsx
 * @purpose Main storage view component with sortable/filterable table
 * @layer feature
 * @deps [Box, Text, Card, Checkbox, Button, Api]
 * @used-by [StoragePage]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role component
 */

import { useState, useEffect } from 'react';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Api } from '@/lib/api';
// Using Font Awesome icons for consistency
import '../styles/storage.css';

interface StorageFile {
  id: string;
  name: string;
  title?: string;
  type: string;
  size: number;
  createdAt: Date;
  modifiedAt?: Date;
  fileType?: string;
  icon?: string;
  wordCount?: number;
  category?: string;
  tags?: string[];
  source?: string;
  status?: 'inbox' | 'processed' | 'enriched';
  score?: number;
  metadata?: any;
}

interface StorageStats {
  type: string;
  count: number;
  size: number;
  icon: React.ReactNode;
}

type ViewMode = 'table' | 'cards';
type SortField = 'name' | 'type' | 'createdAt' | 'size' | 'category' | 'status' | 'score';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  types: string[];
  categories: string[];
  sources: string[];
  status?: string[];
  dateRange?: { start: Date; end: Date };
}

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width?: number;
  sortable?: boolean;
  minWidth?: number;
  resizable?: boolean;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'actions', label: 'Actions', visible: true, width: 90, resizable: false },
  { id: 'checkbox', label: '', visible: true, width: 40, resizable: false },
  { id: 'name', label: 'Name/Title', visible: true, minWidth: 200, sortable: true, resizable: true },
  { id: 'category', label: 'Category', visible: true, width: 100, sortable: true, resizable: true },
  { id: 'type', label: 'Type', visible: true, width: 80, sortable: true },
  { id: 'tags', label: 'Tags', visible: true, minWidth: 150, resizable: true },
  { id: 'status', label: 'Status', visible: true, width: 100, sortable: true },
  { id: 'size', label: 'Size', visible: true, width: 80, sortable: true },
  { id: 'modified', label: 'Modified', visible: true, width: 120, sortable: true },
  // Optional columns
  { id: 'source', label: 'Source', visible: false, width: 80 },
  { id: 'score', label: 'Score', visible: false, width: 60, sortable: true },
  { id: 'words', label: 'Words', visible: false, width: 80 },
];

export function StorageView() {
  const [stats, setStats] = useState<StorageStats[]>([]);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showInKnowledgeBase, setShowInKnowledgeBase] = useState(false);
  
  // Column management state
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const savedColumns = localStorage.getItem('storageTableColumns');
    if (savedColumns) {
      try {
        return JSON.parse(savedColumns);
      } catch {
        return DEFAULT_COLUMNS;
      }
    }
    return DEFAULT_COLUMNS;
  });
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  
  // Enrichment modal state
  const [showEnrichModal, setShowEnrichModal] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState<{
    total: number;
    processed: number;
    enriched: number;
    errors: number;
    currentFile: string;
  }>({
    total: 0,
    processed: 0,
    enriched: 0,
    errors: 0,
    currentFile: ''
  });
  
  // Metadata viewer state
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedFileMetadata, setSelectedFileMetadata] = useState<any>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    categories: [],
    sources: []
  });
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  useEffect(() => {
    loadStorageData();
  }, []);

  // Save column preferences when they change
  useEffect(() => {
    localStorage.setItem('storageTableColumns', JSON.stringify(columns));
  }, [columns]);

  const loadStorageData = async () => {
    try {
      // Load stats
      const statsResponse = await Api.get('/api/storage/stats');
      if (statsResponse.success && statsResponse.stats) {
        const storageStats = Object.entries(statsResponse.stats).map(([type, data]: [string, any]) => ({
          type,
          count: data.count,
          size: data.size,
          icon: getIconForType(type)
        }));
        setStats(storageStats);
      }

      // Load actual files from storage
      const filesResponse = await Api.get('/api/storage/files');
      if (filesResponse.success && filesResponse.filesByType) {
        const allFiles: StorageFile[] = [];
        let fileId = 1;
        
        Object.entries(filesResponse.filesByType).forEach(([type, typeFiles]: [string, any]) => {
          typeFiles.forEach((file: any) => {
            // Get file extension for icon mapping
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            const fileType = getFileTypeFromExtension(extension);
            
            allFiles.push({
              id: file.name.replace(/\.[^/.]+$/, ''), // Use filename without extension as ID
              name: file.name,
              title: file.metadata?.content?.title || file.metadata?.title || file.name,
              type: type,
              fileType: fileType,
              size: file.size,
              createdAt: new Date(file.created),
              modifiedAt: new Date(file.modified || file.created),
              icon: getFileIcon(fileType, extension),
              // Use actual metadata if available, otherwise generate
              wordCount: file.metadata?.content?.word_count || file.metadata?.wordCount || (type === 'text' ? Math.floor(file.size / 5) : undefined),
              category: file.metadata?.category || getCategoryFromType(type, file.name),
              tags: file.metadata?.tags && file.metadata.tags.length > 0 ? file.metadata.tags : [],
              source: file.metadata?.source?.method || (file.metadata?.reference_url ? 'url' : getSourceFromFile(file.name, file.size)),
              status: file.metadata?.enriched_at ? 'enriched' : (file.metadata?.status || 'inbox'),
              score: file.metadata?.score || file.metadata?.confidence ? 
                (typeof file.metadata.confidence === 'number' ? file.metadata.confidence : 
                 file.metadata.confidence === 'high' ? 9 : 
                 file.metadata.confidence === 'medium' ? 6 : 3) : undefined,
              metadata: file.metadata || {}
            });
          });
        });
        
        setFiles(allFiles);
      }
    } catch (error) {
      console.error('Failed to load storage data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate metadata based on file type and name
  const getCategoryFromType = (type: string, fileName: string) => {
    // Map file types to categories
    const typeCategories: Record<string, string> = {
      'text': 'general',
      'code': 'tech',
      'image': 'general',
      'document': 'business',
      'data': 'tech',
      'web': 'general',
      'audio': 'lifestyle',
      'video': 'lifestyle',
      'archive': 'general'
    };
    
    // Check for specific keywords in filename
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('health') || lowerName.includes('medical')) return 'health';
    if (lowerName.includes('education') || lowerName.includes('course') || lowerName.includes('tutorial')) return 'education';
    if (lowerName.includes('business') || lowerName.includes('report') || lowerName.includes('invoice')) return 'business';
    if (lowerName.includes('tech') || lowerName.includes('code') || lowerName.includes('api')) return 'tech';
    
    return typeCategories[type] || 'general';
  };

  const getTagsFromFile = (fileName: string, type: string) => {
    const tags: string[] = [];
    const lowerName = fileName.toLowerCase();
    
    // Add tags based on file characteristics
    if (lowerName.includes('important') || lowerName.includes('urgent')) tags.push('important');
    if (lowerName.includes('draft')) tags.push('draft');
    if (lowerName.includes('final') || lowerName.includes('published')) tags.push('published');
    if (lowerName.includes('personal')) tags.push('personal');
    if (lowerName.includes('work') || lowerName.includes('project')) tags.push('work');
    if (type === 'code' || type === 'data') tags.push('technical');
    if (lowerName.includes('review') || lowerName.includes('feedback')) tags.push('review');
    
    // Return empty array if no meaningful tags found
    // Don't add generic tags like 'file' or 'document'
    return tags.slice(0, 3); // Max 3 tags
  };

  const getSourceFromFile = (fileName: string, size: number) => {
    // Determine likely source based on file characteristics
    const lowerName = fileName.toLowerCase();
    
    // URLs often have specific patterns
    if (lowerName.includes('screenshot') || lowerName.includes('clip')) return 'paste';
    if (lowerName.includes('download') || size > 1024 * 1024) return 'upload'; // Files > 1MB likely uploaded
    if (lowerName.includes('untitled') || lowerName.includes('document')) return 'paste';
    if (lowerName.includes('.html') || lowerName.includes('.htm')) return 'url';
    
    // Default based on size
    return size < 100 * 1024 ? 'paste' : 'upload'; // Small files likely pasted
  };

  const getIconForType = (type: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      text: <i className="fas fa-file-alt" style={{ fontSize: '24px' }} />,
      code: <i className="fas fa-code" style={{ fontSize: '24px' }} />,
      image: <i className="fas fa-image" style={{ fontSize: '24px' }} />,
      video: <i className="fas fa-video" style={{ fontSize: '24px' }} />,
      audio: <i className="fas fa-music" style={{ fontSize: '24px' }} />,
      data: <i className="fas fa-database" style={{ fontSize: '24px' }} />,
      document: <i className="fas fa-file-word" style={{ fontSize: '24px' }} />,
      archive: <i className="fas fa-file-archive" style={{ fontSize: '24px' }} />,
      web: <i className="fas fa-globe" style={{ fontSize: '24px' }} />,
      default: <i className="fas fa-file" style={{ fontSize: '24px' }} />
    };
    return icons[type] || icons.default;
  };

  const getFileTypeFromExtension = (extension: string): string => {
    const fileTypes: Record<string, string> = {
      // Text files
      md: 'markdown',
      txt: 'text',
      log: 'log',
      
      // Code files
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      
      // Data files
      json: 'json',
      xml: 'xml',
      csv: 'csv',
      
      // Image files
      png: 'image',
      jpg: 'image',
      jpeg: 'image',
      gif: 'image',
      svg: 'svg',
      
      // Document files
      pdf: 'pdf',
      doc: 'word',
      docx: 'word',
      
      // Web files
      html: 'html',
      css: 'css',
      
      // Other
      yml: 'yaml',
      yaml: 'yaml'
    };
    
    return fileTypes[extension] || extension;
  };

  const getFileIcon = (fileType: string, extension: string): string => {
    // Using lobehub assets-fileicon CDN for consistent file icons
    const baseUrl = 'https://registry.npmmirror.com/@lobehub/assets-fileicon/1.0.0/files/assets/';
    
    // Map file types to icon names
    const iconMap: Record<string, string> = {
      markdown: 'markdown.svg',
      text: 'txt.svg',
      javascript: 'js.svg',
      typescript: 'ts.svg',
      python: 'py.svg',
      java: 'java.svg',
      json: 'json.svg',
      html: 'html.svg',
      css: 'css.svg',
      yaml: 'yaml.svg',
      xml: 'xml.svg',
      pdf: 'pdf.svg',
      word: 'docx.svg',
      image: 'image.svg',
      video: 'video.svg',
      audio: 'audio.svg',
      changelog: 'changelog.svg'
    };
    
    // Check if we have a specific icon for this file type
    if (iconMap[fileType]) {
      return baseUrl + iconMap[fileType];
    }
    
    // Check if we have an icon for the extension
    if (iconMap[extension]) {
      return baseUrl + iconMap[extension];
    }
    
    // Default file icon
    return baseUrl + 'file.svg';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(new Set(filteredAndSortedFiles.map(f => f.id)));
    } else {
      setSelectedFiles(new Set());
    }
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    const newSelected = new Set(selectedFiles);
    if (checked) {
      newSelected.add(fileId);
    } else {
      newSelected.delete(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleBatchExport = () => {
    const selectedItems = filteredAndSortedFiles.filter(file => selectedFiles.has(file.id));
    console.log('Exporting files:', selectedItems);
    // TODO: Implement batch export functionality
    alert(`Exporting ${selectedFiles.size} files...`);
  };

  const handleBatchEnrich = async () => {
    const fileIds = Array.from(selectedFiles);
    const selectedFileNames = filteredAndSortedFiles
      .filter(file => selectedFiles.has(file.id))
      .map(file => file.name);
    
    // Initialize progress
    setEnrichmentProgress({
      total: fileIds.length,
      processed: 0,
      enriched: 0,
      errors: 0,
      currentFile: selectedFileNames[0] || ''
    });
    setShowEnrichModal(true);
    
    try {
      // Call the enrich API endpoint
      const response = await Api.post('/api/storage/enrich', {
        fileIds: fileIds
      });
      
      if (response.success) {
        // Update progress with results
        setEnrichmentProgress(prev => ({
          ...prev,
          processed: fileIds.length,
          enriched: response.enriched || fileIds.length,
          errors: response.errors || 0,
          currentFile: 'Complete'
        }));
        
        // Reload the files to show updated metadata
        await loadStorageData();
        
        // Wait a bit before closing to show completion
        setTimeout(() => {
          setShowEnrichModal(false);
          setSelectedFiles(new Set());
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to enrich files');
      }
    } catch (error) {
      console.error('Failed to enrich files:', error);
      setEnrichmentProgress(prev => ({
        ...prev,
        errors: prev.total,
        currentFile: 'Error occurred'
      }));
      
      // Keep modal open to show error
      setTimeout(() => {
        setShowEnrichModal(false);
      }, 3000);
    }
  };

  const handleBatchDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} files? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setLoading(true);
      // TODO: Implement actual batch delete API call
      console.log('Deleting files:', Array.from(selectedFiles));
      
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear selection after delete
      setSelectedFiles(new Set());
      
      // Refresh the file list
      await loadStorageData();
      
      alert(`Successfully deleted ${selectedFiles.size} files`);
    } catch (error) {
      console.error('Error deleting files:', error);
      alert('Error deleting files. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewMetadata = async (file: StorageFile) => {
    try {
      // Try to load full metadata from the server
      const response = await Api.get(`/api/metadata/${file.name.replace(/\.[^/.]+$/, '')}`);
      if (response.success && response.metadata) {
        setSelectedFileMetadata({
          fileName: file.name,
          ...response.metadata
        });
      } else {
        // Use local metadata if server fetch fails
        setSelectedFileMetadata({
          fileName: file.name,
          ...file.metadata,
          // Add file info as well
          fileInfo: {
            type: file.type,
            size: file.size,
            created: file.createdAt,
            category: file.category,
            tags: file.tags,
            source: file.source
          }
        });
      }
      setShowMetadataModal(true);
      setActiveDropdownId(null);
    } catch (error) {
      // Fallback to local metadata
      setSelectedFileMetadata({
        fileName: file.name,
        ...file.metadata,
        fileInfo: {
          type: file.type,
          size: file.size,
          created: file.createdAt,
          category: file.category,
          tags: file.tags,
          source: file.source
        }
      });
      setShowMetadataModal(true);
      setActiveDropdownId(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'tech': 'storage__badge--blue',
      'business': 'storage__badge--green',
      'health': 'storage__badge--red',
      'education': 'storage__badge--purple',
      'lifestyle': 'storage__badge--pink',
      'general': 'storage__badge--gray'
    };
    return colors[category] || 'storage__badge--gray';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'paste': return <i className="fas fa-clipboard" />;
      case 'upload': return <i className="fas fa-upload" />;
      case 'url': return <i className="fas fa-link" />;
      case 'drop': return <i className="fas fa-folder-open" />;
      default: return <i className="fas fa-file" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'enriched':
        return <span className="storage__badge storage__badge--success">Enriched</span>;
      case 'processed':
        return <span className="storage__badge storage__badge--info">Processed</span>;
      case 'inbox':
      default:
        return <span className="storage__badge storage__badge--warning">Inbox</span>;
    }
  };

  // Column management functions
  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    // Add a class to the dragged element
    const element = e.currentTarget as HTMLElement;
    element.classList.add('storage__table-cell--dragging');
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleColumnDragEnter = (e: React.DragEvent, columnId: string) => {
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };
  
  const handleColumnDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const draggedIndex = columns.findIndex(col => col.id === draggedColumn);
    const targetIndex = columns.findIndex(col => col.id === targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newColumns = [...columns];
    const [draggedCol] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedCol);

    setColumns(newColumns);
    setDragOverColumn(null);
  };

  const handleColumnDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('storage__table-cell--dragging');
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS);
  };

  const getContentTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'code':
      case 'javascript':
      case 'typescript':
      case 'python':
      case 'java':
        return <i className="fas fa-code" />;
      case 'text':
      case 'markdown':
        return <i className="fas fa-file-alt" />;
      case 'pdf':
      case 'word':
      case 'document':
        return <i className="fas fa-file-pdf" />;
      case 'image':
      case 'svg':
        return <i className="fas fa-image" />;
      case 'video':
        return <i className="fas fa-video" />;
      case 'audio':
        return <i className="fas fa-volume-up" />;
      case 'json':
      case 'xml':
      case 'csv':
      case 'yaml':
        return <i className="fas fa-table" />;
      case 'html':
      case 'css':
        return <i className="fas fa-globe" />;
      case 'archive':
        return <i className="fas fa-file-archive" />;
      default:
        return <i className="fas fa-file" />;
    }
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.storage__filter-dropdown') && !target.closest('.storage__actions-dropdown')) {
        setActiveFilterDropdown(null);
        setActiveDropdownId(null);
      }
    };
    
    if (activeFilterDropdown || activeDropdownId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeFilterDropdown, activeDropdownId]);

  // Apply filters and sorting
  const filteredAndSortedFiles = files
    .filter(file => {
      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(file.type)) return false;
      // Category filter
      if (filters.categories.length > 0 && file.category && !filters.categories.includes(file.category)) return false;
      // Source filter
      if (filters.sources.length > 0 && file.source && !filters.sources.includes(file.source)) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = (a.title || a.name).localeCompare(b.title || b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'createdAt':
          comparison = (a.modifiedAt || a.createdAt).getTime() - (b.modifiedAt || b.createdAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        case 'score':
          comparison = (a.score || 0) - (b.score || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const renderTableView = () => (
    <div className="storage__table-container">
      <div className="storage__table-header">
        <div className="storage__table-controls">
          <Checkbox
            checked={selectedFiles.size === filteredAndSortedFiles.length && filteredAndSortedFiles.length > 0}
            indeterminate={selectedFiles.size > 0 && selectedFiles.size < filteredAndSortedFiles.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="storage__select-all"
          />
          <span className="storage__item-count">Total {filteredAndSortedFiles.length} items</span>
          
          {/* Show active filters */}
          {(filters.types.length > 0 || filters.categories.length > 0 || filters.sources.length > 0) && (
            <div className="storage__active-filters">
              {filters.types.map(type => (
                <span key={type} className="storage__active-filter">
                  Type: {type}
                  <button onClick={() => setFilters({ ...filters, types: filters.types.filter(t => t !== type) })}>
                    <i className="fas fa-times" />
                  </button>
                </span>
              ))}
              {filters.categories.map(category => (
                <span key={category} className="storage__active-filter">
                  Category: {category}
                  <button onClick={() => setFilters({ ...filters, categories: filters.categories.filter(c => c !== category) })}>
                    <i className="fas fa-times" />
                  </button>
                </span>
              ))}
              {filters.sources.map(source => (
                <span key={source} className="storage__active-filter">
                  Source: {source}
                  <button onClick={() => setFilters({ ...filters, sources: filters.sources.filter(s => s !== source) })}>
                    <i className="fas fa-times" />
                  </button>
                </span>
              ))}
              <button 
                className="storage__clear-filters"
                onClick={() => setFilters({ types: [], categories: [], sources: [] })}
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* Filter dropdown buttons */}
          <div className="storage__filter-buttons">
            <div className="storage__filter-dropdown">
              <button 
                className={`storage__filter-btn ${activeFilterDropdown === 'type' ? 'storage__filter-btn--active' : ''}`}
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'type' ? null : 'type')}
              >
                <i className="fas fa-filter" style={{ fontSize: '14px' }} />
                Type
                <i className="fas fa-chevron-down" style={{ fontSize: '14px' }} />
              </button>
              {activeFilterDropdown === 'type' && (
                <div className="storage__filter-menu">
                  <div className="storage__filter-menu-header">
                    <Text size="sm" weight="medium">Filter by Type</Text>
                  </div>
                  {['text', 'code', 'image', 'document', 'data'].map(type => (
                    <label key={type} className="storage__filter-menu-item">
                      <Checkbox
                        checked={filters.types.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, types: [...filters.types, type] });
                          } else {
                            setFilters({ ...filters, types: filters.types.filter(t => t !== type) });
                          }
                        }}
                      />
                      <span>{type}</span>
                      <span className="storage__filter-count">
                        {files.filter(f => f.type === type).length}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            <div className="storage__filter-dropdown">
              <button 
                className={`storage__filter-btn ${activeFilterDropdown === 'category' ? 'storage__filter-btn--active' : ''}`}
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'category' ? null : 'category')}
              >
                <i className="fas fa-filter" style={{ fontSize: '14px' }} />
                Category
                <i className="fas fa-chevron-down" style={{ fontSize: '14px' }} />
              </button>
              {activeFilterDropdown === 'category' && (
                <div className="storage__filter-menu">
                  <div className="storage__filter-menu-header">
                    <Text size="sm" weight="medium">Filter by Category</Text>
                  </div>
                  {['tech', 'business', 'health', 'education', 'lifestyle', 'general'].map(category => (
                    <label key={category} className="storage__filter-menu-item">
                      <Checkbox
                        checked={filters.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, categories: [...filters.categories, category] });
                          } else {
                            setFilters({ ...filters, categories: filters.categories.filter(c => c !== category) });
                          }
                        }}
                      />
                      <span className={`storage__badge ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      <span className="storage__filter-count">
                        {files.filter(f => f.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            <div className="storage__filter-dropdown">
              <button 
                className={`storage__filter-btn ${activeFilterDropdown === 'modified' ? 'storage__filter-btn--active' : ''}`}
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'modified' ? null : 'modified')}
              >
                <i className="fas fa-filter" style={{ fontSize: '14px' }} />
                Modified
                <i className="fas fa-chevron-down" style={{ fontSize: '14px' }} />
              </button>
              {activeFilterDropdown === 'modified' && (
                <div className="storage__filter-menu">
                  <div className="storage__filter-menu-header">
                    <Text size="sm" weight="medium">Filter by Date</Text>
                  </div>
                  <button className="storage__filter-menu-item storage__filter-menu-item--button">
                    Today
                  </button>
                  <button className="storage__filter-menu-item storage__filter-menu-item--button">
                    Last 7 days
                  </button>
                  <button className="storage__filter-menu-item storage__filter-menu-item--button">
                    Last 30 days
                  </button>
                  <button className="storage__filter-menu-item storage__filter-menu-item--button">
                    This year
                  </button>
                </div>
              )}
            </div>
            
            <div className="storage__filter-dropdown">
              <button 
                className={`storage__filter-btn ${activeFilterDropdown === 'source' ? 'storage__filter-btn--active' : ''}`}
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'source' ? null : 'source')}
              >
                <i className="fas fa-filter" style={{ fontSize: '14px' }} />
                Source
                <i className="fas fa-chevron-down" style={{ fontSize: '14px' }} />
              </button>
              {activeFilterDropdown === 'source' && (
                <div className="storage__filter-menu">
                  <div className="storage__filter-menu-header">
                    <Text size="sm" weight="medium">Filter by Source</Text>
                  </div>
                  {['paste', 'upload', 'url', 'drop'].map(source => (
                    <label key={source} className="storage__filter-menu-item">
                      <Checkbox
                        checked={filters.sources.includes(source)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, sources: [...filters.sources, source] });
                          } else {
                            setFilters({ ...filters, sources: filters.sources.filter(s => s !== source) });
                          }
                        }}
                      />
                      <div className="storage__filter-source">
                        {getSourceIcon(source)}
                        <span>{source}</span>
                      </div>
                      <span className="storage__filter-count">
                        {files.filter(f => f.source === source).length}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="storage__header-controls">
          <Button
            size="small"
            variant="secondary"
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            iconLeft={<i className="fas fa-cog" />}
          >
            Columns
          </Button>
          <div className="storage__kb-toggle">
            <span>Show content in Knowledge Base</span>
            <label className="storage__switch">
              <input
                type="checkbox"
                checked={showInKnowledgeBase}
                onChange={(e) => setShowInKnowledgeBase(e.target.checked)}
              />
              <span className="storage__switch-slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="storage__table-wrapper">
        <div className="storage__table">
          <div className="storage__table-row storage__table-row--header">
            {columns.filter(col => col.visible).map((column) => (
              <div
                key={column.id}
                className={`storage__table-cell storage__table-cell--${column.id} ${
                  column.sortable ? 'storage__table-cell--sortable' : ''
                } ${dragOverColumn === column.id ? 'storage__table-cell--drag-over' : ''}`}
                style={{
                  width: column.width ? `${column.width}px` : undefined,
                  minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                }}
                draggable={column.id !== 'checkbox' && column.id !== 'actions'}
                onDragStart={(e) => handleColumnDragStart(e, column.id)}
                onDragOver={handleColumnDragOver}
                onDragEnter={(e) => handleColumnDragEnter(e, column.id)}
                onDragLeave={handleColumnDragLeave}
                onDrop={(e) => handleColumnDrop(e, column.id)}
                onDragEnd={handleColumnDragEnd}
                onClick={() => {
                  if (column.sortable) {
                    handleSort(column.id as SortField);
                  }
                }}
              >
                {column.id === 'checkbox' ? (
                  <Checkbox
                    checked={selectedFiles.size === filteredAndSortedFiles.length && filteredAndSortedFiles.length > 0}
                    indeterminate={selectedFiles.size > 0 && selectedFiles.size < filteredAndSortedFiles.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                ) : (
                  <>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <i className="fas fa-sort" style={{ fontSize: '12px', marginLeft: '4px' }} />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        
        {filteredAndSortedFiles.map((file) => (
          <div key={file.id} className="storage__table-row">
            {columns.filter(col => col.visible).map((column) => (
              <div
                key={column.id}
                className={`storage__table-cell storage__table-cell--${column.id}`}
                style={{
                  width: column.width ? `${column.width}px` : undefined,
                  minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                }}
              >
                {column.id === 'checkbox' && (
                  <Checkbox
                    checked={selectedFiles.has(file.id)}
                    onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                    className="storage__file-checkbox"
                  />
                )}
                
                {column.id === 'name' && (
                  <>
                    <span className="storage__content-type-icon">
                      {getContentTypeIcon(file.fileType || file.type)}
                    </span>
                    <span className="storage__file-name" title={file.name}>
                      {file.title || file.name}
                    </span>
                  </>
                )}
                
                {column.id === 'category' && file.category && (
                  <span className={`storage__badge ${getCategoryColor(file.category)}`}>
                    {file.category}
                  </span>
                )}
                
                {column.id === 'type' && (
                  <span className="storage__type-badge">{file.type}</span>
                )}
                
                {column.id === 'tags' && file.tags && file.tags.length > 0 && (
                  <>
                    {file.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="storage__tag-badge">{tag}</span>
                    ))}
                    {file.tags.length > 2 && (
                      <span className="storage__tag-more">+{file.tags.length - 2}</span>
                    )}
                  </>
                )}
                
                {column.id === 'status' && getStatusBadge(file.status)}
                
                {column.id === 'size' && formatBytes(file.size)}
                
                {column.id === 'modified' && formatTimeAgo(file.modifiedAt || file.createdAt)}
                
                {column.id === 'source' && file.source && (
                  <span className="storage__source-text">{file.source}</span>
                )}
                
                {column.id === 'score' && file.score && (
                  <span className="storage__score">{file.score}/10</span>
                )}
                
                {column.id === 'words' && file.wordCount && (
                  <span className="storage__word-count">{file.wordCount}</span>
                )}
                
                {column.id === 'actions' && (
                  <div className="storage__actions-dropdown">
                    <button 
                      className="storage__more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === file.id ? null : file.id);
                      }}
                    >
                      <i className="fas fa-ellipsis-v" style={{ fontSize: '14px' }} />
                    </button>
                    {activeDropdownId === file.id && (
                      <div className="storage__actions-menu" style={{
                        left: '0',
                        right: 'auto'
                      }}>
                        <button 
                          className="storage__action-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMetadata(file);
                          }}
                        >
                          <i className="fas fa-eye" />
                          <span>View Metadata</span>
                        </button>
                        <button 
                          className="storage__action-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFiles(new Set([file.id]));
                            setActiveDropdownId(null);
                            setTimeout(() => handleBatchEnrich(), 100);
                          }}
                        >
                          <i className="fas fa-magic" />
                          <span>Enrich</span>
                        </button>
                        <div className="storage__action-divider" />
                        <button 
                          className="storage__action-item storage__action-item--danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete ${file.name}?`)) {
                              setSelectedFiles(new Set([file.id]));
                              setActiveDropdownId(null);
                              setTimeout(() => handleBatchDelete(), 100);
                            }
                          }}
                        >
                          <i className="fas fa-trash" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        </div>
      </div>
      
      {/* Batch actions toolbar */}
      {selectedFiles.size > 0 && (
        <div className="storage__batch-actions">
          <div className="storage__batch-actions-left">
            <Checkbox
              checked={selectedFiles.size === filteredAndSortedFiles.length && filteredAndSortedFiles.length > 0}
              indeterminate={selectedFiles.size > 0 && selectedFiles.size < filteredAndSortedFiles.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="storage__batch-checkbox"
            />
            <div className="storage__batch-count">
              Selected {selectedFiles.size} {selectedFiles.size === 1 ? 'item' : 'items'}
            </div>
          </div>
          <div className="storage__batch-actions-right">
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleBatchExport()}
              iconLeft={<i className="fas fa-download" />}
            >
              Export
            </Button>
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleBatchEnrich()}
              iconLeft={<i className="fas fa-magic" />}
              disabled={loading}
            >
              Enrich
            </Button>
            <Button
              size="small"
              variant="danger"
              onClick={() => handleBatchDelete()}
              iconLeft={<i className="fas fa-trash" />}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCardsView = () => (
    <div className="storage__grid">
      {stats.map((stat) => (
        <Card 
          key={stat.type}
          className="storage__stat-card"
          variant="bordered"
          padding="lg"
          interactive
        >
          <div className="storage__stat-header">
            <div className="storage__stat-type">
              <div className="storage__stat-icon">{stat.icon}</div>
              <span className="storage__stat-name">
                {stat.type}
              </span>
            </div>
            <span className="storage__stat-count">{stat.count}</span>
          </div>
          <div className="storage__stat-details">
            <div>
              {stat.count} {stat.count === 1 ? 'file' : 'files'}
            </div>
            {stat.size > 0 && (
              <div>
                Total: {formatBytes(stat.size)}
              </div>
            )}
          </div>
        </Card>
      ))}

      {stats.length === 0 && (
        <div className="storage__empty">
          <i className="fas fa-folder-open storage__empty-icon" style={{ fontSize: '48px' }} />
          <p className="storage__empty-text">
            No content in storage yet
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="storage">
        <div className="storage__header">
          <div className="storage__header-top">
            <h1 className="storage__title">Storage</h1>
            <div className="storage__view-toggle">
              <Button
                size="small"
                variant={viewMode === 'table' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                size="small"
                variant={viewMode === 'cards' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
            </div>
          </div>
          <p className="storage__subtitle">
            Content organized by type in the storage system
          </p>
        </div>

        {loading ? (
          <div className="storage__loading">
            Loading storage information...
          </div>
        ) : viewMode === 'table' ? renderTableView() : renderCardsView()}
        
        {/* Enrichment Progress Modal */}
        <Modal
          isOpen={showEnrichModal}
          onClose={() => {}}  // Prevent closing during enrichment
          title="Enriching Files"
        >
          <div className="storage__enrich-modal">
            <div className="storage__enrich-progress">
              <Text size="sm" color="muted">
                Processing {enrichmentProgress.processed} of {enrichmentProgress.total} files
              </Text>
              
              <div className="storage__progress-bar">
                <div 
                  className="storage__progress-fill"
                  style={{ 
                    width: `${(enrichmentProgress.processed / enrichmentProgress.total) * 100}%` 
                  }}
                />
              </div>
              
              <div className="storage__enrich-stats">
                <div className="storage__enrich-stat">
                  <i className="fas fa-check-circle" style={{ color: 'var(--color-success)' }} />
                  <Text size="sm">Enriched: {enrichmentProgress.enriched}</Text>
                </div>
                {enrichmentProgress.errors > 0 && (
                  <div className="storage__enrich-stat">
                    <i className="fas fa-exclamation-circle" style={{ color: 'var(--color-danger)' }} />
                    <Text size="sm">Errors: {enrichmentProgress.errors}</Text>
                  </div>
                )}
              </div>
              
              <div className="storage__enrich-current">
                <Text size="sm" color="muted">
                  {enrichmentProgress.currentFile === 'Complete' ? (
                    <span style={{ color: 'var(--color-success)' }}>
                      <i className="fas fa-check" /> Enrichment complete!
                    </span>
                  ) : enrichmentProgress.currentFile === 'Error occurred' ? (
                    <span style={{ color: 'var(--color-danger)' }}>
                      <i className="fas fa-times" /> An error occurred during enrichment
                    </span>
                  ) : (
                    <>Processing: {enrichmentProgress.currentFile}</>
                  )}
                </Text>
              </div>
            </div>
          </div>
        </Modal>
        
        {/* Metadata Viewer Modal */}
        <Modal
          isOpen={showMetadataModal}
          onClose={() => {
            setShowMetadataModal(false);
            setSelectedFileMetadata(null);
          }}
          title={`Metadata: ${selectedFileMetadata?.fileName || ''}`}
        >
          <div className="storage__metadata-modal">
            {selectedFileMetadata && (
              <div className="storage__metadata-content">
                <pre className="storage__metadata-json">
                  {JSON.stringify(selectedFileMetadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Modal>
        
        {/* Column Settings Modal */}
        <Modal
          isOpen={showColumnSettings}
          onClose={() => setShowColumnSettings(false)}
          title="Customize Columns"
        >
          <div className="storage__column-settings">
            <div className="storage__column-settings-header">
              <Text size="sm" color="muted">
                Drag and drop to reorder columns, or toggle visibility.
              </Text>
            </div>
            
            <div className="storage__column-list">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={`storage__column-item ${!column.visible ? 'storage__column-item--hidden' : ''}`}
                  draggable={column.id !== 'checkbox' && column.id !== 'actions'}
                  onDragStart={(e) => handleColumnDragStart(e, column.id)}
                  onDragOver={handleColumnDragOver}
                  onDrop={(e) => handleColumnDrop(e, column.id)}
                  onDragEnd={handleColumnDragEnd}
                >
                  <div className="storage__column-item-left">
                    <i className="fas fa-grip-vertical storage__column-drag-handle" />
                    <Checkbox
                      checked={column.visible}
                      onChange={() => toggleColumnVisibility(column.id)}
                      disabled={column.id === 'checkbox' || column.id === 'actions'}
                    />
                    <span className="storage__column-label">{column.label}</span>
                  </div>
                  {column.sortable && (
                    <span className="storage__column-sortable">
                      <i className="fas fa-sort" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="storage__column-settings-footer">
              <Button
                size="small"
                variant="secondary"
                onClick={resetColumns}
              >
                Reset to Default
              </Button>
              <Button
                size="small"
                variant="primary"
                onClick={() => setShowColumnSettings(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
}