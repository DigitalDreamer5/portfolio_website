/**
 * Portfolio Website JavaScript - Enhanced Professional Version
 * Author: Kashish Valecha
 * Description: Interactive functionality for personal portfolio website
 */

class PortfolioManager {
    constructor() {
        this.config = {
            scrollOffset: 100,
            observerThreshold: 0.3,
            stickyHeaderOffset: 100,
            animationDelay: 100,
            typewriterSpeed: 100,
            typewriterDelay: 2000
        };

        this.state = {
            isMenuOpen: false,
            currentSection: 'home',
            isScrolling: false,
            animatedElements: new Set()
        };

        this.elements = {};
        this.observers = {};
        
        this.init();
    }

    /**
     * Initialize the portfolio functionality
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupObservers();
        this.initializeAnimations();
        this.setupPreloader();
        this.initTypewriter();
        this.setupSkillBars();
        
        console.log('Portfolio initialized successfully');
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        this.elements = {
            menuToggle: document.querySelector('#menu'),
            navbar: document.querySelector('.navbar'),
            navLinks: document.querySelectorAll('header nav a'),
            sections: document.querySelectorAll('section'),
            header: document.querySelector('.header'),
            contactForm: document.querySelector('#contactForm'),
            backToTop: document.querySelector('.scroll-top'),
            preloader: document.querySelector('.preloader'),
            typewriterElement: document.querySelector('.text-animation h2'),
            skillBars: document.querySelectorAll('.bar'),
            newsletterForm: document.querySelector('.newsletter-form')
        };
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        this.elements.menuToggle?.addEventListener('click', (e) => this.toggleMobileMenu(e));

        // Navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Scroll events
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));

        // Contact form
        this.elements.contactForm?.addEventListener('submit', (e) => this.handleContactForm(e));

        // Newsletter form
        this.elements.newsletterForm?.addEventListener('submit', (e) => this.handleNewsletterForm(e));

        // Back to top button
        this.elements.backToTop?.addEventListener('click', (e) => this.scrollToTop(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Click outside to close mobile menu
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Window resize
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    }

    /**
     * Setup Intersection Observer for animations and navigation
     */
    setupObservers() {
        // Section observer for navigation and animations
        this.observers.section = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleSectionIntersection(entry.target);
                }
            });
        }, { 
            threshold: this.config.observerThreshold,
            rootMargin: `-${this.config.scrollOffset}px 0px -${this.config.scrollOffset}px 0px`
        });

        // Animate elements observer
        this.observers.animation = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe sections
        this.elements.sections.forEach(section => {
            this.observers.section.observe(section);
            this.observers.animation.observe(section);
        });

        // Observe other animated elements
        const animatedElements = document.querySelectorAll('.education-content, .skill-item, .project-card');
        animatedElements.forEach(el => this.observers.animation.observe(el));
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Add CSS for enhanced animations
        const style = document.createElement('style');
        style.textContent = `
            .animate-fade-in {
                animation: fadeInUp 0.8s ease forwards;
                opacity: 0;
                transform: translateY(30px);
            }
            
            .animate-slide-left {
                animation: slideInLeft 0.8s ease forwards;
                opacity: 0;
                transform: translateX(-30px);
            }
            
            .animate-slide-right {
                animation: slideInRight 0.8s ease forwards;
                opacity: 0;
                transform: translateX(30px);
            }
            
            .animate-scale {
                animation: scaleIn 0.6s ease forwards;
                opacity: 0;
                transform: scale(0.9);
            }
            
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInLeft {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideInRight {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes scaleIn {
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .skill-bar-animated {
                animation: fillBar 2s ease forwards;
                transform-origin: left;
            }
            
            @keyframes fillBar {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup preloader
     */
    setupPreloader() {
        if (this.elements.preloader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.elements.preloader.style.opacity = '0';
                    this.elements.preloader.style.visibility = 'hidden';
                }, 1000);
            });
        }
    }

    /**
     * Initialize typewriter effect
     */
    initTypewriter() {
        if (!this.elements.typewriterElement) return;

        const phrases = [
            'BTech Student | Aspiring Developer',
            'Frontend Enthusiast',
            'Problem Solver',
            'Creative Thinker'
        ];

        let currentPhrase = 0;
        let currentChar = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const current = phrases[currentPhrase];
            
            if (isDeleting) {
                this.elements.typewriterElement.textContent = current.substring(0, currentChar - 1);
                currentChar--;
            } else {
                this.elements.typewriterElement.textContent = current.substring(0, currentChar + 1);
                currentChar++;
            }

            let speed = isDeleting ? 50 : this.config.typewriterSpeed;

            if (!isDeleting && currentChar === current.length) {
                speed = this.config.typewriterDelay;
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
            }

            setTimeout(typeWriter, speed);
        };

        typeWriter();
    }

    /**
     * Setup skill bars animation
     */
    setupSkillBars() {
        const skillsSection = document.querySelector('#skills');
        if (!skillsSection) return;

        const skillBarsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.bar');
                    skillBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.classList.add('skill-bar-animated');
                        }, index * 200);
                    });
                    skillBarsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillBarsObserver.observe(skillsSection);
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.state.isMenuOpen = !this.state.isMenuOpen;
        this.elements.menuToggle.classList.toggle('bx-x');
        this.elements.navbar.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.state.isMenuOpen ? 'hidden' : '';
    }

    /**
     * Handle navigation clicks
     */
    handleNavigation(e) {
        e.preventDefault();
        
        const href = e.currentTarget.getAttribute('href');
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (!targetSection) return;

        this.smoothScrollTo(targetSection.offsetTop - this.config.scrollOffset);
        this.closeMobileMenu();
        this.updateActiveNavLink(href);
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        if (this.state.isScrolling) return;
        
        this.state.isScrolling = true;
        
        // Toggle sticky header
        const shouldBeSticky = window.scrollY > this.config.stickyHeaderOffset;
        this.elements.header.classList.toggle('sticky', shouldBeSticky);

        // Show/hide back to top button
        if (this.elements.backToTop) {
            const shouldShow = window.scrollY > 300;
            this.elements.backToTop.style.opacity = shouldShow ? '1' : '0';
            this.elements.backToTop.style.pointerEvents = shouldShow ? 'auto' : 'none';
        }

        requestAnimationFrame(() => {
            this.state.isScrolling = false;
        });
    }

    /**
     * Handle section intersection
     */
    handleSectionIntersection(section) {
        const id = section.getAttribute('id');
        this.state.currentSection = id;
        this.updateActiveNavLink(`#${id}`);
        
        // Add animation class
        section.classList.add('start-animation');
    }

    /**
     * Animate element when in view
     */
    animateElement(element) {
        if (this.state.animatedElements.has(element)) return;
        
        this.state.animatedElements.add(element);
        
        // Add appropriate animation class based on element type
        if (element.classList.contains('education-content')) {
            element.classList.add('animate-slide-left');
        } else if (element.classList.contains('skill-item')) {
            element.classList.add('animate-scale');
        } else if (element.classList.contains('project-card')) {
            element.classList.add('animate-fade-in');
        } else {
            element.classList.add('animate-fade-in');
        }
    }

    /**
     * Handle contact form submission
     */
    async handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateContactForm(data)) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission(data);
            
            this.showNotification('Thank you for your message! I will get back to you soon.', 'success');
            e.target.reset();
        } catch (error) {
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Handle newsletter form submission
     */
    async handleNewsletterForm(e) {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        try {
            // Simulate newsletter subscription
            await this.simulateFormSubmission({ email });
            this.showNotification('Thank you for subscribing!', 'success');
            e.target.reset();
        } catch (error) {
            this.showNotification('Subscription failed. Please try again.', 'error');
        }
    }

    /**
     * Validate contact form
     */
    validateContactForm(data) {
        const required = ['name', 'email', 'phone', 'subject', 'message'];
        
        for (const field of required) {
            if (!data[field] || data[field].trim().length === 0) {
                return false;
            }
        }

        return this.validateEmail(data.email) && this.validatePhone(data.phone);
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone format
     */
    validatePhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Simulate form submission
     */
    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', data);
                resolve();
            }, 1500);
        });
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-size: 1.4rem;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove
        setTimeout(() => this.removeNotification(notification), 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    /**
     * Remove notification
     */
    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(e) {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Handle clicks outside mobile menu
     */
    handleOutsideClick(e) {
        if (this.state.isMenuOpen && 
            !this.elements.navbar.contains(e.target) && 
            !this.elements.menuToggle.contains(e.target)) {
            this.closeMobileMenu();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Scroll to top
     */
    scrollToTop(e) {
        e.preventDefault();
        this.smoothScrollTo(0);
    }

    /**
     * Smooth scroll to position
     */
    smoothScrollTo(targetPosition) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.state.isMenuOpen = false;
        this.elements.menuToggle.classList.remove('bx-x');
        this.elements.navbar.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(activeHref) {
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeHref) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce function calls
     */
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});

// Add service worker for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

