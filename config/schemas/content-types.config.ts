/**
 * @file config/contentTypes.config.ts
 * @purpose Central configuration for content type detection and storage mapping
 * @layer config
 * @deps ../types/ContentTypes
 * @used-by [ContentInboxService, detectFileType, detectContentType]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 * @based-on /dev_log/INGEST_FILES.MD
 */

import type { ContentType } from '../backend/types/ContentTypes';

/**
 * Storage directory mapping for content types
 */
export const STORAGE_DIRECTORIES = {
  text: 'text',
  code: 'code',
  document: 'documents',
  image: 'images',
  video: 'video',
  audio: 'audio',
  data: 'data',
  web: 'web',
  email: 'email',
  design: 'design',
  archive: 'archives'
} as const;

/**
 * MIME type to storage directory mapping
 * Based on INGEST_FILES.MD content type inventory
 */
export const MIME_TYPE_MAPPINGS: Record<string, keyof typeof STORAGE_DIRECTORIES> = {
  // Text types
  'text/plain': 'text',
  'text/markdown': 'text',
  'text/html': 'web',
  'text/css': 'code',
  'text/csv': 'data',
  
  // Application types
  'application/json': 'data',
  'application/pdf': 'document',
  'application/zip': 'archive',
  'application/x-zip-compressed': 'archive',
  'application/x-rar-compressed': 'archive',
  'application/x-7z-compressed': 'archive',
  'application/vnd.ms-excel': 'data',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'data',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'application/vnd.ms-powerpoint': 'document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'document',
  
  // Image types
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'design',
  'image/bmp': 'image',
  'image/tiff': 'image',
  'image/x-icon': 'image',
  'image/heic': 'image',
  'image/avif': 'image',
  
  // Video types
  'video/mp4': 'video',
  'video/quicktime': 'video',
  'video/webm': 'video',
  'video/x-msvideo': 'video',
  'video/x-matroska': 'video',
  'video/x-flv': 'video',
  'video/mpeg': 'video',
  
  // Audio types
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'audio/webm': 'audio',
  'audio/ogg': 'audio',
  'audio/x-m4a': 'audio',
  'audio/aac': 'audio',
  'audio/flac': 'audio',
  
  // Email types
  'message/rfc822': 'email',
  'application/mbox': 'email',
  
  // Code types (often served as text/plain)
  'application/javascript': 'code',
  'application/typescript': 'code',
  'application/x-python': 'code',
  'application/x-java': 'code',
};

/**
 * File extension mappings
 * Comprehensive list based on INGEST_FILES.MD
 */
export const FILE_EXTENSION_MAPPINGS: Record<string, ContentType> = {
  // Text files (plain)
  txt: 'text',
  md: 'text',
  markdown: 'text',
  log: 'text',
  
  // Documents (formatted text)  
  pdf: 'document',
  doc: 'document',
  docx: 'document',
  odt: 'document',
  rtf: 'document',
  ppt: 'document',
  pptx: 'document',
  odp: 'document',
  
  // Audio files
  mp3: 'audio',
  wav: 'audio',
  m4a: 'audio',
  aac: 'audio',
  flac: 'audio',
  ogg: 'audio',
  wma: 'audio',
  aiff: 'audio',
  
  // Video files
  mp4: 'video',
  mov: 'video',
  webm: 'video',
  avi: 'video',
  mkv: 'video',
  flv: 'video',
  wmv: 'video',
  mpg: 'video',
  mpeg: 'video',
  m4v: 'video',
  '3gp': 'video',
  
  // Image files
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  gif: 'image',
  bmp: 'image',
  svg: 'design',
  tiff: 'image',
  tif: 'image',
  ico: 'image',
  heic: 'image',
  avif: 'image',
  
  // Code files
  js: 'code',
  ts: 'code',
  jsx: 'code',
  tsx: 'code',
  mjs: 'code',
  cjs: 'code',
  py: 'code',
  pyw: 'code',
  ipynb: 'code',
  html: 'code',
  css: 'code',
  scss: 'code',
  sass: 'code',
  less: 'code',
  java: 'code',
  c: 'code',
  cpp: 'code',
  h: 'code',
  hpp: 'code',
  cs: 'code',
  php: 'code',
  rb: 'code',
  go: 'code',
  rs: 'code',
  swift: 'code',
  kt: 'code',
  scala: 'code',
  sh: 'code',
  bash: 'code',
  zsh: 'code',
  fish: 'code',
  ps1: 'code',
  bat: 'code',
  sql: 'code',
  r: 'code',
  matlab: 'code',
  m: 'code',
  pl: 'code',
  lua: 'code',
  
  // Data files
  csv: 'data',
  tsv: 'data',
  xlsx: 'data',
  xls: 'data',
  json: 'data',
  jsonl: 'data',
  parquet: 'data',
  avro: 'data',
  arrow: 'data',
  feather: 'data',
  pkl: 'data',
  pickle: 'data',
  db: 'data',
  sqlite: 'data',
  
  // Design files
  fig: 'design',
  sketch: 'design',
  ai: 'design',
  eps: 'design',
  psd: 'design',
  xd: 'design',
  figma: 'design',
  invision: 'design',
  principle: 'design',
  
  // Archive files
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  tar: 'archive',
  gz: 'archive',
  bz2: 'archive',
  xz: 'archive',
  lz: 'archive',
  lzma: 'archive',
  cab: 'archive',
  iso: 'archive',
  
  // Email files
  eml: 'email',
  mbox: 'email',
  msg: 'email',
  pst: 'email',
  
  // Web content
  xml: 'web',
  yaml: 'web',
  yml: 'web',
  toml: 'web',
  ini: 'web',
  cfg: 'web',
  conf: 'web',
};

