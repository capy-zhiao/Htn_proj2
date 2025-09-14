/**
 * Data Manager Module
 * Handles all API calls, data processing, and state management
 */

class DataManager {
    constructor() {
        this.allData = { projects: [], projectSummaries: [] };
        this.filteredProjects = [];
        this.selectedProject = null;
    }

    /**
     * Load project data from API
     */
    async loadData() {
        try {
            console.log('Starting to load data...');
            const response = await fetch(CONFIG.API.PROJECTS);
            console.log('API response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Failed to fetch project data');
            }
            
            this.allData = await response.json();
            console.log('Data loaded successfully:', this.allData);
            
            this.filteredProjects = this.allData.projectSummaries;
            
            return this.allData;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    /**
     * Filter projects based on search criteria
     */
    filterProjects(searchQuery = '', projectFilter = 'all', typeFilter = 'all') {
        const query = searchQuery.toLowerCase();
        
        this.filteredProjects = this.allData.projectSummaries.filter(project => {
            const matchesSearch = !query || 
                project.title.toLowerCase().includes(query) ||
                project.summary.toLowerCase().includes(query) ||
                project.projectName.toLowerCase().includes(query) ||
                project.tags.some(tag => tag.toLowerCase().includes(query));

            const matchesProject = projectFilter === 'all' || project.projectName === projectFilter;
            const matchesType = typeFilter === 'all' || project.type === typeFilter;

            return matchesSearch && matchesProject && matchesType;
        });

        return this.filteredProjects;
    }

    /**
     * Get filtered projects
     */
    getFilteredProjects() {
        return this.filteredProjects;
    }

    /**
     * Get all projects
     */
    getAllProjects() {
        return this.allData.projects;
    }

    /**
     * Select a project
     */
    selectProject(project) {
        this.selectedProject = project;
        return this.selectedProject;
    }

    /**
     * Get selected project
     */
    getSelectedProject() {
        return this.selectedProject;
    }

    /**
     * Convert tag to type
     */
    getTypeFromTag(tag) {
        return CONFIG.TYPE_MAPPINGS[tag] || 'Other';
    }

    /**
     * Extract function-related content from conversation
     */
    extractFunctions(data) {
        const functions = [];
        const messages = data.messages || [];
        
        for (const msg of messages) {
            const content = msg.content || '';
            if (CONFIG.KEYWORDS.FUNCTIONS.some(keyword => content.toLowerCase().includes(keyword))) {
                const sentences = content.split('.');
                for (const sentence of sentences) {
                    if (CONFIG.KEYWORDS.FUNCTIONS.some(keyword => sentence.toLowerCase().includes(keyword))) {
                        if (sentence.trim()) {
                            functions.push(sentence.trim());
                        }
                    }
                }
            }
        }
        
        return functions.slice(0, CONFIG.UI.MAX_FUNCTIONS_DISPLAY);
    }

    /**
     * Extract bug fix related content from conversation
     */
    extractBugFixes(data) {
        const bugFixes = [];
        const messages = data.messages || [];
        
        for (const msg of messages) {
            const content = msg.content || '';
            if (CONFIG.KEYWORDS.BUG_FIXES.some(keyword => content.toLowerCase().includes(keyword))) {
                const sentences = content.split('.');
                for (const sentence of sentences) {
                    if (CONFIG.KEYWORDS.BUG_FIXES.some(keyword => sentence.toLowerCase().includes(keyword))) {
                        if (sentence.trim()) {
                            bugFixes.push(sentence.trim());
                        }
                    }
                }
            }
        }
        
        return bugFixes.slice(0, CONFIG.UI.MAX_BUG_FIXES_DISPLAY);
    }

    /**
     * Extract tags from data
     */
    extractTags(data) {
        const tags = [];
        const tag = data.tag || '';
        const description = data.description || '';
        const beforeCode = data.before_code || '';
        const afterCode = data.after_code || '';
        
        // Add main tag
        if (tag && tag !== 'other') {
            tags.push(tag.replace(' ', '-'));
        }
        
        // Generate code-based tags if there are code changes
        if (beforeCode || afterCode) {
            const codeTags = this.generateCodeChangeTags(beforeCode, afterCode);
            // Add relevant code tags to main tags
            codeTags.forEach(codeTag => {
                if (!tags.includes(codeTag)) {
                    tags.push(codeTag);
                }
            });
        }
        
        // Extract keywords from description
        const keywords = description.toLowerCase().split(' ');
        for (const keyword of keywords) {
            if (keyword.length > 3 && !tags.includes(keyword)) {
                tags.push(keyword);
            }
        }
        
        return tags.slice(0, CONFIG.UI.MAX_TAGS_DISPLAY);
    }

    /**
     * Format code changes for side-by-side comparison
     */
    formatCodeChanges(beforeCode, afterCode) {
        if (!beforeCode && !afterCode) {
            return '// No code changes detected';
        }
        
        // Generate tags based on code changes
        const codeTags = this.generateCodeChangeTags(beforeCode, afterCode);
        
        // Return object for side-by-side comparison
        return {
            type: 'side_by_side',
            before: beforeCode || '',
            after: afterCode || '',
            tags: codeTags
        };
    }

    /**
     * Generate tags based on code changes
     */
    generateCodeChangeTags(beforeCode, afterCode) {
        const tags = [];
        
        // Analyze code changes to generate relevant tags
        if (beforeCode && afterCode) {
            // Code modification
            tags.push('modified');
            
            // Check for specific patterns
            if (this.containsFunction(beforeCode) && this.containsFunction(afterCode)) {
                tags.push('function');
            }
            
            if (this.containsClass(beforeCode) && this.containsClass(afterCode)) {
                tags.push('class');
            }
            
            if (this.containsImport(beforeCode) || this.containsImport(afterCode)) {
                tags.push('import');
            }
            
            if (this.containsAPI(beforeCode) || this.containsAPI(afterCode)) {
                tags.push('api');
            }
            
            if (this.containsDatabase(beforeCode) || this.containsDatabase(afterCode)) {
                tags.push('database');
            }
            
            if (this.containsUI(beforeCode) || this.containsUI(afterCode)) {
                tags.push('ui');
            }
            
            // Extract function/class names
            const functionNames = this.extractFunctionNames(afterCode);
            functionNames.forEach(name => {
                if (name.length > 2) {
                    tags.push(`\`${name}\``);
                }
            });
            
            // Extract file names from comments or strings
            const fileNames = this.extractFileNames(afterCode);
            fileNames.forEach(fileName => {
                if (fileName.length > 2) {
                    tags.push(`\`${fileName}\``);
                }
            });
            
        } else if (afterCode && !beforeCode) {
            // New code addition
            tags.push('added');
            tags.push('new');
            
            if (this.containsFunction(afterCode)) {
                tags.push('function');
            }
            
            if (this.containsClass(afterCode)) {
                tags.push('class');
            }
        } else if (beforeCode && !afterCode) {
            // Code removal
            tags.push('removed');
            tags.push('deleted');
        }
        
        return [...new Set(tags)].slice(0, 8); // Remove duplicates and limit to 8 tags
    }

    /**
     * Helper methods to analyze code content
     */
    containsFunction(code) {
        return /def\s+\w+\s*\(/.test(code);
    }
    
    containsClass(code) {
        return /class\s+\w+/.test(code);
    }
    
    containsImport(code) {
        return /import\s+\w+/.test(code) || /from\s+\w+\s+import/.test(code);
    }
    
    containsAPI(code) {
        return /api|endpoint|route|request|response/i.test(code);
    }
    
    containsDatabase(code) {
        return /database|db|sql|query|table|model/i.test(code);
    }
    
    containsUI(code) {
        return /ui|component|render|display|button|form|input/i.test(code);
    }
    
    extractFunctionNames(code) {
        const matches = code.match(/def\s+(\w+)\s*\(/g);
        return matches ? matches.map(match => match.replace(/def\s+(\w+)\s*\(/, '$1')) : [];
    }
    
    extractFileNames(code) {
        const matches = code.match(/['"`]([^'"`]*\.(py|js|ts|jsx|tsx|html|css|json|md))['"`]/g);
        return matches ? matches.map(match => match.replace(/['"`]/g, '')) : [];
    }

    /**
     * Generate impact description
     */
    generateImpactDescription(tag, description) {
        return CONFIG.IMPACT_DESCRIPTIONS[tag] || 'Had a positive impact on project development';
    }

    /**
     * Process raw project data into formatted project summary
     */
    processProjectData(data, index) {
        return {
            id: data.conversation_id || `project-${index + 1}`,
            projectName: data.project_name || CONFIG.DEFAULTS.UNKNOWN_PROJECT,
            title: data.title || `Update ${index + 1}`,
            summary: data.summary || data.description || '',
            type: this.getTypeFromTag(data.tag || 'other'),
            timestamp: data.created_at || new Date().toISOString(),
            aiModel: CONFIG.DEFAULTS.AI_MODEL,
            functions: this.extractFunctions(data),
            bugFixes: this.extractBugFixes(data),
            tags: this.extractTags(data),
            codeChanges: this.formatCodeChanges(data.before_code || '', data.after_code || ''),
            impact: this.generateImpactDescription(data.tag || 'other', data.description || ''),
            messageCount: data.message_count || 0,
            participants: data.participants || []
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
} else {
    window.DataManager = DataManager;
}
