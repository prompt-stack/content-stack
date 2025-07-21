/**
 * Navigation - Handles navigation component and progress tracking
 */
export class Navigation {
    constructor(config, progressTracker) {
        this.config = config;
        this.progressTracker = progressTracker;
        this.isMobileMenuOpen = false;
        this.currentSection = null;
        this.scrollIndicator = null;
        
        // DOM elements
        this.navToggle = null;
        this.navMenu = null;
        this.navList = null;
        this.navOverlay = null;
        
        // Bind methods
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        
        // Throttled scroll handler for performance
        this.throttledScrollHandler = this.throttle(this.handleScroll, 16);
    }

    /**
     * Initialize and render the navigation
     */
    render() {
        try {
            this.createNavigationItems();
            this.setupEventListeners();
            this.createScrollIndicator();
            this.updateProgress();
            
            console.log('Navigation rendered successfully');
        } catch (error) {
            console.error('Error rendering navigation:', error);
        }
    }

    /**
     * Create navigation items from config
     */
    createNavigationItems() {
        this.navList = document.querySelector('.nav__list');
        if (!this.navList) {
            console.error('Navigation list element not found');
            return;
        }

        const modules = this.config.getModules();
        const navigationItems = modules.map(module => this.createNavItem(module));
        
        this.navList.innerHTML = navigationItems.join('');
    }

    /**
     * Create individual navigation item
     */
    createNavItem(module) {
        const isCompleted = this.progressTracker.isModuleCompleted(module.id);
        const progress = this.progressTracker.getModuleProgress(module.id);
        const isActive = this.currentSection === module.id;
        
        return `
            <li class="nav__item ${isCompleted ? 'nav__item--completed' : ''}" role="none">
                <a href="#${module.id}" 
                   class="nav__link ${isActive ? 'nav__link--active' : ''}" 
                   data-module-id="${module.id}"
                   aria-describedby="progress-${module.id}">
                    <span class="nav__link-text">${module.title}</span>
                    <div class="nav__progress" id="progress-${module.id}">
                        <span class="nav__progress-text sr-only">
                            ${Math.round(progress * 100)}% complete
                        </span>
                        <div class="nav__progress-bar" role="progressbar" 
                             aria-valuenow="${Math.round(progress * 100)}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                            <div class="nav__progress-fill" 
                                 style="width: ${progress * 100}%"></div>
                        </div>
                    </div>
                </a>
            </li>
        `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Get DOM elements
        this.navToggle = document.querySelector('.nav__toggle');
        this.navMenu = document.querySelector('.nav__menu');
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', this.handleToggleClick);
        }

        // Navigation clicks
        if (this.navList) {
            this.navList.addEventListener('click', this.handleNavClick);
        }

        // Scroll handling
        window.addEventListener('scroll', this.throttledScrollHandler, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown);

        // Outside click to close mobile menu
        document.addEventListener('click', this.handleOutsideClick);

        // Resize handling
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Handle mobile menu toggle
     */
    handleToggleClick(event) {
        event.preventDefault();
        this.toggleMobileMenu();
    }

    /**
     * Handle navigation link clicks
     */
    handleNavClick(event) {
        const link = event.target.closest('.nav__link');
        if (!link) return;

        event.preventDefault();
        
        const moduleId = link.dataset.moduleId;
        const targetElement = document.getElementById(moduleId);
        
        if (targetElement) {
            this.scrollToSection(targetElement);
            this.setActiveSection(moduleId);
            
            // Close mobile menu if open
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        }
    }

    /**
     * Handle scroll events for active section detection
     */
    handleScroll() {
        this.updateScrollIndicator();
        this.updateActiveSection();
    }

    /**
     * Handle keyboard navigation
     */
    handleKeydown(event) {
        // Close mobile menu on Escape
        if (event.key === 'Escape' && this.isMobileMenuOpen) {
            this.closeMobileMenu();
            this.navToggle?.focus();
        }

        // Arrow key navigation within menu
        if (this.isMobileMenuOpen && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            this.handleArrowNavigation(event);
        }
    }

    /**
     * Handle arrow key navigation
     */
    handleArrowNavigation(event) {
        event.preventDefault();
        
        const links = Array.from(this.navList.querySelectorAll('.nav__link'));
        const currentIndex = links.indexOf(document.activeElement);
        
        let nextIndex;
        if (event.key === 'ArrowDown') {
            nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
        }
        
        links[nextIndex]?.focus();
    }

