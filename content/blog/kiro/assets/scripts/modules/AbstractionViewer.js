/**
 * AbstractionViewer - Handles interactive abstraction layer visualization
 */
export class AbstractionViewer {
    constructor() {
        this.currentLayer = null;
        this.layerModal = null;
        this.layerDetails = {
            'ui-user-interface': {
                title: 'UI (User Interface)',
                subtitle: 'What people see and interact with',
                description: 'The user interface is the top layer that users directly interact with. It includes all visual elements, buttons, forms, and layouts that make up the user experience.',
                realWorldAnalogy: 'Like the dashboard and controls in your car - you see the speedometer, steering wheel, and buttons, but you don\'t see the engine.',
                examples: [
                    { title: 'Website Buttons', description: 'Click buttons to perform actions' },
                    { title: 'Form Fields', description: 'Input boxes for user data' },
                    { title: 'Navigation Menus', description: 'Links to different pages' },
                    { title: 'Visual Feedback', description: 'Loading spinners, success messages' }
                ],
                aiPromptExample: 'Create a user-friendly form (UI) that collects user information and provides clear feedback when submitted.'
            },
            'components': {
                title: 'Components',
                subtitle: 'Reusable building blocks',
                description: 'Components are reusable pieces of functionality that can be combined to build larger systems. They encapsulate specific behaviors and can be used multiple times.',
                realWorldAnalogy: 'Like LEGO blocks - each piece has a specific function, but you can combine them in different ways to build complex structures.',
                examples: [
                    { title: 'Dropdown Menu', description: 'Reusable selection component' },
                    { title: 'Chat Widget', description: 'Self-contained messaging component' },
                    { title: 'File Upload', description: 'Drag-and-drop file handling' },
                    { title: 'Progress Bar', description: 'Visual progress indicator' }
                ],
                aiPromptExample: 'Build a reusable notification component that can display success, error, or warning messages throughout the application.'
            },
            'logic': {
                title: 'Logic',
                subtitle: 'What happens when you interact',
                description: 'The logic layer contains the rules and processes that determine what happens when users interact with the interface. It handles data processing, validation, and business rules.',
                realWorldAnalogy: 'Like the brain of the operation - it receives input, processes it according to rules, and decides what should happen next.',
                examples: [
                    { title: 'Form Validation', description: 'Check if email format is correct' },
                    { title: 'Data Processing', description: 'Calculate totals, filter results' },
                    { title: 'API Calls', description: 'Request data from external services' },
                    { title: 'State Management', description: 'Track what the user has done' }
                ],
                aiPromptExample: 'Create logic that validates user input, processes the data, and determines the appropriate response based on business rules.'
            },
            'system-architecture': {
                title: 'System Architecture',
                subtitle: 'The big-picture plumbing',
                description: 'System architecture is the foundational layer that defines how different parts of the system communicate, where data is stored, and how everything connects together.',
                realWorldAnalogy: 'Like the foundation, plumbing, and electrical systems of a house - you don\'t see them, but everything else depends on them working properly.',
                examples: [
                    { title: 'Database Storage', description: 'Where information is permanently saved' },
                    { title: 'API Connections', description: 'How different services communicate' },
                    { title: 'Security Systems', description: 'Authentication and authorization' },
                    { title: 'Server Infrastructure', description: 'Where the application runs' }
                ],
                aiPromptExample: 'Design a system architecture that handles user authentication, data storage, and integrates with third-party services securely.'
            }
        };
        
        this.setupEventListeners();
    }

    /**
     * Initialize the abstraction viewer
     */
    init() {
        this.createLayerModal();
        this.setupLayerInteractions();
        console.log('AbstractionViewer initialized');
    }

