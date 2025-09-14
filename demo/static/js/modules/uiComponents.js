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

        projects.forEach((project, index) => {
            const projectDiv = UIUtils.createElement('div', 
                'project-card flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group animate-fade-in-up'
            );
            
            // Add staggered animation delay
            projectDiv.style.animationDelay = `${index * 0.1}s`;
            
            projectDiv.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <i data-lucide="folder-open" class="w-5 h-5 text-blue-600"></i>
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">${UIUtils.escapeHtml(project.name)}</div>
                        <div class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                            ${UIUtils.escapeHtml(this.generateProjectSummary(project))}
                        </div>
                    </div>
                </div>
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

        filteredProjects.forEach((project, index) => {
            const updateDiv = UIUtils.createElement('div');
            const isSelected = selectedProject?.id === project.id;
            
            updateDiv.className = `project-card p-5 cursor-pointer transition-all duration-300 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:border-blue-200 group animate-slide-in-right ${
                isSelected ? 'selected-project' : ''
            }`;
            
            // Add staggered animation delay
            updateDiv.style.animationDelay = `${index * 0.05}s`;
            
            updateDiv.innerHTML = `
                <div class="mb-3">
                    <h3 class="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2 mb-2">
                        ${UIUtils.escapeHtml(project.title)}
                    </h3>
                    <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        ${UIUtils.escapeHtml(project.summary)}
                    </p>
                </div>
                
                <div class="flex items-center gap-2 text-xs mb-3 flex-wrap">
                    <span class="bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium text-gray-700">
                        <i data-lucide="folder-open" class="w-3 h-3"></i>
                        ${UIUtils.escapeHtml(project.projectName)}
                    </span>
                    <span class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium status-badge ${UIUtils.getTypeColor(project.type)}">
                        ${UIUtils.getTypeIcon(project.type)}
                        ${UIUtils.escapeHtml(project.type)}
                    </span>
                </div>
                
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <div class="flex items-center gap-1.5">
                        <i data-lucide="calendar" class="w-3 h-3"></i>
                        <span class="font-medium">${UIUtils.formatTimestamp(project.timestamp)}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <i data-lucide="sparkles" class="w-3 h-3 text-blue-500"></i>
                        <span class="font-medium text-blue-600">${UIUtils.escapeHtml(project.aiModel)}</span>
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
                    <div class="text-center max-w-md mx-auto mt-32 animate-fade-in-up">
                        <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                            <i data-lucide="sparkles" class="w-10 h-10 text-blue-600"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Select a project update to view details</h2>
                        <p class="text-gray-600 mb-6">Browse your project summaries and AI-generated insights</p>
                        <div class="flex items-center justify-center gap-6 text-sm text-gray-500">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="brain" class="w-4 h-4 text-blue-600"></i>
                                </div>
                                <span class="font-medium">AI Analysis</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="code" class="w-4 h-4 text-green-600"></i>
                                </div>
                                <span class="font-medium">Code Insights</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="trending-up" class="w-4 h-4 text-purple-600"></i>
                                </div>
                                <span class="font-medium">Impact Tracking</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            UIUtils.initializeIcons();
            return;
        }

        detailView.innerHTML = `
            <div class="animate-fade-in-up">
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100">
                    <div class="flex items-start justify-between mb-6">
                        <div class="flex-1">
                            <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
                                ${UIUtils.escapeHtml(selectedProject.title)}
                            </h1>
                            <div class="flex items-center gap-3 mb-4 flex-wrap">
                                <span class="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-white/20">
                                    <i data-lucide="folder-open" class="w-4 h-4 text-blue-600"></i>
                                    <span class="font-medium text-gray-700">${UIUtils.escapeHtml(selectedProject.projectName)}</span>
                                </span>
                                <span class="px-4 py-2 rounded-xl flex items-center gap-2 status-badge ${UIUtils.getTypeColor(selectedProject.type)} shadow-sm">
                                    ${UIUtils.getTypeIcon(selectedProject.type)}
                                    <span class="font-semibold">${UIUtils.escapeHtml(selectedProject.type)}</span>
                                </span>
                            </div>
                        </div>
                        <div class="flex gap-2 ml-4">
                            <button class="p-3 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-white/50 backdrop-blur-sm transition-all duration-200 border border-transparent hover:border-blue-200">
                                <i data-lucide="external-link" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                
                    <div class="flex items-center gap-6 text-sm">
                        <div class="flex items-center gap-2 text-gray-600">
                            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i data-lucide="calendar" class="w-4 h-4 text-blue-600"></i>
                            </div>
                            <span class="font-medium">${UIUtils.formatTimestamp(selectedProject.timestamp)}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i data-lucide="sparkles" class="w-4 h-4 text-purple-600"></i>
                            </div>
                            <span class="font-medium">Generated by ${UIUtils.escapeHtml(selectedProject.aiModel)}</span>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 mt-4">
                        ${selectedProject.tags.map(tag => `
                            <span class="tag">
                                <i data-lucide="tag" class="w-3 h-3"></i>
                                ${UIUtils.escapeHtml(tag)}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="space-y-8">
                <div class="glass-card rounded-2xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <i data-lucide="file-text" class="w-4 h-4 text-white"></i>
                        </div>
                        Summary
                    </h3>
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                        <p class="text-gray-800 leading-relaxed text-base">${UIUtils.escapeHtml(selectedProject.summary)}</p>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div class="glass-card rounded-2xl p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <i data-lucide="wrench" class="w-4 h-4 text-white"></i>
                            </div>
                            New Features and Capabilities
                        </h3>
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                            <ul class="space-y-3">
                                ${selectedProject.functions.length > 0 ? 
                                    selectedProject.functions.map(func => `
                                        <li class="flex items-start gap-3 text-sm">
                                            <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                                                <i data-lucide="check" class="w-3 h-3 text-white"></i>
                                            </div>
                                            <span class="text-gray-700 leading-relaxed">${UIUtils.escapeHtml(func)}</span>
                                        </li>
                                    `).join('') :
                                    '<li class="text-sm text-gray-500 italic flex items-center gap-2"><i data-lucide="info" class="w-4 h-4"></i>No specific features identified</li>'
                                }
                            </ul>
                        </div>
                    </div>

                    <div class="glass-card rounded-2xl p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <i data-lucide="bug" class="w-4 h-4 text-white"></i>
                            </div>
                            Bug Fixes
                        </h3>
                        <div class="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-5">
                            <ul class="space-y-3">
                                ${selectedProject.bugFixes.length > 0 ? 
                                    selectedProject.bugFixes.map(fix => `
                                        <li class="flex items-start gap-3 text-sm">
                                            <div class="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                                                <i data-lucide="x" class="w-3 h-3 text-white"></i>
                                            </div>
                                            <span class="text-gray-700 leading-relaxed">${UIUtils.escapeHtml(fix)}</span>
                                        </li>
                                    `).join('') :
                                    '<li class="text-sm text-gray-500 italic flex items-center gap-2"><i data-lucide="info" class="w-4 h-4"></i>No specific bug fixes identified</li>'
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

    /**
     * Generate project summary - TESTING FUNCTION ONLY
     * TODO: Replace with real project description from data
     */
    generateProjectSummary(project) {
        // DEMO/TESTING: This function generates fake summaries for demonstration
        // In production, this should return project.description or similar real data
        
        if (project.description) {
            return project.description;
        }
        
        // Fallback demo text for testing purposes
        return ``;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponents;
} else {
    window.UIComponents = UIComponents;
}
