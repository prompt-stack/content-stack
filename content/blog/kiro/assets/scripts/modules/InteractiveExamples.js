/**
 * @file content/blog/kiro/assets/scripts/modules/InteractiveExamples.js
 * @purpose Blog content script: InteractiveExamples
 * @layer content
 * @deps none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role pure-view
 */

/**
 * InteractiveExamples - Handles interactive examples and practice exercises
 */
export class InteractiveExamples {
    constructor() {
        this.currentExercise = null;
        this.exerciseProgress = new Map();
        this.walkthroughSteps = new Map();
        
        // Exercise definitions
        this.exercises = {
            'abstraction-practice': {
                title: 'Abstraction Practice',
                description: 'Practice identifying abstraction layers in real scenarios',
                type: 'walkthrough',
                difficulty: 'beginner',
                estimatedTime: '10 minutes',
                steps: this.getAbstractionSteps()
            },
            'json-builder': {
                title: 'JSON Structure Builder',
                description: 'Build JSON structures for different scenarios',
                type: 'interactive',
                difficulty: 'beginner', 
                estimatedTime: '15 minutes',
                scenarios: this.getJsonScenarios()
            },
            'ai-prompting': {
                title: 'AI Prompting Practice',
                description: 'Practice writing effective AI prompts using CS concepts',
                type: 'prompt-practice',
                difficulty: 'intermediate',
                estimatedTime: '20 minutes',
                prompts: this.getAIPromptExercises()
            }
        };
        
        this.setupEventListeners();
    }
}   
 /**
     * Initialize interactive examples
     */
    init() {
        this.createExerciseContainers();
        this.setupExerciseNavigation();
        console.log('InteractiveExamples initialized');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        document.addEventListener('click', (event) => {
            // Handle exercise start buttons
            const startBtn = event.target.closest('.start-exercise-btn');
            if (startBtn) {
                event.preventDefault();
                const exerciseId = startBtn.dataset.exercise;
                this.startExercise(exerciseId);
                return;
            }

            // Handle walkthrough navigation
            const nextBtn = event.target.closest('.walkthrough-next-btn');
            if (nextBtn) {
                event.preventDefault();
                this.nextWalkthroughStep();
                return;
            }

            const prevBtn = event.target.closest('.walkthrough-prev-btn');
            if (prevBtn) {
                event.preventDefault();
                this.previousWalkthroughStep();
                return;
            }

            // Handle exercise completion
            const completeBtn = event.target.closest('.complete-exercise-btn');
            if (completeBtn) {
                event.preventDefault();
                this.completeCurrentExercise();
                return;
            }

            // Handle hint buttons
            const hintBtn = event.target.closest('.show-hint-btn');
            if (hintBtn) {
                event.preventDefault();
                const hintId = hintBtn.dataset.hint;
                this.showHint(hintId);
                return;
            }
        });
    }

    /**
     * Get abstraction walkthrough steps
     */
    getAbstractionSteps() {
        return [
            {
                id: 'step-1',
                title: 'Identify the User Interface',
                content: 'Look at this online shopping website. What elements can users directly interact with?',
                scenario: 'shopping-website',
                question: 'Which of these are UI elements?',
                options: [
                    { text: 'Product images', correct: true, explanation: 'Users can see and click on product images' },
                    { text: 'Database queries', correct: false, explanation: 'Database queries happen behind the scenes' },
                    { text: 'Add to cart button', correct: true, explanation: 'Users directly click this button' },
                    { text: 'Payment processing', correct: false, explanation: 'Payment processing is internal logic' }
                ],
                hint: 'Think about what you can see and click on the webpage'
            },
            {
                id: 'step-2', 
                title: 'Identify the Logic Layer',
                content: 'Now think about what happens when you click "Add to Cart". What logic runs?',
                scenario: 'shopping-cart',
                question: 'What logic happens when adding items to cart?',
                options: [
                    { text: 'Check if item is in stock', correct: true, explanation: 'The system needs to verify availability' },
                    { text: 'Update the cart display', correct: false, explanation: 'This is UI update, not core logic' },
                    { text: 'Calculate total price', correct: true, explanation: 'Math calculations are logic operations' },
                    { text: 'Show success message', correct: false, explanation: 'This is UI feedback' }
                ],
                hint: 'Focus on the business rules and calculations, not what users see'
            }
        ];
    }    /**

     * Get JSON building scenarios
     */
    getJsonScenarios() {
        return [
            {
                id: 'user-profile',
                title: 'Build a User Profile',
                description: 'Create a JSON object representing a user profile for a social media app',
                requirements: [
                    'User must have a name and email',
                    'Include user preferences (theme, notifications)',
                    'Add a list of user interests',
                    'Include account creation date'
                ],
                template: '{\n  "name": "",\n  "email": "",\n  // Add more fields here\n}',
                solution: {
                    "name": "Alice Johnson",
                    "email": "alice@example.com", 
                    "preferences": {
                        "theme": "dark",
                        "notifications": true
                    },
                    "interests": ["photography", "travel", "coding"],
                    "createdAt": "2024-01-15"
                },
                hints: [
                    'Remember to use objects for nested data like preferences',
                    'Arrays are perfect for lists like interests',
                    'Dates can be stored as strings in ISO format'
                ]
            },
            {
                id: 'course-structure',
                title: 'Design a Course Structure',
                description: 'Create JSON representing an online course with modules and lessons',
                requirements: [
                    'Course has title, description, and instructor',
                    'Multiple modules, each with a title and lessons',
                    'Each lesson has title, duration, and completion status',
                    'Track overall course progress'
                ],
                template: '{\n  "course": {\n    "title": "",\n    // Add course details\n  }\n}',
                solution: {
                    "course": {
                        "title": "Web Development Basics",
                        "description": "Learn the fundamentals of web development",
                        "instructor": "Jane Smith",
                        "modules": [
                            {
                                "title": "HTML Basics",
                                "lessons": [
                                    { "title": "Introduction to HTML", "duration": "30 min", "completed": true },
                                    { "title": "HTML Elements", "duration": "45 min", "completed": false }
                                ]
                            }
                        ],
                        "progress": 25
                    }
                },
                hints: [
                    'Use nested objects for complex structures',
                    'Arrays work well for collections like modules and lessons',
                    'Boolean values are perfect for completion status'
                ]
            }
        ];
    }

    /**
     * Get AI prompting exercises
     */
    getAIPromptExercises() {
        return [
            {
                id: 'abstraction-prompt',
                title: 'Using Abstraction in AI Prompts',
                scenario: 'You want AI to help design a mobile app',
                badExample: 'Make me an app',
                goodExample: 'Design a mobile app with these layers: UI (clean, modern interface), Components (login form, dashboard, settings), Logic (user authentication, data validation), Architecture (user database, API connections, cloud storage)',
                explanation: 'The good example uses abstraction thinking to describe each layer clearly',
                practice: 'Now write a prompt for AI to help design a website for a restaurant',
                hints: [
                    'Think about the UI layer - what will customers see?',
                    'Consider components - menu display, reservation form, contact info',
                    'What logic is needed - order processing, reservation management?',
                    'What architecture - payment system, database, hosting?'
                ]
            },
            {
                id: 'data-structure-prompt',
                title: 'Using Data Structures in AI Prompts',
                scenario: 'You want AI to help organize customer data',
                badExample: 'Help me organize customer info',
                goodExample: 'Create a JSON structure for customer data with: customer object (name, email, phone), order history array (each order has date, items array, total), preferences object (communication method, product categories)',
                explanation: 'The good example specifies exactly what data structures to use',
                practice: 'Write a prompt for organizing employee data at a company',
                hints: [
                    'What employee information needs to be stored?',
                    'How should departments and roles be structured?',
                    'What about project assignments and performance data?',
                    'Consider using objects for employee details and arrays for lists'
                ]
            }
        ];
    }    /*
*
     * Create exercise containers
     */
    createExerciseContainers() {
        const exerciseContainers = document.querySelectorAll('.interactive-exercise-container');
        
        exerciseContainers.forEach(container => {
            const exerciseType = container.dataset.exerciseType;
            const exerciseId = container.dataset.exerciseId;
            
            if (this.exercises[exerciseId]) {
                this.renderExercise(container, exerciseId);
            }
        });
    }

    /**
     * Render an exercise
     */
    renderExercise(container, exerciseId) {
        const exercise = this.exercises[exerciseId];
        
        const exerciseHTML = `
            <div class="interactive-exercise" data-exercise-id="${exerciseId}">
                <div class="exercise-header">
                    <h4 class="exercise-title">${exercise.title}</h4>
                    <div class="exercise-meta">
                        <span class="exercise-difficulty difficulty-${exercise.difficulty}">${exercise.difficulty}</span>
                        <span class="exercise-time">⏱️ ${exercise.estimatedTime}</span>
                    </div>
                </div>
                <div class="exercise-description">
                    <p>${exercise.description}</p>
                </div>
                <div class="exercise-content" id="exercise-content-${exerciseId}">
                    ${this.renderExerciseContent(exercise)}
                </div>
                <div class="exercise-actions">
                    <button class="btn btn--primary start-exercise-btn" data-exercise="${exerciseId}">
                        Start Exercise
                    </button>
                </div>
            </div>
        `;
        
        container.innerHTML = exerciseHTML;
    }

    /**
     * Render exercise content based on type
     */
    renderExerciseContent(exercise) {
        switch (exercise.type) {
            case 'walkthrough':
                return this.renderWalkthroughContent(exercise);
            case 'interactive':
                return this.renderInteractiveContent(exercise);
            case 'prompt-practice':
                return this.renderPromptPracticeContent(exercise);
            default:
                return '<div class="exercise-placeholder">Exercise content will appear here</div>';
        }
    }

    /**
     * Render walkthrough content
     */
    renderWalkthroughContent(exercise) {
        return `
            <div class="walkthrough-container" style="display: none;">
                <div class="walkthrough-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <span class="progress-text">Step 1 of ${exercise.steps.length}</span>
                </div>
                <div class="walkthrough-content">
                    <!-- Steps will be loaded dynamically -->
                </div>
                <div class="walkthrough-navigation">
                    <button class="btn btn--outline walkthrough-prev-btn" disabled>Previous</button>
                    <button class="btn btn--primary walkthrough-next-btn">Next</button>
                </div>
            </div>
        `;
    }

    /**
     * Render interactive content
     */
    renderInteractiveContent(exercise) {
        return `
            <div class="interactive-container" style="display: none;">
                <div class="scenario-selector">
                    <h5>Choose a scenario to practice:</h5>
                    <div class="scenario-buttons">
                        ${exercise.scenarios.map(scenario => `
                            <button class="btn btn--outline scenario-btn" data-scenario="${scenario.id}">
                                ${scenario.title}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="scenario-content">
                    <!-- Scenario content will be loaded here -->
                </div>
            </div>
        `;
    }

    /**
     * Render prompt practice content
     */
    renderPromptPracticeContent(exercise) {
        return `
            <div class="prompt-practice-container" style="display: none;">
                <div class="prompt-examples">
                    ${exercise.prompts.map((prompt, index) => `
                        <div class="prompt-example" data-prompt-index="${index}">
                            <h5>${prompt.title}</h5>
                            <div class="prompt-scenario">
                                <strong>Scenario:</strong> ${prompt.scenario}
                            </div>
                            <div class="prompt-comparison">
                                <div class="bad-example">
                                    <h6>❌ Poor Prompt:</h6>
                                    <pre><code>${prompt.badExample}</code></pre>
                                </div>
                                <div class="good-example">
                                    <h6>✅ Better Prompt:</h6>
                                    <pre><code>${prompt.goodExample}</code></pre>
                                </div>
                            </div>
                            <div class="prompt-explanation">
                                <strong>Why it's better:</strong> ${prompt.explanation}
                            </div>
                            <div class="prompt-practice">
                                <h6>Your Turn:</h6>
                                <p>${prompt.practice}</p>
                                <textarea class="prompt-input" placeholder="Write your prompt here..." rows="4"></textarea>
                                <button class="btn btn--sm btn--outline show-hint-btn" data-hint="prompt-${index}">
                                    Show Hints
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }   
 /**
     * Start an exercise
     */
    startExercise(exerciseId) {
        const exercise = this.exercises[exerciseId];
        if (!exercise) return;

        this.currentExercise = exerciseId;
        
        // Hide start button and show exercise content
        const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
        const startBtn = exerciseElement.querySelector('.start-exercise-btn');
        const contentContainer = exerciseElement.querySelector(`#exercise-content-${exerciseId}`);
        
        startBtn.style.display = 'none';
        
        // Show appropriate content based on exercise type
        const exerciseContainer = contentContainer.querySelector(`.${exercise.type}-container`);
        if (exerciseContainer) {
            exerciseContainer.style.display = 'block';
            
            // Initialize exercise based on type
            switch (exercise.type) {
                case 'walkthrough':
                    this.initializeWalkthrough(exerciseId);
                    break;
                case 'interactive':
                    this.initializeInteractive(exerciseId);
                    break;
                case 'prompt-practice':
                    this.initializePromptPractice(exerciseId);
                    break;
            }
        }
    }

    /**
     * Initialize walkthrough exercise
     */
    initializeWalkthrough(exerciseId) {
        const exercise = this.exercises[exerciseId];
        this.walkthroughSteps.set(exerciseId, { currentStep: 0, totalSteps: exercise.steps.length });
        this.showWalkthroughStep(exerciseId, 0);
    }

    /**
     * Show walkthrough step
     */
    showWalkthroughStep(exerciseId, stepIndex) {
        const exercise = this.exercises[exerciseId];
        const step = exercise.steps[stepIndex];
        const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
        const contentContainer = exerciseElement.querySelector('.walkthrough-content');
        const progressFill = exerciseElement.querySelector('.progress-fill');
        const progressText = exerciseElement.querySelector('.progress-text');
        const prevBtn = exerciseElement.querySelector('.walkthrough-prev-btn');
        const nextBtn = exerciseElement.querySelector('.walkthrough-next-btn');

        // Update progress
        const progressPercent = ((stepIndex + 1) / exercise.steps.length) * 100;
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `Step ${stepIndex + 1} of ${exercise.steps.length}`;

        // Update navigation buttons
        prevBtn.disabled = stepIndex === 0;
        nextBtn.textContent = stepIndex === exercise.steps.length - 1 ? 'Complete' : 'Next';

        // Render step content
        contentContainer.innerHTML = `
            <div class="walkthrough-step">
                <h5>${step.title}</h5>
                <div class="step-content">
                    <p>${step.content}</p>
                    ${step.scenario ? `<div class="step-scenario" data-scenario="${step.scenario}">
                        <!-- Scenario visualization would go here -->
                    </div>` : ''}
                    <div class="step-question">
                        <h6>${step.question}</h6>
                        <div class="step-options">
                            ${step.options.map((option, index) => `
                                <label class="option-label">
                                    <input type="checkbox" name="step-${stepIndex}" value="${index}">
                                    <span class="option-text">${option.text}</span>
                                </label>
                            `).join('')}
                        </div>
                        <button class="btn btn--sm btn--outline show-hint-btn" data-hint="step-${stepIndex}">
                            Need a hint?
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Update walkthrough state
        const walkthroughState = this.walkthroughSteps.get(exerciseId);
        walkthroughState.currentStep = stepIndex;
    }

    /**
     * Next walkthrough step
     */
    nextWalkthroughStep() {
        if (!this.currentExercise) return;
        
        const walkthroughState = this.walkthroughSteps.get(this.currentExercise);
        const exercise = this.exercises[this.currentExercise];
        
        if (walkthroughState.currentStep < exercise.steps.length - 1) {
            this.showWalkthroughStep(this.currentExercise, walkthroughState.currentStep + 1);
        } else {
            this.completeCurrentExercise();
        }
    }

    /**
     * Previous walkthrough step
     */
    previousWalkthroughStep() {
        if (!this.currentExercise) return;
        
        const walkthroughState = this.walkthroughSteps.get(this.currentExercise);
        
        if (walkthroughState.currentStep > 0) {
            this.showWalkthroughStep(this.currentExercise, walkthroughState.currentStep - 1);
        }
    }

    /**
     * Initialize interactive exercise
     */
    initializeInteractive(exerciseId) {
        const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
        const scenarioButtons = exerciseElement.querySelectorAll('.scenario-btn');
        
        scenarioButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const scenarioId = btn.dataset.scenario;
                this.loadScenario(exerciseId, scenarioId);
            });
        });
    }

    /**
     * Load a scenario for interactive exercise
     */
    loadScenario(exerciseId, scenarioId) {
        const exercise = this.exercises[exerciseId];
        const scenario = exercise.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;

        const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
        const contentContainer = exerciseElement.querySelector('.scenario-content');
        
        contentContainer.innerHTML = `
            <div class="scenario-exercise">
                <h5>${scenario.title}</h5>
                <p>${scenario.description}</p>
                <div class="scenario-requirements">
                    <h6>Requirements:</h6>
                    <ul>
                        ${scenario.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <div class="scenario-workspace">
                    <div class="json-editor-simple">
                        <textarea class="scenario-json-input" rows="15" placeholder="Build your JSON here...">${scenario.template}</textarea>
                    </div>
                    <div class="scenario-validation">
                        <button class="btn btn--outline validate-btn">Validate JSON</button>
                        <button class="btn btn--ghost show-solution-btn">Show Solution</button>
                    </div>
                    <div class="scenario-feedback">
                        <!-- Feedback will appear here -->
                    </div>
                </div>
            </div>
        `;

        // Set up scenario-specific event listeners
        this.setupScenarioListeners(exerciseId, scenarioId);
    }

    /**
     * Set up scenario event listeners
     */
    setupScenarioListeners(exerciseId, scenarioId) {
        const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
        const validateBtn = exerciseElement.querySelector('.validate-btn');
        const solutionBtn = exerciseElement.querySelector('.show-solution-btn');
        const jsonInput = exerciseElement.querySelector('.scenario-json-input');

        validateBtn.addEventListener('click', () => {
            this.validateScenarioJson(exerciseId, scenarioId);
        });

        solutionBtn.addEventListener('click', () => {
            this.showScenarioSolution(exerciseId, scenarioId);
        });
    }

    /**
     * Initialize prompt practice exercise
     */
    initializePromptPractice(exerciseId) {
        // Prompt practice is already rendered, just need to set up hint system
        console.log(`Prompt practice initialized for ${exerciseId}`);
    }

    /**
     * Show hint for current step/exercise
     */
    showHint(hintId) {
        // Implementation for showing hints
        const hintModal = this.createHintModal(hintId);
        document.body.appendChild(hintModal);
    }

    /**
     * Complete current exercise
     */
    completeCurrentExercise() {
        if (!this.currentExercise) return;

        const exerciseElement = document.querySelector(`[data-exercise-id="${this.currentExercise}"]`);
        
        // Show completion message
        const completionHTML = `
            <div class="exercise-completion">
                <div class="completion-icon">🎉</div>
                <h4>Exercise Completed!</h4>
                <p>Great job completing the ${this.exercises[this.currentExercise].title} exercise!</p>
                <button class="btn btn--primary restart-exercise-btn">Try Another Exercise</button>
            </div>
        `;
        
        exerciseElement.innerHTML = completionHTML;
        
        // Mark progress
        this.exerciseProgress.set(this.currentExercise, 'completed');
        
        // Reset current exercise
        this.currentExercise = null;
    }

    /**
     * Create hint modal
     */
    createHintModal(hintId) {
        const modal = document.createElement('div');
        modal.className = 'hint-modal';
        modal.innerHTML = `
            <div class="hint-content">
                <h5>💡 Hint</h5>
                <p>Hint content would go here based on ${hintId}</p>
                <button class="btn btn--sm close-hint-btn">Got it!</button>
            </div>
        `;
        
        modal.querySelector('.close-hint-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        return modal;
    }

    /**
     * Get exercise statistics
     */
    getStats() {
        return {
            totalExercises: Object.keys(this.exercises).length,
            completedExercises: Array.from(this.exerciseProgress.values()).filter(status => status === 'completed').length,
            currentExercise: this.currentExercise
        };
    }
}
