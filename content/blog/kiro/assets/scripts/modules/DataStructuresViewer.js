/**
 * @file content/blog/kiro/assets/scripts/modules/DataStructuresViewer.js
 * @purpose Blog content script: DataStructuresViewer
 * @layer content
 * @deps none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role pure-view
 */

/**
 * DataStructuresViewer - Handles interactive data structures visualization
 */
export class DataStructuresViewer {
    constructor() {
        this.activeEditor = null;
        this.jsonEditors = new Map();
        this.visualizations = new Map();
        
        // Data structure examples
        this.examples = {
            'list': {
                title: 'List/Array',
                description: 'An ordered collection of items',
                analogy: 'Like a grocery list - items in order',
                basicExample: '["apple", "banana", "cherry"]',
                complexExample: '[\n  "Task 1: Write email",\n  "Task 2: Call client", \n  "Task 3: Update website"\n]',
                realWorldUses: [
                    'Shopping lists',
                    'Todo items',
                    'User names',
                    'Menu options'
                ],
                aiPromptExample: 'Create a list of the top 5 marketing strategies for small businesses.'
            },
            'object': {
                title: 'Object/Dictionary',
                description: 'Key-value pairs with named properties',
                analogy: 'Like a labeled drawer with compartments',
                basicExample: '{\n  "name": "Alice",\n  "age": 28,\n  "role": "Designer"\n}',
                complexExample: '{\n  "user": {\n    "name": "Alice Johnson",\n    "email": "alice@example.com",\n    "preferences": {\n      "theme": "dark",\n      "notifications": true\n    }\n  }\n}',
                realWorldUses: [
                    'User profiles',
                    'Configuration settings',
                    'Product information',
                    'API responses'
                ],
                aiPromptExample: 'Generate a user profile object with name, email, preferences, and account settings.'
            },
            'nested': {
                title: 'Nested Structures',
                description: 'Objects and arrays combined together',
                analogy: 'Like folders containing files and other folders',
                basicExample: '{\n  "course": "CS Fundamentals",\n  "modules": ["Abstraction", "Data Structures"]\n}',
                complexExample: '{\n  "course": {\n    "title": "CS for Non-Technical",\n    "modules": [\n      {\n        "name": "Abstraction",\n        "completed": true,\n        "sections": ["Introduction", "Layers"]\n      },\n      {\n        "name": "Data Structures",\n        "completed": false,\n        "sections": ["Lists", "Objects", "JSON"]\n      }\n    ]\n  }\n}',
                realWorldUses: [
                    'Course structures',
                    'Organization charts',
                    'Product catalogs',
                    'API responses'
                ],
                aiPromptExample: 'Create a nested structure representing a company with departments, employees, and their projects.'
            }
        };
        
        this.setupEventListeners();
    }

    /**
     * Initialize the data structures viewer
     */
    init() {
        this.createInteractiveEditors();
        this.createVisualizations();
        this.setupJsonValidation();
        console.log('DataStructuresViewer initialized');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        document.addEventListener('click', (event) => {
            // Handle example buttons
            const exampleBtn = event.target.closest('.load-example-btn');
            if (exampleBtn) {
                event.preventDefault();
                const exampleType = exampleBtn.dataset.example;
                const complexity = exampleBtn.dataset.complexity || 'basic';
                this.loadExample(exampleType, complexity);
                return;
            }

            // Handle copy buttons
            const copyBtn = event.target.closest('.copy-json-btn');
            if (copyBtn) {
                event.preventDefault();
                const editorId = copyBtn.dataset.editor;
                this.copyJsonContent(editorId);
                return;
            }

            // Handle format buttons
            const formatBtn = event.target.closest('.format-json-btn');
            if (formatBtn) {
                event.preventDefault();
                const editorId = formatBtn.dataset.editor;
                this.formatJson(editorId);
                return;
            }

            // Handle clear buttons
            const clearBtn = event.target.closest('.clear-json-btn');
            if (clearBtn) {
                event.preventDefault();
                const editorId = clearBtn.dataset.editor;
                this.clearEditor(editorId);
                return;
            }

            // Handle visualization toggle
            const vizBtn = event.target.closest('.toggle-visualization-btn');
            if (vizBtn) {
                event.preventDefault();
                const editorId = vizBtn.dataset.editor;
                this.toggleVisualization(editorId);
                return;
            }
        });

        // Handle input changes in JSON editors
        document.addEventListener('input', (event) => {
            const jsonEditor = event.target.closest('.json-editor-textarea');
            if (jsonEditor) {
                const editorId = jsonEditor.dataset.editorId;
                this.validateAndUpdateVisualization(editorId);
            }
        });
    }

