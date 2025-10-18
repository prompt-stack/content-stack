/**
 * @file lib/logger.ts
 * @purpose Centralized logging utility with environment-based control
 * @layer utility
 * @deps none
 * @used-by [All components and services]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

// Check if we should suppress logs (controlled by environment variable or localStorage)
const SUPPRESS_LOGS = import.meta.env.VITE_SUPPRESS_LOGS === 'true' || 
                      localStorage.getItem('suppressLogs') === 'true';

const SUPPRESS_ERRORS = import.meta.env.VITE_SUPPRESS_ERRORS === 'true' || 
                        localStorage.getItem('suppressErrors') === 'true';

export const logger = {
  log: (...args: any[]) => {
    if (!SUPPRESS_LOGS) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (!SUPPRESS_ERRORS) {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (!SUPPRESS_LOGS) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (!SUPPRESS_LOGS) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    // Debug logs only show in development
    if (import.meta.env.DEV && !SUPPRESS_LOGS) {
      console.debug(...args);
    }
  },
  
  // Force log regardless of settings (for critical errors)
  force: (...args: any[]) => {
    console.error('[CRITICAL]', ...args);
  }
};

// Helper to toggle logging at runtime
export const toggleLogs = (suppress: boolean) => {
  localStorage.setItem('suppressLogs', suppress ? 'true' : 'false');
  window.location.reload(); // Reload to apply changes
};

// Helper to toggle error logging at runtime
export const toggleErrors = (suppress: boolean) => {
  localStorage.setItem('suppressErrors', suppress ? 'true' : 'false');
  window.location.reload(); // Reload to apply changes
};