/**
 * ProgressTracker - Handles user progress tracking and persistence
 */
export class ProgressTracker {
    constructor() {
        this.progress = {
            completedSections: [],
            completedModules: [],
            currentSection: null,
            overallProgress: 0,
            lastAccessed: new Date().toISOString(),
            moduleProgress: {}
        };
        
        // Load existing progress
        this.loadFromStorage();
    }

    /**
     * Mark a section as complete
     */
    markSectionComplete(sectionId, moduleId) {
        if (!this.progress.completedSections.includes(sectionId)) {
            this.progress.completedSections.push(sectionId);
        }
        
        this.progress.currentSection = sectionId;
        this.progress.lastAccessed = new Date().toISOString();
        
        // Update module progress
        this.updateModuleProgress(moduleId);
        
        // Save to storage
        this.saveToStorage();
        
        console.log(`Section ${sectionId} marked as complete`);
    }

    /**
     * Get progress for a specific section
     */
    getSectionProgress(sectionId) {
        return this.progress.completedSections.includes(sectionId);
    }

    /**
     * Check if a module is completed
     */
    isModuleCompleted(moduleId) {
        return this.progress.completedModules.includes(moduleId);
    }

    /**
     * Get progress percentage for a module (0-1)
     */
    getModuleProgress(moduleId) {
        // Return stored progress or default to 0
        return this.progress.moduleProgress[moduleId] || 0;
    }

    /**
     * Update module progress based on completed sections
     */
    updateModuleProgress(moduleId) {
        // For now, we'll use a simple calculation
        // This will be enhanced when we have full module/section data
        const currentProgress = this.progress.moduleProgress[moduleId] || 0;
        const newProgress = Math.min(currentProgress + 0.25, 1.0); // Increment by 25%
        
        this.progress.moduleProgress[moduleId] = newProgress;
        
        // Mark module as completed if progress reaches 100%
        if (newProgress >= 1.0 && !this.progress.completedModules.includes(moduleId)) {
            this.progress.completedModules.push(moduleId);
        }
        
        // Update overall progress
        this.calculateOverallProgress();
    }

    /**
     * Calculate overall course progress
     */
    calculateOverallProgress() {
        const moduleProgresses = Object.values(this.progress.moduleProgress);
        if (moduleProgresses.length === 0) {
            this.progress.overallProgress = 0;
            return;
        }
        
        const totalProgress = moduleProgresses.reduce((sum, progress) => sum + progress, 0);
        this.progress.overallProgress = totalProgress / moduleProgresses.length;
    }

    /**
     * Get overall course progress (0-1)
     */
    getOverallProgress() {
        return this.progress.overallProgress;
    }

    /**
     * Reset progress for a module
     */
    resetModuleProgress(moduleId) {
        this.progress.moduleProgress[moduleId] = 0;
        
        // Remove from completed modules
        const index = this.progress.completedModules.indexOf(moduleId);
        if (index > -1) {
            this.progress.completedModules.splice(index, 1);
        }
        
        // Remove completed sections for this module
        // Note: This is a simplified approach - in full implementation,
        // we'd need to know which sections belong to which module
        
        this.calculateOverallProgress();
        this.saveToStorage();
    }

    /**
     * Reset all progress
     */
    resetAllProgress() {
        this.progress = {
            completedSections: [],
            completedModules: [],
            currentSection: null,
            overallProgress: 0,
            lastAccessed: new Date().toISOString(),
            moduleProgress: {}
        };
        
        this.saveToStorage();
        console.log('All progress reset');
    }

    /**
     * Save progress to localStorage
     */
    saveToStorage() {
        try {
            const progressData = JSON.stringify(this.progress);
            localStorage.setItem('cs-course-progress', progressData);
            console.log('Progress saved to localStorage');
        } catch (error) {
            console.warn('Failed to save progress to localStorage:', error);
            // Could implement alternative storage or just continue without persistence
        }
    }

