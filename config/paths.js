import { fileURLToPath } from 'url';
import path from 'path';

// Get the root directory (assuming this file is in config/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.join(__dirname, '..');

// Core directories
export const PATHS = {
  // Main directories
  root: ROOT_DIR,
  content: path.join(ROOT_DIR, 'content'),
  inbox: path.join(ROOT_DIR, 'content', 'inbox'),
  library: path.join(ROOT_DIR, 'content', 'library'),
  archive: path.join(ROOT_DIR, 'content', 'archive'),
  temp: path.join(ROOT_DIR, 'temp'),
  
  // Metadata structure
  metadata: {
    root: path.join(ROOT_DIR, 'content', 'metadata'),
    raw: path.join(ROOT_DIR, 'content', 'metadata', 'raw'),
    processed: path.join(ROOT_DIR, 'content', 'metadata', 'processed')
  },
  
  // Configuration directories
  config: path.join(ROOT_DIR, 'config'),
  prompts: path.join(ROOT_DIR, 'prompts'),
  
  // Server directories
  server: path.join(ROOT_DIR, 'server'),
  public: path.join(ROOT_DIR, 'public'),
  
  // Scripts directory
  scripts: path.join(ROOT_DIR, 'scripts'),
  
  // Plugin directories
  plugins: {
    root: path.join(ROOT_DIR, 'plugins'),
    installed: path.join(ROOT_DIR, 'plugins', 'installed')
  },
  
  // Library subdirectories
  libraryCategories: {
    tech: path.join(ROOT_DIR, 'content', 'library', 'tech'),
    business: path.join(ROOT_DIR, 'content', 'library', 'business'),
    health: path.join(ROOT_DIR, 'content', 'library', 'health'),
    finance: path.join(ROOT_DIR, 'content', 'library', 'finance'),
    cooking: path.join(ROOT_DIR, 'content', 'library', 'cooking'),
    education: path.join(ROOT_DIR, 'content', 'library', 'education'),
    lifestyle: path.join(ROOT_DIR, 'content', 'library', 'lifestyle'),
    entertainment: path.join(ROOT_DIR, 'content', 'library', 'entertainment'),
    general: path.join(ROOT_DIR, 'content', 'library', 'general')
  }
};

// Helper functions for common path operations
export const pathHelpers = {
  /**
   * Get metadata path by status
   * @param {string} status - 'raw' or 'processed'
   * @param {string} filename - optional filename to append
   */
  getMetadataPath: (status = 'root', filename = '') => {
    const basePath = PATHS.metadata[status] || PATHS.metadata.root;
    return filename ? path.join(basePath, filename) : basePath;
  },
  
  /**
   * Get library category path
   * @param {string} category - library category name
   * @param {string} filename - optional filename to append
   */
  getLibraryPath: (category, filename = '') => {
    const basePath = PATHS.libraryCategories[category] || PATHS.libraryCategories.general;
    return filename ? path.join(basePath, filename) : basePath;
  },
  
  /**
   * Get all possible metadata locations for a file
   * @param {string} filename - metadata filename
   */
  getAllMetadataPaths: (filename) => [
    path.join(PATHS.metadata.raw, filename),
    path.join(PATHS.metadata.processed, filename),
    path.join(PATHS.metadata.root, filename) // legacy location
  ],
  
  /**
   * Get search folders for metadata (in priority order)
   */
  getMetadataSearchFolders: () => ['raw', 'processed', '']
};

// Environment-specific overrides (for future use)
export const getEnvironmentPaths = (env = process.env.NODE_ENV || 'development') => {
  const envOverrides = {
    development: {},
    production: {},
    test: {
      // Could override to use temp directories for testing
      inbox: path.join(ROOT_DIR, 'temp', 'test-inbox'),
      library: path.join(ROOT_DIR, 'temp', 'test-library')
    }
  };
  
  return {
    ...PATHS,
    ...envOverrides[env]
  };
};

export default PATHS; 