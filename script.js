/**
 * Theme Management System
 * Handles light/dark mode switching with localStorage persistence
 */
class ThemeManager {
    constructor() {
        // Get saved theme preference or default to light
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.setupEventListeners();
    }

    /**
     * Set up event listeners for theme toggle
     */
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
}

/**
 * Utility Functions
 */
class Utils {
    /**
     * Add smooth scrolling to anchor links
     */
    static initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Add loading states to buttons
     */
    static initButtonLoadingStates() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('loading')) return;
                
                const originalText = this.textContent;
                this.classList.add('loading');
                this.textContent = '';
                
                // Remove loading state after a short delay
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.textContent = originalText;
                }, 1000);
            });
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    Utils.initSmoothScrolling();
    Utils.initButtonLoadingStates();
}); 