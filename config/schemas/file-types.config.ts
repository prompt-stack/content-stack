/**
 * @file config/file-types.config.ts
 * @purpose File types configuration for content ingestion
 * @description Defines all accepted file types, their categories, and processing rules
 */

export const fileTypesConfig = {
  // Text-based content
  text: {
    name: "Text Files",
    extensions: ['.txt', '.md', '.markdown', '.rtf', '.tex', '.log'],
    mimeTypes: ['text/plain', 'text/markdown', 'text/x-markdown', 'text/rtf'],
    maxSize: 50 * 1024 * 1024, // 50MB
    canExtractText: true,
    aiModel: 'LLM'
  },

  // Documents
  document: {
    name: "Documents",
    extensions: ['.pdf', '.doc', '.docx', '.odt', '.pages', '.epub'],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text'
    ],
    maxSize: 100 * 1024 * 1024, // 100MB
    canExtractText: true,
    aiModel: 'LLM + Document Parser'
  },

  // Spreadsheets
  spreadsheet: {
    name: "Spreadsheets",
    extensions: ['.csv', '.xls', '.xlsx', '.ods', '.numbers'],
    mimeTypes: [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.spreadsheet'
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
    canExtractText: true,
    aiModel: 'LLM + Data Parser'
  },

  // Presentations
  presentation: {
    name: "Presentations",
    extensions: ['.ppt', '.pptx', '.odp', '.key'],
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.presentation'
    ],
    maxSize: 200 * 1024 * 1024, // 200MB
    canExtractText: true,
    aiModel: 'LLM + Slide Parser'
  },

  // Code files
  code: {
    name: "Code Files",
    extensions: [
      '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs',
      '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.r',
      '.html', '.css', '.scss', '.sass', '.less',
      '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.env',
      '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd'
    ],
    mimeTypes: [
      'text/javascript', 'application/javascript',
      'text/typescript', 'text/x-python', 'text/x-java',
      'text/html', 'text/css', 'application/json',
      'application/xml', 'text/yaml', 'application/x-sh'
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    canExtractText: true,
    aiModel: 'Code LLM (Claude, GPT-4)'
  },

  // Images
  image: {
    name: "Images",
    extensions: [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
      '.bmp', '.ico', '.tiff', '.heic', '.heif', '.raw'
    ],
    mimeTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml', 'image/bmp', 'image/tiff'
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
    canExtractText: false,
    aiModel: 'Vision Model (GPT-4V, Claude Vision, BLIP-2)'
  },

  // Videos
  video: {
    name: "Videos",
    extensions: [
      '.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v',
      '.wmv', '.flv', '.f4v', '.asf', '.rm', '.rmvb',
      '.3gp', '.3g2', '.mpg', '.mpeg', '.ts', '.vob'
    ],
    mimeTypes: [
      'video/mp4', 'video/quicktime', 'video/x-msvideo',
      'video/webm', 'video/x-flv', 'video/mpeg'
    ],
    maxSize: {
      localhost: 5 * 1024 * 1024 * 1024, // 5GB
      production: 100 * 1024 * 1024      // 100MB
    },
    canExtractText: false,
    aiModel: 'Whisper + Vision Model'
  },

  // Audio
  audio: {
    name: "Audio Files",
    extensions: [
      '.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac',
      '.wma', '.aiff', '.opus', '.webm', '.amr'
    ],
    mimeTypes: [
      'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/aac',
      'audio/ogg', 'audio/flac', 'audio/webm'
    ],
    maxSize: 500 * 1024 * 1024, // 500MB
    canExtractText: false,
    aiModel: 'Whisper, Deepgram, AssemblyAI'
  },

  // Archives
  archive: {
    name: "Archive Files",
    extensions: ['.zip', '.tar', '.gz', '.rar', '.7z', '.bz2', '.xz'],
    mimeTypes: [
      'application/zip', 'application/x-tar', 'application/gzip',
      'application/x-rar-compressed', 'application/x-7z-compressed'
    ],
    maxSize: 500 * 1024 * 1024, // 500MB
    canExtractText: false,
    aiModel: 'Extract then process contents'
  },

  // Design files
  design: {
    name: "Design Files",
    extensions: ['.fig', '.sketch', '.xd', '.ai', '.psd', '.indd'],
    mimeTypes: [
      'application/x-figma', 'application/x-sketch',
      'application/vnd.adobe.photoshop',
      'application/postscript'
    ],
    maxSize: 500 * 1024 * 1024, // 500MB
    canExtractText: false,
    aiModel: 'Vision Model + Design parsers'
  },

  // Email
  email: {
    name: "Email Files",
    extensions: ['.eml', '.msg', '.mbox'],
    mimeTypes: [
      'message/rfc822', 'application/vnd.ms-outlook'
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
    canExtractText: true,
    aiModel: 'LLM + Email parser'
  },

  // Web content
  web: {
    name: "Web Content",
    extensions: ['.html', '.htm', '.mhtml', '.webarchive'],
    mimeTypes: [
      'text/html', 'application/xhtml+xml',
      'multipart/related'
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
    canExtractText: true,
    aiModel: 'LLM + Web parser'
  },

  // Data files
  data: {
    name: "Data Files",
    extensions: ['.json', '.jsonl', '.ndjson', '.xml', '.sql'],
    mimeTypes: [
      'application/json', 'application/x-ndjson',
      'application/xml', 'application/sql'
    ],
    maxSize: 100 * 1024 * 1024, // 100MB
    canExtractText: true,
    aiModel: 'LLM + Data parser'
  },

  // 3D/Spatial
  spatial: {
    name: "3D/Spatial Files",
    extensions: ['.glb', '.gltf', '.obj', '.fbx', '.dae', '.stl'],
    mimeTypes: [
      'model/gltf-binary', 'model/gltf+json',
      'application/x-tgif'
    ],
    maxSize: 200 * 1024 * 1024, // 200MB
    canExtractText: false,
    aiModel: 'Emerging 3D models'
  },

  // Subtitles/Transcripts
  transcript: {
    name: "Transcripts",
    extensions: ['.srt', '.vtt', '.ass', '.ssa', '.sbv'],
    mimeTypes: [
      'text/vtt', 'application/x-subrip',
      'text/x-ssa'
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    canExtractText: true,
    aiModel: 'LLM'
  }
};

// Helper functions
export function getFileTypeCategory(filename: string): string {
  const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (!ext) return 'unknown';

  for (const [category, config] of Object.entries(fileTypesConfig)) {
    if (config.extensions.includes(ext)) {
      return category;
    }
  }
  return 'unknown';
}

export function getFileSizeLimit(filename: string, environment: 'localhost' | 'production' = 'production'): number {
  const category = getFileTypeCategory(filename);
  const config = fileTypesConfig[category as keyof typeof fileTypesConfig];
  
  if (!config) return 10 * 1024 * 1024; // Default 10MB
  
  if (typeof config.maxSize === 'object') {
    return config.maxSize[environment];
  }
  
  return config.maxSize;
}

export function canExtractText(filename: string): boolean {
  const category = getFileTypeCategory(filename);
  const config = fileTypesConfig[category as keyof typeof fileTypesConfig];
  return config?.canExtractText || false;
}

export function getAIModel(filename: string): string {
  const category = getFileTypeCategory(filename);
  const config = fileTypesConfig[category as keyof typeof fileTypesConfig];
  return config?.aiModel || 'LLM';
}

// Export type definitions
export type FileTypeCategory = keyof typeof fileTypesConfig;
export type FileTypeConfig = typeof fileTypesConfig[FileTypeCategory];