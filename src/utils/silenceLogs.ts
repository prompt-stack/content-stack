/**
 * @file utils/silenceLogs.ts
 * @purpose Quick utility to silence console logs
 * @layer utility
 * @deps none
 */

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};

export const silenceLogs = () => {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  // Keep errors for critical issues
  console.error = (...args: any[]) => {
    // Only show actual errors, not fetch failures
    const message = args[0]?.toString() || '';
    if (message.includes('Failed to fetch') || 
        message.includes('ERR_CONNECTION_REFUSED') ||
        message.includes('Sync check failed') ||
        message.includes('Failed to load queue')) {
      return; // Suppress these common errors
    }
    originalConsole.error(...args);
  };
};

export const restoreLogs = () => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
};

// Add to window for easy browser console access
if (typeof window !== 'undefined') {
  (window as any).silenceLogs = silenceLogs;
  (window as any).restoreLogs = restoreLogs;
  
  // Auto-silence on load if flag is set
  if (localStorage.getItem('silentMode') === 'true') {
    silenceLogs();
  }
}