/**
 * @file config/categories.config.ts
 * @purpose Content categories configuration
 * @description Defines all content categories with metadata
 * @llm-read true
 * @llm-write full-edit
 */

export interface CategoryConfig {
  name: string;
  icon: string;
  color: string;
  description: string;
  keywords?: string[];
}

export const categoriesConfig: Record<string, CategoryConfig> = {
  tech: {
    name: 'Technology',
    icon: '💻',
    color: '#6366f1',
    description: 'Programming, AI, software, digital tools, automation',
    keywords: ['programming', 'ai', 'software', 'code', 'development', 'api', 'cloud']
  },
  business: {
    name: 'Business',
    icon: '💼',
    color: '#10b981',
    description: 'Entrepreneurship, marketing, strategy, growth',
    keywords: ['business', 'startup', 'marketing', 'sales', 'growth', 'strategy']
  },
  finance: {
    name: 'Finance',
    icon: '💰',
    color: '#f59e0b',
    description: 'Investing, crypto, money management, economics',
    keywords: ['finance', 'investing', 'crypto', 'money', 'economics', 'trading']
  },
  health: {
    name: 'Health & Wellness',
    icon: '🏃',
    color: '#ef4444',
    description: 'Fitness, wellness, nutrition, mental health',
    keywords: ['health', 'fitness', 'wellness', 'nutrition', 'exercise', 'mental']
  },
  cooking: {
    name: 'Cooking',
    icon: '🍳',
    color: '#ec4899',
    description: 'Recipes, food prep, culinary techniques',
    keywords: ['cooking', 'recipes', 'food', 'culinary', 'kitchen', 'meal']
  },
  education: {
    name: 'Education',
    icon: '📚',
    color: '#8b5cf6',
    description: 'Learning, tutorials, how-to guides',
    keywords: ['education', 'learning', 'tutorial', 'guide', 'course', 'teaching']
  },
  lifestyle: {
    name: 'Lifestyle',
    icon: '🌟',
    color: '#06b6d4',
    description: 'Personal development, habits, productivity',
    keywords: ['lifestyle', 'productivity', 'habits', 'personal', 'development']
  },
  entertainment: {
    name: 'Entertainment',
    icon: '🎮',
    color: '#a855f7',
    description: 'Pop culture, media, gaming, arts',
    keywords: ['entertainment', 'gaming', 'media', 'culture', 'art', 'music']
  },
  general: {
    name: 'General',
    icon: '📝',
    color: '#6b7280',
    description: 'Cross-category or uncategorized content',
    keywords: []
  }
};

// Helper functions
export function getCategoryByName(name: string): CategoryConfig | undefined {
  const key = Object.keys(categoriesConfig).find(
    k => categoriesConfig[k].name.toLowerCase() === name.toLowerCase()
  );
  return key ? categoriesConfig[key] : undefined;
}

export function getCategoryKeyByName(name: string): string | undefined {
  return Object.keys(categoriesConfig).find(
    k => categoriesConfig[k].name.toLowerCase() === name.toLowerCase()
  );
}

export function isValidCategory(category: string): boolean {
  return category in categoriesConfig;
}

export function getAllCategories(): string[] {
  return Object.keys(categoriesConfig);
}

export function getCategoryConfig(category: string): CategoryConfig | undefined {
  return categoriesConfig[category];
}

// Export type
export type CategoryKey = keyof typeof categoriesConfig;