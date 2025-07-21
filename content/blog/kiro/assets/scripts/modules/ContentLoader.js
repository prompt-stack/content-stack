/**
 * ContentLoader - Handles dynamic content loading and rendering
 */
export class ContentLoader {
    constructor(config) {
        this.config = config;
        this.contentCache = new Map();
        this.templateCache = new Map();
        this.loadingStates = new Map();
        
        // Content validation schema
        this.validationSchema = {
            requiredFields: ['id', 'title', 'type'],
            validTypes: ['concept', 'interactive', 'practical'],
            maxTitleLength: 100,
            maxDescriptionLength: 500
        };
    }

    /**
     * Load module content with caching and error handling
     */
    async loadModuleContent(moduleId) {
        try {
            // Check if already loading
            if (this.loadingStates.get(moduleId)) {
                console.log(`Module ${moduleId} is already loading`);
                return this.waitForLoad(moduleId);
            }

            // Check cache first
            if (this.contentCache.has(moduleId)) {
                console.log(`Loading module ${moduleId} from cache`);
                return this.contentCache.get(moduleId);
            }

            // Set loading state
            this.loadingStates.set(moduleId, true);

            // Get module data from config
            const moduleData = this.config.getModule(moduleId);
            if (!moduleData) {
                throw new Error(`Module not found: ${moduleId}`);
            }

            // Validate module data
            this.validateModuleData(moduleData);

            // Generate content HTML
            const contentHtml = await this.generateModuleHTML(moduleData);

            // Cache the content
            this.contentCache.set(moduleId, contentHtml);

            // Clear loading state
            this.loadingStates.delete(moduleId);

            console.log(`Module ${moduleId} loaded successfully`);
            return contentHtml;

        } catch (error) {
            console.error(`Error loading module ${moduleId}:`, error);
            this.loadingStates.delete(moduleId);
            return this.generateErrorContent(moduleId, error);
        }
    }

    /**
     * Generate HTML content for a module
     */
    async generateModuleHTML(moduleData) {
        const template = await this.getTemplate('module');
        
        const templateData = {
            ...moduleData,
            sectionsHtml: await this.generateSectionsHTML(moduleData.sections || []),
            estimatedTime: moduleData.estimatedTime || 'Unknown',
            difficulty: moduleData.difficulty || 'beginner',
            completionStatus: this.getCompletionStatus(moduleData.id)
        };

        return this.renderTemplate(template, templateData);
    }

    /**
     * Generate HTML for module sections
     */
    async generateSectionsHTML(sections) {
        const sectionPromises = sections.map(section => this.generateSectionHTML(section));
        const sectionHtmlArray = await Promise.all(sectionPromises);
        return sectionHtmlArray.join('');
    }

    /**
     * Generate HTML for a single section
     */
    async generateSectionHTML(section) {
        const template = await this.getTemplate(`section-${section.type}`);
        
        const templateData = {
            ...section,
            contentHtml: this.generateSectionContent(section),
            isCompleted: this.isSectionCompleted(section.id),
            estimatedTime: section.estimatedTime || '5 minutes'
        };

        return this.renderTemplate(template, templateData);
    }

    /**
     * Generate content based on section type
     */
    generateSectionContent(section) {
        switch (section.type) {
            case 'concept':
                return this.generateConceptContent(section.content);
            case 'interactive':
                return this.generateInteractiveContent(section.content);
            case 'practical':
                return this.generatePracticalContent(section.content);
            default:
                return this.generateDefaultContent(section.content);
        }
    }

