/**
 * @file features/content-inbox/config.ts
 * @purpose Content Inbox feature-specific configuration
 * @layer feature-config
 * @deps /config (global configs)
 * @used-by [ContentInboxQueuePanel, config, useContentQueue]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import contentTypes from '/config/content-types.json';

// Import global configurations
const globalContentTypes = contentTypes;

// Feature-specific configuration that extends global configs
export const contentInboxConfig = {
  // File handling configuration
  upload: {
    limits: {
      localhost: {
        video: 5 * 1024 * 1024 * 1024, // 5GB
        file: 500 * 1024 * 1024,       // 500MB
        paste: 10 * 1024 * 1024        // 10MB
      },
      production: {
        video: 100 * 1024 * 1024,      // 100MB
        file: 10 * 1024 * 1024,        // 10MB
        paste: 1 * 1024 * 1024         // 1MB
      }
    },
    videoExtensions: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.wmv', '.flv', '.f4v', '.asf', '.rm', '.rmvb', '.3gp', '.3g2'],
    textReadingLimit: 50 * 1024 * 1024 // Don't read text files larger than 50MB
  },

  // UI display settings
  ui: {
    preview: {
      maxLength: {
        list: 280,
        grid: 320
      }
    },
    tags: {
      maxVisible: {
        list: 5,
        grid: 3
      },
      maxLength: 10
    },
    title: {
      maxLength: 50,
      truncate: true
    }
  },

  // Animation settings
  animations: {
    enabled: true,
    durations: {
      fadeIn: 400,        // ms
      transition: 300,    // ms
      optimisticPulse: 2000 // ms
    },
    easings: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  // Sync and performance settings
  sync: {
    autoCheckEnabled: false, // Disabled to prevent re-render storms
    checkInterval: 500,      // ms
    retryAttempts: 3,
    retryDelay: 1000        // ms
  },

  // Content processing rules
  processing: {
    textFiles: {
      maxSizeForReading: 50 * 1024 * 1024, // 50MB
      mimeTypes: ['text/', 'application/json', 'application/javascript'],
      extensions: ['.txt', '.md', '.js', '.ts', '.json', '.csv', '.xml', '.html', '.css']
    },
    videoFiles: {
      processContent: false,      // Don't read video content to avoid memory issues
      extractMetadata: true,      // Extract file info
      generateThumbnails: false   // Future feature
    }
  },

  // Validation messages
  validation: {
    messages: {
      fileSizeExceeded: 'File size ({actualSize}) exceeds limit of {maxSize}{fileTypeNote}',
      emptyContent: 'Content cannot be empty',
      invalidUrl: 'Please enter a valid URL (http:// or https://)',
      duplicateContent: 'This content already exists in your inbox'
    }
  },

  // Feature flags
  features: {
    bulkOperations: true,
    syncStatus: true,
    duplicateDetection: true,
    videoSupport: true,
    exportFunctionality: true,
    autoSave: false,
    realTimeSync: false
  },

  // Extend global categories with inbox-specific settings
  categories: {
    ...globalContentTypes.categories,
    // Add inbox-specific category behavior
    defaultCategory: 'general',
    allowCustomCategories: true
  },

  // Environment-specific overrides
  environment: {
    development: {
      debug: true,
      verboseLogging: true,
      skipValidation: false
    },
    production: {
      debug: false,
      verboseLogging: false,
      skipValidation: false
    }
  }
};

// Helper functions for configuration access
export const getFileSizeLimit = (filename: string): number => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isVideo = contentInboxConfig.upload.videoExtensions.some(ext => 
    filename.toLowerCase().endsWith(ext)
  );
  
  const env = isLocalhost ? 'localhost' : 'production';
  return isVideo ? 
    contentInboxConfig.upload.limits[env].video : 
    contentInboxConfig.upload.limits[env].file;
};

export const isVideoFile = (filename: string): boolean => {
  return contentInboxConfig.upload.videoExtensions.some(ext => 
    filename.toLowerCase().endsWith(ext)
  );
};

export const shouldReadFileContent = (file: File): boolean => {
  if (isVideoFile(file.name)) return false;
  if (file.size > contentInboxConfig.processing.textFiles.maxSizeForReading) return false;
  
  const isTextFile = contentInboxConfig.processing.textFiles.mimeTypes.some(type =>
    file.type.startsWith(type.replace('/', ''))
  ) || contentInboxConfig.processing.textFiles.extensions.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );
  
  return isTextFile;
};

export const getPreviewLength = (viewMode: 'list' | 'grid'): number => {
  return contentInboxConfig.ui.preview.maxLength[viewMode];
};

export const getMaxVisibleTags = (viewMode: 'list' | 'grid'): number => {
  return contentInboxConfig.ui.tags.maxVisible[viewMode];
};

// Type exports for TypeScript support
export type ContentInboxConfig = typeof contentInboxConfig;
export type ViewMode = 'list' | 'grid';
export type Environment = 'localhost' | 'production';
