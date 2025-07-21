/**
 * @file content/blog/kiro/assets/scripts/modules/CourseConfig.js
 * @purpose Blog content script: CourseConfig
 * @layer content
 * @deps none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role pure-view
 */

/**
 * CourseConfig - Handles loading and managing course configuration
 */
export class CourseConfig {
    constructor() {
        this.config = null;
        this.configPath = './assets/data/course-config.json';
    }

    /**
     * Load course configuration from JSON file
     */
    async load() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            
            this.config = await response.json();
            this.validateConfig();
            
            console.log('Course configuration loaded successfully');
            return this.config;
            
        } catch (error) {
            console.error('Error loading course configuration:', error);
            throw error;
        }
    }

    /**
     * Validate the loaded configuration
     */
    validateConfig() {
        if (!this.config) {
            throw new Error('Configuration is null');
        }

        // Validate required top-level properties
        const required = ['course', 'modules', 'ui', 'features'];
        for (const prop of required) {
            if (!this.config[prop]) {
                throw new Error(`Missing required configuration property: ${prop}`);
            }
        }

        // Validate course data
        if (!this.config.course.title || !this.config.course.description) {
            throw new Error('Course title and description are required');
        }

        // Validate modules
        if (!Array.isArray(this.config.modules) || this.config.modules.length === 0) {
            throw new Error('At least one module is required');
        }

        // Validate module structure
        this.config.modules.forEach((module, index) => {
            if (!module.id || !module.title || !module.sections) {
                throw new Error(`Invalid module structure at index ${index}`);
            }
        });

        console.log('Configuration validation passed');
    }

    /**
     * Get course metadata
     */
    getCourseData() {
        return this.config?.course || {};
    }

    /**
     * Get all modules
     */
    getModules() {
        return this.config?.modules || [];
    }

    /**
     * Get a specific module by ID
     */
    getModule(moduleId) {
        return this.config?.modules.find(module => module.id === moduleId);
    }

    /**
     * Get UI configuration
     */
    getUIConfig() {
        return this.config?.ui || {};
    }

    /**
     * Get feature flags
     */
    getFeatures() {
        return this.config?.features || {};
    }

    /**
     * Get theme configuration
     */
    getTheme() {
        return this.config?.ui?.theme || {};
    }

    /**
     * Check if a feature is enabled
     */
    isFeatureEnabled(featureName) {
        return this.config?.features?.[featureName] === true;
    }

    /**
     * Get navigation configuration
     */
    getNavigationConfig() {
        return this.config?.ui?.navigation || {};
    }

    /**
     * Get content configuration
     */
    getContentConfig() {
        return this.config?.ui?.content || {};
    }
}
