// Data Loader for SISR Project
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    /**
     * Load JSON data from a file with caching
     * @param {string} url - The URL of the JSON file
     * @param {boolean} useCache - Whether to use cached data
     * @returns {Promise<Object>} The loaded JSON data
     */
    async loadJSON(url, useCache = true) {
        // Check cache first
        if (useCache && this.cache.has(url)) {
            return this.cache.get(url);
        }

        // Check if already loading
        if (this.loadingPromises.has(url)) {
            return await this.loadingPromises.get(url);
        }

        // Create loading promise
        const loadingPromise = this.fetchJSON(url);
        this.loadingPromises.set(url, loadingPromise);

        try {
            const data = await loadingPromise;
            
            // Cache the result
            if (useCache) {
                this.cache.set(url, data);
            }
            
            return data;
        } finally {
            // Clean up loading promise
            this.loadingPromises.delete(url);
        }
    }

    /**
     * Fetch JSON data from URL
     * @param {string} url - The URL to fetch from
     * @returns {Promise<Object>} The JSON data
     */
    async fetchJSON(url) {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Successfully loaded data from ${url}`);
            return data;
        } catch (error) {
            console.error(`Failed to load JSON from ${url}:`, error);
            throw error;
        }
    }

    /**
     * Load multiple JSON files concurrently
     * @param {Object} urls - Object with keys as names and values as URLs
     * @param {boolean} useCache - Whether to use cached data
     * @returns {Promise<Object>} Object with loaded data
     */
    async loadMultipleJSON(urls, useCache = true) {
        const promises = Object.entries(urls).map(async ([key, url]) => {
            try {
                const data = await this.loadJSON(url, useCache);
                return [key, data];
            } catch (error) {
                console.error(`Failed to load ${key} from ${url}:`, error);
                return [key, null];
            }
        });

        const results = await Promise.all(promises);
        return Object.fromEntries(results);
    }

    /**
     * Load configuration data
     * @returns {Promise<Object>} Configuration object
     */
    async loadConfig() {
        try {
            const config = await this.loadJSON('./data/config.json');
            
            // Validate required config fields
            const requiredFields = ['siteName', 'version'];
            const missingFields = requiredFields.filter(field => !config[field]);
            
            if (missingFields.length > 0) {
                console.warn('Missing required config fields:', missingFields);
            }
            
            return config;
        } catch (error) {
            console.error('Failed to load configuration:', error);
            // Return default config
            return {
                siteName: 'SISR Project',
                version: '1.0.0',
                theme: 'default'
            };
        }
    }

    /**
     * Load content data with validation
     * @returns {Promise<Object>} Content object
     */
    async loadContent() {
        try {
            const content = await this.loadJSON('./data/content.json');
            
            // Validate content structure
            this.validateContentStructure(content);
            
            return content;
        } catch (error) {
            console.error('Failed to load content:', error);
            return this.getDefaultContent();
        }
    }

    /**
     * Load team data
     * @returns {Promise<Object>} Team data object
     */
    async loadTeam() {
        try {
            const team = await this.loadJSON('./data/team.json');
            
            // Validate team members
            if (team.members && Array.isArray(team.members)) {
                team.members = team.members.filter(member => 
                    member.name && member.role
                );
            }
            
            return team;
        } catch (error) {
            console.error('Failed to load team data:', error);
            return { members: [] };
        }
    }

    /**
     * Validate content structure
     * @param {Object} content - Content object to validate
     */
    validateContentStructure(content) {
        const requiredSections = ['hero', 'research', 'downloads'];
        const missingSections = requiredSections.filter(section => !content[section]);
        
        if (missingSections.length > 0) {
            console.warn('Missing content sections:', missingSections);
        }
        
        // Validate hero section
        if (content.hero && (!content.hero.title || !content.hero.description)) {
            console.warn('Hero section missing title or description');
        }
        
        // Validate research section
        if (content.research && !Array.isArray(content.research.items)) {
            console.warn('Research section should have an items array');
        }
    }

    /**
     * Get default content structure
     * @returns {Object} Default content object
     */
    getDefaultContent() {
        return {
            hero: {
                title: 'SISR Project',
                description: 'Single Image Super-Resolution Research'
            },
            research: {
                title: 'Research Overview',
                items: []
            },
            downloads: {
                title: 'Downloads',
                items: []
            }
        };
    }

    /**
     * Save data to local storage
     * @param {string} key - Storage key
     * @param {Object} data - Data to save
     */
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Data saved to localStorage with key: ${key}`);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    /**
     * Load data from local storage
     * @param {string} key - Storage key
     * @returns {Object|null} Loaded data or null
     */
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    }

    /**
     * Clear cache
     * @param {string} url - Specific URL to clear, or clear all if not provided
     */
    clearCache(url = null) {
        if (url) {
            this.cache.delete(url);
            console.log(`Cache cleared for ${url}`);
        } else {
            this.cache.clear();
            console.log('All cache cleared');
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            loadingPromises: this.loadingPromises.size
        };
    }

    /**
     * Preload all data files
     * @returns {Promise<Object>} All loaded data
     */
    async preloadAll() {
        console.log('Preloading all data files...');
        
        const dataUrls = {
            config: './data/config.json',
            content: './data/content.json',
            team: './data/team.json'
        };

        try {
            const allData = await this.loadMultipleJSON(dataUrls);
            console.log('All data preloaded successfully');
            return allData;
        } catch (error) {
            console.error('Failed to preload data:', error);
            throw error;
        }
    }

    /**
     * Refresh data by clearing cache and reloading
     * @param {string} url - URL to refresh
     * @returns {Promise<Object>} Refreshed data
     */
    async refreshData(url) {
        this.clearCache(url);
        return await this.loadJSON(url, false);
    }

    /**
     * Load data with retry mechanism
     * @param {string} url - URL to load from
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} delay - Delay between retries in ms
     * @returns {Promise<Object>} Loaded data
     */
    async loadWithRetry(url, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.loadJSON(url, false);
            } catch (error) {
                console.warn(`Attempt ${attempt} failed for ${url}:`, error.message);
                
                if (attempt === maxRetries) {
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.DataLoader = DataLoader;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
