/**
 * Main Application Module
 * Initializes and coordinates all components
 */

class ProjectDashboardApp {
    constructor() {
        this.dataManager = null;
        this.uiComponents = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing Project Dashboard App...');
            
            // Initialize data manager
            this.dataManager = new DataManager();
            
            // Initialize UI components
            this.uiComponents = new UIComponents(this.dataManager);
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize icons
            UIUtils.initializeIcons();
            
            // Load data
            await this.loadData();
            
            this.isInitialized = true;
            console.log('Project Dashboard App initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            UIUtils.showError(error.message);
        }
    }

    /**
     * Load application data
     */
    async loadData() {
        try {
            // Don't show loading state that replaces DOM - just load data
            await this.dataManager.loadData();
            
            // Render all components
            this.uiComponents.renderProjects();
            this.uiComponents.renderUpdates();
            this.uiComponents.updateFilters();
            
            console.log('Data loaded and UI rendered successfully');
            
        } catch (error) {
            console.error('Error loading data:', error);
            UIUtils.showError(error.message);
        }
    }

    /**
     * Hide loading state and show main app
     */
    hideLoadingState() {
        // No longer needed since we don't replace the DOM
        console.log('Data loaded successfully, app is ready');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input with debouncing
        const searchInput = UIUtils.getElementById(CONFIG.ELEMENTS.SEARCH_INPUT);
        if (searchInput) {
            const debouncedFilter = UIUtils.debounce(() => {
                this.uiComponents.handleFilterChange();
            }, CONFIG.UI.DEBOUNCE_DELAY);
            
            UIUtils.addEventListenerSafe(searchInput, 'input', debouncedFilter);
        }

        // Project filter
        const projectFilter = UIUtils.getElementById(CONFIG.ELEMENTS.PROJECT_FILTER);
        if (projectFilter) {
            UIUtils.addEventListenerSafe(projectFilter, 'change', () => {
                this.uiComponents.handleFilterChange();
            });
        }

        // Type filter
        const typeFilter = UIUtils.getElementById(CONFIG.ELEMENTS.TYPE_FILTER);
        if (typeFilter) {
            UIUtils.addEventListenerSafe(typeFilter, 'change', () => {
                this.uiComponents.handleFilterChange();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize handler
        window.addEventListener('resize', UIUtils.debounce(() => {
            this.handleWindowResize();
        }, 250));
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + K to focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            const searchInput = UIUtils.getElementById(CONFIG.ELEMENTS.SEARCH_INPUT);
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to clear search
        if (event.key === 'Escape') {
            const searchInput = UIUtils.getElementById(CONFIG.ELEMENTS.SEARCH_INPUT);
            if (searchInput && searchInput === document.activeElement) {
                searchInput.value = '';
                this.uiComponents.handleFilterChange();
            }
        }
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        // Re-initialize icons after potential layout changes
        UIUtils.initializeIcons();
        
        // Could add responsive behavior here
        console.log('Window resized, layout adjusted');
    }

    /**
     * Refresh data
     */
    async refreshData() {
        if (!this.isInitialized) {
            console.warn('App not initialized, cannot refresh data');
            return;
        }

        try {
            console.log('Refreshing data...');
            await this.dataManager.loadData();
            
            // Re-render all components
            this.uiComponents.renderProjects();
            this.uiComponents.renderUpdates();
            this.uiComponents.updateFilters();
            
            console.log('Data refreshed successfully');
        } catch (error) {
            console.error('Error refreshing data:', error);
            UIUtils.showError('Failed to refresh data: ' + error.message);
        }
    }

    /**
     * Get current application state
     */
    getState() {
        if (!this.isInitialized) {
            return { initialized: false };
        }

        return {
            initialized: true,
            selectedProject: this.dataManager.getSelectedProject(),
            filteredProjectsCount: this.dataManager.getFilteredProjects().length,
            totalProjectsCount: this.dataManager.getAllProjects().length
        };
    }

    /**
     * Destroy the application
     */
    destroy() {
        // Clean up event listeners and resources
        this.isInitialized = false;
        this.dataManager = null;
        this.uiComponents = null;
        console.log('Project Dashboard App destroyed');
    }
}

// Global app instance
let app = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing Project Dashboard App...');
    
    try {
        app = new ProjectDashboardApp();
        await app.init();
    } catch (error) {
        console.error('Failed to start application:', error);
        UIUtils.showError('Failed to start application: ' + error.message);
    }
});

// Global functions for debugging and external access
window.getAppState = () => app ? app.getState() : null;
window.refreshAppData = () => app ? app.refreshData() : null;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectDashboardApp;
} else {
    window.ProjectDashboardApp = ProjectDashboardApp;
}
