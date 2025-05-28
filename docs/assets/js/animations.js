// animations.js - Advanced animations and visual effects
class AnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeTextAnimations();
        this.initializeCardAnimations();
        this.initializeCounters();
        this.initializeParticleEffects();
        this.initializeHoverEffects();
        this.initializeLoadingAnimations();
    }
    
    // Text typing animation
    initializeTextAnimations() {
        const typingElements = document.querySelectorAll('.typing-text');
        typingElements.forEach(element => {
            this.typeWriter(element);
        });
        
        // Fade in text animation
        const fadeTextElements = document.querySelectorAll('.fade-text');
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateText(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        fadeTextElements.forEach(el => textObserver.observe(el));
    }
    
    typeWriter(element, speed = 50) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
    
    animateText(element) {
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all 0.6s ease ${index * 0.1}s`;
            element.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 100);
        });
    }
    
    // Card animations
    initializeCardAnimations() {
        const cards = document.querySelectorAll('.card, .research-card, .team-card');
        
        cards.forEach(card => {
            // Hover animation
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
        });
        
        // Stagger animation for cards
        this.staggerCards();
    }
    
    animateCardHover(card, isHover) {
        if (isHover) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        }
    }
    
    staggerCards() {
        const cardContainers = document.querySelectorAll('.row');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.card, .col-md-4, .col-lg-3');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.2 });
        
        cardContainers.forEach(container => {
            const cards = container.querySelectorAll('.card, .col-md-4, .col-lg-3');
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
            });
            observer.observe(container);
        });
    }
    
    // Counter animations
    initializeCounters() {
        const counters = document.querySelectorAll('.counter, [data-count]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count') || element.textContent);
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
    
    // Particle effects for hero section
    initializeParticleEffects() {
        const heroSection = document.querySelector('.hero-section, #home');
        if (heroSection) {
            this.createParticles(heroSection);
        }
    }
    
    createParticles(container) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;
        
        container.style.position = 'relative';
        container.appendChild(particlesContainer);
        
        for (let i = 0; i < 50; i++) {
            this.createParticle(particlesContainer);
        }
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float ${Math.random() * 3 + 3}s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        
        container.appendChild(particle);
        
        // Add floating animation
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes float {
                    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Advanced hover effects
    initializeHoverEffects() {
        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
            });
        });
        
        // Image hover effects
        const images = document.querySelectorAll('.hover-zoom img');
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1)';
            });
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });
    }
    
    createRippleEffect(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = diameter + 'px';
        circle.style.left = event.clientX - button.offsetLeft - radius + 'px';
        circle.style.top = event.clientY - button.offsetTop - radius + 'px';
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
        
        // Add ripple styles if not exists
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                }
                
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Loading animations
    initializeLoadingAnimations() {
        // Page load animation
        window.addEventListener('load', () => {
            this.fadeInPage();
        });
        
        // Skeleton loading for images
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.lazyLoadImage(img);
        });
    }
    
    fadeInPage() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
    
    lazyLoadImage(img) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('loading');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        img.classList.add('loading');
        imageObserver.observe(img);
        
        // Add loading styles
        if (!document.getElementById('loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .loading {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }
                
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});

// Scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.initScrollAnimations();
    }
    
    initScrollAnimations() {
        // Progress bar animation on scroll
        window.addEventListener('scroll', () => {
            this.updateProgressBar();
            this.parallaxElements();
        });
    }
    
    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = progress + '%';
        }
    }
    
    parallaxElements() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
});