    /**
     * Generate concept section content
     */
    generateConceptContent(content) {
        let html = '';
        
        if (content.introduction) {
            html += `<div class="content-introduction">${content.introduction}</div>`;
        }

        if (content.keyPoints && content.keyPoints.length > 0) {
            html += `
                <div class="content-key-points">
                    <h4>Key Points</h4>
                    <ul class="key-points-list">
                        ${content.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (content.examples && content.examples.length > 0) {
            html += `
                <div class="content-examples">
                    <h4>Examples</h4>
                    ${content.examples.map(example => `
                        <div class="example-card">
                            <h5>${example.title}</h5>
                            <p>${example.description}</p>
                            ${example.visual ? `<div class="example-visual" data-visual="${example.visual}"></div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return html;
    }

    /**
     * Generate interactive section content
     */
    generateInteractiveContent(content) {
        let html = '';
        
        if (content.introduction) {
            html += `<div class="content-introduction">${content.introduction}</div>`;
        }

        if (content.interactive) {
            html += this.generateInteractiveElement(content.interactive);
        }

        if (content.layers) {
            html += this.generateLayersVisualization(content.layers);
        }

        return html;
    }

    /**
     * Generate interactive element based on type
     */
    generateInteractiveElement(interactive) {
        switch (interactive.type) {
            case 'json-editor':
                return this.generateJsonEditor(interactive);
            case 'diagram':
                return this.generateDiagram(interactive);
            default:
                return `
                    <div class="interactive-container">
                        <div class="interactive-element" 
                             data-type="${interactive.type}"
                             data-initial-value="${this.escapeHtml(interactive.initialValue || '')}"
                             data-instructions="${this.escapeHtml(interactive.instructions || '')}">
                            <div class="interactive-placeholder">
                                <p>Interactive element will load here</p>
                                <p class="text-small">${interactive.instructions}</p>
                            </div>
                        </div>
                    </div>
                `;
        }
    }

    /**
     * Generate JSON editor for data structures
     */
    generateJsonEditor(interactive) {
        const editorId = `editor-${Date.now()}`;
        const initialValue = interactive.initialValue || '{\n  "example": "data"\n}';
        
        return `
            <div class="json-editor-container" 
                 data-editor-id="${editorId}" 
                 data-initial-value="${this.escapeHtml(initialValue)}">
                <div class="json-editor-intro">
                    <h4>🔧 Interactive JSON Editor</h4>
                    <p>${interactive.instructions || 'Try editing the JSON below to see how data structures work!'}</p>
                </div>
                <!-- JSON editor will be initialized by DataStructuresViewer -->
            </div>
        `;
    }

    /**
     * Generate diagram placeholder
     */
    generateDiagram(interactive) {
        return `
            <div class="diagram-container">
                <div class="diagram-placeholder">
                    <h4>${interactive.title || 'Interactive Diagram'}</h4>
                    <p>${interactive.instructions || 'Diagram will be rendered here'}</p>
                </div>
            </div>
        `;
    }

    /**
     * Generate interactive layers visualization for abstraction module
     */
    generateLayersVisualization(layers) {
        return `
            <div class="layers-visualization">
                <h4>System Layers</h4>
                <div class="layers-container" id="abstraction-layers">
                    ${layers.map((layer, index) => `
                        <div class="layer-card interactive-layer" 
                             style="--layer-color: ${layer.color}; --layer-index: ${index}"
                             data-layer-id="${layer.name.toLowerCase().replace(/\s+/g, '-')}"
                             tabindex="0"
                             role="button"
                             aria-describedby="layer-description-${index}">
                            <div class="layer-header">
                                <h5>${layer.name}</h5>
                                <div class="layer-indicator">
                                    <span class="layer-number">${index + 1}</span>
                                </div>
                            </div>
                            <div class="layer-content">
                                <p id="layer-description-${index}">${layer.description}</p>
                                <div class="layer-examples">
                                    ${layer.examples.map(example => `
                                        <span class="layer-example" title="Example: ${example}">${example}</span>
                                    `).join('')}
                                </div>
                                <div class="layer-interaction">
                                    <button class="btn btn--sm btn--outline explore-layer-btn" 
                                            data-layer="${layer.name.toLowerCase().replace(/\s+/g, '-')}">
                                        Explore Layer
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="layers-explanation">
                    <div class="abstraction-analogy">
                        <h5>🏗️ Think of it like building a house:</h5>
                        <div class="analogy-comparison">
                            <div class="analogy-item">
                                <strong>Foundation</strong> → System Architecture
                            </div>
                            <div class="analogy-item">
                                <strong>Plumbing & Wiring</strong> → Logic Layer
                            </div>
                            <div class="analogy-item">
                                <strong>Rooms & Layout</strong> → Components
                            </div>
                            <div class="analogy-item">
                                <strong>Paint & Furniture</strong> → User Interface
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate practical section content
     */
    generatePracticalContent(content) {
        let html = '';
        
        if (content.introduction) {
            html += `<div class="content-introduction">${content.introduction}</div>`;
        }

        if (content.examples && content.examples.length > 0) {
            html += `
                <div class="practical-examples">
                    <h4>Practical Examples</h4>
                    ${content.examples.map(example => `
                        <div class="practical-example">
                            <div class="example-scenario">
                                <h5>Scenario: ${example.scenario}</h5>
                            </div>
                            <div class="example-prompt">
                                <h6>Example Prompt:</h6>
                                <pre><code>${this.escapeHtml(example.prompt)}</code></pre>
                                <button class="btn btn--sm copy-btn" data-copy="${this.escapeHtml(example.prompt)}">
                                    Copy Prompt
                                </button>
                            </div>
                            <div class="example-explanation">
                                <h6>Why This Works:</h6>
                                <p>${example.explanation}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return html;
    }

    /**
     * Generate default content for unknown types
     */
    generateDefaultContent(content) {
        if (typeof content === 'string') {
            return `<div class="content-text">${content}</div>`;
        }
        
        if (content && content.introduction) {
            return `<div class="content-introduction">${content.introduction}</div>`;
        }
        
        return '<div class="content-placeholder">Content will be available soon.</div>';
    }

    /**
     * Get template with caching
     */
    async getTemplate(templateName) {
        if (this.templateCache.has(templateName)) {
            return this.templateCache.get(templateName);
        }

        const template = this.getBuiltInTemplate(templateName);
        this.templateCache.set(templateName, template);
        return template;
    }

    /**
     * Get built-in templates
     */
    getBuiltInTemplate(templateName) {
        const templates = {
            'module': `
                <div class="module-content">
                    <div class="module-header">
                        <h2 class="module-title">{{title}}</h2>
                        <div class="module-meta">
                            <span class="module-time">⏱️ {{estimatedTime}}</span>
                            <span class="module-difficulty difficulty-{{difficulty}}">{{difficulty}}</span>
                        </div>
                        <p class="module-description">{{description}}</p>
                    </div>
                    <div class="module-sections">
                        {{sectionsHtml}}
                    </div>
                    <div class="module-footer">
                        <button class="btn btn--primary mark-complete-btn" data-module-id="{{id}}">
                            Mark Module Complete
                        </button>
                    </div>
                </div>
            `,
            'section-concept': `
                <div class="section section--concept" data-section-id="{{id}}">
                    <div class="section-header">
                        <h3 class="section-title">{{title}}</h3>
                        <span class="section-time">{{estimatedTime}}</span>
                    </div>
                    <div class="section-content">
                        {{contentHtml}}
                    </div>
                    <div class="section-footer">
                        <button class="btn btn--outline section-complete-btn" data-section-id="{{id}}">
                            Mark Section Complete
                        </button>
                    </div>
                </div>
            `,
            'section-interactive': `
                <div class="section section--interactive" data-section-id="{{id}}">
                    <div class="section-header">
                        <h3 class="section-title">{{title}}</h3>
                        <span class="section-time">{{estimatedTime}}</span>
                    </div>
                    <div class="section-content">
                        {{contentHtml}}
                    </div>
                    <div class="section-footer">
                        <button class="btn btn--outline section-complete-btn" data-section-id="{{id}}">
                            Mark Section Complete
                        </button>
                    </div>
                </div>
            `,
            'section-practical': `
                <div class="section section--practical" data-section-id="{{id}}">
                    <div class="section-header">
                        <h3 class="section-title">{{title}}</h3>
                        <span class="section-time">{{estimatedTime}}</span>
                    </div>
                    <div class="section-content">
                        {{contentHtml}}
                    </div>
                    <div class="section-footer">
                        <button class="btn btn--outline section-complete-btn" data-section-id="{{id}}">
                            Mark Section Complete
                        </button>
                    </div>
                </div>
            `
        };

        return templates[templateName] || templates['module'];
    }

    /**
     * Render template with data
     */
    renderTemplate(template, data) {
        let rendered = template;
        
        // Simple template replacement
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            const value = data[key] !== undefined ? data[key] : '';
            rendered = rendered.replace(regex, value);
        });

        // Clean up any remaining template variables
        rendered = rendered.replace(/{{[^}]+}}/g, '');

        return rendered;
    }

    /**
     * Validate module data
     */
    validateModuleData(moduleData) {
        const errors = [];

        // Check required fields
        this.validationSchema.requiredFields.forEach(field => {
            if (!moduleData[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });

        // Validate title length
        if (moduleData.title && moduleData.title.length > this.validationSchema.maxTitleLength) {
            errors.push(`Title too long: ${moduleData.title.length} characters`);
        }

        // Validate description length
        if (moduleData.description && moduleData.description.length > this.validationSchema.maxDescriptionLength) {
            errors.push(`Description too long: ${moduleData.description.length} characters`);
        }

        // Validate sections
        if (moduleData.sections) {
            moduleData.sections.forEach((section, index) => {
                if (!section.id || !section.title || !section.type) {
                    errors.push(`Section ${index} missing required fields`);
                }
                
                if (!this.validationSchema.validTypes.includes(section.type)) {
                    errors.push(`Section ${index} has invalid type: ${section.type}`);
                }
            });
        }

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }

        return true;
    }

    /**
     * Generate error content
     */
    generateErrorContent(moduleId, error) {
        return `
            <div class="content-error">
                <div class="error-icon">⚠️</div>
                <h3>Unable to Load Content</h3>
                <p>We're having trouble loading the content for this module.</p>
                <div class="error-details">
                    <strong>Module:</strong> ${moduleId}<br>
                    <strong>Error:</strong> ${error.message}
                </div>
                <div class="error-actions">
                    <button class="btn btn--outline retry-btn" data-module-id="${moduleId}">
                        Try Again
                    </button>
                    <button class="btn btn--ghost" onclick="window.location.reload()">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Wait for content to load (for concurrent requests)
     */
    async waitForLoad(moduleId) {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (!this.loadingStates.get(moduleId)) {
                    clearInterval(checkInterval);
                    resolve(this.contentCache.get(moduleId) || this.generateErrorContent(moduleId, new Error('Load timeout')));
                }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve(this.generateErrorContent(moduleId, new Error('Load timeout')));
            }, 10000);
        });
    }

    /**
     * Clear content cache
     */
    clearCache(moduleId = null) {
        if (moduleId) {
            this.contentCache.delete(moduleId);
            console.log(`Cache cleared for module: ${moduleId}`);
        } else {
            this.contentCache.clear();
            console.log('All content cache cleared');
        }
    }

    /**
     * Get completion status for a module
     */
    getCompletionStatus(moduleId) {
        // This would integrate with ProgressTracker
        return 'not-started'; // placeholder
    }

    /**
     * Check if section is completed
     */
    isSectionCompleted(sectionId) {
        // This would integrate with ProgressTracker
        return false; // placeholder
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Preload content for better performance
     */
    async preloadModules(moduleIds) {
        const preloadPromises = moduleIds.map(id => this.loadModuleContent(id));
        await Promise.allSettled(preloadPromises);
        console.log('Modules preloaded:', moduleIds);
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            contentCacheSize: this.contentCache.size,
            templateCacheSize: this.templateCache.size,
            loadingModules: Array.from(this.loadingStates.keys())
        };
    }
}