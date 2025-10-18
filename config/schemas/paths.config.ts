/**
 * @file config/paths.config.ts
 * @purpose Central configuration for all system paths and directory structure
 * @layer config
 * @deps path
 * @used-by [ContentInboxService, MetadataService, Pipeline Tools]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 * 
 * Directory Structure:
 * - storage/: Raw content files organized by type
 * - metadata/: JSON metadata for all content
 * - library/: Final organized content (after processing)
 */

/**
 * @file config/paths.config.ts
 * @purpose System paths configuration
 * @description Defines all directory paths and helper functions
 * @llm-read true
 * @llm-write full-edit
 * @llm-role critical-infrastructure
 */

import { join } from 'path';
import { STORAGE_DIRECTORIES } from './content-types.config';

/**
 * Base paths configuration
 * All paths are relative to the project root
 */
export const BASE_PATHS = {
  // Core data directories (root level)
  storage: 'storage',
  metadata: 'metadata',
  library: 'library',
  
  // System directories
  config: 'config',
  backend: 'backend',
  src: 'src',
  public: 'public',
  tools: 'tools',
  
  // Legacy paths (to be removed)
  content: 'content',
  contentInbox: 'content/inbox', // DEPRECATED - direct to storage now
} as const;

/**
 * Library subdirectories for organized content
 */
export const LIBRARY_CATEGORIES = {
  articles: 'articles',
  tutorials: 'tutorials',
  references: 'references',
  projects: 'projects',
  snippets: 'snippets',
  resources: 'resources',
} as const;

/**
 * Storage subdirectories (from content-types.config)
 */
export const STORAGE_SUBDIRS = STORAGE_DIRECTORIES;

/**
 * Get absolute path from project root
 */
export function getAbsolutePath(relativePath: string, baseDir: string = process.cwd()): string {
  return join(baseDir, relativePath);
}

/**
 * Get storage directory paths
 */
export function getStoragePaths(baseDir: string = process.cwd()) {
  const storageRoot = join(baseDir, BASE_PATHS.storage);
  
  return {
    root: storageRoot,
    text: join(storageRoot, STORAGE_SUBDIRS.text),
    code: join(storageRoot, STORAGE_SUBDIRS.code),
    document: join(storageRoot, STORAGE_SUBDIRS.document),
    image: join(storageRoot, STORAGE_SUBDIRS.image),
    video: join(storageRoot, STORAGE_SUBDIRS.video),
    audio: join(storageRoot, STORAGE_SUBDIRS.audio),
    data: join(storageRoot, STORAGE_SUBDIRS.data),
    web: join(storageRoot, STORAGE_SUBDIRS.web),
    email: join(storageRoot, STORAGE_SUBDIRS.email),
    design: join(storageRoot, STORAGE_SUBDIRS.design),
    archive: join(storageRoot, STORAGE_SUBDIRS.archive),
  };
}

/**
 * Get metadata directory path
 */
export function getMetadataPath(baseDir: string = process.cwd()): string {
  return join(baseDir, BASE_PATHS.metadata);
}

/**
 * Get library directory paths
 */
export function getLibraryPaths(baseDir: string = process.cwd()) {
  const libraryRoot = join(baseDir, BASE_PATHS.library);
  
  return {
    root: libraryRoot,
    articles: join(libraryRoot, LIBRARY_CATEGORIES.articles),
    tutorials: join(libraryRoot, LIBRARY_CATEGORIES.tutorials),
    references: join(libraryRoot, LIBRARY_CATEGORIES.references),
    projects: join(libraryRoot, LIBRARY_CATEGORIES.projects),
    snippets: join(libraryRoot, LIBRARY_CATEGORIES.snippets),
    resources: join(libraryRoot, LIBRARY_CATEGORIES.resources),
  };
}

/**
 * Get all directories that need to exist
 */
export function getAllRequiredDirectories(baseDir: string = process.cwd()): string[] {
  const storagePaths = getStoragePaths(baseDir);
  const libraryPaths = getLibraryPaths(baseDir);
  const metadataPath = getMetadataPath(baseDir);
  
  return [
    metadataPath,
    ...Object.values(storagePaths),
    ...Object.values(libraryPaths),
  ];
}

/**
 * Generate storage file path
 */
export function generateStoragePath(contentType: string, id: string, extension: string): string {
  const storageDir = STORAGE_SUBDIRS[contentType as keyof typeof STORAGE_SUBDIRS] || STORAGE_SUBDIRS.text;
  return `${BASE_PATHS.storage}/${storageDir}/${id}.${extension}`;
}

/**
 * Generate metadata file path
 */
export function generateMetadataPath(id: string): string {
  return `${BASE_PATHS.metadata}/${id}.json`;
}

/**
 * Generate library file path
 */
export function generateLibraryPath(category: keyof typeof LIBRARY_CATEGORIES, filename: string): string {
  return `${BASE_PATHS.library}/${LIBRARY_CATEGORIES[category]}/${filename}`;
}

/**
 * Parse storage path to extract info
 */
export function parseStoragePath(path: string): {
  type: string;
  id: string;
  extension: string;
} | null {
  // Expected format: storage/{type}/{id}.{extension}
  const match = path.match(/storage\/([^/]+)\/([^.]+)\.(.+)$/);
  if (!match) return null;
  
  return {
    type: match[1],
    id: match[2],
    extension: match[3],
  };
}

/**
 * Convert absolute path to relative path
 */
export function toRelativePath(absolutePath: string, baseDir: string = process.cwd()): string {
  return absolutePath.replace(baseDir + '/', '');
}

/**
 * Path validation utilities
 */
export const pathValidation = {
  isStoragePath: (path: string) => path.startsWith(BASE_PATHS.storage),
  isMetadataPath: (path: string) => path.startsWith(BASE_PATHS.metadata),
  isLibraryPath: (path: string) => path.startsWith(BASE_PATHS.library),
  
  isValidStorageType: (type: string) => {
    return Object.values(STORAGE_SUBDIRS).includes(type as typeof STORAGE_SUBDIRS[keyof typeof STORAGE_SUBDIRS]);
  },
  
  isValidLibraryCategory: (category: string) => {
    return Object.values(LIBRARY_CATEGORIES).includes(category as typeof LIBRARY_CATEGORIES[keyof typeof LIBRARY_CATEGORIES]);
  },
};

/**
 * Get content locations (all possible paths for a content ID)
 */
export function getContentLocations(id: string, baseDir: string = process.cwd()) {
  return {
    metadata: join(baseDir, BASE_PATHS.metadata, `${id}.json`),
    // Storage path would be determined by reading metadata
    // Library path would be determined by LLM categorization
  };
}