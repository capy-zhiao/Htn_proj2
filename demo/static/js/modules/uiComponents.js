/**
 * UI Components Module
 * Handles rendering of all UI components
 */

class UIComponents {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    /**
     * Render the projects list in the sidebar
     */
    renderProjects() {
        const projectsList = UIUtils.getElementById(CONFIG.ELEMENTS.PROJECTS_LIST);
        if (!projectsList) return;

        UIUtils.clearElement(projectsList);
        const projects = this.dataManager.getAllProjects();

        projects.forEach(project => {
            const projectDiv = UIUtils.createElement('div', 
                'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50'
            );
            
            projectDiv.innerHTML = `
                <div class="flex items-center gap-2">
                    <i data-lucide="folder-open" class="w-4 h-4 text-gray-400"></i>
                    <div>
                        <div class="text-sm font-medium">${UIUtils.escapeHtml(project.name)}</div>
                        <div class="text-xs text-gray-500">${UIUtils.escapeHtml(project.status)}</div>
                    </div>
                </div>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    ${project.updates}
                </span>
            `;

            UIUtils.addEventListenerSafe(projectDiv, 'click', () => {
                const projectFilter = UIUtils.getElementById(CONFIG.ELEMENTS.PROJECT_FILTER);
                if (projectFilter) {
                    projectFilter.value = project.name;
                    this.handleFilterChange();
                }
            });

            projectsList.appendChild(projectDiv);
        });

        UIUtils.initializeIcons();
    }

    /**
     * Render the updates list
     */
    renderUpdates() {
        const updatesList = UIUtils.getElementById(CONFIG.ELEMENTS.UPDATES_LIST);
        const updateCount = UIUtils.getElementById(CONFIG.ELEMENTS.UPDATE_COUNT);
        
        if (!updatesList || !updateCount) return;
        
        const filteredProjects = this.dataManager.getFilteredProjects();
        const selectedProject = this.dataManager.getSelectedProject();
        
        updateCount.textContent = filteredProjects.length;
        UIUtils.clearElement(updatesList);

        filteredProjects.forEach(project => {
            const updateDiv = UIUtils.createElement('div');
            const isSelected = selectedProject?.id === project.id;
            
            updateDiv.className = `p-4 cursor-pointer transition-colors ${
                isSelected ? CONFIG.CSS_CLASSES.SELECTED_PROJECT : CONFIG.CSS_CLASSES.HOVER_EFFECT
            }`;
            
            updateDiv.innerHTML = `
                <div class="mb-2">
                    <h3 class="text-sm font-medium text-gray-900 ${CONFIG.CSS_CLASSES.LINE_CLAMP_2}">
                        ${UIUtils.escapeHtml(project.title)}
                    </h3>
                    <p class="text-xs text-gray-600 mt-1 ${CONFIG.CSS_CLASSES.LINE_CLAMP_1}">
                        ${UIUtils.escapeHtml(project.summary)}
                    </p>
                </div>
                
                <div class="flex items-center gap-2 text-xs mb-2">
                    <span class="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                        <i data-lucide="folder-open" class="w-3 h-3"></i>
                        ${UIUtils.escapeHtml(project.projectName)}
                    </span>
                    <span class="px-2 py-1 rounded flex items-center gap-1 ${UIUtils.getTypeColor(project.type)}">
                        ${UIUtils.getTypeIcon(project.type)}
                        ${UIUtils.escapeHtml(project.type)}
                    </span>
                </div>
                
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <div class="flex items-center gap-1">
                        <i data-lucide="calendar" class="w-3 h-3"></i>
                        ${UIUtils.formatTimestamp(project.timestamp)}
                    </div>
                    <div class="flex items-center gap-1">
                        <i data-lucide="message-square" class="w-3 h-3"></i>
                        ${UIUtils.escapeHtml(project.aiModel)}
                    </div>
                </div>
            `;

            UIUtils.addEventListenerSafe(updateDiv, 'click', () => {
                this.selectProject(project);
            });

            updatesList.appendChild(updateDiv);
        });

        UIUtils.initializeIcons();
    }

