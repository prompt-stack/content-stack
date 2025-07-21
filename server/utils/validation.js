/**
 * @file server/utils/validation.js
 * @purpose Server-side validation logic
 * @layer backend
 * @deps [import path from 'path';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import path from 'path';

/**
 * Validates and sanitizes file IDs to prevent directory traversal
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid
 */
export function isValidId(id) {
    if (!id || typeof id !== 'string') return false;
    
    // Only allow alphanumeric, hyphens, and underscores
    return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * Validates and sanitizes filenames
 * @param {string} filename - The filename to validate
 * @returns {boolean} - True if valid
 */
export function isValidFilename(filename) {
    if (!filename || typeof filename !== 'string') return false;
    
    // Check for path traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return false;
    }
    
    // Check for null bytes
    if (filename.includes('\0')) {
        return false;
    }
    
    // Ensure it has a valid extension
    const ext = path.extname(filename);
    if (!ext || ext.length < 2) return false;
    
    return true;
}

/**
 * Sanitizes a filename by removing dangerous characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
export function sanitizeFilename(filename) {
    if (!filename) return '';
    
    // Get the base name without path
    const baseName = path.basename(filename);
    
    // Remove dangerous characters but keep the extension
    const ext = path.extname(baseName);
    const name = path.basename(baseName, ext);
    
    // Replace dangerous characters with safe ones
    const safeName = name
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .replace(/^\.+/, '') // Remove leading dots
        .substring(0, 200); // Limit length
    
    return safeName + ext;
}

/**
 * Validates that a path is within the allowed directory
 * @param {string} filePath - The path to check
 * @param {string} allowedDir - The allowed directory
 * @returns {boolean} - True if path is safe
 */
export function isPathWithinDirectory(filePath, allowedDir) {
    const resolvedPath = path.resolve(filePath);
    const resolvedAllowedDir = path.resolve(allowedDir);
    
    return resolvedPath.startsWith(resolvedAllowedDir);
}

/**
 * Validates request body fields
 * @param {object} body - Request body
 * @param {string[]} requiredFields - Required field names
 * @returns {{valid: boolean, errors: string[]}} - Validation result
 */
export function validateRequestBody(body, requiredFields) {
    const errors = [];
    
    if (!body || typeof body !== 'object') {
        return { valid: false, errors: ['Request body is required'] };
    }
    
    for (const field of requiredFields) {
        if (!body[field]) {
            errors.push(`Field '${field}' is required`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}