/**
 * AI model requirements for each content type
 * Based on INGEST_FILES.MD AI-Native Content Ingestion Map
 */
export const AI_MODEL_REQUIREMENTS = {
  text: {
    models: ['LLM'],
    capabilities: ['summarize', 'classify', 'extract_structure'],
  },
  code: {
    models: ['Claude Code', 'Copilot', 'GPT-4'],
    capabilities: ['analyze', 'summarize', 'refactor', 'test'],
  },
  document: {
    models: ['LLM', 'Document parsers'],
    capabilities: ['structure_content', 'extract_tables', 'classify_sections'],
  },
  image: {
    models: ['BLIP-2', 'Gemini', 'GPT-4o vision', 'OpenAI Vision', 'LLaVA'],
    capabilities: ['caption', 'describe', 'classify', 'OCR'],
  },
  video: {
    models: ['Whisper', 'Video Captioning', 'Gemini Flash'],
    capabilities: ['extract_transcript', 'summarize_visuals', 'classify_content'],
  },
  audio: {
    models: ['Whisper', 'OpenAI Whisper Large V3', 'Deepgram', 'AssemblyAI'],
    capabilities: ['transcribe', 'timestamp', 'diarize', 'summarize'],
  },
  data: {
    models: ['GPT-4', 'Claude 3.5', 'Pandas + LLM'],
    capabilities: ['normalize_data', 'generate_summaries', 'chart_insights'],
  },
  web: {
    models: ['LLM', 'Unstructured.io', 'newspaper3k', 'Mercury Parser'],
    capabilities: ['extract_article', 'metadata', 'semantic_structure'],
  },
  email: {
    models: ['LLM', 'Regex extractors'],
    capabilities: ['extract_threads', 'classify_intent', 'summarize'],
  },
  design: {
    models: ['GPT-4o vision', 'figma-to-code APIs'],
    capabilities: ['describe_layout', 'extract_components', 'annotate_design'],
  },
  archive: {
    models: ['File extraction', 'Then process contents'],
    capabilities: ['extract', 'process_contents'],
  },
} as const;

/**
 * Get storage directory for a content type
 */
export function getStorageDirectory(contentType: ContentType): string {
  return STORAGE_DIRECTORIES[contentType] || 'text';
}

/**
 * Get storage directory from MIME type
 */
export function getStorageDirectoryFromMime(mimeType: string): string {
  // Check exact match
  if (MIME_TYPE_MAPPINGS[mimeType]) {
    return STORAGE_DIRECTORIES[MIME_TYPE_MAPPINGS[mimeType]];
  }
  
  // Check prefix match (e.g., "image/webp" → "images")
  for (const [mime, contentType] of Object.entries(MIME_TYPE_MAPPINGS)) {
    if (mimeType.startsWith(mime.split('/')[0] + '/')) {
      return STORAGE_DIRECTORIES[contentType];
    }
  }
  
  // Default to text
  return 'text';
}

/**
 * Get content type from file extension
 */
export function getContentTypeFromExtension(filename: string): ContentType {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  return FILE_EXTENSION_MAPPINGS[extension] || 'text';
}