    /**
     * Handle clicks outside mobile menu
     */
    handleOutsideClick(event) {
        if (!this.isMobileMenuOpen) return;
        
        const isInsideNav = event.target.closest('.nav');
        if (!isInsideNav) {
            this.closeMobileMenu();
        }
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        
        // Update toggle button
        if (this.navToggle) {
            this.navToggle.setAttribute('aria-expanded', 'true');
            this.navToggle.classList.add('nav__toggle--active');
        }
        
        // Show menu
        if (this.navMenu) {
            this.navMenu.classList.add('nav__menu--open');
            this.navMenu.setAttribute('aria-hidden', 'false');
        }
        
        // Create and show overlay
        this.createOverlay();
        
        // Focus first menu item
        const firstLink = this.navList?.querySelector('.nav__link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        
        // Update toggle button
        if (this.navToggle) {
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navToggle.classList.remove('nav__toggle--active');
        }
        
        // Hide menu
        if (this.navMenu) {
            this.navMenu.classList.remove('nav__menu--open');
            this.navMenu.setAttribute('aria-hidden', 'true');
        }
        
        // Remove overlay
        this.removeOverlay();
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Create mobile menu overlay
     */
    createOverlay() {
        if (this.navOverlay) return;
        
        this.navOverlay = document.createElement('div');
        this.navOverlay.className = 'nav__overlay nav__overlay--active';
        this.navOverlay.addEventListener('click', () => this.closeMobileMenu());
        
        document.body.appendChild(this.navOverlay);
    }

    /**
     * Remove mobile menu overlay
     */
    removeOverlay() {
        if (this.navOverlay) {
            this.navOverlay.remove();
            this.navOverlay = null;
        }
    }

    /**
     * Scroll to section with smooth animation
     */
    scrollToSection(element) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Set active section
     */
    setActiveSection(sectionId) {
        this.currentSection = sectionId;
        
        // Update navigation links
        const links = this.navList?.querySelectorAll('.nav__link');
        links?.forEach(link => {
            const isActive = link.dataset.moduleId === sectionId;
            link.classList.toggle('nav__link--active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    }

    /**
     * Update active section based on scroll position
     */
    updateActiveSection() {
        const modules = this.config.getModules();
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        let activeSection = null;
        
        for (const module of modules) {
            const element = document.getElementById(module.id);
            if (element && element.offsetTop <= scrollPosition) {
                activeSection = module.id;
            }
        }
        
        if (activeSection && activeSection !== this.currentSection) {
            this.setActiveSection(activeSection);
        }
    }

    /**
     * Create scroll progress indicator
     */
    createScrollIndicator() {
        // Create scroll indicator element
        this.scrollIndicator = document.createElement('div');
        this.scrollIndicator.className = 'nav__scroll-indicator';
        this.scrollIndicator.innerHTML = '<div class="nav__scroll-progress"></div>';
        
        document.body.appendChild(this.scrollIndicator);
    }

    /**
     * Update scroll progress indicator
     */
    updateScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = this.scrollIndicator.querySelector('.nav__scroll-progress');
        if (progressBar) {
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        }
        
        // Show/hide indicator based on scroll position
        const shouldShow = scrollTop > 100;
        this.scrollIndicator.classList.toggle('nav__scroll-indicator--visible', shouldShow);
    }

    /**
     * Update progress indicators
     */
    updateProgress() {
        const modules = this.config.getModules();
        
        modules.forEach(module => {
            const progress = this.progressTracker.getModuleProgress(module.id);
            const isCompleted = this.progressTracker.isModuleCompleted(module.id);
            
            // Update progress bar
            const progressBar = document.querySelector(`#progress-${module.id} .nav__progress-fill`);
            if (progressBar) {
                progressBar.style.width = `${progress * 100}%`;
            }
            
            // Update progress text
            const progressText = document.querySelector(`#progress-${module.id} .nav__progress-text`);
            if (progressText) {
                progressText.textContent = `${Math.round(progress * 100)}% complete`;
            }
            
            // Update ARIA attributes
            const progressElement = document.querySelector(`#progress-${module.id} [role="progressbar"]`);
            if (progressElement) {
                progressElement.setAttribute('aria-valuenow', Math.round(progress * 100));
            }
            
            // Update completion status
            const navItem = document.querySelector(`[data-module-id="${module.id}"]`)?.closest('.nav__item');
            if (navItem) {
                navItem.classList.toggle('nav__item--completed', isCompleted);
            }
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Throttle function for performance
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Destroy navigation and clean up
     */
    destroy() {
        // Remove event listeners
        this.navToggle?.removeEventListener('click', this.handleToggleClick);
        this.navList?.removeEventListener('click', this.handleNavClick);
        window.removeEventListener('scroll', this.throttledScrollHandler);
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('click', this.handleOutsideClick);
        
        // Remove overlay and scroll indicator
        this.removeOverlay();
        this.scrollIndicator?.remove();
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}