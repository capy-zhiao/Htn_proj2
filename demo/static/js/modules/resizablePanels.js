/**
 * Resizable Panels Module
 * Handles panel resizing, collapsing, and state persistence
 */

class ResizablePanels {
    constructor() {
        this.isResizing = false;
        this.currentHandle = null;
        this.startX = 0;
        this.startWidth = 0;
        this.panelStates = this.loadPanelStates();
        
        this.init();
    }

    init() {
        this.setupResizeHandles();
        this.restorePanelStates();
        
        // Add global event listeners
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('selectstart', this.preventSelection.bind(this));
    }

    setupResizeHandles() {
        const handles = document.querySelectorAll('.resize-handle');
        
        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                this.startResize(e, handle);
            });
            
            // Add double-click to auto-resize
            handle.addEventListener('dblclick', (e) => {
                this.autoResize(handle);
            });
        });
    }


    startResize(e, handle) {
        e.preventDefault();
        
        this.isResizing = true;
        this.currentHandle = handle;
        this.startX = e.clientX;
        
        const targetId = handle.dataset.target;
        const targetPanel = document.getElementById(targetId);
        
        if (targetPanel) {
            this.startWidth = targetPanel.offsetWidth;
            handle.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }
    }

    handleMouseMove(e) {
        if (!this.isResizing || !this.currentHandle) return;

        e.preventDefault();
        
        const targetId = this.currentHandle.dataset.target;
        const targetPanel = document.getElementById(targetId);
        
        if (!targetPanel) return;

        const deltaX = e.clientX - this.startX;
        const newWidth = this.startWidth + deltaX;
        
        // Get min and max width from style or defaults
        const minWidth = parseInt(targetPanel.style.minWidth) || 200;
        const maxWidth = parseInt(targetPanel.style.maxWidth) || 800;
        
        // Constrain the width
        const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        
        targetPanel.style.width = `${constrainedWidth}px`;
        
        // Save state
        this.savePanelState(targetId, {
            width: constrainedWidth
        });
    }

    handleMouseUp(e) {
        if (!this.isResizing) return;

        this.isResizing = false;
        
        if (this.currentHandle) {
            this.currentHandle.classList.remove('resizing');
            this.currentHandle = null;
        }
        
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }

    preventSelection(e) {
        if (this.isResizing) {
            e.preventDefault();
        }
    }


    autoResize(handle) {
        const targetId = handle.dataset.target;
        const targetPanel = document.getElementById(targetId);
        
        if (!targetPanel) return;

        // Auto-resize to optimal width based on content
        let optimalWidth;
        
        switch(targetId) {
            case 'sidebar':
                optimalWidth = 320;
                break;
            case 'updates-panel':
                optimalWidth = 400;
                break;
            case 'detail-panel':
                optimalWidth = Math.max(500, window.innerWidth * 0.4);
                break;
            default:
                optimalWidth = 350;
        }
        
        // Animate to optimal width
        targetPanel.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        targetPanel.style.width = `${optimalWidth}px`;
        
        setTimeout(() => {
            targetPanel.style.transition = '';
        }, 300);

        // Save state
        this.savePanelState(targetId, {
            width: optimalWidth
        });
    }

    savePanelState(panelId, state) {
        this.panelStates[panelId] = { ...this.panelStates[panelId], ...state };
        localStorage.setItem('panelStates', JSON.stringify(this.panelStates));
    }

    loadPanelStates() {
        try {
            const saved = localStorage.getItem('panelStates');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.warn('Failed to load panel states:', e);
            return {};
        }
    }

    restorePanelStates() {
        Object.entries(this.panelStates).forEach(([panelId, state]) => {
            const panel = document.getElementById(panelId);
            if (!panel) return;

            if (state.width) {
                panel.style.width = `${state.width}px`;
            }
        });
    }

    // Public API methods
    getPanelWidth(panelId) {
        const panel = document.getElementById(panelId);
        return panel ? panel.offsetWidth : 0;
    }

    setPanelWidth(panelId, width) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.width = `${width}px`;
            this.savePanelState(panelId, { width });
        }
    }

    resetPanels() {
        // Reset all panels to default sizes
        const defaults = {
            'sidebar': 320,
            'updates-panel': 384,
            'detail-panel': 'flex-1'
        };

        Object.entries(defaults).forEach(([panelId, width]) => {
            const panel = document.getElementById(panelId);
            if (panel) {
                if (width === 'flex-1') {
                    panel.style.width = '';
                } else {
                    panel.style.width = `${width}px`;
                }
            }
        });

        // Clear saved states
        localStorage.removeItem('panelStates');
        this.panelStates = {};
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResizablePanels;
} else {
    window.ResizablePanels = ResizablePanels;
}