    /**
     * Create interactive JSON editors
     */
    createInteractiveEditors() {
        const editorContainers = document.querySelectorAll('.json-editor-container');
        
        editorContainers.forEach((container, index) => {
            const editorId = container.dataset.editorId || `editor-${index}`;
            const initialValue = container.dataset.initialValue || '{}';
            
            this.createEditor(container, editorId, initialValue);
        });
    }

    /**
     * Create a single JSON editor
     */
    createEditor(container, editorId, initialValue) {
        const editorHTML = `
            <div class="json-editor" data-editor-id="${editorId}">
                <div class="json-editor-header">
                    <h5 class="json-editor-title">Interactive JSON Editor</h5>
                    <div class="json-editor-controls">
                        <button class="btn btn--xs btn--outline load-example-btn" 
                                data-example="list" data-complexity="basic">
                            List Example
                        </button>
                        <button class="btn btn--xs btn--outline load-example-btn" 
                                data-example="object" data-complexity="basic">
                            Object Example
                        </button>
                        <button class="btn btn--xs btn--outline load-example-btn" 
                                data-example="nested" data-complexity="basic">
                            Nested Example
                        </button>
                    </div>
                </div>
                <div class="json-editor-body">
                    <div class="json-editor-input">
                        <textarea class="json-editor-textarea" 
                                  data-editor-id="${editorId}"
                                  placeholder="Enter your JSON here..."
                                  rows="8">${this.formatJsonString(initialValue)}</textarea>
                        <div class="json-editor-actions">
                            <button class="btn btn--sm btn--outline format-json-btn" 
                                    data-editor="${editorId}">
                                Format JSON
                            </button>
                            <button class="btn btn--sm btn--outline copy-json-btn" 
                                    data-editor="${editorId}">
                                Copy JSON
                            </button>
                            <button class="btn btn--sm btn--ghost clear-json-btn" 
                                    data-editor="${editorId}">
                                Clear
                            </button>
                        </div>
                    </div>
                    <div class="json-editor-output">
                        <div class="json-validation" data-editor-id="${editorId}">
                            <div class="validation-status validation-status--valid">
                                ✓ Valid JSON
                            </div>
                        </div>
                        <div class="json-visualization" data-editor-id="${editorId}">
                            <div class="visualization-header">
                                <h6>Visual Representation</h6>
                                <button class="btn btn--xs btn--outline toggle-visualization-btn" 
                                        data-editor="${editorId}">
                                    Toggle View
                                </button>
                            </div>
                            <div class="visualization-content">
                                <!-- Visualization will be generated here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = editorHTML;
        
        // Store editor reference
        const textarea = container.querySelector('.json-editor-textarea');
        this.jsonEditors.set(editorId, {
            container: container,
            textarea: textarea,
            isValid: true
        });

        // Initial validation and visualization
        this.validateAndUpdateVisualization(editorId);
    }

    /**
     * Load an example into the editor
     */
    loadExample(exampleType, complexity = 'basic') {
        const example = this.examples[exampleType];
        if (!example) return;

        const exampleJson = complexity === 'complex' ? example.complexExample : example.basicExample;
        
        // Find the active editor or use the first one
        const editorId = this.activeEditor || this.jsonEditors.keys().next().value;
        const editor = this.jsonEditors.get(editorId);
        
        if (editor) {
            editor.textarea.value = exampleJson;
            this.validateAndUpdateVisualization(editorId);
            
            // Show example information
            this.showExampleInfo(exampleType, complexity);
        }
    }

    /**
     * Show example information
     */
    showExampleInfo(exampleType, complexity) {
        const example = this.examples[exampleType];
        const infoHTML = `
            <div class="example-info">
                <h6>${example.title}</h6>
                <p><strong>Description:</strong> ${example.description}</p>
                <p><strong>Think of it like:</strong> ${example.analogy}</p>
                <div class="example-uses">
                    <strong>Real-world uses:</strong>
                    <ul>
                        ${example.realWorldUses.map(use => `<li>${use}</li>`).join('')}
                    </ul>
                </div>
                <div class="example-ai-prompt">
                    <strong>AI Prompt Example:</strong>
                    <pre><code>${example.aiPromptExample}</code></pre>
                    <button class="btn btn--xs copy-btn" data-copy="${example.aiPromptExample}">
                        Copy Prompt
                    </button>
                </div>
            </div>
        `;

        // Show in a temporary info panel
        this.showTemporaryInfo(infoHTML);
    }

    /**
     * Validate JSON and update visualization
     */
    validateAndUpdateVisualization(editorId) {
        const editor = this.jsonEditors.get(editorId);
        if (!editor) return;

        const jsonText = editor.textarea.value.trim();
        const validationElement = document.querySelector(`[data-editor-id="${editorId}"].json-validation`);
        const visualizationElement = document.querySelector(`[data-editor-id="${editorId}"].json-visualization`);

        try {
            if (jsonText === '') {
                this.showValidationStatus(validationElement, 'empty', 'Enter JSON to validate');
                this.clearVisualization(visualizationElement);
                return;
            }

            const parsedJson = JSON.parse(jsonText);
            editor.isValid = true;
            
            this.showValidationStatus(validationElement, 'valid', 'Valid JSON');
            this.updateVisualization(visualizationElement, parsedJson, editorId);
            
        } catch (error) {
            editor.isValid = false;
            this.showValidationStatus(validationElement, 'invalid', `Invalid JSON: ${error.message}`);
            this.clearVisualization(visualizationElement);
        }
    }

    /**
     * Show validation status
     */
    showValidationStatus(element, status, message) {
        if (!element) return;

        element.innerHTML = `
            <div class="validation-status validation-status--${status}">
                ${status === 'valid' ? '✓' : status === 'invalid' ? '✗' : 'ℹ'} ${message}
            </div>
        `;
    }

    /**
     * Update visualization
     */
    updateVisualization(element, data, editorId) {
        if (!element) return;

        const visualizationContent = element.querySelector('.visualization-content');
        if (!visualizationContent) return;

        const visualization = this.generateVisualization(data);
        visualizationContent.innerHTML = visualization;
    }

    /**
     * Generate visual representation of JSON data
     */
    generateVisualization(data, depth = 0) {
        const indent = '  '.repeat(depth);
        
        if (Array.isArray(data)) {
            return this.generateArrayVisualization(data, depth);
        } else if (typeof data === 'object' && data !== null) {
            return this.generateObjectVisualization(data, depth);
        } else {
            return this.generatePrimitiveVisualization(data);
        }
    }

    /**
     * Generate array visualization
     */
    generateArrayVisualization(array, depth) {
        const items = array.map((item, index) => `
            <div class="viz-array-item" style="--depth: ${depth}">
                <div class="viz-index">[${index}]</div>
                <div class="viz-value">
                    ${this.generateVisualization(item, depth + 1)}
                </div>
            </div>
        `).join('');

        return `
            <div class="viz-array">
                <div class="viz-type-label">Array (${array.length} items)</div>
                <div class="viz-array-items">
                    ${items}
                </div>
            </div>
        `;
    }

    /**
     * Generate object visualization
     */
    generateObjectVisualization(obj, depth) {
        const keys = Object.keys(obj);
        const items = keys.map(key => `
            <div class="viz-object-item" style="--depth: ${depth}">
                <div class="viz-key">"${key}":</div>
                <div class="viz-value">
                    ${this.generateVisualization(obj[key], depth + 1)}
                </div>
            </div>
        `).join('');

        return `
            <div class="viz-object">
                <div class="viz-type-label">Object (${keys.length} properties)</div>
                <div class="viz-object-items">
                    ${items}
                </div>
            </div>
        `;
    }

    /**
     * Generate primitive value visualization
     */
    generatePrimitiveVisualization(value) {
        const type = typeof value;
        let displayValue = value;
        let className = `viz-primitive viz-${type}`;

        if (type === 'string') {
            displayValue = `"${value}"`;
        } else if (value === null) {
            className = 'viz-primitive viz-null';
            displayValue = 'null';
        }

        return `
            <div class="${className}">
                <span class="viz-type">${type}</span>
                <span class="viz-value">${displayValue}</span>
            </div>
        `;
    }

    /**
     * Clear visualization
     */
    clearVisualization(element) {
        if (!element) return;
        
        const visualizationContent = element.querySelector('.visualization-content');
        if (visualizationContent) {
            visualizationContent.innerHTML = '<div class="viz-empty">Enter valid JSON to see visualization</div>';
        }
    }

    /**
     * Format JSON in editor
     */
    formatJson(editorId) {
        const editor = this.jsonEditors.get(editorId);
        if (!editor) return;

        try {
            const jsonText = editor.textarea.value.trim();
            if (jsonText === '') return;

            const parsed = JSON.parse(jsonText);
            const formatted = JSON.stringify(parsed, null, 2);
            editor.textarea.value = formatted;
            
            this.validateAndUpdateVisualization(editorId);
            this.showTemporaryMessage('JSON formatted successfully!', 'success');
            
        } catch (error) {
            this.showTemporaryMessage('Cannot format invalid JSON', 'error');
        }
    }

    /**
     * Copy JSON content
     */
    async copyJsonContent(editorId) {
        const editor = this.jsonEditors.get(editorId);
        if (!editor) return;

        try {
            await navigator.clipboard.writeText(editor.textarea.value);
            this.showTemporaryMessage('JSON copied to clipboard!', 'success');
        } catch (error) {
            this.showTemporaryMessage('Failed to copy JSON', 'error');
        }
    }

    /**
     * Clear editor content
     */
    clearEditor(editorId) {
        const editor = this.jsonEditors.get(editorId);
        if (!editor) return;

        editor.textarea.value = '';
        this.validateAndUpdateVisualization(editorId);
    }

    /**
     * Toggle visualization view
     */
    toggleVisualization(editorId) {
        const visualizationElement = document.querySelector(`[data-editor-id="${editorId}"].json-visualization`);
        if (!visualizationElement) return;

        visualizationElement.classList.toggle('visualization-collapsed');
    }

    /**
     * Format JSON string
     */
    formatJsonString(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, 2);
        } catch (error) {
            return jsonString;
        }
    }

    /**
     * Show temporary info panel
     */
    showTemporaryInfo(content) {
        const infoPanel = document.createElement('div');
        infoPanel.className = 'temp-info-panel';
        infoPanel.innerHTML = `
            <div class="temp-info-content">
                ${content}
                <button class="btn btn--sm btn--outline close-info-btn">Close</button>
            </div>
        `;

        document.body.appendChild(infoPanel);

        // Auto-close after 15 seconds or on click
        const closeBtn = infoPanel.querySelector('.close-info-btn');
        const closeInfo = () => {
            infoPanel.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => infoPanel.remove(), 300);
        };

        closeBtn.addEventListener('click', closeInfo);
        setTimeout(closeInfo, 15000);
    }

    /**
     * Show temporary message
     */
    showTemporaryMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `temp-message temp-message--${type}`;
        messageElement.textContent = message;

        messageElement.style.cssText = `
            position: fixed;
            top: var(--space-4);
            right: var(--space-4);
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--space-3) var(--space-4);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-tooltip);
            animation: slideInRight 0.3s ease-out;
        `;

        if (type === 'success') {
            messageElement.style.borderColor = 'var(--color-accent)';
            messageElement.style.backgroundColor = '#f0fdf4';
        } else if (type === 'error') {
            messageElement.style.borderColor = 'var(--color-error)';
            messageElement.style.backgroundColor = '#fef2f2';
        }

        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageElement.remove(), 300);
        }, 3000);
    }

    /**
     * Create visual diagrams for data structures
     */
    createVisualizations() {
        // This method can be extended to create static visual diagrams
        // showing the conceptual differences between data structures
        console.log('Visual diagrams created');
    }

    /**
     * Set up JSON validation
     */
    setupJsonValidation() {
        // Additional validation setup if needed
        console.log('JSON validation set up');
    }

    /**
     * Get viewer statistics
     */
    getStats() {
        return {
            activeEditors: this.jsonEditors.size,
            activeEditor: this.activeEditor,
            availableExamples: Object.keys(this.examples).length
        };
    }

    /**
     * Destroy the viewer
     */
    destroy() {
        this.jsonEditors.clear();
        this.visualizations.clear();
        this.activeEditor = null;
    }
}
