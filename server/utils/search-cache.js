import { buildSearchIndex } from '../search.js';

/**
 * Search index cache manager with automatic cleanup
 */
class SearchIndexCache {
    constructor() {
        this.index = null;
        this.lastBuilt = null;
        this.ttl = 5 * 60 * 1000; // 5 minutes
        this.maxAge = 30 * 60 * 1000; // 30 minutes max lifetime
        this.buildPromise = null;
        
        // Periodically clear the index to prevent memory leaks
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.maxAge);
    }
    
    /**
     * Get the search index, building it if necessary
     * @param {string} libraryDir - Path to library directory
     * @returns {Promise<Object>} - The search index
     */
    async getIndex(libraryDir) {
        const now = Date.now();
        
        // If index is fresh, return it
        if (this.index && this.lastBuilt && (now - this.lastBuilt) < this.ttl) {
            return this.index;
        }
        
        // If already building, wait for it
        if (this.buildPromise) {
            return this.buildPromise;
        }
        
        // Build new index
        this.buildPromise = this.rebuild(libraryDir);
        
        try {
            const index = await this.buildPromise;
            return index;
        } finally {
            this.buildPromise = null;
        }
    }
    
    /**
     * Force rebuild the index
     * @param {string} libraryDir - Path to library directory
     * @returns {Promise<Object>} - The new search index
     */
    async rebuild(libraryDir) {
        console.log('Building search index...');
        const startTime = Date.now();
        
        try {
            const newIndex = await buildSearchIndex(libraryDir);
            this.index = newIndex;
            this.lastBuilt = Date.now();
            
            const buildTime = Date.now() - startTime;
            console.log(`Search index built in ${buildTime}ms with ${Object.keys(newIndex.documents || {}).length} documents`);
            
            return newIndex;
        } catch (error) {
            console.error('Failed to build search index:', error);
            // Return stale index if available
            if (this.index) {
                return this.index;
            }
            throw error;
        }
    }
    
    /**
     * Clear the index to free memory
     */
    clear() {
        console.log('Clearing search index cache');
        this.index = null;
        this.lastBuilt = null;
        this.buildPromise = null;
    }
    
    /**
     * Cleanup old index to prevent memory leaks
     */
    cleanup() {
        if (this.lastBuilt && (Date.now() - this.lastBuilt) > this.maxAge) {
            this.clear();
        }
    }
    
    /**
     * Get cache statistics
     */
    getStats() {
        return {
            hasIndex: !!this.index,
            age: this.lastBuilt ? Date.now() - this.lastBuilt : null,
            documentCount: this.index ? Object.keys(this.index.documents || {}).length : 0,
            isBuilding: !!this.buildPromise
        };
    }
    
    /**
     * Dispose of the cache and clear intervals
     */
    dispose() {
        clearInterval(this.cleanupInterval);
        this.clear();
    }
}

// Export singleton instance
export const searchCache = new SearchIndexCache();