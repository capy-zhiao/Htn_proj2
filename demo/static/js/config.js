// Configuration constants for the Project Summary Dashboard

const CONFIG = {
    // API endpoints
    API: {
        PROJECTS: '/api/projects'
    },
    
    // UI constants
    UI: {
        DEBOUNCE_DELAY: 300,
        ANIMATION_DURATION: 200,
        MAX_FUNCTIONS_DISPLAY: 5,
        MAX_BUG_FIXES_DISPLAY: 5,
        MAX_TAGS_DISPLAY: 6
    },
    
    // Default values
    DEFAULTS: {
        AI_MODEL: 'OpenAI GPT-3.5',
        PROJECT_STATUS: 'Active',
        UNKNOWN_PROJECT: 'Unknown Project'
    },
    
    // Type mappings
    TYPE_MAPPINGS: {
        'bug fixed': 'Security Update',
        'function added': 'Feature Development',
        'function modify': 'Feature Development',
        'question': 'Discussion',
        'discussion': 'Discussion',
        'other': 'Other'
    },
    
    // Type styling
    TYPE_STYLES: {
        'Feature Development': {
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700',
            icon: 'wrench'
        },
        'Security Update': {
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            icon: 'git-branch'
        },
        'Performance': {
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            icon: 'code'
        },
        'Discussion': {
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-700',
            icon: 'message-square'
        },
        'Other': {
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700',
            icon: 'folder-open'
        }
    },
    
    // Impact descriptions
    IMPACT_DESCRIPTIONS: {
        'bug fixed': 'Improved system stability and user experience',
        'function added': 'Enhanced functionality and user capabilities',
        'function modify': 'Optimized existing features and performance',
        'question': 'Clarified requirements and improved understanding',
        'discussion': 'Promoted knowledge sharing and collaboration',
        'other': 'Had a positive impact on project development'
    },
    
    // Search keywords for content extraction
    KEYWORDS: {
        FUNCTIONS: ['function', 'method', 'added', 'implemented', 'create', 'add', 'implement'],
        BUG_FIXES: ['bug', 'fix', 'error', 'issue', 'repair', 'problem']
    },
    
    // Element IDs for DOM manipulation
    ELEMENTS: {
        APP: 'app',
        SEARCH_INPUT: 'searchInput',
        PROJECT_FILTER: 'projectFilter',
        TYPE_FILTER: 'typeFilter',
        PROJECTS_LIST: 'projectsList',
        UPDATES_LIST: 'updatesList',
        UPDATE_COUNT: 'updateCount',
        DETAIL_VIEW: 'detailView'
    },
    
    // CSS classes
    CSS_CLASSES: {
        SELECTED_PROJECT: 'bg-blue-50 border-r-2 border-r-blue-500',
        HOVER_EFFECT: 'hover:bg-gray-50',
        LOADING_SPINNER: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600',
        LINE_CLAMP_1: 'line-clamp-1',
        LINE_CLAMP_2: 'line-clamp-2'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
