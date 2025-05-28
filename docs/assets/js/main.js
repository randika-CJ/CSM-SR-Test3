// Main JavaScript file for SISR Project
class SISRApp {
    constructor() {
        this.components = {};
        this.data = {};
        this.init();
    }

    async init() {
        try {
            // Load components first
            await this.loadComponents();
            
            // Load data
            await this.loadData();
            
            // Initialize animations
            this.initializeAnimations();
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('SISR App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize SISR App:', error);
        }
    }

    async loadComponents() {
        const componentLoader = new ComponentLoader();
        
        const componentPaths = {
            header: './components/header.html',
            hero: './components/hero.html',
            research: './components/research.html',
            footer: './components/footer.html'
        };

        for (const [name, path] of Object.entries(componentPaths)) {
            try {
                this.components[name] = await componentLoader.loadComponent(path);
                console.log(`Component '${name}' loaded successfully`);
            } catch (error) {
                console.error(`Failed to load component '${name}':`, error);
            }
        }
    }

    async loadData() {
        const dataLoader = new DataLoader();
        
        try {
            this.data.config = await dataLoader.loadJSON('./data/config.json');
            this.data.content = await dataLoader.loadJSON('./data/content.json');
            this.data.team = await dataLoader.loadJSON('./data/team.json');
            
            // Populate content into components
            this.populateContent();
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    populateContent() {
        // Update hero section
        const heroSection = document.getElementById('home');
        if (heroSection && this.data.content) {
            const heroTitle = heroSection.querySelector('h1');
            const heroDescription = heroSection.querySelector('p');
            
            if (this.data.content.hero) {
                if (heroTitle) heroTitle.textContent = this.data.content.hero.title || heroTitle.textContent;
                if (heroDescription) heroDescription.textContent = this.data.content.hero.description || heroDescription.textContent;
            }
        }

        // Update research section
        const researchSection = document.getElementById('research');
        if (researchSection && this.data.content && this.data.content.research) {
            const researchTitle = researchSection.querySelector('h2');
            const researchContent = researchSection.querySelector('.research-content');
            
            if (researchTitle) researchTitle.textContent = this.data.content.research.title || researchTitle.textContent;
            
            if (researchContent && this.data.content.research.items) {
                researchContent.innerHTML = this.data.content.research.items.map(item => `
                    <div class="research-item">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `).join('');
            }
        }

        // Update team section
        const teamSection = document.getElementById('team');
        if (teamSection && this.data.team) {
            const teamGrid = teamSection.querySelector('.team-grid');
            if (teamGrid && this.data.team.members) {
                teamGrid.innerHTML = this.data.team.members.map(member => `
                    <div class="team-member">
                        <img src="${member.image || './assets/images/default-avatar.png'}" alt="${member.name}">
                        <h3>${member.name}</h3>
                        <p>${member.role}</p>
                        <p>${member.description || ''}</p>
                    </div>
                `).join('');
            }
        }

        // Update downloads section
        const downloadsSection = document.getElementById('downloads');
        if (downloadsSection && this.data.content && this.data.content.downloads) {
            const downloadsList = downloadsSection.querySelector('.downloads-list');
            if (downloadsList && this.data.content.downloads.items) {
                downloadsList.innerHTML = this.data.content.downloads.items.map(item => `
                    <div class="download-item">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <a href="${item.url}" class="download-btn" download>Download</a>
                    </div>
                `).join('');
            }
        }
    }

    initializeAnimations() {
        if (window.AnimationManager) {
            this.animationManager = new AnimationManager();
            this.animationManager.init();
        }
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                }
            });
        });

        // Progress bar update on scroll
        window.addEventListener('scroll', this.updateProgressBar.bind(this));
        
        // Contact form submission
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }
    }

    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }
    }

    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Contact form submitted:', data);
        
        // Show success message
        this.showMessage('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        e.target.reset();
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Public methods for external access
    getComponent(name) {
        return this.components[name];
    }

    getData(key) {
        return this.data[key];
    }

    updateContent(section, content) {
        if (this.data.content) {
            this.data.content[section] = { ...this.data.content[section], ...content };
            this.populateContent();
        }
    }
}

// Component Loader Class
class ComponentLoader {
    async loadComponent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading component from ${path}:`, error);
            throw error;
        }
    }

    async injectComponent(containerId, componentHTML) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = componentHTML;
        } else {
            console.warn(`Container with ID '${containerId}' not found`);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sisrApp = new SISRApp();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SISRApp, ComponentLoader };
}