    /**
     * Load progress from localStorage
     */
    loadFromStorage() {
        try {
            const savedProgress = localStorage.getItem('cs-course-progress');
            if (savedProgress) {
                const parsedProgress = JSON.parse(savedProgress);
                
                // Merge with default structure to handle version changes
                this.progress = {
                    ...this.progress,
                    ...parsedProgress,
                    lastAccessed: new Date().toISOString()
                };
                
                console.log('Progress loaded from localStorage');
            }
        } catch (error) {
            console.warn('Failed to load progress from localStorage:', error);
            // Continue with default progress
        }
    }

    /**
     * Get progress summary for debugging/display
     */
    getProgressSummary() {
        return {
            overallProgress: Math.round(this.progress.overallProgress * 100),
            completedModules: this.progress.completedModules.length,
            completedSections: this.progress.completedSections.length,
            currentSection: this.progress.currentSection,
            lastAccessed: this.progress.lastAccessed
        };
    }

    /**
     * Set module progress directly (useful for testing or manual updates)
     */
    setModuleProgress(moduleId, progress) {
        this.progress.moduleProgress[moduleId] = Math.max(0, Math.min(1, progress));
        
        // Update completion status
        if (progress >= 1.0 && !this.progress.completedModules.includes(moduleId)) {
            this.progress.completedModules.push(moduleId);
        } else if (progress < 1.0) {
            const index = this.progress.completedModules.indexOf(moduleId);
            if (index > -1) {
                this.progress.completedModules.splice(index, 1);
            }
        }
        
        this.calculateOverallProgress();
        this.saveToStorage();
    }

    /**
     * Check if localStorage is available
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Recover from corrupted progress data
     */
    recoverFromCorruption() {
        console.warn('Attempting to recover from corrupted progress data');
        
        try {
            // Try to salvage what we can from corrupted data
            const corruptedData = localStorage.getItem('cs-course-progress');
            if (corruptedData) {
                // Try to extract partial data
                const partial = this.extractPartialData(corruptedData);
                if (partial) {
                    this.progress = {
                        ...this.progress,
                        ...partial,
                        lastAccessed: new Date().toISOString()
                    };
                    
                    // Save the recovered data
                    this.saveToStorage();
                    console.log('Progress data partially recovered');
                    return true;
                }
            }
        } catch (error) {
            console.error('Recovery failed:', error);
        }
        
        // If recovery fails, reset to default
        this.resetAllProgress();
        console.log('Progress data reset to default');
        return false;
    }

