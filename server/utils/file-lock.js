/**
 * @file server/utils/file-lock.js
 * @purpose Server-side file-lock logic
 * @layer backend
 * @deps [import path from 'path';, import { promises as fs } from 'fs';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import { promises as fs } from 'fs';
import path from 'path';

// Simple file-based locking mechanism
const locks = new Map();
const lockDir = '.locks';

/**
 * Acquire a lock for a file
 * @param {string} filePath - The file to lock
 * @param {number} maxWaitTime - Maximum time to wait for lock (ms)
 * @returns {Promise<Function>} - Release function
 */
export async function acquireLock(filePath, maxWaitTime = 5000) {
    const lockId = path.resolve(filePath);
    const startTime = Date.now();
    
    // Wait for any existing lock to be released
    while (locks.has(lockId)) {
        if (Date.now() - startTime > maxWaitTime) {
            throw new Error(`Timeout acquiring lock for ${filePath}`);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Acquire the lock
    locks.set(lockId, Date.now());
    
    // Return release function
    return () => {
        locks.delete(lockId);
    };
}

/**
 * Execute a function with file locking
 * @param {string} filePath - The file to lock
 * @param {Function} fn - The function to execute
 * @returns {Promise<any>} - Result of the function
 */
export async function withLock(filePath, fn) {
    const release = await acquireLock(filePath);
    try {
        return await fn();
    } finally {
        release();
    }
}

/**
 * Update a JSON file with locking
 * @param {string} filePath - Path to JSON file
 * @param {Function} updateFn - Function that receives current data and returns updated data
 * @returns {Promise<any>} - The updated data
 */
export async function updateJsonFile(filePath, updateFn) {
    return withLock(filePath, async () => {
        let data;
        try {
            const content = await fs.readFile(filePath, 'utf8');
            data = JSON.parse(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                data = {};
            } else {
                throw error;
            }
        }
        
        const updated = await updateFn(data);
        await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
        return updated;
    });
}

/**
 * Read a JSON file with locking
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<any>} - The parsed data
 */
export async function readJsonFile(filePath) {
    return withLock(filePath, async () => {
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
    });
}

/**
 * Check if a file is currently locked
 * @param {string} filePath - The file to check
 * @returns {boolean} - True if locked
 */
export function isLocked(filePath) {
    const lockId = path.resolve(filePath);
    return locks.has(lockId);
}

/**
 * Clean up stale locks (older than 30 seconds)
 */
export function cleanupStaleLocks() {
    const now = Date.now();
    const staleTime = 30000; // 30 seconds
    
    for (const [lockId, timestamp] of locks.entries()) {
        if (now - timestamp > staleTime) {
            locks.delete(lockId);
        }
    }
}

// Run cleanup every 10 seconds
setInterval(cleanupStaleLocks, 10000);
