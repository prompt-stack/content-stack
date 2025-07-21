/**
 * ModuleRenderer - Handles rendering of module cards and content
 */
export class ModuleRenderer {
    constructor(config, progressTracker) {
        this.config = config;
        this.progressTracker = progressTracker;
        this.expandedModules = new Set();
    }

    /**
     * Render a module card with dynamic content and progress
     */
    renderModuleCard(module) {
        const progress = this.progressTracker.getModuleProgress(module.id);
        const isCompleted = this.progressTracker.isModuleCompleted(module.id);
        const isExpanded = this.expandedModules.has(module.id);
        
        // Get sections count and estimated total time
        const sectionsCount = module.sections ? module.sections.length : 0;
        const totalTime = this.calculateTotalTime(module);
        
        return `
            <div class="module-card ${isCompleted ? 'module-card--completed' : ''} ${isExpanded ? 'module-card--expanded' : ''}" 
                 data-module-id="${module.id}"
                 data-difficulty="${module.difficulty}"
                 data-order="${module.order}">
                
                <!-- Module Card Header -->
                <div class="module-card__header">
                    <div class="module-card__icon">
                        ${this.getModuleIcon(module.icon)}
                    </div>
                    <div class="module-card__badge">
                        <span class="difficulty-badge difficulty-badge--${module.difficulty}">
                            ${module.difficulty}
                        </span>
                    </div>
                </div>
                
                <!-- Module Card Content -->
                <div class="module-card__content">
                    <h3 class="module-card__title">${module.title}</h3>
                    <p class="module-card__description">${module.description}</p>
                    
                    <!-- Module Stats -->
                    <div class="module-card__stats">
                        <div class="module-stat">
                            <span class="module-stat__icon">📚</span>
                            <span class="module-stat__text">${sectionsCount} sections</span>
                        </div>
                        <div class="module-stat">
                            <span class="module-stat__icon">⏱️</span>
                            <span class="module-stat__text">${totalTime}</span>
                        </div>
                        <div class="module-stat">
                            <span class="module-stat__icon">🎯</span>
                            <span class="module-stat__text">${Math.round(progress * 100)}% complete</span>
                        </div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="module-card__progress">
                        <div class="progress-bar" role="progressbar" 
                             aria-valuenow="${Math.round(progress * 100)}" 
                             aria-valuemin="0" 
                             aria-valuemax="100"
                             aria-label="Module progress">
                            <div class="progress-bar__fill" style="width: ${progress * 100}%"></div>
                        </div>
                        <span class="progress-text">${Math.round(progress * 100)}% Complete</span>
                    </div>
                </div>
                
                <!-- Expandable Sections Preview -->
                <div class="module-card__sections ${isExpanded ? 'module-card__sections--expanded' : ''}">
                    ${this.renderSectionsPreview(module.sections || [])}
                </div>
                
                <!-- Module Card Actions -->
                <div class="module-card__actions">
                    <button class="btn btn--outline btn--sm expand-toggle-btn" 
                            data-action="toggle-expand" 
                            data-module-id="${module.id}"
                            aria-expanded="${isExpanded}"
                            aria-controls="sections-${module.id}">
                        <span class="expand-text">${isExpanded ? 'Show Less' : 'Show Sections'}</span>
                        <span class="expand-icon">${isExpanded ? '▲' : '▼'}</span>
                    </button>
                    
                    <button class="btn ${progress > 0 ? 'btn--secondary' : 'btn--primary'} module-action-btn" 
                            data-action="open-module" 
                            data-module-id="${module.id}">
                        ${this.getActionButtonText(progress, isCompleted)}
                    </button>
                </div>
                
                <!-- Completion Badge -->
                ${isCompleted ? '<div class="module-card__completion-badge">✓ Completed</div>' : ''}
            </div>
        `;
    }