    /**
     * Render the detail view for selected project
     */
    renderDetailView() {
        const selectedProject = this.dataManager.getSelectedProject();
        const detailView = UIUtils.getElementById(CONFIG.ELEMENTS.DETAIL_VIEW);
        
        if (!detailView) return;

        if (!selectedProject) {
            detailView.innerHTML = `
                <div class="flex items-center justify-center h-full text-gray-500">
                    <div class="text-center">
                        <i data-lucide="folder-open" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                        <p class="text-lg font-medium mb-2">Select a project update to view details</p>
                        <p class="text-sm">Browse your project summaries and AI-generated insights</p>
                    </div>
                </div>
            `;
            UIUtils.initializeIcons();
            return;
        }

        detailView.innerHTML = `
            <div class="mb-6">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">
                            ${UIUtils.escapeHtml(selectedProject.title)}
                        </h1>
                        <div class="flex items-center gap-2 mb-3">
                            <span class="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-2">
                                <i data-lucide="folder-open" class="w-4 h-4"></i>
                                ${UIUtils.escapeHtml(selectedProject.projectName)}
                            </span>
                            <span class="px-3 py-1 rounded-lg flex items-center gap-2 ${UIUtils.getTypeColor(selectedProject.type)}">
                                ${UIUtils.getTypeIcon(selectedProject.type)}
                                ${UIUtils.escapeHtml(selectedProject.type)}
                            </span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <i data-lucide="external-link" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div class="flex items-center gap-1">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        ${UIUtils.formatTimestamp(selectedProject.timestamp)}
                    </div>
                    <div class="flex items-center gap-1">
                        <i data-lucide="message-square" class="w-4 h-4"></i>
                        Generated by ${UIUtils.escapeHtml(selectedProject.aiModel)}
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    ${selectedProject.tags.map(tag => `
                        <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            <i data-lucide="tag" class="w-3 h-3"></i>
                            ${UIUtils.escapeHtml(tag)}
                        </span>
                    `).join('')}
                </div>
            </div>

            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <p class="text-gray-800">${UIUtils.escapeHtml(selectedProject.summary)}</p>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <i data-lucide="wrench" class="w-5 h-5 text-green-600"></i>
                            New Features and Capabilities
                        </h3>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <ul class="space-y-2">
                                ${selectedProject.functions.length > 0 ? 
                                    selectedProject.functions.map(func => `
                                        <li class="flex items-start gap-2 text-sm">
                                            <div class="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <span class="text-gray-700">${UIUtils.escapeHtml(func)}</span>
                                        </li>
                                    `).join('') :
                                    '<li class="text-sm text-gray-500 italic">No specific features identified</li>'
                                }
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <i data-lucide="bug" class="w-5 h-5 text-red-600"></i>
                            Bug Fixes
                        </h3>
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                            <ul class="space-y-2">
                                ${selectedProject.bugFixes.length > 0 ? 
                                    selectedProject.bugFixes.map(fix => `
                                        <li class="flex items-start gap-2 text-sm">
                                            <div class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <span class="text-gray-700">${UIUtils.escapeHtml(fix)}</span>
                                        </li>
                                    `).join('') :
                                    '<li class="text-sm text-gray-500 italic">No specific bug fixes identified</li>'
                                }
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Impact and Results</h3>
                    <div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                        <p class="text-gray-800">${UIUtils.escapeHtml(selectedProject.impact)}</p>
                    </div>
                </div>

                <div>
                    <div class="flex items-center gap-2 mb-3">
                        <i data-lucide="code" class="w-5 h-5 text-gray-700"></i>
                        <h3 class="text-lg font-semibold text-gray-900">Key Code Changes</h3>
                    </div>
                    ${this.renderCodeChanges(selectedProject.codeChanges)}
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Conversation Details</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="font-medium text-gray-700">Message Count:</span> ${selectedProject.messageCount}
                        </div>
                        <div>
                            <span class="font-medium text-gray-700">Participants:</span> ${UIUtils.escapeHtml(selectedProject.participants.join(', '))}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize icons after rendering
        setTimeout(() => {
            UIUtils.initializeIcons();
        }, 100);
    }

    /**
     * Render code changes with side-by-side comparison
     */
    renderCodeChanges(codeChanges) {
        if (typeof codeChanges === 'string') {
            // Fallback for old format
            return `
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h4 class="text-sm font-semibold text-gray-700">Code Changes</h4>
                        </div>
                    </div>
                    <div class="bg-gray-50">
                        <pre class="p-4 text-sm text-gray-800 overflow-x-auto font-mono leading-relaxed"><code>${UIUtils.escapeHtml(codeChanges)}</code></pre>
                    </div>
                </div>
            `;
        }
        
        if (codeChanges && codeChanges.type === 'side_by_side') {
            return `
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h4 class="text-sm font-semibold text-gray-700">Code Changes</h4>
                        </div>
                    </div>
                    <div class="space-y-0">
                        <div class="border-b border-gray-200">
                            <div class="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 border-b border-gray-200">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span class="text-sm font-medium text-red-700">Before</span>
                                </div>
                            </div>
                            <div class="bg-gray-50">
                                <pre class="p-4 text-sm text-gray-800 overflow-x-auto font-mono leading-relaxed"><code>${UIUtils.escapeHtml(codeChanges.before)}</code></pre>
                            </div>
                        </div>
                        <div>
                            <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span class="text-sm font-medium text-green-700">After</span>
                                </div>
                            </div>
                            <div class="bg-gray-50">
                                <pre class="p-4 text-sm text-gray-800 overflow-x-auto font-mono leading-relaxed"><code>${UIUtils.escapeHtml(codeChanges.after)}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const result = `
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 class="text-sm font-semibold text-gray-700">Code Changes</h4>
                    </div>
                </div>
                <div class="bg-gray-50">
                    <pre class="p-4 text-sm text-gray-500 overflow-x-auto font-mono leading-relaxed"><code>// No code changes detected</code></pre>
                </div>
            </div>
        `;
        
        // Initialize icons after rendering
        setTimeout(() => {
            UIUtils.initializeIcons();
        }, 100);
        
        return result;
    }

    /**
     * Update filter options
     */
    updateFilters() {
        const projectFilter = UIUtils.getElementById(CONFIG.ELEMENTS.PROJECT_FILTER);
        if (!projectFilter) return;

        projectFilter.innerHTML = '<option value="all">All Projects</option>';
        
        const projects = this.dataManager.getAllProjects();
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.name;
            option.textContent = project.name;
            projectFilter.appendChild(option);
        });
    }

    /**
     * Select a project and update UI
     */
    selectProject(project) {
        this.dataManager.selectProject(project);
        this.renderDetailView();
        this.renderUpdates(); // Re-render to update selected state
    }

    /**
     * Handle filter changes
     */
    handleFilterChange() {
        const searchQuery = UIUtils.getElementById(CONFIG.ELEMENTS.SEARCH_INPUT)?.value || '';
        const projectFilter = UIUtils.getElementById(CONFIG.ELEMENTS.PROJECT_FILTER)?.value || 'all';
        const typeFilter = UIUtils.getElementById(CONFIG.ELEMENTS.TYPE_FILTER)?.value || 'all';

        this.dataManager.filterProjects(searchQuery, projectFilter, typeFilter);
        this.renderUpdates();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponents;
} else {
    window.UIComponents = UIComponents;
}