    /**
     * Extract partial data from corrupted JSON
     */
    extractPartialData(corruptedJson) {
        try {
            // Try to find valid JSON fragments
            const matches = corruptedJson.match(/"completedModules":\s*\[[^\]]*\]/);
            if (matches) {
                const completedModules = JSON.parse(`{${matches[0]}}`).completedModules;
                return { completedModules };
            }
        } catch (error) {
            // Ignore extraction errors
        }
        return null;
    }

    /**
     * Create progress backup
     */
    createBackup() {
        if (!this.isStorageAvailable()) return false;
        
        try {
            const backup = {
                ...this.progress,
                backupTimestamp: new Date().toISOString()
            };
            
            localStorage.setItem('cs-course-progress-backup', JSON.stringify(backup));
            console.log('Progress backup created');
            return true;
        } catch (error) {
            console.error('Failed to create backup:', error);
            return false;
        }
    }

    /**
     * Restore from backup
     */
    restoreFromBackup() {
        if (!this.isStorageAvailable()) return false;
        
        try {
            const backupData = localStorage.getItem('cs-course-progress-backup');
            if (backupData) {
                const backup = JSON.parse(backupData);
                
                // Validate backup data
                if (backup.completedModules && Array.isArray(backup.completedModules)) {
                    this.progress = {
                        ...this.progress,
                        ...backup,
                        lastAccessed: new Date().toISOString()
                    };
                    
                    this.saveToStorage();
                    console.log('Progress restored from backup');
                    return true;
                }
            }
        } catch (error) {
            console.error('Failed to restore from backup:', error);
        }
        
        return false;
    }

    /**
     * Get detailed progress analytics
     */
    getProgressAnalytics() {
        const totalModules = Object.keys(this.progress.moduleProgress).length;
        const completedModules = this.progress.completedModules.length;
        const inProgressModules = Object.values(this.progress.moduleProgress)
            .filter(progress => progress > 0 && progress < 1).length;
        
        const averageProgress = totalModules > 0 
            ? Object.values(this.progress.moduleProgress).reduce((sum, p) => sum + p, 0) / totalModules
            : 0;
        
        const timeSpent = this.calculateTimeSpent();
        const streak = this.calculateStreak();
        
        return {
            totalModules,
            completedModules,
            inProgressModules,
            notStartedModules: totalModules - completedModules - inProgressModules,
            overallProgress: this.progress.overallProgress,
            averageProgress,
            completionRate: totalModules > 0 ? completedModules / totalModules : 0,
            timeSpent,
            streak,
            lastAccessed: this.progress.lastAccessed
        };
    }

    /**
     * Calculate estimated time spent (simplified)
     */
    calculateTimeSpent() {
        // This is a simplified calculation
        // In a real app, you'd track actual time spent
        const completedSections = this.progress.completedSections.length;
        const estimatedMinutesPerSection = 10;
        return completedSections * estimatedMinutesPerSection;
    }

    /**
     * Calculate learning streak
     */
    calculateStreak() {
        // Simplified streak calculation
        // In a real app, you'd track daily activity
        const lastAccessed = new Date(this.progress.lastAccessed);
        const now = new Date();
        const daysDiff = Math.floor((now - lastAccessed) / (1000 * 60 * 60 * 24));
        
        return daysDiff <= 1 ? 1 : 0; // Simplified: 1 if accessed recently, 0 otherwise
    }

    /**
     * Export progress data
     */
    exportProgress() {
        const exportData = {
            ...this.progress,
            exportTimestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import progress data
     */
    importProgress(importData) {
        try {
            const data = typeof importData === 'string' ? JSON.parse(importData) : importData;
            
            // Validate imported data
            if (data.completedModules && Array.isArray(data.completedModules)) {
                // Create backup before import
                this.createBackup();
                
                // Import the data
                this.progress = {
                    completedSections: data.completedSections || [],
                    completedModules: data.completedModules || [],
                    currentSection: data.currentSection || null,
                    overallProgress: data.overallProgress || 0,
                    lastAccessed: new Date().toISOString(),
                    moduleProgress: data.moduleProgress || {}
                };
                
                this.saveToStorage();
                console.log('Progress data imported successfully');
                return true;
            }
        } catch (error) {
            console.error('Failed to import progress:', error);
        }
        
        return false;
    }

    /**
     * Add progress event listener
     */
    addEventListener(event, callback) {
        if (!this.eventListeners) {
            this.eventListeners = {};
        }
        
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        
        this.eventListeners[event].push(callback);
    }

    /**
     * Emit progress event
     */
    emitEvent(event, data) {
        if (this.eventListeners && this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in progress event listener:', error);
                }
            });
        }
    }

    /**
     * Enhanced save with event emission
     */
    saveToStorage() {
        try {
            const progressData = JSON.stringify(this.progress);
            localStorage.setItem('cs-course-progress', progressData);
            
            // Emit progress update event
            this.emitEvent('progress-updated', this.getProgressSummary());
            
            console.log('Progress saved to localStorage');
        } catch (error) {
            console.warn('Failed to save progress to localStorage:', error);
            // Try to recover space by cleaning up
            this.cleanupStorage();
        }
    }

    /**
     * Cleanup storage space
     */
    cleanupStorage() {
        try {
            // Remove old backups if storage is full
            localStorage.removeItem('cs-course-progress-backup');
            
            // Try saving again
            const progressData = JSON.stringify(this.progress);
            localStorage.setItem('cs-course-progress', progressData);
            
            console.log('Storage cleaned up and progress saved');
        } catch (error) {
            console.error('Storage cleanup failed:', error);
            // Continue without persistence
        }
    }
}