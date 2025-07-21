/**
 * Library Categories Configuration
 * Central source of truth for content categorization
 */

export const CATEGORIES = {
  tech: {
    id: 'tech',
    label: 'Tech',
    description: 'Programming, AI, software, digital tools',
    icon: '💻',
    color: '#3b82f6' // blue
  },
  business: {
    id: 'business',
    label: 'Business',
    description: 'Marketing, strategy, entrepreneurship',
    icon: '💼',
    color: '#10b981' // green
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    description: 'Investing, crypto, economics',
    icon: '💰',
    color: '#f59e0b' // amber
  },
  health: {
    id: 'health',
    label: 'Health',
    description: 'Fitness, wellness, nutrition',
    icon: '🏃',
    color: '#ef4444' // red
  },
  cooking: {
    id: 'cooking',
    label: 'Cooking',
    description: 'Recipes, culinary techniques',
    icon: '🍳',
    color: '#f97316' // orange
  },
  education: {
    id: 'education',
    label: 'Education',
    description: 'Learning, tutorials, guides',
    icon: '📚',
    color: '#8b5cf6' // purple
  },
  lifestyle: {
    id: 'lifestyle',
    label: 'Lifestyle',
    description: 'Productivity, habits, personal dev',
    icon: '🌟',
    color: '#ec4899' // pink
  },
  entertainment: {
    id: 'entertainment',
    label: 'Entertainment',
    description: 'Media, gaming, arts',
    icon: '🎮',
    color: '#6366f1' // indigo
  },
  general: {
    id: 'general',
    label: 'General',
    description: 'Cross-category content',
    icon: '📝',
    color: '#6b7280' // gray
  }
};

// Export as array for dropdowns
export const CATEGORY_LIST = Object.values(CATEGORIES);

// Export valid category IDs for validation
export const VALID_CATEGORIES = Object.keys(CATEGORIES);

// Helper to get category by ID
export function getCategoryById(id) {
  return CATEGORIES[id] || CATEGORIES.general;
}

// Helper to validate category
export function isValidCategory(id) {
  return VALID_CATEGORIES.includes(id);
}