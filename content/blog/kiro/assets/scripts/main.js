/**
 * Main JavaScript entry point
 * This file initializes the application and coordinates all modules
 */

// Import core modules
import { CourseConfig } from './modules/CourseConfig.js';
import { Navigation } from './modules/Navigation.js';
import { ProgressTracker } from './modules/ProgressTracker.js';
import { ContentLoader } from './modules/ContentLoader.js';
import { ModuleRenderer } from './modules/ModuleRenderer.js';
import { ErrorHandler } from './modules/ErrorHandler.js';
import { AbstractionViewer } from './modules/AbstractionViewer.js';
import { DataStructuresViewer } from './modules/DataStructuresViewer.js';

/**
 * Application class - main controller
 */
class App {
    constructor() {
        this.config = null;
        this.navigation = null;
        this.progressTracker = null;
        this.contentLoader = null;
        this.moduleRenderer = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing CS Course Website...');
            
            // Show loading indicator
            this.showLoading();
            
            // Load course configuration
            this.config = new CourseConfig();
            await this.config.load();
            
            // Initialize core modules
            this.progressTracker = new ProgressTracker();
            this.contentLoader = new ContentLoader(this.config);
            this.moduleRenderer = new ModuleRenderer(this.config, this.progressTracker);
            this.navigation = new Navigation(this.config, this.progressTracker);
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Render initial content
            await this.renderInitialContent();
            
            // Hide loading indicator
            this.hideLoading();
            
            this.isInitialized = true;
            console.log('Application initialized successfully');
            
        } catch (error) {
            ErrorHandler.handleInitializationError(error);
            this.hideLoading();
        }
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Navigation events
        document.addEventListener('click', this.handleNavigation.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Window events
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Progress tracking events
        document.addEventListener('section-complete', this.handleSectionComplete.bind(this));
    }

    /**
     * Handle navigation clicks
     */
    handleNavigation(event) {
        const target = event.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        event.preventDefault();
        
        switch (action) {
            case 'start-learning':
                this.startLearning();
                break;
            case 'open-module':
                this.openModule(target.dataset.moduleId);
                break;
            case 'close-content':
                this.closeContent();
                break;
            case 'toggle-nav':
                this.navigation.toggleMobileMenu();
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboard(event) {
        // Escape key closes content viewer
        if (event.key === 'Escape') {
            this.closeContent();
        }
        
        // Arrow keys for navigation (when appropriate)
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            // Handle module navigation
            this.handleArrowNavigation(event.key);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (this.navigation) {
                this.navigation.handleResize();
            }
        }, 250);
    }

    /**
     * Handle before page unload
     */
    handleBeforeUnload() {
        // Save progress before leaving
        if (this.progressTracker) {
            this.progressTracker.saveToStorage();
        }
    }

    /**
     * Handle section completion
     */
    handleSectionComplete(event) {
        const { sectionId, moduleId } = event.detail;
        this.progressTracker.markSectionComplete(sectionId, moduleId);
        this.navigation.updateProgress();
    }

    /**
     * Render initial content
     */
    async renderInitialContent() {
        // Initialize some demo progress for visual demonstration
        this.initializeDemoProgress();
        
        // Enhance hero section
        this.enhanceHeroSection();
        
        // Render navigation
        this.navigation.render();
        
        // Render course overview
        await this.renderOverview();
        
        // Render module cards
        await this.renderModules();
    }

    /**
     * Initialize demo progress data for demonstration
     */
    initializeDemoProgress() {
        // Only add demo data if no existing progress
        if (this.progressTracker.getOverallProgress() === 0) {
            // Set some sample progress
            this.progressTracker.setModuleProgress('abstraction', 0.75);
            this.progressTracker.setModuleProgress('data-structures', 0.5);
            this.progressTracker.setModuleProgress('apis-communication', 0.25);
            
            console.log('Demo progress initialized');
        }
    }

    /**
     * Enhance hero section with dynamic content and interactions
     */
    enhanceHeroSection() {
        const heroSection = document.querySelector('.hero');
        const heroVisual = document.querySelector('.hero__visual');
        const ctaButton = document.querySelector('.hero__cta');
        
        if (!heroSection) return;

        // Add dynamic course stats to hero
        this.addHeroStats();
        
        // Enhance hero visual with interactive elements
        this.enhanceHeroVisual(heroVisual);
        
        // Add scroll-triggered animations
        this.setupHeroAnimations(heroSection);
        
        // Enhance CTA button functionality
        this.enhanceCTAButton(ctaButton);
        
        console.log('Hero section enhanced');
    }