    /**
     * Set up event listeners for layer interactions
     */
    setupEventListeners() {
        document.addEventListener('click', (event) => {
            // Handle explore layer button clicks
            const exploreBtn = event.target.closest('.explore-layer-btn');
            if (exploreBtn) {
                event.preventDefault();
                const layerId = exploreBtn.dataset.layer;
                this.showLayerDetail(layerId);
                return;
            }

            // Handle layer card clicks
            const layerCard = event.target.closest('.interactive-layer');
            if (layerCard) {
                const layerId = layerCard.dataset.layerId;
                this.highlightLayer(layerId);
                return;
            }

            // Handle modal close
            const closeBtn = event.target.closest('.layer-detail-close');
            if (closeBtn) {
                this.closeLayerDetail();
                return;
            }

            // Close modal on backdrop click
            if (event.target.classList.contains('layer-detail-modal')) {
                this.closeLayerDetail();
                return;
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.layerModal?.classList.contains('layer-detail-modal--active')) {
                this.closeLayerDetail();
            }
        });
    }

    /**
     * Set up layer interactions after content is loaded
     */
    setupLayerInteractions() {
        const layersContainer = document.getElementById('abstraction-layers');
        if (!layersContainer) return;

        // Add hover effects and accessibility
        const layerCards = layersContainer.querySelectorAll('.interactive-layer');
        layerCards.forEach((card, index) => {
            // Add keyboard navigation
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const layerId = card.dataset.layerId;
                    this.showLayerDetail(layerId);
                }
            });

            // Add focus management
            card.addEventListener('focus', () => {
                this.highlightLayer(card.dataset.layerId);
            });

