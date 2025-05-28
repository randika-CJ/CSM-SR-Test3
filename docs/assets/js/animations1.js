// Animations Manager for SISR Project
class AnimationManager {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        this.scrollPosition = 0;
        this.isInitialized = false;
    }

    /**
     * Initialize the animation system
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.initializeProgressBar();
        
        this.isInitialized = true;
        console.log('Animation Manager initialized');
    }

    /**
     * Setup Intersection Observer for scroll-triggered animations
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(
            '.hero-section, .section, .research-item, .team-member, .download-item, .animate-on-scroll'
        );

        animatableElements.forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    /**
     * Trigger animation for an element
     * @param {HTMLElement} element - Element to animate
     */
    triggerAnimation(element) {
        if (this.animatedElements.has(element)) return;

        const animationType = element.dataset.animation || this.getDefaultAnimation(element);
        
        switch (animationType) {
            case 'fadeInUp':
                this.fadeInUp(element);
                break;
            case 'fadeInLeft':
                this.fadeInLeft(element);
                break;
            case 'fadeInRight':
                this.fadeInRight(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            case 'slideInDown':
                this.slideInDown(element);
                break;
            default:
                this.fadeIn(element);
        }

        this.animatedElements.add(element);
    }

    /**
     * Get default animation based on element type
     * @param {HTMLElement} element - Element to check
     * @returns {string} Animation type
     */
    getDefaultAnimation(element) {
        if (element.classList.contains('hero-section')) return 'fadeInUp';
        if (element.classList.contains('research-item')) return 'fadeInLeft';
        if (element.classList.contains('team-member')) return 'scaleIn';
        if (element.classList.contains('download-item')) return 'fadeInRight';
        return 'fadeIn';
    }

    /**
     * Fade in animation
     * @param {HTMLElement} element - Element to animate
     */
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.8s ease-in-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    /**
     * Fade in up animation
     * @param {HTMLElement} element - Element to animate
     */
    fadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Fade in left animation
     * @param {HTMLElement} element - Element to animate
     */
    fadeInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    /**
     * Fade in right animation
     * @param {HTMLElement} element - Element to animate
     */
    fadeInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    /**
     * Scale in animation
     * @param {HTMLElement} element - Element to animate
     */
    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    /**
     * Slide in down animation
     * @param {HTMLElement} element - Element to animate
     */
    slideInDown(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Setup scroll-based animations
     */
    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            this.scrollPosition = window.pageYOffset;
            this.updateParallaxElements();
            this.updateProgressBar();
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        });
    }

    /**
     * Update parallax elements based on scroll
     */
    updateParallaxElements() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(this.scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    /**
     * Update progress bar
     */
    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = `${scrolled}%`;
    }

    /**
     * Initialize progress bar
     */
    initializeProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.transition = 'width 0.3s ease';
        }
    }

    /**
     * Setup hover animations
     */
    setupHoverAnimations() {
        // Card hover effects
        const cards = document.querySelectorAll('.research-item, .team-member, .download-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.cardHoverIn(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.cardHoverOut(card);
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn, .download-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.buttonHoverIn(button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.buttonHoverOut(button);
            });
        });

        // Navigation link effects
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.navLinkHoverIn(link);
            });
            
            link.addEventListener('mouseleave', () => {
                this.navLinkHoverOut(link);
            });
        });
    }

    /**
     * Card hover in animation
     * @param {HTMLElement} card - Card element
     */
    cardHoverIn(card) {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = 'translateY(-5px) scale(1.02)';
        card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    }

    /**
     * Card hover out animation
     * @param {HTMLElement} card - Card element
     */
    cardHoverOut(card) {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }

    /**
     * Button hover in animation
     * @param {HTMLElement} button - Button element
     */
    buttonHoverIn(button) {
        button.style.transition = 'all 0.3s ease';
        button.style.transform = 'translateY(-2px)';
        button.style.filter = 'brightness(1.1)';
    }

    /**
     * Button hover out animation
     * @param {HTMLElement} button - Button element
     */
    buttonHoverOut(button) {
        button.style.transform = 'translateY(0)';
        button.style.filter = 'brightness(1)';
    }

    /**
     * Navigation link hover in animation
     * @param {HTMLElement} link - Link element
     */
    navLinkHoverIn(link) {
        link.style.transition = 'color 0.3s ease';
        link.style.color = '#007bff';
    }

    /**
     * Navigation link hover out animation
     * @param {HTMLElement} link - Link element
     */
    navLinkHoverOut(link) {
        link.style.color = '';
    }

    /**
     * Setup loading animations
     */
    setupLoadingAnimations() {
        // Logo animation on load
        const logo = document.querySelector('.logo');
        if (logo) {
            this.animateLogo(logo);
        }

        // Hero section animation
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            this.animateHeroSection(heroSection);
        }

        // Staggered animation for navigation items
        const navItems = document.querySelectorAll('.nav-menu li');
        this.staggerAnimation(navItems, 'fadeInDown', 100);
    }

    /**
     * Animate logo on page load
     * @param {HTMLElement} logo - Logo element
     */
    animateLogo(logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.5) rotate(-180deg)';
        logo.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }

    /**
     * Animate hero section on page load
     * @param {HTMLElement} heroSection - Hero section element
     */
    animateHeroSection(heroSection) {
        const title = heroSection.querySelector('h1');
        const subtitle = heroSection.querySelector('p');
        const cta = heroSection.querySelector('.btn');

        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            title.style.transition = 'all 0.8s ease-out';
            
            setTimeout(() => {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 500);
        }

        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(30px)';
            subtitle.style.transition = 'all 0.8s ease-out';
            
            setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 700);
        }

        if (cta) {
            cta.style.opacity = '0';
            cta.style.transform = 'translateY(30px)';
            cta.style.transition = 'all 0.8s ease-out';
            
            setTimeout(() => {
                cta.style.opacity = '1';
                cta.style.transform = 'translateY(0)';
            }, 900);
        }
    }

    /**
     * Staggered animation for multiple elements
     * @param {NodeList} elements - Elements to animate
     * @param {string} animationType - Type of animation
     * @param {number} delay - Delay between each element
     */
    staggerAnimation(elements, animationType = 'fadeInUp', delay = 100) {
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = this.getInitialTransform(animationType);
            element.style.transition = 'all 0.6s ease-out';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'none';
            }, index * delay);
        });
    }

    /**
     * Get initial transform for animation type
     * @param {string} animationType - Type of animation
     * @returns {string} Initial transform value
     */
    getInitialTransform(animationType) {
        switch (animationType) {
            case 'fadeInUp':
                return 'translateY(20px)';
            case 'fadeInDown':
                return 'translateY(-20px)';
            case 'fadeInLeft':
                return 'translateX(-20px)';
            case 'fadeInRight':
                return 'translateX(20px)';
            case 'scaleIn':
                return 'scale(0.8)';
            default:
                return 'translateY(20px)';
        }
    }

    /**
     * Animate typing effect for text
     * @param {HTMLElement} element - Element to animate
     * @param {string} text - Text to type
     * @param {number} speed - Typing speed in ms
     */
    typeWriter(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    }

    /**
     * Animate counter numbers
     * @param {HTMLElement} element - Element containing the number
     * @param {number} target - Target number
     * @param {number} duration - Animation duration in ms
     */
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const counter = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            }
        }, 16);
    }

    /**
     * Pulse animation for elements
     * @param {HTMLElement} element - Element to pulse
     * @param {number} duration - Pulse duration
     */
    pulse(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    /**
     * Shake animation for elements (useful for form validation)
     * @param {HTMLElement} element - Element to shake
     */
    shake(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    /**
     * Smooth scroll to element
     * @param {HTMLElement} targetElement - Element to scroll to
     * @param {number} offset - Offset from top
     */
    smoothScrollTo(targetElement, offset = 0) {
        const targetPosition = targetElement.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    /**
     * Easing function for smooth animations
     * @param {number} t - Current time
     * @param {number} b - Start value
     * @param {number} c - Change in value
     * @param {number} d - Duration
     * @returns {number} Eased value
     */
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    /**
     * Add loading spinner animation
     * @param {HTMLElement} container - Container for spinner
     */
    showLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        container.appendChild(spinner);
        
        // Add CSS if not already added
        if (!document.querySelector('#spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'spinner-styles';
            style.textContent = `
                .loading-spinner {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Remove loading spinner
     * @param {HTMLElement} container - Container with spinner
     */
    hideLoadingSpinner(container) {
        const spinner = container.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    /**
     * Add CSS animations to document
     */
    addAnimationStyles() {
        if (document.querySelector('#animation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-fade-in {
                animation: fadeIn 0.8s ease-in-out;
            }
            
            .animate-slide-up {
                animation: slideInUp 0.8s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Destroy animation manager and clean up
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
        this.isInitialized = false;
        console.log('Animation Manager destroyed');
    }

    /**
     * Reset all animations
     */
    resetAnimations() {
        this.animatedElements.clear();
        
        // Reset all animated elements
        const elements = document.querySelectorAll('[style*="opacity"], [style*="transform"]');
        elements.forEach(element => {
            element.style.opacity = '';
            element.style.transform = '';
            element.style.transition = '';
        });
    }

    /**
     * Get animation statistics
     * @returns {Object} Animation statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            observersCount: this.observers.length,
            animatedElementsCount: this.animatedElements.size,
            currentScrollPosition: this.scrollPosition
        };
    }
}

// CSS Animation utilities
const AnimationUtils = {
    /**
     * Add bounce effect to element
     * @param {HTMLElement} element - Element to bounce
     */
    bounce(element) {
        element.style.animation = 'bounce 0.6s ease';
        setTimeout(() => element.style.animation = '', 600);
    },

    /**
     * Add flash effect to element
     * @param {HTMLElement} element - Element to flash
     */
    flash(element) {
        element.style.animation = 'flash 1s ease';
        setTimeout(() => element.style.animation = '', 1000);
    },

    /**
     * Add wobble effect to element
     * @param {HTMLElement} element - Element to wobble
     */
    wobble(element) {
        element.style.animation = 'wobble 1s ease';
        setTimeout(() => element.style.animation = '', 1000);
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AnimationManager = AnimationManager;
    window.AnimationUtils = AnimationUtils;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationManager, AnimationUtils };
}