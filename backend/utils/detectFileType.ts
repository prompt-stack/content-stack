/**
 * @layer backend-utils
 * @description Detect file type from filename and content - based on INGEST_FILES.MD
 * @dependencies none
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming convention: detect[Property]
 * Based on AI-Native Content Ingestion Map from INGEST_FILES.MD
 */

import type { ContentType } from '../types/ContentTypes';

/**
 * Detect content type from filename and content
 * Based on the comprehensive list from INGEST_FILES.MD
 */
export function detectFileType(filename: string, content?: string): ContentType {
  const extension = getFileExtension(filename).toLowerCase();
  
  // Text files (plain)
  if (isTextFile(extension)) {
    // If we have content, check if it's code
    if (content && hasCodePatterns(content)) {
      return 'code';
    }
    return 'text';
  }
  
  // Documents (formatted text)
  if (isDocumentFile(extension)) {
    return 'document';
  }
  
  // Audio files
  if (isAudioFile(extension)) {
    return 'audio';
  }
  
  // Video files
  if (isVideoFile(extension)) {
    return 'video';
  }
  
  // Image files
  if (isImageFile(extension)) {
    return 'image';
  }
  
  // Code files
  if (isCodeFile(extension)) {
    return 'code';
  }
  
  // Data files
  if (isDataFile(extension)) {
    return 'data';
  }
  
  // Design files
  if (isDesignFile(extension)) {
    return 'design';
  }
  
  // Archive files
  if (isArchiveFile(extension)) {
    return 'archive';
  }
  
  // Email files
  if (isEmailFile(extension)) {
    return 'email';
  }
  
  // Web content (for URLs)
  if (isWebContent(filename)) {
    return 'web';
  }
  
  // Default to text
  return 'text';
}

/**
 * Extract file extension from filename
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot + 1) : '';
}

/**
 * Check if extension is a text file
 * From INGEST_FILES.MD: .txt, .md, .json, .csv
 */
function isTextFile(extension: string): boolean {
  const textExtensions = [
    'txt', 'md', 'markdown', 
    'html', 'htm', 'xml', 'yaml', 'yml', 'toml',
    'ini', 'cfg', 'conf', 'log'
  ];
  return textExtensions.includes(extension);
}

/**
 * Check if extension is a document file
 * From INGEST_FILES.MD: .pdf, .docx, .pptx
 */
function isDocumentFile(extension: string): boolean {
  const documentExtensions = [
    'pdf', 'doc', 'docx', 'odt', 'rtf',
    'ppt', 'pptx', 'odp',
    'xls', 'xlsx', 'ods'
  ];
  return documentExtensions.includes(extension);
}

/**
 * Check if extension is an audio file
 * From INGEST_FILES.MD: .mp3, .wav, .m4a
 */
function isAudioFile(extension: string): boolean {
  const audioExtensions = [
    'mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg',
    'wma', 'aiff', 'au', 'ra'
  ];
  return audioExtensions.includes(extension);
}

/**
 * Check if extension is a video file
 * From INGEST_FILES.MD: .mp4, .mov, .webm
 */
function isVideoFile(extension: string): boolean {
  const videoExtensions = [
    'mp4', 'mov', 'webm', 'avi', 'mkv', 'flv',
    'wmv', 'mpg', 'mpeg', 'm4v', '3gp'
  ];
  return videoExtensions.includes(extension);
}

/**
 * Check if extension is an image file
 * From INGEST_FILES.MD: .png, .jpg, .webp
 */
function isImageFile(extension: string): boolean {
  const imageExtensions = [
    'png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp',
    'svg', 'tiff', 'tif', 'ico', 'heic', 'avif'
  ];
  return imageExtensions.includes(extension);
}

/**
 * Check if extension is a code file
 * From INGEST_FILES.MD: .py, .js, .ts, .html
 */
function isCodeFile(extension: string): boolean {
  const codeExtensions = [
    // JavaScript/TypeScript
    'js', 'ts', 'jsx', 'tsx', 'mjs', 'cjs',
    // Python
    'py', 'pyw', 'ipynb',
    // Web
    'html', 'css', 'scss', 'sass', 'less',
    // Other languages
    'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'php',
    'rb', 'go', 'rs', 'swift', 'kt', 'scala',
    'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat',
    'sql', 'r', 'matlab', 'm', 'pl', 'lua'
  ];
  return codeExtensions.includes(extension);
}

/**
 * Check if extension is a data file
 * From INGEST_FILES.MD: .csv, .xlsx, .json
 */
function isDataFile(extension: string): boolean {
  const dataExtensions = [
    'csv', 'tsv', 'xlsx', 'xls', 'json', 'jsonl',
    'parquet', 'avro', 'arrow', 'feather',
    'pkl', 'pickle', 'db', 'sqlite', 'sql'
  ];
  return dataExtensions.includes(extension);
}

/**
 * Check if extension is a design file
 * From INGEST_FILES.MD: .fig, .sketch, .svg
 */
function isDesignFile(extension: string): boolean {
  const designExtensions = [
    'fig', 'sketch', 'svg', 'ai', 'eps', 'psd',
    'xd', 'figma', 'invision', 'principle'
  ];
  return designExtensions.includes(extension);
}

/**
 * Check if extension is an archive file
 */
function isArchiveFile(extension: string): boolean {
  const archiveExtensions = [
    'zip', 'rar', '7z', 'tar', 'gz', 'bz2',
    'xz', 'lz', 'lzma', 'cab', 'iso'
  ];
  return archiveExtensions.includes(extension);
}

/**
 * Check if extension is an email file
 * From INGEST_FILES.MD: .eml, .mbox
 */
function isEmailFile(extension: string): boolean {
  const emailExtensions = ['eml', 'mbox', 'msg', 'pst'];
  return emailExtensions.includes(extension);
}

/**
 * Check if this is web content (URL)
 */
function isWebContent(filename: string): boolean {
  return filename.startsWith('http://') || filename.startsWith('https://');
}

/**
 * Check if content contains code patterns
 */
function hasCodePatterns(content: string): boolean {
  const codePatterns = [
    /```/,                    // Code blocks
    /function\s+\w+/,         // Function declarations
    /const\s+\w+\s*=/,        // Const declarations
    /import\s+.*from/,        // Import statements
    /export\s+/,              // Export statements
    /{[\s\S]*}/,              // Object/function brackets
    /console\.log/,           // Console statements
    /\.then\(/,               // Promise chains
    /async\s+function/,       // Async functions
    /class\s+\w+/,            // Class declarations
    /def\s+\w+\(/,            // Python functions
    /public\s+class/,         // Java classes
  ];
  
  return codePatterns.some(pattern => pattern.test(content));
}