            card.addEventListener('blur', () => {
                this.clearHighlight();
            });
        });

        // Add layer connection animations
        this.animateLayerConnections();
    }

    /**
     * Highlight a specific layer
     */
    highlightLayer(layerId) {
        const layersContainer = document.getElementById('abstraction-layers');
        if (!layersContainer) return;

        // Clear previous highlights
        this.clearHighlight();

        // Highlight selected layer
        const targetLayer = layersContainer.querySelector(`[data-layer-id="${layerId}"]`);
        if (targetLayer) {
            targetLayer.classList.add('layer-highlighted');
            this.currentLayer = layerId;

            // Dim other layers
            const allLayers = layersContainer.querySelectorAll('.interactive-layer');
            allLayers.forEach(layer => {
                if (layer !== targetLayer) {
                    layer.classList.add('layer-dimmed');
                }
            });
        }
    }

    /**
     * Clear layer highlights
     */
    clearHighlight() {
        const layersContainer = document.getElementById('abstraction-layers');
        if (!layersContainer) return;

        const allLayers = layersContainer.querySelectorAll('.interactive-layer');
        allLayers.forEach(layer => {
            layer.classList.remove('layer-highlighted', 'layer-dimmed');
        });

        this.currentLayer = null;
    }

    /**
     * Show detailed layer information in modal
     */
    showLayerDetail(layerId) {
        const layerData = this.layerDetails[layerId];
        if (!layerData) {
            console.warn('Layer data not found:', layerId);
            return;
        }

        if (!this.layerModal) {
            this.createLayerModal();
        }

        // Populate modal content
        const modalContent = this.layerModal.querySelector('.layer-detail-content');
        modalContent.innerHTML = `
            <button class="layer-detail-close" aria-label="Close layer details">&times;</button>
            <div class="layer-detail-header">
                <h3 class="layer-detail-title">${layerData.title}</h3>
                <p class="layer-detail-subtitle">${layerData.subtitle}</p>
            </div>
            <div class="layer-detail-body">
                <div class="layer-description">
                    <p>${layerData.description}</p>
                </div>
                <div class="layer-analogy">
                    <h6>🔍 Real-World Analogy</h6>
                    <p>${layerData.realWorldAnalogy}</p>
                </div>
                <div class="layer-detail-examples">
                    <h6>Examples in Practice</h6>
                    <div class="detail-example-grid">
                        ${layerData.examples.map(example => `
                            <div class="detail-example-item">
                                <strong>${example.title}</strong>
                                <p>${example.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="layer-ai-prompt">
                    <h6>💡 AI Prompt Example</h6>
                    <div class="ai-prompt-example">
                        <pre><code>${layerData.aiPromptExample}</code></pre>
                        <button class="btn btn--sm copy-btn" data-copy="${layerData.aiPromptExample}">
                            Copy Prompt
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Show modal
        this.layerModal.classList.add('layer-detail-modal--active');
        
        // Focus management
        const closeButton = this.layerModal.querySelector('.layer-detail-close');
        if (closeButton) {
            closeButton.focus();
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close layer detail modal
     */
    closeLayerDetail() {
        if (!this.layerModal) return;

        this.layerModal.classList.remove('layer-detail-modal--active');
        document.body.style.overflow = '';

        // Return focus to the layer that was opened
        if (this.currentLayer) {
            const layerCard = document.querySelector(`[data-layer-id="${this.currentLayer}"]`);
            if (layerCard) {
                layerCard.focus();
            }
        }
    }

    /**
     * Create layer detail modal
     */
    createLayerModal() {
        if (this.layerModal) return;

        this.layerModal = document.createElement('div');
        this.layerModal.className = 'layer-detail-modal';
        this.layerModal.innerHTML = `
            <div class="layer-detail-content">
                <!-- Content will be populated dynamically -->
            </div>
        `;

        document.body.appendChild(this.layerModal);
    }

    /**
     * Animate layer connections
     */
    animateLayerConnections() {
        const layersContainer = document.getElementById('abstraction-layers');
        if (!layersContainer) return;

        // Add connection lines between layers
        const connectionLines = document.createElement('div');
        connectionLines.className = 'layer-connections';
        connectionLines.innerHTML = `
            <svg class="connection-svg" viewBox="0 0 100 400" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:var(--color-primary);stop-opacity:0.6" />
                        <stop offset="50%" style="stop-color:var(--color-secondary);stop-opacity:0.4" />
                        <stop offset="100%" style="stop-color:var(--color-accent);stop-opacity:0.6" />
                    </linearGradient>
                </defs>
                <path d="M50 0 Q30 100 50 200 Q70 300 50 400" 
                      stroke="url(#connectionGradient)" 
                      stroke-width="2" 
                      fill="none" 
                      opacity="0.3"/>
                <path d="M50 0 Q70 100 50 200 Q30 300 50 400" 
                      stroke="url(#connectionGradient)" 
                      stroke-width="1" 
                      fill="none" 
                      opacity="0.2"/>
            </svg>
        `;

        layersContainer.style.position = 'relative';
        layersContainer.appendChild(connectionLines);
    }

    /**
     * Add interactive layer tutorial
     */
    showLayerTutorial() {
        const tutorial = document.createElement('div');
        tutorial.className = 'layer-tutorial';
        tutorial.innerHTML = `
            <div class="tutorial-content">
                <h4>🎯 Interactive Layer Guide</h4>
                <div class="tutorial-steps">
                    <div class="tutorial-step">
                        <span class="step-number">1</span>
                        <p><strong>Click</strong> on any layer to highlight it</p>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">2</span>
                        <p><strong>Press "Explore Layer"</strong> for detailed information</p>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">3</span>
                        <p><strong>Use keyboard</strong> navigation with Tab and Enter</p>
                    </div>
                </div>
                <button class="btn btn--sm btn--outline close-tutorial-btn">Got it!</button>
            </div>
        `;

        // Add tutorial to layers container
        const layersContainer = document.getElementById('abstraction-layers');
        if (layersContainer) {
            layersContainer.parentNode.insertBefore(tutorial, layersContainer);
        }

        // Auto-hide tutorial after 10 seconds or on click
        const closeBtn = tutorial.querySelector('.close-tutorial-btn');
        const hideTutorial = () => {
            tutorial.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => tutorial.remove(), 300);
        };

        closeBtn.addEventListener('click', hideTutorial);
        setTimeout(hideTutorial, 10000);
    }

    /**
     * Get interaction statistics
     */
    getStats() {
        return {
            currentLayer: this.currentLayer,
            modalOpen: this.layerModal?.classList.contains('layer-detail-modal--active') || false,
            availableLayers: Object.keys(this.layerDetails).length
        };
    }

    /**
     * Destroy the abstraction viewer
     */
    destroy() {
        if (this.layerModal) {
            this.layerModal.remove();
            this.layerModal = null;
        }

        // Restore body scroll
        document.body.style.overflow = '';

        // Clear highlights
        this.clearHighlight();
    }
}