    /**
     * Render sections preview for expandable content
     */
    renderSectionsPreview(sections) {
        if (!sections || sections.length === 0) {
            return '<div class="sections-preview__empty">No sections available</div>';
        }

        return `
            <div class="sections-preview" id="sections-${sections[0]?.id?.split('-')[0] || 'unknown'}">
                <h4 class="sections-preview__title">Module Sections</h4>
                <div class="sections-list">
                    ${sections.map((section, index) => this.renderSectionPreview(section, index)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render individual section preview
     */
    renderSectionPreview(section, index) {
        const isCompleted = this.progressTracker.getSectionProgress(section.id);
        const sectionNumber = index + 1;
        
        return `
            <div class="section-preview ${isCompleted ? 'section-preview--completed' : ''}" 
                 data-section-id="${section.id}">
                <div class="section-preview__number">${sectionNumber}</div>
                <div class="section-preview__content">
                    <h5 class="section-preview__title">${section.title}</h5>
                    <div class="section-preview__meta">
                        <span class="section-type section-type--${section.type}">${section.type}</span>
                        <span class="section-time">${section.estimatedTime || '5 min'}</span>
                    </div>
                </div>
                <div class="section-preview__status">
                    ${isCompleted ? '<span class="status-icon status-icon--completed">✓</span>' : '<span class="status-icon status-icon--pending">○</span>'}
                </div>
            </div>
        `;
    }

    /**
     * Get module icon based on type
     */
    getModuleIcon(iconType) {
        const icons = {
            'layers': '🏗️',
            'database': '🗄️',
            'network': '🌐',
            'server': '🖥️',
            'code': '💻',
            'brain': '🧠',
            'tools': '🔧',
            'rocket': '🚀'
        };
        
        return icons[iconType] || '📚';
    }

    /**
     * Calculate total estimated time for module
     */
    calculateTotalTime(module) {
        if (module.estimatedTime) {
            return module.estimatedTime;
        }
        
        if (!module.sections || module.sections.length === 0) {
            return '30 min';
        }
        
        // Sum up section times (simplified calculation)
        const totalMinutes = module.sections.reduce((total, section) => {
            const timeStr = section.estimatedTime || '10 minutes';
            const minutes = parseInt(timeStr.match(/\d+/)?.[0] || '10');
            return total + minutes;
        }, 0);
        
        if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const mins = totalMinutes % 60;
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
        
        return `${totalMinutes} min`;
    }

    /**
     * Get appropriate action button text based on progress
     */
    getActionButtonText(progress, isCompleted) {
        if (isCompleted) {
            return 'Review Module';
        } else if (progress > 0) {
            return 'Continue Learning';
        } else {
            return 'Start Module';
        }
    }

    /**
     * Handle module card interactions
     */
    setupModuleCardListeners() {
        document.addEventListener('click', (event) => {
            // Handle expand/collapse toggle
            const expandBtn = event.target.closest('[data-action="toggle-expand"]');
            if (expandBtn) {
                event.preventDefault();
                const moduleId = expandBtn.dataset.moduleId;
                this.toggleModuleExpansion(moduleId);
                return;
            }

            // Handle module card clicks (for mobile)
            const moduleCard = event.target.closest('.module-card');
            if (moduleCard && !event.target.closest('button')) {
                const moduleId = moduleCard.dataset.moduleId;
                this.handleCardClick(moduleId);
                return;
            }
        });
    }

    /**
     * Toggle module expansion
     */
    toggleModuleExpansion(moduleId) {
        const moduleCard = document.querySelector(`[data-module-id="${moduleId}"]`);
        if (!moduleCard) return;

        const isExpanded = this.expandedModules.has(moduleId);
        const sectionsContainer = moduleCard.querySelector('.module-card__sections');
        const expandBtn = moduleCard.querySelector('.expand-toggle-btn');
        const expandText = expandBtn.querySelector('.expand-text');
        const expandIcon = expandBtn.querySelector('.expand-icon');

        if (isExpanded) {
            // Collapse
            this.expandedModules.delete(moduleId);
            moduleCard.classList.remove('module-card--expanded');
            sectionsContainer.classList.remove('module-card__sections--expanded');
            expandBtn.setAttribute('aria-expanded', 'false');
            expandText.textContent = 'Show Sections';
            expandIcon.textContent = '▼';
        } else {
            // Expand
            this.expandedModules.add(moduleId);
            moduleCard.classList.add('module-card--expanded');
            sectionsContainer.classList.add('module-card__sections--expanded');
            expandBtn.setAttribute('aria-expanded', 'true');
            expandText.textContent = 'Show Less';
            expandIcon.textContent = '▲';
        }

        // Smooth scroll to keep card in view
        setTimeout(() => {
            moduleCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 300);
    }

    /**
     * Handle module card click (mobile interaction)
     */
    handleCardClick(moduleId) {
        // On mobile, first click expands, second click opens
        if (window.innerWidth <= 768) {
            if (!this.expandedModules.has(moduleId)) {
                this.toggleModuleExpansion(moduleId);
            } else {
                // Dispatch open module event
                document.dispatchEvent(new CustomEvent('open-module', {
                    detail: { moduleId }
                }));
            }
        }
    }

    /**
     * Update all module cards with current progress
     */
    updateAllModuleProgress() {
        const moduleCards = document.querySelectorAll('.module-card');
        
        moduleCards.forEach(card => {
            const moduleId = card.dataset.moduleId;
            const progress = this.progressTracker.getModuleProgress(moduleId);
            const isCompleted = this.progressTracker.isModuleCompleted(moduleId);
            
            // Update progress bar
            const progressFill = card.querySelector('.progress-bar__fill');
            const progressText = card.querySelector('.progress-text');
            const progressBar = card.querySelector('.progress-bar');
            
            if (progressFill) {
                progressFill.style.width = `${progress * 100}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${Math.round(progress * 100)}% Complete`;
            }
            
            if (progressBar) {
                progressBar.setAttribute('aria-valuenow', Math.round(progress * 100));
            }
            
            // Update completion state
            card.classList.toggle('module-card--completed', isCompleted);
            
            // Update action button
            const actionBtn = card.querySelector('.module-action-btn');
            if (actionBtn) {
                actionBtn.textContent = this.getActionButtonText(progress, isCompleted);
                actionBtn.className = `btn ${progress > 0 ? 'btn--secondary' : 'btn--primary'} module-action-btn`;
            }
            
            // Update completion badge
            let completionBadge = card.querySelector('.module-card__completion-badge');
            if (isCompleted && !completionBadge) {
                completionBadge = document.createElement('div');
                completionBadge.className = 'module-card__completion-badge';
                completionBadge.textContent = '✓ Completed';
                card.appendChild(completionBadge);
            } else if (!isCompleted && completionBadge) {
                completionBadge.remove();
            }
            
            // Update stats
            const progressStat = card.querySelector('.module-stat:last-child .module-stat__text');
            if (progressStat) {
                progressStat.textContent = `${Math.round(progress * 100)}% complete`;
            }
        });
    }

    /**
     * Filter modules by difficulty or completion status
     */
    filterModules(filterType, filterValue) {
        const moduleCards = document.querySelectorAll('.module-card');
        
        moduleCards.forEach(card => {
            let shouldShow = true;
            
            switch (filterType) {
                case 'difficulty':
                    shouldShow = card.dataset.difficulty === filterValue;
                    break;
                case 'completion':
                    const isCompleted = card.classList.contains('module-card--completed');
                    shouldShow = filterValue === 'completed' ? isCompleted : !isCompleted;
                    break;
                case 'progress':
                    const moduleId = card.dataset.moduleId;
                    const progress = this.progressTracker.getModuleProgress(moduleId);
                    if (filterValue === 'started') {
                        shouldShow = progress > 0 && progress < 1;
                    } else if (filterValue === 'not-started') {
                        shouldShow = progress === 0;
                    }
                    break;
                default:
                    shouldShow = true;
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    /**
     * Sort modules by specified criteria
     */
    sortModules(sortBy) {
        const modulesGrid = document.getElementById('modules-grid');
        if (!modulesGrid) return;
        
        const moduleCards = Array.from(modulesGrid.querySelectorAll('.module-card'));
        
        moduleCards.sort((a, b) => {
            switch (sortBy) {
                case 'order':
                    return parseInt(a.dataset.order) - parseInt(b.dataset.order);
                case 'progress':
                    const progressA = this.progressTracker.getModuleProgress(a.dataset.moduleId);
                    const progressB = this.progressTracker.getModuleProgress(b.dataset.moduleId);
                    return progressB - progressA; // Descending
                case 'difficulty':
                    const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
                    return difficultyOrder[a.dataset.difficulty] - difficultyOrder[b.dataset.difficulty];
                case 'alphabetical':
                    const titleA = a.querySelector('.module-card__title').textContent;
                    const titleB = b.querySelector('.module-card__title').textContent;
                    return titleA.localeCompare(titleB);
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        moduleCards.forEach(card => modulesGrid.appendChild(card));
    }

    /**
     * Get module rendering statistics
     */
    getStats() {
        return {
            expandedModules: this.expandedModules.size,
            totalModules: document.querySelectorAll('.module-card').length,
            completedModules: document.querySelectorAll('.module-card--completed').length
        };
    }
}