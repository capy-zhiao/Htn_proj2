/**
 * UI Utilities Module
 * Contains helper functions for UI operations and formatting
 */

class UIUtils {
    /**
     * Initialize Lucide icons
     */
    static initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Format timestamp for display
     */
    static formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Get type-specific icon HTML
     */
    static getTypeIcon(type) {
        const iconName = CONFIG.TYPE_STYLES[type]?.icon || 'folder-open';
        return `<i data-lucide="${iconName}" class="w-4 h-4"></i>`;
    }

    /**
     * Get type-specific color classes
     */
    static getTypeColor(type) {
        const styles = CONFIG.TYPE_STYLES[type] || CONFIG.TYPE_STYLES['Other'];
        return `${styles.bgColor} ${styles.textColor}`;
    }

    /**
     * Show loading state
     */
    static showLoading() {
        const app = document.getElementById(CONFIG.ELEMENTS.APP);
        if (app) {
            app.innerHTML = `
                <div class="h-screen bg-gray-50 flex items-center justify-center">
                    <div class="text-center">
                        <div class="${CONFIG.CSS_CLASSES.LOADING_SPINNER} mx-auto mb-4"></div>
                        <p class="text-gray-600">Loading project data...</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Show error state
     */
    static showError(message) {
        const app = document.getElementById(CONFIG.ELEMENTS.APP);
        if (app) {
            app.innerHTML = `
                <div class="h-screen bg-gray-50 flex items-center justify-center">
                    <div class="text-center">
                        <div class="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 class="text-xl font-semibold text-gray-900 mb-2">Error loading data</h2>
                        <p class="text-gray-600 mb-4">${message}</p>
                        <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Retry
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Create a DOM element with classes and content
     */
    static createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        return element;
    }

    /**
     * Safely get element by ID
     */
    static getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID '${id}' not found`);
        }
        return element;
    }

    /**
     * Debounce function for search input
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Escape HTML to prevent XSS
     */
    static escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    /**
     * Truncate text with ellipsis
     */
    static truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substr(0, maxLength - 3) + '...';
    }

    /**
     * Check if element is in viewport
     */
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     */
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Add event listener with error handling
     */
    static addEventListenerSafe(element, event, handler) {
        if (element && typeof handler === 'function') {
            element.addEventListener(event, handler);
        } else {
            console.error('Invalid element or handler for event listener', { element, event, handler });
        }
    }

    /**
     * Remove all child elements from a parent
     */
    static clearElement(element) {
        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    }

    /**
     * Show/hide element with animation
     */
    static toggleElement(element, show = true) {
        if (!element) return;

        if (show) {
            element.style.display = 'block';
            element.style.opacity = '0';
            element.style.transform = 'translateY(-10px)';
            
            // Force reflow
            element.offsetHeight;
            
            element.style.transition = `all ${CONFIG.UI.ANIMATION_DURATION}ms ease-out`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        } else {
            element.style.transition = `all ${CONFIG.UI.ANIMATION_DURATION}ms ease-in`;
            element.style.opacity = '0';
            element.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, CONFIG.UI.ANIMATION_DURATION);
        }
    }

    /**
     * Copy text to clipboard
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }

    /**
     * Generate unique ID
     */
    static generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUtils;
} else {
    window.UIUtils = UIUtils;
}
