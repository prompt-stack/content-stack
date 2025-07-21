/**
 * Canonical Feature Configuration - Single Source of Truth
 * Based on feedback recommendations for tiered UX monetization
 */

/**
 * @typedef {Object} FeatureCapability
 * @property {string} id - Unique feature identifier
 * @property {string} name - Display name
 * @property {string} description - Feature description
 * @property {string} category - Feature category
 * @property {string[]} tiers - Allowed tiers
 * @property {string} [component] - UI component name
 * @property {string} [apiEndpoint] - API endpoint
 * @property {Object} [quotaLimits] - Quota limits per tier
 * @property {string} upsellTriggerRule - When to show upsell
 * @property {string} upgradeMessage - Upgrade prompt message
 * @property {string} valueProposition - User-facing benefit
 */

export const FEATURES = [
  // Core Features (Free)
  {
    id: 'file-upload',
    name: 'File Upload',
    description: 'Upload documents, images, and files',
    category: 'content',
    tiers: ['free', 'pro', 'enterprise'],
    quotaLimits: { free: 5, pro: 50, enterprise: -1 }, // MB per file
    upsellTriggerRule: 'immediate',
    upgradeMessage: 'Upgrade for larger file uploads',
    valueProposition: 'Upload files up to 50MB (vs 5MB)'
  },
  
  {
    id: 'text-paste',
    name: 'Text Paste',
    description: 'Paste and save text content directly',
    category: 'content',
    tiers: ['free', 'pro', 'enterprise'],
    upsellTriggerRule: 'immediate',
    upgradeMessage: 'Basic text pasting available',
    valueProposition: 'Save unlimited text content'
  },
  
  {
    id: 'basic-search',
    name: 'Basic Search',
    description: 'Search your content library',
    category: 'content',
    tiers: ['free', 'pro', 'enterprise'],
    upsellTriggerRule: 'blocked_action',
    upgradeMessage: 'Upgrade for advanced search features',
    valueProposition: 'Find content with basic keyword search'
  },
  
  {
    id: 'manual-tagging',
    name: 'Manual Tagging',
    description: 'Add tags to organize content',
    category: 'content',
    tiers: ['free', 'pro', 'enterprise'],
    upsellTriggerRule: 'usage_pattern',
    upgradeMessage: 'Upgrade for automatic AI tagging',
    valueProposition: 'Organize content with custom tags'
  },
  
  // URL Extraction Features (Pro+)
  {
    id: 'url-extraction',
    name: 'URL Extraction',
    description: 'Extract content from web URLs',
    category: 'extraction',
    tiers: ['pro', 'enterprise'],
    component: 'URLExtractor',
    apiEndpoint: '/api/extract-url',
    upsellTriggerRule: 'contextual',
    upgradeMessage: 'Extract full content and metadata from URLs',
    valueProposition: 'Save 15 minutes of manual note-taking per article'
  },
  
  {
    id: 'youtube-extraction',
    name: 'YouTube Extraction',
    description: 'Extract transcripts and metadata from YouTube',
    category: 'extraction',
    tiers: ['pro', 'enterprise'],
    component: 'YouTubeExtractor',
    apiEndpoint: '/api/extract-youtube',
    upsellTriggerRule: 'contextual',
    upgradeMessage: 'Pull full transcript + key moments with Pro',
    valueProposition: 'Get full transcripts, timestamps, and speaker identification'
  },
  
  {
    id: 'tiktok-extraction',
    name: 'TikTok Extraction',
    description: 'Extract captions and metadata from TikTok',
    category: 'extraction',
    tiers: ['pro', 'enterprise'],
    component: 'TikTokExtractor',
    apiEndpoint: '/api/extract-tiktok',
    upsellTriggerRule: 'contextual',
    upgradeMessage: 'Extract captions and trends from TikTok videos',
    valueProposition: 'Auto-extract captions, music, and trend data'
  },
  
  {
    id: 'reddit-extraction',
    name: 'Reddit Extraction',
    description: 'Extract discussions and comments from Reddit',
    category: 'extraction',
    tiers: ['pro', 'enterprise'],
    component: 'RedditExtractor',
    apiEndpoint: '/api/extract-reddit',
    upsellTriggerRule: 'contextual',
    upgradeMessage: 'Extract full Reddit discussions and top comments',
    valueProposition: 'Capture entire Reddit threads with context'
  },
  
  // Automation Features (Pro+)
  {
    id: 'bulk-operations',
    name: 'Bulk Operations',
    description: 'Process multiple items simultaneously',
    category: 'automation',
    tiers: ['pro', 'enterprise'],
    component: 'BulkProcessor',
    quotaLimits: { pro: 25, enterprise: -1 }, // files at once
    upsellTriggerRule: 'usage_pattern',
    upgradeMessage: 'Process 25 files at once, auto-tag & summarize',
    valueProposition: 'Save hours with batch processing and automation'
  },
  
  {
    id: 'auto-tagging',
    name: 'AI Auto-Tagging',
    description: 'Automatic content tagging with AI',
    category: 'automation',
    tiers: ['pro', 'enterprise'],
    component: 'AutoTagger',
    apiEndpoint: '/api/auto-tag',
    upsellTriggerRule: 'usage_pattern',
    upgradeMessage: 'AI tags your content automatically',
    valueProposition: 'Never manually tag content again'
  },
  
  // Advanced Search (Pro+)
  {
    id: 'advanced-search',
    name: 'Advanced Search',
    description: 'Regex, semantic, and filtered search',
    category: 'content',
    tiers: ['pro', 'enterprise'],
    component: 'AdvancedSearch',
    upsellTriggerRule: 'blocked_action',
    upgradeMessage: 'Use regex, semantic search, and advanced filters',
    valueProposition: 'Find exactly what you need with powerful search'
  },
  
  {
    id: 'semantic-search',
    name: 'Semantic Search',
    description: 'AI-powered meaning-based search',
    category: 'content