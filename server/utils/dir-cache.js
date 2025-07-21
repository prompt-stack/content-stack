/**
 * @file server/utils/dir-cache.js
 * @purpose Server-side dir-cache logic
 * @layer backend
 * @deps [import { promises as fs } from 'fs';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import { promises as fs } from 'fs';

/**
 * Directory listing cache to reduce filesystem operations
 */
class DirectoryCache {
    constructor() {
        this.cache = new Map();
        this.ttl = 5000; // 5 seconds
        this.maxSize = 100; // Max number of cached directories
        
        // Periodically clean up old entries
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 30000); // Every 30 seconds
    }
    
    /**
     * Get cached directory listing or read from filesystem
     * @param {string} dirPath - Directory path
     * @param {Object} options - Options for readdir
     * @returns {Promise<Array>} - Directory contents
     */
    async readdir(dirPath, options = {}) {
        const cacheKey = `${dirPath}:${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);
        const now = Date.now();
        
        // Return cached if fresh
        if (cached && (now - cached.time) < this.ttl) {
            return cached.data;
        }
        
        // Read from filesystem
        try {
            const data = await fs.readdir(dirPath, options);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data,
                time: now
            });
            
            // Limit cache size
            if (this.cache.size > this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            
            return data;
        } catch (error) {
            // If we have stale cache data, return it on error
            if (cached) {
                console.warn(`Using stale cache for ${dirPath} due to error:`, error.message);
                return cached.data;
            }
            throw error;
        }
    }
    
    /**
     * Invalidate cache for a specific directory
     * @param {string} dirPath - Directory path
     */
    invalidate(dirPath) {
        // Remove all entries for this directory
        for (const key of this.cache.keys()) {
            if (key.startsWith(dirPath)) {
                this.cache.delete(key);
            }
        }
    }
    
    /**
     * Clear entire cache
     */
    clear() {
        this.cache.clear();
    }
    
    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        const expiredKeys = [];
        
        for (const [key, value] of this.cache.entries()) {
            if ((now - value.time) > this.ttl * 2) {
                expiredKeys.push(key);
            }
        }
        
        expiredKeys.forEach(key => this.cache.delete(key));
    }
    
    /**
     * Get cache statistics
     */
    getStats() {
        const now = Date.now();
        let fresh = 0;
        let stale = 0;
        
        for (const value of this.cache.values()) {
            if ((now - value.time) < this.ttl) {
                fresh++;
            } else {
                stale++;
            }
        }
        
        return {
            size: this.cache.size,
            fresh,
            stale,
            maxSize: this.maxSize,
            ttl: this.ttl
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
export const dirCache = new DirectoryCache();