    /**
     * Add dynamic stats to hero section
     */
    addHeroStats() {
        const heroContainer = document.querySelector('.hero__container');
        if (!heroContainer) return;

        const courseData = this.config.getCourseData();
        const modules = this.config.getModules();
        const overallProgress = this.progressTracker.getOverallProgress();

        // Create hero features section
        const heroFeatures = document.createElement('div');
        heroFeatures.className = 'hero__features';
        heroFeatures.innerHTML = `
            <div class="hero__feature">
                <div class="hero__feature-icon">📚</div>
                <div class="hero__feature-title">${modules.length} Modules</div>
                <div class="hero__feature-description">Comprehensive learning path</div>
            </div>
            <div class="hero__feature">
                <div class="hero__feature-icon">⏱️</div>
                <div class="hero__feature-title">${courseData.estimatedDuration}</div>
                <div class="hero__feature-description">Self-paced learning</div>
            </div>
            <div class="hero__feature">
                <div class="hero__feature-icon">🎯</div>
                <div class="hero__feature-title">Beginner Friendly</div>
                <div class="hero__feature-description">No coding background needed</div>
            </div>
            <div class="hero__feature">
                <div class="hero__feature-icon">🚀</div>
                <div class="hero__feature-title">${Math.round(overallProgress * 100)}% Complete</div>
                <div class="hero__feature-description">Your current progress</div>
            </div>
        `;

        heroContainer.appendChild(heroFeatures);
    }

    /**
     * Enhance hero visual with interactive elements
     */
    enhanceHeroVisual(heroVisual) {
        if (!heroVisual) return;

        // Add interactive visual elements
        heroVisual.innerHTML = `
            <div class="hero__visual-content">
                <div class="hero__visual-icon">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="50" fill="var(--color-primary)" opacity="0.1"/>
                        <circle cx="60" cy="60" r="35" fill="var(--color-secondary)" opacity="0.2"/>
                        <circle cx="60" cy="60" r="20" fill="var(--color-accent)" opacity="0.3"/>
                        <text x="60" y="70" text-anchor="middle" fill="var(--color-primary)" font-size="24" font-weight="bold">CS</text>
                    </svg>
                </div>
                <div class="hero__visual-elements">
                    <div class="floating-element floating-element--1">💡</div>
                    <div class="floating-element floating-element--2">🔧</div>
                    <div class="floating-element floating-element--3">⚡</div>
                    <div class="floating-element floating-element--4">🎯</div>
                </div>
            </div>
        `;
    }

    /**
     * Set up hero animations triggered by scroll
     */
    setupHeroAnimations(heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('hero--animated');
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(heroSection);
    }

    /**
     * Enhance CTA button with additional functionality
     */
    enhanceCTAButton(ctaButton) {
        if (!ctaButton) return;

        // Add progress indicator to CTA if user has started
        const overallProgress = this.progressTracker.getOverallProgress();
        
        if (overallProgress > 0) {
            ctaButton.innerHTML = `
                <span>Continue Learning</span>
                <div class="btn__progress">
                    <div class="btn__progress-bar" style="width: ${overallProgress * 100}%"></div>
                </div>
            `;
            ctaButton.classList.add('btn--with-progress');
        }

        // Add click analytics (placeholder)
        ctaButton.addEventListener('click', () => {
            console.log('CTA clicked - Start Learning');
            // Could add analytics tracking here
        });
    }

