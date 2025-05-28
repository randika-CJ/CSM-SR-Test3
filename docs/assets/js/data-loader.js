// data-loader.js - Dynamic content loading and data management
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.init();
    }
    
    init() {
        this.loadConfiguration();
        this.loadContent();
        this.loadTeamData();
        this.setupDynamicLoading();
    }
    
    // Load configuration data
    async loadConfiguration() {
        try {
            const config = await this.fetchJSON('data/config.json');
            if (config) {
                this.applyConfiguration(config);
            }
        } catch (error) {
            console.log('Using default configuration');
            this.useDefaultConfig();
        }
    }
    
    // Load main content data
    async loadContent() {
        try {
            const content = await this.fetchJSON('data/content.json');
            if (content) {
                this.populateContent(content);
            }
        } catch (error) {
            console.log('Using embedded content');
        }
    }
    
    // Load team data
    async loadTeamData() {
        try {
            const teamData = await this.fetchJSON('data/team.json');
            if (teamData) {
                this.populateTeamSection(teamData);
            }
        } catch (error) {
            console.log('Using embedded team data');
        }
    }
    
    // Generic JSON fetcher with caching
    async fetchJSON(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            this.cache.set(url, data);
            return data;
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
            return null;
        }
    }
    
    // Apply configuration settings
    applyConfiguration(config) {
        // Update site title
        if (config.site && config.site.title) {
            document.title = config.site.title;
            const titleElements = document.querySelectorAll('.site-title');
            titleElements.forEach(el => el.textContent = config.site.title);
        }
        
        // Update theme colors
        if (config.theme) {
            this.applyTheme(config.theme);
        }
        
        // Update navigation
        if (config.navigation) {
            this.updateNavigation(config.navigation);
        }
        
        // Update social links
        if (config.social) {
            this.updateSocialLinks(config.social);
        }
    }
    
    // Apply theme configuration
    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme.primaryColor) {
            root.style.setProperty('--primary-color', theme.primaryColor);
        }
        if (theme.secondaryColor) {
            root.style.setProperty('--secondary-color', theme.secondaryColor);
        }
        if (theme.accentColor) {
            root.style.setProperty('--accent-color', theme.accentColor);
        }
        if (theme.backgroundColor) {
            root.style.setProperty('--bg-color', theme.backgroundColor);
        }
    }
    
    // Update navigation from config
    updateNavigation(navigation) {
        const navList = document.querySelector('.navbar-nav');
        if (navList && navigation.items) {
            // Clear existing navigation
            navList.innerHTML = '';
            
            // Add new navigation items
            navigation.items.forEach(item => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                li.innerHTML = `
                    <a class="nav-link" href="${item.href}">${item.label}</a>
                `;
                navList.appendChild(li);
            });
        }
    }
    
    // Update social links
    updateSocialLinks(social) {
        const socialContainer = document.querySelector('.social-links');
        if (socialContainer) {
            socialContainer.innerHTML = '';
            
            Object.entries(social).forEach(([platform, url]) => {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.className = `social-link ${platform}`;
                link.innerHTML = this.getSocialIcon(platform);
                socialContainer.appendChild(link);
            });
        }
    }
    
    // Get social media icons
    getSocialIcon(platform) {
        const icons = {
            github: '<i class="fab fa-github"></i>',
            twitter: '<i class="fab fa-twitter"></i>',
            linkedin: '<i class="fab fa-linkedin"></i>',
            email: '<i class="fas fa-envelope"></i>',
            youtube: '<i class="fab fa-youtube"></i>',
            facebook: '<i class="fab fa-facebook"></i>'
        };
        return icons[platform] || '<i class="fas fa-link"></i>';
    }
    
    // Populate dynamic content
    populateContent(content) {
        // Update hero section
        if (content.hero) {
            this.updateHeroSection(content.hero);
        }
        
        // Update research section
        if (content.research) {
            this.updateResearchSection(content.research);
        }
        
        // Update publications
        if (content.publications) {
            this.updatePublications(content.publications);
        }
        
        // Update downloads
        if (content.downloads) {
            this.updateDownloads(content.downloads);
        }
    }
    
    // Update hero section content
    updateHeroSection(hero) {
        const titleEl = document.querySelector('.hero-title, .display-1');
        const subtitleEl = document.querySelector('.hero-subtitle, .lead');
        const descriptionEl = document.querySelector('.hero-description');
        
        if (titleEl && hero.title) titleEl.textContent = hero.title;
        if (subtitleEl && hero.subtitle) subtitleEl.textContent = hero.subtitle;
        if (descriptionEl && hero.description) descriptionEl.textContent = hero.description;
    }
    
    // Update research section
    updateResearchSection(research) {
        const researchContainer = document.querySelector('#research .row');
        if (researchContainer && research.items) {
            researchContainer.innerHTML = '';
            
            research.items.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4 mb-4';
                col.innerHTML = `
                    <div class="card h-100" data-aos="fade-up">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            ${item.tags ? `<div class="tags">${item.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('')}</div>` : ''}
                        </div>
                    </div>
                `;
                researchContainer.appendChild(col);
            });
        }
    }
    
    // Update publications
    updatePublications(publications) {
        const pubContainer = document.querySelector('#publications .publications-list');
        if (pubContainer && publications.items) {
            pubContainer.innerHTML = '';
            
            publications.items.forEach(pub => {
                const pubItem = document.createElement('div');
                pubItem.className = 'publication-item mb-4 p-3 border rounded';
                pubItem.innerHTML = `
                    <h6 class="publication-title">${pub.title}</h6>
                    <p class="publication-authors text-muted">${pub.authors}</p>
                    <p class="publication-venue"><em>${pub.venue}</em> ${pub.year}</p>
                    ${pub.abstract ? `<p class="publication-abstract">${pub.abstract}</p>` : ''}
                    <div class="publication-links">
                        ${pub.pdf ? `<a href="${pub.pdf}" class="btn btn-sm btn-outline-primary me-2">PDF</a>` : ''}
                        ${pub.code ? `<a href="${pub.code}" class="btn btn-sm btn-outline-secondary me-2">Code</a>` : ''}
                        ${pub.demo ? `<a href="${pub.demo}" class="btn btn-sm btn-outline-success">Demo</a>` : ''}
                    </div>
                `;
                pubContainer.appendChild(pubItem);
            });
        }
    }
    
    // Update downloads section
    updateDownloads(downloads) {
        const downloadContainer = document.querySelector('#downloads .row');
        if (downloadContainer && downloads.items) {
            downloadContainer.innerHTML = '';
            
            downloads.items.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4 mb-4';
                col.innerHTML = `
                    <div class="card h-100" data-aos="fade-up">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="text-muted">
                                <small>Size: ${item.size || 'N/A'} | Version: ${item.version || '1.0'}</small>
                            </p>
                        </div>
                        <div class="card-footer">
                            <a href="${item.url}" class="btn btn-primary btn-sm" download>
                                <i class="fas fa-download me-1"></i>Download
                            </a>
                            ${item.docs ? `<a href="${item.docs}" class="btn btn-outline-secondary btn-sm ms-2">Docs</a>` : ''}
                        </div>
                    </div>
                `;
                downloadContainer.appendChild(col);
            });
        }
    }
    
    // Populate team section
    populateTeamSection(teamData) {
        const teamContainer = document.querySelector('#team .row');
        if (teamContainer && teamData.members) {
            teamContainer.innerHTML = '';
            
            teamData.members.forEach(member => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-3 mb-4';
                col.innerHTML = `
                    <div class="card team-card h-100 text-center" data-aos="fade-up">
                        <div class="card-body">
                            <img src="${member.photo || 'assets/images/default-avatar.jpg'}" 
                                 class="rounded-circle mb-3" 
                                 width="80" height="80" 
                                 alt="${member.name}">
                            <h6 class="card-title">${member.name}</h6>
                            <p class="card-text text-muted">${member.role}</p>
                            ${member.bio ? `<p class="card-text small">${member.bio}</p>` : ''}
                            <div class="social-links">
                                ${member.email ? `<a href="mailto:${member.email}" class="text-decoration-none me-2"><i class="fas fa-envelope"></i></a>` : ''}
                                ${member.github ? `<a href="${member.github}" class="text-decoration-none me-2" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                                ${member.linkedin ? `<a href="${member.linkedin}" class="text-decoration-none me-2" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                teamContainer.appendChild(col);
            });
        }
    }
    
    // Setup dynamic loading for components
    setupDynamicLoading() {
        // Load components on demand
        this.loadComponents();
        
        // Setup lazy loading for heavy content
        this.setupLazyLoading();
        
        // Setup search functionality
        this.setupSearch();
    }
    
    // Load HTML components
    async loadComponents() {
        const componentLoaders = document.querySelectorAll('[data-component]');
        
        for (const loader of componentLoaders) {
            const componentName = loader.getAttribute('data-component');
            try {
                const response = await fetch(`components/${componentName}.html`);
                if (response.ok) {
                    const html = await response.text();
                    loader.innerHTML = html;
                    loader.removeAttribute('data-component');
                    
                    // Trigger any component-specific initialization
                    this.initializeComponent(componentName, loader);
                }
            } catch (error) {
                console.error(`Error loading component ${componentName}:`, error);
            }
        }
    }
    
    // Initialize specific components
    initializeComponent(componentName, element) {
        switch (componentName) {
            case 'contact-form':
                this.initializeContactForm(element);
                break;
            case 'search-box':
                this.initializeSearchBox(element);
                break;
            case 'newsletter':
                this.initializeNewsletter(element);
                break;
        }
    }
    
    // Initialize contact form component
    initializeContactForm(element) {
        const form = element.querySelector('form');
        if (form) {
            form.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
    }
    
    // Handle contact form submission
    async handleContactSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        try {
            // Simulate API call
            await this.delay(1000);
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
        }
    }
    
    // Setup lazy loading for images and content
    setupLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy-src]');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.getAttribute('data-lazy-src');
                    
                    if (element.tagName === 'IMG') {
                        element.src = src;
                    } else {
                        element.style.backgroundImage = `url(${src})`;
                    }
                    
                    element.removeAttribute('data-lazy-src');
                    lazyObserver.unobserve(element);
                }
            });
        }, { threshold: 0.1 });
        
        lazyElements.forEach(el => lazyObserver.observe(el));
    }
    
    // Setup search functionality
    setupSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        });
    }
    
    // Handle search functionality
    handleSearch(event) {
        const query = event.target.value.toLowerCase().trim();
        const searchableElements = document.querySelectorAll('[data-searchable]');
        
        if (query === '') {
            searchableElements.forEach(el => {
                el.style.display = '';
                el.classList.remove('search-highlight');
            });
            return;
        }
        
        searchableElements.forEach(element => {
            const content = element.textContent.toLowerCase();
            if (content.includes(query)) {
                element.style.display = '';
                this.highlightText(element, query);
            } else {
                element.style.display = 'none';
            }
        });
    }
    
    // Highlight search terms
    highlightText(element, query) {
        const originalText = element.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
        element.innerHTML = highlightedText;
    }
    
    // Utility functions
    debounce(func, wait) {
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
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Show notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
        `;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Default configuration fallback
    useDefaultConfig() {
        const defaultConfig = {
            site: {
                title: "Structure-Informed Super-Resolution",
                description: "Revolutionary AI technology for scientific imaging"
            },
            theme: {
                primaryColor: "#6f42c1",
                secondaryColor: "#6c757d",
                accentColor: "#20c997"
            },
            navigation: {
                items: [
                    { label: "Home", href: "#home" },
                    { label: "Research", href: "#research" },
                    { label: "Publications", href: "#publications" },
                    { label: "Downloads", href: "#downloads" },
                    { label: "Team", href: "#team" },
                    { label: "Contact", href: "#contact" }
                ]
            }
        };
        
        this.applyConfiguration(defaultConfig);
    }
    
    // Performance monitoring
    monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
            });
        }
    }
    
    // Error handling and logging
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Optional: Send to error tracking service
        if (window.errorTracker) {
            window.errorTracker.log(error, context);
        }
    }
}

// Data storage and caching utilities
class DataCache {
    constructor() {
        this.storage = new Map();
        this.maxSize = 50;
        this.ttl = 5 * 60 * 1000; // 5 minutes
    }
    
    set(key, value) {
        const item = {
            value,
            timestamp: Date.now()
        };
        
        if (this.storage.size >= this.maxSize) {
            const firstKey = this.storage.keys().next().value;
            this.storage.delete(firstKey);
        }
        
        this.storage.set(key, item);
    }
    
    get(key) {
        const item = this.storage.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.storage.delete(key);
            return null;
        }
        
        return item.value;
    }
    
    clear() {
        this.storage.clear();
    }
}

// Initialize data loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dataLoader = new DataLoader();
    
    // Make it globally accessible for debugging
    window.dataLoader = dataLoader;
    
    // Monitor performance
    dataLoader.monitorPerformance();
});