/**
 * ErrorHandler - Centralized error handling and user feedback
 * Will be fully implemented in task 10
 */
export class ErrorHandler {
    static handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <h2>Unable to Load Course</h2>
            <p>We're having trouble loading the course content. Please try refreshing the page.</p>
            <button onclick="window.location.reload()">Refresh Page</button>
        `;
        
        document.body.appendChild(errorMessage);
    }

    static handleContentError(contentId, error) {
        console.error('Content error:', contentId, error);
        
        // Show inline error message
        const errorElement = document.createElement('div');
        errorElement.className = 'content-error';
        errorElement.innerHTML = `
            <p>Unable to load content. Please try again.</p>
            <button onclick="this.parentElement.remove()">Dismiss</button>
        `;
        
        // Find appropriate container and show error
        const container = document.querySelector('.modules__grid') || document.body;
        container.appendChild(errorElement);
    }

    static handleStorageError(error) {
        console.warn('Storage error:', error);
        // Continue without progress tracking
        // Will be fully implemented in task 10
    }
}