    /**
     * Render course overview
     */
    async renderOverview() {
        const overviewContainer = document.querySelector('.overview__content');
        if (!overviewContainer) return;
        
        const courseData = this.config.getCourseData();
        const modules = this.config.getModules();
        const overallProgress = this.progressTracker.getOverallProgress();
        
        overviewContainer.innerHTML = `
            <div class="overview__objectives">
                <h3>What You'll Learn</h3>
                <ul class="objectives-list">
                    ${courseData.learningObjectives.map(objective => 
                        `<li class="objectives-item">${objective}</li>`
                    ).join('')}
                </ul>
            </div>
            <div class="overview__details">
                <div class="overview__stats">
                    <div class="stat-card">
                        <div class="stat-number">${modules.length}</div>
                        <div class="stat-label">Modules</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${courseData.estimatedDuration}</div>
                        <div class="stat-label">Duration</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Math.round(overallProgress * 100)}%</div>
                        <div class="stat-label">Complete</div>
                    </div>
                </div>
                <div class="overview__info">
                    <div class="info-item">
                        <strong>Difficulty Level:</strong> 
                        <span class="difficulty-badge difficulty-badge--${courseData.difficulty}">
                            ${courseData.difficulty.charAt(0).toUpperCase() + courseData.difficulty.slice(1)}
                        </span>
                    </div>
                    <div class="info-item">
                        <strong>Prerequisites:</strong> ${courseData.prerequisites}
                    </div>
                    <div class="info-item">
                        <strong>Last Updated:</strong> ${new Date(courseData.lastUpdated).toLocaleDateString()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render module cards
     */
    async renderModules() {
        const modulesGrid = document.getElementById('modules-grid');
        if (!modulesGrid) return;
        
        const modules = this.config.getModules();
        
        // Render module cards using enhanced ModuleRenderer
        modulesGrid.innerHTML = modules.map(module => 
            this.moduleRenderer.renderModuleCard(module)
        ).join('');
        
        // Set up module card event listeners
        this.moduleRenderer.setupModuleCardListeners();
        
        // Set up additional module interactions
        this.setupModuleInteractions();
    }

    /**
     * Set up additional module interactions
     */
    setupModuleInteractions() {
        // Listen for custom open-module events
        document.addEventListener('open-module', (event) => {
            const { moduleId } = event.detail;
            this.openModule(moduleId);
        });

        // Update module progress when sections are completed
        document.addEventListener('section-complete', () => {
            this.moduleRenderer.updateAllModuleProgress();
        });

        // Set up module filtering and sorting if controls exist
        this.setupModuleControls();
    }

    /**
     * Set up module filtering and sorting controls
     */
    setupModuleControls() {
        // Add module controls if they don't exist
        this.addModuleControls();

        // Filter buttons
        document.addEventListener('click', (event) => {
            const filterBtn = event.target.closest('.filter-btn');
            if (filterBtn) {
                const filterType = filterBtn.dataset.filter;
                const filterValue = filterBtn.dataset.value;
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(btn => 
                    btn.classList.remove('filter-btn--active')
                );
                filterBtn.classList.add('filter-btn--active');
                
                // Apply filter
                if (filterType === 'all') {
                    this.showAllModules();
                } else {
                    this.moduleRenderer.filterModules(filterType, filterValue);
                }
            }
        });

        // Sort dropdown
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (event) => {
                this.moduleRenderer.sortModules(event.target.value);
            });
        }
    }

    /**
     * Add module controls to the page
     */
    addModuleControls() {
        const modulesContainer = document.querySelector('.modules__container');
        const modulesTitle = document.querySelector('.modules__title');
        
        if (!modulesContainer || !modulesTitle) return;

        // Check if controls already exist
        if (document.querySelector('.modules__controls')) return;

        const controlsHTML = `
            <div class="modules__controls">
                <div class="modules__filters">
                    <button class="filter-btn filter-btn--active" data-filter="all">All Modules</button>
                    <button class="filter-btn" data-filter="difficulty" data-value="beginner">Beginner</button>
                    <button class="filter-btn" data-filter="difficulty" data-value="intermediate">Intermediate</button>
                    <button class="filter-btn" data-filter="completion" data-value="completed">Completed</button>
                    <button class="filter-btn" data-filter="progress" data-value="started">In Progress</button>
                </div>
                <div class="modules__sort">
                    <label for="module-sort">Sort by:</label>
                    <select id="module-sort" class="sort-select">
                        <option value="order">Default Order</option>
                        <option value="progress">Progress</option>
                        <option value="difficulty">Difficulty</option>
                        <option value="alphabetical">Alphabetical</option>
                    </select>
                </div>
            </div>
        `;

        modulesTitle.insertAdjacentHTML('afterend', controlsHTML);
    }

    /**
     * Show all modules (remove filters)
     */
    showAllModules() {
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.style.display = 'block';
        });
    }

    /**
     * Start learning - scroll to first module
     */
    startLearning() {
        const firstModule = document.querySelector('.module-card');
        if (firstModule) {
            firstModule.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Open a specific module
     */
    async openModule(moduleId) {
        try {
            this.showLoading();
            
            const moduleData = this.config.getModule(moduleId);
            if (!moduleData) {
                throw new Error(`Module not found: ${moduleId}`);
            }
            
            // Load and render module content using ContentLoader
            const content = await this.contentLoader.loadModuleContent(moduleId);
            this.showContentViewer(content);
            
            // Set up content event listeners
            this.setupContentEventListeners();
            
            this.hideLoading();
            
        } catch (error) {
            ErrorHandler.handleContentError(moduleId, error);
            this.hideLoading();
        }
    }

    /**
     * Show content viewer with module content
     */
    showContentViewer(content) {
        const contentViewer = document.getElementById('content-viewer');
        const contentContainer = document.getElementById('content-viewer-content');
        
        if (contentViewer && contentContainer) {
            contentContainer.innerHTML = content;
            contentViewer.setAttribute('aria-hidden', 'false');
            contentViewer.classList.add('content-viewer--active');
            
            // Focus management for accessibility
            const closeButton = contentViewer.querySelector('.content-viewer__close');
            if (closeButton) {
                closeButton.focus();
            }
        }
    }

    /**
     * Close content viewer
     */
    closeContent() {
        const contentViewer = document.getElementById('content-viewer');
        if (contentViewer) {
            contentViewer.setAttribute('aria-hidden', 'true');
            contentViewer.classList.remove('content-viewer--active');
        }
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.setAttribute('aria-hidden', 'false');
            loading.classList.add('loading--active');
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.setAttribute('aria-hidden', 'true');
            loading.classList.remove('loading--active');
        }
    }

    /**
     * Set up event listeners for dynamic content
     */
    setupContentEventListeners() {
        const contentViewer = document.getElementById('content-viewer');
        if (!contentViewer) return;

        // Section completion buttons
        contentViewer.addEventListener('click', (event) => {
            const sectionCompleteBtn = event.target.closest('.section-complete-btn');
            if (sectionCompleteBtn) {
                const sectionId = sectionCompleteBtn.dataset.sectionId;
                this.markSectionComplete(sectionId);
                return;
            }

            // Module completion buttons
            const moduleCompleteBtn = event.target.closest('.mark-complete-btn');
            if (moduleCompleteBtn) {
                const moduleId = moduleCompleteBtn.dataset.moduleId;
                this.markModuleComplete(moduleId);
                return;
            }

            // Copy buttons for code examples
            const copyBtn = event.target.closest('.copy-btn');
            if (copyBtn) {
                const textToCopy = copyBtn.dataset.copy;
                this.copyToClipboard(textToCopy);
                return;
            }

            // Retry buttons for error states
            const retryBtn = event.target.closest('.retry-btn');
            if (retryBtn) {
                const moduleId = retryBtn.dataset.moduleId;
                this.retryLoadModule(moduleId);
                return;
            }
        });

        // Initialize specialized viewers based on content
        this.initializeSpecializedViewers();

        console.log('Content event listeners set up');
    }

    /**
     * Initialize specialized content viewers
     */
    initializeSpecializedViewers() {
        // Check if abstraction layers are present
        const abstractionLayers = document.getElementById('abstraction-layers');
        if (abstractionLayers) {
            // Initialize AbstractionViewer for interactive layers
            const abstractionViewer = new AbstractionViewer();
            abstractionViewer.init();
            
            // Show tutorial for first-time users
            const hasSeenTutorial = localStorage.getItem('abstraction-tutorial-seen');
            if (!hasSeenTutorial) {
                setTimeout(() => {
                    abstractionViewer.showLayerTutorial();
                    localStorage.setItem('abstraction-tutorial-seen', 'true');
                }, 1000);
            }
            
            console.log('AbstractionViewer initialized');
        }

        // Check if JSON editors are present (data structures module)
        const jsonEditors = document.querySelectorAll('.json-editor-container');
        if (jsonEditors.length > 0) {
            // Initialize DataStructuresViewer for interactive JSON editing
            const dataStructuresViewer = new DataStructuresViewer();
            dataStructuresViewer.init();
            
            console.log('DataStructuresViewer initialized');
        }

        // Add other specialized viewers here as needed
        // e.g., APIViewer, etc.
    }

    /**
     * Mark a section as complete
     */
    markSectionComplete(sectionId) {
        // Find the module ID from the current content
        const moduleContent = document.querySelector('.module-content');
        const moduleId = moduleContent?.dataset?.moduleId || 'unknown';

        // Update progress tracker
        this.progressTracker.markSectionComplete(sectionId, moduleId);

        // Update UI
        const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (sectionElement) {
            sectionElement.classList.add('section--completed');
            
            const completeBtn = sectionElement.querySelector('.section-complete-btn');
            if (completeBtn) {
                completeBtn.textContent = 'Completed ✓';
                completeBtn.disabled = true;
                completeBtn.classList.add('btn--success');
            }
        }

        // Update navigation progress
        this.navigation.updateProgress();

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('section-complete', {
            detail: { sectionId, moduleId }
        }));

        console.log(`Section ${sectionId} marked as complete`);
    }

    /**
     * Mark a module as complete
     */
    markModuleComplete(moduleId) {
        // Set module progress to 100%
        this.progressTracker.setModuleProgress(moduleId, 1.0);

        // Update UI
        const moduleContent = document.querySelector('.module-content');
        if (moduleContent) {
            moduleContent.classList.add('module--completed');
            
            const completeBtn = moduleContent.querySelector('.mark-complete-btn');
            if (completeBtn) {
                completeBtn.textContent = 'Module Completed ✓';
                completeBtn.disabled = true;
                completeBtn.classList.remove('btn--primary');
                completeBtn.classList.add('btn--success');
            }
        }

        // Update navigation progress
        this.navigation.updateProgress();

        // Show completion message
        this.showCompletionMessage(moduleId);

        console.log(`Module ${moduleId} marked as complete`);
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Show temporary success message
            this.showTemporaryMessage('Copied to clipboard!', 'success');
            
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showTemporaryMessage('Copied to clipboard!', 'success');
            } catch (fallbackError) {
                this.showTemporaryMessage('Failed to copy text', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    }

    /**
     * Retry loading a module
     */
    async retryLoadModule(moduleId) {
        // Clear cache for this module
        this.contentLoader.clearCache(moduleId);
        
        // Reload the module
        await this.openModule(moduleId);
    }

    /**
     * Show completion message
     */
    showCompletionMessage(moduleId) {
        const moduleData = this.config.getModule(moduleId);
        const message = `
            <div class="completion-message">
                <div class="completion-icon">🎉</div>
                <h3>Module Completed!</h3>
                <p>Great job completing "${moduleData?.title || moduleId}"!</p>
                <div class="completion-stats">
                    <div class="stat">
                        <strong>${Math.round(this.progressTracker.getOverallProgress() * 100)}%</strong>
                        <span>Course Progress</span>
                    </div>
                </div>
            </div>
        `;
        
        this.showTemporaryMessage(message, 'success', 5000);
    }

    /**
     * Show temporary message
     */
    showTemporaryMessage(message, type = 'info', duration = 3000) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.temp-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `temp-message temp-message--${type}`;
        messageElement.innerHTML = message;

        // Add to page
        document.body.appendChild(messageElement);

        // Position and show
        messageElement.style.cssText = `
            position: fixed;
            top: var(--space-4);
            right: var(--space-4);
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--space-4);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-tooltip);
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Apply type-specific styling
        if (type === 'success') {
            messageElement.style.borderColor = 'var(--color-accent)';
            messageElement.style.backgroundColor = '#f0fdf4';
        } else if (type === 'error') {
            messageElement.style.borderColor = 'var(--color-error)';
            messageElement.style.backgroundColor = '#fef2f2';
        }

        // Auto-remove after duration
        setTimeout(() => {
            messageElement.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageElement.remove(), 300);
        }, duration);
    }

    /**
     * Handle arrow key navigation
     */
    handleArrowNavigation(key) {
        // Implementation for keyboard navigation between modules
        // Will be expanded in later tasks
        console.log('Arrow navigation:', key);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

// Export for potential external use
export default App;