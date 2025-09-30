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
        this.setupCertificateCards();
        this.initCertificatesData();
        
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
     * Initialize certificates data and render them
     */
    initCertificatesData() {
        // Certificate data arrays - Easy to update!
        // Add your certificate images to the 'certificates' folder
        const certificatesData = {
            techSkills: {
                title: "Tech Skill Certificates",
                icon: "fas fa-laptop-code",
                certificates: [
                    {
                        title: "Prompt Design in Vertex AI",
                        organization: "Google Cloud",
                        description: "Advanced prompt engineering and design patterns for Vertex AI applications",
                        icon: "fab fa-google",
                        tags: [
                            { name: "AI/ML", class: "ai" },
                            { name: "Cloud", class: "cloud" }
                        ],
                        image: "google-vertex-ai.jpg",
                        preview: {
                            type: "google-cert",
                            content: `
                                <div class="google-logo">Google Cloud</div>
                                <h3 class="cert-title-large">Prompt Design<br>in Vertex AI</h3>
                                <p class="cert-category">Machine Learning & AI</p>
                                <div class="skill-badge">SKILL BADGE • INTRODUCTORY</div>
                                <div class="google-colors"></div>
                            `
                        }
                    },
                    {
                        title: "Build Real World AI Applications",
                        organization: "Google Cloud",
                        description: "Building practical AI applications with Gemini and Imagen technologies",
                        icon: "fab fa-google",
                        tags: [
                            { name: "AI/ML", class: "ai" },
                            { name: "Cloud", class: "cloud" }
                        ],
                        image: "google-gemini-ai.jpg",
                        preview: {
                            type: "google-cert",
                            content: `
                                <div class="google-logo">Google Cloud</div>
                                <h3 class="cert-title-large">Build Real World AI Applications<br>with Gemini and Imagen</h3>
                                <p class="cert-category">Machine Learning & AI</p>
                                <div class="skill-badge">SKILL BADGE • INTRODUCTORY</div>
                                <div class="google-colors"></div>
                            `
                        }
                    },
                    {
                        title: "Develop GenAI Apps with Gemini and Streamlit",
                        organization: "Google Cloud",
                        description: "Building generative AI applications using Gemini and Streamlit framework",
                        icon: "fab fa-google",
                        tags: [
                            { name: "AI/ML", class: "ai" },
                            { name: "Cloud", class: "cloud" }
                        ],
                        image: "google-gemini-streamlit.jpg",
                        preview: {
                            type: "google-cert",
                            content: `
                                <div class="google-logo">Google Cloud</div>
                                <h3 class="cert-title-large">Develop GenAI Apps with<br>Gemini and Streamlit</h3>
                                <p class="cert-category">Machine Learning & AI</p>
                                <div class="skill-badge">SKILL BADGE • INTERMEDIATE</div>
                                <div class="google-colors"></div>
                            `
                        }
                    },
                    {
                        title: "Explore Generative AI with Vertex AI Gemini API",
                        organization: "Google Cloud",
                        description: "Comprehensive exploration of Vertex AI Gemini API for AI development",
                        icon: "fab fa-google",
                        tags: [
                            { name: "AI/ML", class: "ai" },
                            { name: "Cloud", class: "cloud" }
                        ],
                        image: "google-vertex-gemini-api.jpg",
                        preview: {
                            type: "google-cert",
                            content: `
                                <div class="google-logo">Google Cloud</div>
                                <h3 class="cert-title-large">Explore Generative AI with<br>the Vertex AI Gemini API</h3>
                                <p class="cert-category">Machine Learning & AI</p>
                                <div class="skill-badge">SKILL BADGE • INTERMEDIATE</div>
                                <div class="google-colors"></div>
                            `
                        }
                    },
                    {
                        title: "Inspect Rich Documents with Gemini Multimodality",
                        organization: "Google Cloud",
                        description: "Advanced document processing using Gemini's multimodal capabilities",
                        icon: "fab fa-google",
                        tags: [
                            { name: "AI/ML", class: "ai" },
                            { name: "Cloud", class: "cloud" }
                        ],
                        image: "google-gemini-documents.jpg",
                        preview: {
                            type: "google-cert",
                            content: `
                                <div class="google-logo">Google Cloud</div>
                                <h3 class="cert-title-large">Inspect Rich Documents with Gemini<br>Multimodality and Multimodal RAG</h3>
                                <p class="cert-category">Machine Learning & AI</p>
                                <div class="skill-badge">SKILL BADGE • INTERMEDIATE</div>
                                <div class="google-colors"></div>
                            `
                        }
                    },
                    {
                        title: "SAWIT.AI Learnathon",
                        organization: "GUVI (An HCL Group Company)",
                        description: "Comprehensive training in Generative AI fundamentals and applications",
                        icon: "fas fa-brain",
                        tags: [
                            { name: "AI/ML", class: "ai" },
                            { name: "Gen AI", class: "ml" }
                        ],
                        image: "guvi-sawit-ai.jpg",
                        preview: {
                            type: "guvi-cert",
                            content: `
                                <div class="cert-logos">
                                    <div class="guvi-logo">GUVI</div>
                                    <div class="partners">SAWIT.AI Learnathon</div>
                                </div>
                                <h3 class="cert-name">Kashish Valecha</h3>
                                <p class="cert-course">Generative AI Fundamentals</p>
                                <p class="cert-detail">HCL Group Company Partnership</p>
                                <div class="cert-date-badge">September 2024</div>
                            `
                        }
                    },
                    {
                        title: "Red Hat OpenShift Applications",
                        organization: "Red Hat Academy",
                        description: "Container orchestration and OpenShift platform fundamentals",
                        icon: "fab fa-redhat",
                        tags: [
                            { name: "DevOps", class: "devops" },
                            { name: "Cloud", class: "cloud" }
                        ],
                        image: "redhat-openshift.jpg",
                        preview: {
                            type: "redhat-cert",
                            content: `
                                <div class="redhat-logo">🎩 Red Hat</div>
                                <p class="cert-type">Certificate of attendance</p>
                                <h3 class="cert-name">KASHISH VALECHA</h3>
                                <p class="cert-course">Introduction to Red Hat OpenShift Applications (DO101 - RHA)<br>- Ver. 4.6</p>
                                <p class="cert-date">September 06, 2025</p>
                                <p class="credit-hours">Credit hours: 8</p>
                            `
                        }
                    },
                    {
                        title: "Getting Started with Linux Fundamentals",
                        organization: "Red Hat Training",
                        description: "Linux operating system fundamentals and command-line proficiency",
                        icon: "fab fa-redhat",
                        tags: [
                            { name: "Linux", class: "devops" },
                            { name: "DevOps", class: "tools" }
                        ],
                        image: "redhat-linux.jpg",
                        preview: {
                            type: "redhat-cert",
                            content: `
                                <div class="redhat-logo">🎩 Red Hat</div>
                                <p class="cert-type">Certificate of attendance</p>
                                <h3 class="cert-name">KASHISH VALECHA</h3>
                                <p class="cert-course">Red Hat Training: Getting Started with Linux Fundamentals<br>(RH104 - RHA) - Ver. 9.1</p>
                                <p class="cert-date">September 05, 2025</p>
                                <p class="credit-hours">Credit hours: 16</p>
                            `
                        }
                    },
                    {
                        title: "Version Control with Git",
                        organization: "Meta (Coursera)",
                        description: "Professional Git workflow and version control mastery",
                        icon: "fab fa-meta",
                        tags: [
                            { name: "Dev Tools", class: "tools" },
                            { name: "Web Dev", class: "web" }
                        ],
                        image: "meta-git.jpg",
                        preview: {
                            type: "meta-cert",
                            content: `
                                <div class="meta-logo">∞ Meta</div>
                                <div class="course-badge">COURSE CERTIFICATE</div>
                                <h3 class="cert-name">KASHISH VALECHA</h3>
                                <p class="cert-course">Version Control</p>
                                <p class="cert-provider-text">an online non-credit course authorized by Meta and offered through Coursera</p>
                                <div class="coursera-seal">coursera</div>
                            `
                        }
                    },
                    {
                        title: "Introduction to Front-End Development",
                        organization: "Meta (Coursera)",
                        description: "Comprehensive frontend development fundamentals and modern web technologies",
                        icon: "fab fa-meta",
                        tags: [
                            { name: "Web Dev", class: "web" },
                            { name: "Frontend", class: "programming" }
                        ],
                        image: "meta-frontend.jpg",
                        preview: {
                            type: "meta-cert",
                            content: `
                                <div class="meta-logo">∞ Meta</div>
                                <div class="course-badge">COURSE CERTIFICATE</div>
                                <h3 class="cert-name">KASHISH VALECHA</h3>
                                <p class="cert-course">Introduction to Front-End Development</p>
                                <p class="cert-provider-text">an online non-credit course authorized by Meta and offered through Coursera</p>
                                <div class="coursera-seal">coursera</div>
                            `
                        }
                    },
                    {
                        title: "Introduction to Operating Systems",
                        organization: "University of Colorado Boulder (Coursera)",
                        description: "Comprehensive study of operating system concepts and system programming",
                        icon: "fas fa-server",
                        tags: [
                            { name: "Operating Systems", class: "programming" },
                            { name: "System Programming", class: "tools" }
                        ],
                        image: "colorado-operating-systems.jpg",
                        preview: {
                            type: "placeholder colorado-cert",
                            content: `
                                <i class="fas fa-server"></i>
                                <h5>Operating Systems</h5>
                                <p>University of Colorado Boulder</p>
                            `
                        }
                    },
                    {
                        title: "Programming with C++",
                        organization: "Simplilearn (Coursera)",
                        description: "Advanced C++ programming concepts and object-oriented programming",
                        icon: "fas fa-terminal",
                        tags: [
                            { name: "Programming", class: "programming" },
                            { name: "C++", class: "tools" }
                        ],
                        image: "simplilearn-cpp.jpg",
                        preview: {
                            type: "placeholder",
                            content: `
                                <i class="fas fa-code"></i>
                                <h5>C++ Programming</h5>
                                <p>Simplilearn Certified</p>
                            `
                        }
                    },
                    {
                        title: "C++ Training Completion",
                        organization: "EduPyramids (Spoken Tutorial Project, IIT Bombay)",
                        description: "Comprehensive C++ programming training with practical implementation",
                        icon: "fas fa-graduation-cap",
                        tags: [
                            { name: "Programming", class: "programming" },
                            { name: "C++", class: "tools" }
                        ],
                        image: "edupyramids-cpp.jpg",
                        preview: {
                            type: "placeholder",
                            content: `
                                <i class="fas fa-certificate"></i>
                                <h5>C++ Training</h5>
                                <p>EduPyramids Certified</p>
                            `
                        }
                    }
                ]
            },
            professionalSkills: {
                title: "Professional Skills",
                icon: "fas fa-user-tie",
                certificates: [
                    {
                        title: "Communicating Your Best Self",
                        organization: "Arizona State University",
                        description: "Professional communication and personal branding strategies",
                        icon: "fas fa-user-tie",
                        tags: [
                            { name: "Communication", class: "communication" },
                            { name: "Soft Skills", class: "presentation" }
                        ],
                        // Add your certificate image file name here:
                        image: "asu-communication.jpg", // Put this file in /certificates/ folder
                        preview: {
                            type: "placeholder asu-cert",
                            content: `
                                <i class="fas fa-graduation-cap"></i>
                                <h5>ASU Communication</h5>
                                <p>Certificate Available</p>
                            `
                        }
                    },
                    {
                        title: "Successful Presentation",
                        organization: "University of Colorado Boulder",
                        description: "Advanced presentation techniques and public speaking skills",
                        icon: "fas fa-presentation",
                        tags: [
                            { name: "Presentation", class: "presentation" },
                            { name: "Public Speaking", class: "speaking" }
                        ],
                        // Add your certificate image file name here:
                        image: "colorado-presentation.jpg", // Put this file in /certificates/ folder
                        preview: {
                            type: "placeholder colorado-cert",
                            content: `
                                <i class="fas fa-microphone-alt"></i>
                                <h5>Presentation Skills</h5>
                                <p>Certificate Available</p>
                            `
                        }
                    }
                ]
            },
            leadership: {
                title: "Leadership & Recognition",
                icon: "fas fa-medal",
                certificates: [
                    {
                        title: "RotorX Drone Workshop",
                        organization: "NEXUS 2025, PCU E&TC",
                        description: "Two-day intensive drone technology and applications workshop",
                        icon: "fas fa-helicopter",
                        tags: [
                            { name: "Hardware", class: "hardware" },
                            { name: "Workshop", class: "leadership" }
                        ],
                        // Add your certificate image file name here:
                        image: "nexus-drone.jpg", // Put this file in /certificates/ folder
                        preview: {
                            type: "nexus-cert",
                            content: `
                                <div class="cert-logos">
                                    <h3 class="nexus-title">NEXUS 2025</h3>
                                </div>
                                <h3 class="cert-name">Kashish Valecha</h3>
                                <p class="cert-course nexus-course">RotorX - A Two Day Drone Workshop</p>
                                <p class="cert-detail">Electronics and Telecommunication Student Association</p>
                                <div class="cert-date-badge nexus-badge">March 2025</div>
                            `
                        }
                    },
                    {
                        title: "Cultural Fest Anantam Anchor",
                        organization: "Pimpri Chinchwad University",
                        description: "Event anchoring and cultural program coordination",
                        icon: "fas fa-microphone",
                        tags: [
                            { name: "Public Speaking", class: "speaking" },
                            { name: "Leadership", class: "leadership" }
                        ],
                        // Add your certificate image file name here:
                        image: "anantam-anchor.jpg", // Put this file in /certificates/ folder
                        preview: {
                            type: "anantam-cert",
                            content: `
                                <div class="cert-logos">
                                    <h3 class="anantam-title">अनंतम्</h3>
                                    <div class="anantam-subtitle">Cultural Fest 2025</div>
                                </div>
                                <h3 class="cert-name">Kashish Valecha (Anchor)</h3>
                                <p class="cert-course anantam-course">Cultural Festival Coordination</p>
                                <p class="cert-detail">Pimpri Chinchwad University</p>
                                <div class="cert-date-badge anantam-badge">February 2025</div>
                            `
                        }
                    },
                    {
                        title: "R&D Club Management Team",
                        organization: "Pimpri Chinchwad University",
                        description: "Research & Development club active member and contributor",
                        icon: "fas fa-search",
                        tags: [
                            { name: "Leadership", class: "leadership" },
                            { name: "Research", class: "tools" }
                        ],
                        // Add your certificate image file name here:
                        image: "pcu-research.jpg", // Put this file in /certificates/ folder
                        preview: {
                            type: "pcu-cert",
                            content: `
                                <div class="cert-logos">
                                    <h3 class="pcu-title">PCU's</h3>
                                    <div class="pcu-subtitle">Pimpri Chinchwad University</div>
                                </div>
                                <h3 class="cert-name">Kashish Valecha (Management Team)</h3>
                                <p class="cert-course pcu-course">Research & Development Club</p>
                                <p class="cert-detail">Active Member - Academic Year 2024-25</p>
                                <div class="cert-date-badge pcu-badge">2024-25</div>
                            `
                        }
                    }
                ]
            }
        };

        this.renderCertificates(certificatesData);
    }

    /**
     * Render certificates from data
     */
    renderCertificates(data) {
        const container = document.querySelector('.certifications-container');
        if (!container) return;

        let html = '';

        Object.entries(data).forEach(([key, category]) => {
            html += `
                <div class="cert-category">
                    <div class="category-header">
                        <h3><i class="${category.icon}"></i> ${category.title}</h3>
                        <div class="category-divider"></div>
                    </div>
                    <div class="cert-grid">
                        ${category.certificates.map(cert => this.generateCertificateCard(cert)).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        
        // Re-setup certificate interactions after rendering
        this.setupCertificateCards();
    }

    /**
     * Generate individual certificate card HTML
     */
    generateCertificateCard(cert) {
        const tagsHTML = cert.tags.map(tag => 
            `<span class="cert-tag ${tag.class}">${tag.name}</span>`
        ).join('');

        let previewHTML;
        
        // Check if certificate has an image
        if (cert.image) {
            previewHTML = `
                <div class="cert-image-container">
                    <img src="certificates/${cert.image}" alt="${cert.title} Certificate" class="cert-image" />
                    <div class="cert-image-overlay-text">
                        <h4>${cert.title}</h4>
                        <p>${cert.organization}</p>
                    </div>
                </div>
            `;
        } else {
            // Fallback to preview content
            previewHTML = cert.preview.type === 'placeholder' 
                ? `<div class="cert-placeholder ${cert.preview.type}">${cert.preview.content}</div>`
                : `<div class="cert-preview ${cert.preview.type}">${cert.preview.content}</div>`;
        }

        return `
            <div class="cert-card" tabindex="0">
                <div class="cert-content">
                    <div class="cert-header">
                        <h4 class="cert-title">${cert.title}</h4>
                        <div class="cert-icon"><i class="${cert.icon}"></i></div>
                    </div>
                    <p class="cert-provider">${cert.organization}</p>
                    <p class="cert-desc">${cert.description}</p>
                    <div class="cert-tags">
                        ${tagsHTML}
                    </div>
                </div>
                <div class="cert-image-overlay">
                    ${previewHTML}
                </div>
            </div>
        `;
    }
    setupCertificateCards() {
        const certCards = document.querySelectorAll('.cert-card');
        
        certCards.forEach(card => {
            // Handle mobile touch interactions
            if ('ontouchstart' in window) {
                let touchStarted = false;
                
                card.addEventListener('touchstart', (e) => {
                    touchStarted = true;
                    setTimeout(() => touchStarted = false, 300);
                });
                
                card.addEventListener('touchend', (e) => {
                    if (touchStarted) {
                        e.preventDefault();
                        this.toggleCertificatePreview(card);
                    }
                });
            }
            
            // Handle keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleCertificatePreview(card);
                }
            });
            
            // Handle click for desktop fallback
            card.addEventListener('click', (e) => {
                if (!('ontouchstart' in window)) {
                    this.toggleCertificatePreview(card);
                }
            });
            
            // Close on escape or outside click
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeCertificatePreview(card);
                }
            });
            
            document.addEventListener('click', (e) => {
                if (!card.contains(e.target)) {
                    this.closeCertificatePreview(card);
                }
            });
        });
    }

    /**
     * Toggle certificate preview
     */
    toggleCertificatePreview(card) {
        const isActive = card.classList.contains('cert-card-active');
        
        // Close all other previews
        document.querySelectorAll('.cert-card-active').forEach(activeCard => {
            if (activeCard !== card) {
                this.closeCertificatePreview(activeCard);
            }
        });
        
        if (isActive) {
            this.closeCertificatePreview(card);
        } else {
            this.openCertificatePreview(card);
        }
    }

    /**
     * Open certificate preview
     */
    openCertificatePreview(card) {
        card.classList.add('cert-card-active');
        card.setAttribute('aria-expanded', 'true');
        
        // Add animation class to preview
        const preview = card.querySelector('.cert-preview, .cert-placeholder');
        if (preview) {
            preview.style.animation = 'certificateAppear 0.6s ease-out';
        }
    }

    /**
     * Close certificate preview
     */
    closeCertificatePreview(card) {
        card.classList.remove('cert-card-active');
        card.setAttribute('aria-expanded', 'false');
    }
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


/**
 * 3D Background Scene with Spline
 */
class Spline3DScene {
    constructor() {
        this.canvas = null;
        this.app = null;
        this.isLoaded = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.loadScene());
            } else {
                this.loadScene();
            }
        } catch (error) {
            console.warn('Spline 3D scene could not be initialized:', error);
        }
    }

    async loadScene() {
        try {
            this.canvas = document.getElementById('hero3d');
            
            if (!this.canvas) {
                console.warn('3D canvas element not found');
                return;
            }

            // Dynamically import Spline runtime
            const { Application } = await import('https://unpkg.com/@splinetool/runtime');
            
            this.app = new Application(this.canvas);
            
            // Load the 3D scene
            await this.app.load('https://prod.spline.design/u355WCL1favKvTz9/scene.splinecode');
            
            this.isLoaded = true;
            console.log('Spline 3D scene loaded successfully');
            
            // Add loading fade-in effect
            this.canvas.style.opacity = '0';
            this.canvas.style.transition = 'opacity 2s ease-in-out';
            
            setTimeout(() => {
                this.canvas.style.opacity = '0.8';
            }, 500);
            
        } catch (error) {
            console.warn('Failed to load Spline 3D scene:', error);
            // Hide canvas if loading fails
            if (this.canvas) {
                this.canvas.style.display = 'none';
            }
        }
    }

    // Method to adjust 3D scene based on screen size
    handleResize() {
        if (this.app && this.isLoaded) {
            // Spline handles resize automatically, but we can add custom logic here
            const isMobile = window.innerWidth <= 768;
            if (this.canvas) {
                this.canvas.style.opacity = isMobile ? '0.6' : '0.8';
            }
        }
    }
}

// Initialize 3D scene
const spline3DScene = new Spline3DScene();

// Handle window resize for 3D scene
window.addEventListener('resize', () => {
    spline3DScene.handleResize();
});

// Add performance monitoring for 3D scene
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.name.includes('spline') && entry.duration > 100) {
                console.log('3D scene performance:', entry.duration + 'ms');
                // Reduce opacity if performance is poor
                const canvas = document.getElementById('hero3d');
                if (canvas && entry.duration > 200) {
                    canvas.style.opacity = '0.5';
                }
            }
        }
    });
    
    try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
        // Performance observer not supported
    }
}

/**
 * 3D Floating Elements System
 * Integrated with existing portfolio functionality
 */
class FloatingElementsManager {
    constructor() {
        this.techSymbols = [
            '{ }', '< >', '[ ]', '< />', 
            '{ }', '</>', '()=>', 'fn', 
            '&&', '||', '!=', '==',
            '++', '--', '=>', '::',
            '0', '1', '', 'p',
            '', '', '', '',
            'AI', 'ML', 'JS', 'CSS',
            '?', '?', '', ''
        ];
        
        this.container = null;
        this.isInitialized = false;
        this.mouseX = 0.5;
        this.mouseY = 0.5;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.container = document.getElementById('floatingElements');
        
        if (!this.container) {
            console.warn('Floating elements container not found');
            return;
        }

        this.createFloatingElements();
        this.createSectionElements();
        this.setupEventListeners();
        this.isInitialized = true;
        
        console.log('Floating elements system initialized');
    }

    createFloatingElements() {
        // Create 12 main floating elements (slightly more for better coverage)
        for (let i = 0; i < 12; i++) {
            const element = document.createElement('div');
            element.className = 'float-item';
            
            // Randomly add pulse animation to some elements
            if (Math.random() > 0.7) {
                element.classList.add('float-pulse');
            }
            
            // Random symbol
            element.textContent = this.techSymbols[Math.floor(Math.random() * this.techSymbols.length)];
            
            // Random starting position
            element.style.top = Math.random() * 100 + '%';
            element.style.fontSize = (Math.random() * 1.5 + 1.2) + 'rem';
            
            // Random initial delay
            element.style.animationDelay = Math.random() * 10 + 's';
            
            this.container.appendChild(element);
        }
    }

    createSectionElements() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, sectionIndex) => {
            // Skip if section already has floating elements
            if (section.querySelector('.section-float')) return;
            
            // Add 2-4 smaller floating elements per section
            const numElements = Math.floor(Math.random() * 3) + 2;
            
            for (let i = 0; i < numElements; i++) {
                const element = document.createElement('div');
                element.className = 'section-float';
                element.textContent = this.techSymbols[Math.floor(Math.random() * this.techSymbols.length)];
                
                // Random position within section
                element.style.left = Math.random() * 85 + 7.5 + '%';
                element.style.top = Math.random() * 70 + 15 + '%';
                element.style.animationDelay = Math.random() * 8 + 's';
                
                // Use your existing CSS custom properties for colors
                const colorVars = [
                    'var(--brand-primary)', 
                    'var(--brand-secondary)', 
                    'var(--brand-accent)', 
                    'var(--brand-success)'
                ];
                element.style.color = colorVars[Math.floor(Math.random() * colorVars.length)];
                
                section.appendChild(element);
            }
        });
    }

    setupEventListeners() {
        // Mouse interaction with throttling for performance
        let mouseThrottle = false;
        document.addEventListener('mousemove', (e) => {
            if (mouseThrottle) return;
            mouseThrottle = true;
            
            setTimeout(() => {
                this.handleMouseMove(e);
                mouseThrottle = false;
            }, 16); // ~60fps
        });

        // Scroll parallax effect with throttling
        let scrollThrottle = false;
        window.addEventListener('scroll', () => {
            if (scrollThrottle) return;
            scrollThrottle = true;
            
            setTimeout(() => {
                this.handleScroll();
                scrollThrottle = false;
            }, 16); // ~60fps
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleMouseMove(e) {
        if (!this.isInitialized) return;
        
        const floatItems = document.querySelectorAll('.float-item');
        this.mouseX = e.clientX / window.innerWidth;
        this.mouseY = e.clientY / window.innerHeight;
        
        floatItems.forEach((item, index) => {
            const speed = (index % 3 + 1) * 15; // Reduced speed for subtlety
            const x = (this.mouseX - 0.5) * speed;
            const y = (this.mouseY - 0.5) * speed;
            
            // Apply transform while preserving existing transforms
            const currentTransform = item.style.transform || '';
            if (!currentTransform.includes('translate(')) {
                item.style.transform = 	ranslate(px, px) ;
            }
        });
    }

    handleScroll() {
        if (!this.isInitialized) return;
        
        const scrolled = window.pageYOffset;
        const floatItems = document.querySelectorAll('.float-item');
        
        floatItems.forEach((item, index) => {
            const speed = (index % 4 + 1) * 0.05; // Reduced speed for subtlety
            const baseTransform = 	ranslateY(px);
            
            // Combine with mouse movement if it exists
            const mouseTransform = item.style.transform.includes('translate(') ? 
                item.style.transform.split('translate(')[1].split(')')[0] : '0px, 0px';
            
            item.style.transform = 	ranslate() ;
        });
    }

    handleResize() {
        if (!this.isInitialized) return;
        
        // Adjust floating elements based on screen size
        const isMobile = window.innerWidth <= 768;
        const floatItems = document.querySelectorAll('.float-item');
        
        floatItems.forEach(item => {
            if (isMobile) {
                item.style.fontSize = (Math.random() * 1 + 1) + 'rem';
                item.style.opacity = '0.2';
            } else {
                item.style.fontSize = (Math.random() * 1.5 + 1.2) + 'rem';
                item.style.opacity = '0.4';
            }
        });
    }

    // Method to pause/resume animations (useful for performance)
    toggleAnimations(pause = false) {
        const allFloatingElements = document.querySelectorAll('.float-item, .section-float');
        
        allFloatingElements.forEach(element => {
            if (pause) {
                element.style.animationPlayState = 'paused';
            } else {
                element.style.animationPlayState = 'running';
            }
        });
    }

    // Method to adjust opacity based on user preference
    setOpacity(opacity) {
        const floatItems = document.querySelectorAll('.float-item');
        const sectionFloats = document.querySelectorAll('.section-float');
        
        floatItems.forEach(item => {
            item.style.opacity = opacity;
        });
        
        sectionFloats.forEach(item => {
            item.style.opacity = opacity * 0.75; // Section elements are more subtle
        });
    }
}

// Initialize floating elements system
const floatingElementsManager = new FloatingElementsManager();

// Integration with existing portfolio manager
if (typeof window.portfolioManager !== 'undefined') {
    // If portfolio manager exists, integrate with it
    window.portfolioManager.floatingElements = floatingElementsManager;
} else {
    // Create global reference for other scripts to access
    window.floatingElementsManager = floatingElementsManager;
}

// Performance monitoring for floating elements
let performanceCheckInterval;
if ('PerformanceObserver' in window) {
    performanceCheckInterval = setInterval(() => {
        const now = performance.now();
        const entries = performance.getEntriesByType('measure');
        
        // If performance is poor, reduce floating elements activity
        if (entries.some(entry => entry.duration > 16)) {
            floatingElementsManager.setOpacity(0.2);
        }
    }, 5000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (performanceCheckInterval) {
        clearInterval(performanceCheckInterval);
    }
    floatingElementsManager.toggleAnimations(true);
});

/**
 * Extremely Subtle Floating Elements Manager
 * Creates minimal, professional floating elements that enhance without distracting
 */
class SubtleFloatingManager {
    constructor() {
        this.simpleSymbols = [
            '{', '}', '<', '>', '[', ']', '(', ')', 
            '.', ',', ';', ':', '/', '\\', '-', '=', '+',
            '★', '◆', '▪', '▫'
        ];
        
        this.sectionSymbols = {
            home: ['{', '}', '<', '>', 'Dev', 'AI'],
            about: ['(', ')', '.', ',', 'Me', 'Bio'],
            education: ['★', '◆', 'Learn', 'Study', '2024'],
            certifications: ['★', '◆', '▪'], // Only simple shapes
            skills: ['{', '}', '<', '>', 'JS', 'CSS'],
            projects: ['[', ']', '+', '=', 'Build'],
            contact: ['@', '.', 'Hi', 'Chat']
        };
        
        this.portfolioColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#4f46e5'];
        this.containers = {};
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Get containers
        this.containers.global = document.getElementById('globalFloating');
        this.containers.home = document.getElementById('homeElements');
        this.containers.about = document.getElementById('aboutElements');
        this.containers.education = document.getElementById('educationElements');
        this.containers.certifications = document.getElementById('certificationsElements');
        this.containers.skills = document.getElementById('skillsElements');
        this.containers.projects = document.getElementById('projectsElements');
        this.containers.contact = document.getElementById('contactElements');

        if (!this.containers.global) {
            console.warn('Subtle floating containers not found');
            return;
        }

        this.createGlobalElements();
        this.createSectionElements();
        console.log('Subtle floating elements initialized');
    }

    createGlobalElements() {
        // Only 8-10 global elements (much fewer than before)
        for (let i = 0; i < 9; i++) {
            const element = document.createElement('div');
            element.className = 'subtle-float';
            
            // Add variant class for different colors/opacity
            const variant = Math.floor(Math.random() * 4) + 1;
            element.classList.add(`variant-${variant}`);
            
            // Simple symbols only
            element.textContent = this.simpleSymbols[Math.floor(Math.random() * this.simpleSymbols.length)];
            
            // Positioning
            element.style.left = Math.random() * 90 + 5 + '%';
            element.style.top = Math.random() * 90 + 5 + '%';
            
            // Super slow animations
            element.style.animationDuration = (Math.random() * 10 + 25) + 's'; // 25-35 seconds
            element.style.animationDelay = Math.random() * 20 + 's';
            
            this.containers.global.appendChild(element);
        }
    }

    createSectionElements() {
        Object.entries(this.containers).forEach(([sectionName, container]) => {
            if (!container || sectionName === 'global') return;

            let numElements;
            let symbols = this.sectionSymbols[sectionName] || this.simpleSymbols;
            
            // Special handling for certifications (fewer elements)
            if (sectionName === 'certifications') {
                this.createCertificationElements(container);
                return;
            }
            
            // 5-7 elements per section (much fewer)
            numElements = Math.floor(Math.random() * 3) + 5;

            for (let i = 0; i < numElements; i++) {
                const element = document.createElement('div');
                element.className = 'subtle-float';
                
                // Variant for subtle color differences
                const variant = Math.floor(Math.random() * 4) + 1;
                element.classList.add(`variant-${variant}`);
                
                element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                
                // Positioning within section
                element.style.left = Math.random() * 85 + 7.5 + '%';
                element.style.top = Math.random() * 80 + 10 + '%';
                
                // Even slower animations for sections
                element.style.animationDuration = (Math.random() * 8 + 27) + 's'; // 27-35 seconds
                element.style.animationDelay = Math.random() * 15 + 's';
                
                container.appendChild(element);
            }
        });
    }

    createCertificationElements(container) {
        // Only 8 elements total for certifications (3 trophies, 2 medals, 3 certificates)
        const certElements = [
            { symbol: '★', class: 'cert-trophy', count: 3 },
            { symbol: '◆', class: 'cert-medal', count: 2 },
            { symbol: '▪', class: 'cert-document', count: 3 }
        ];

        certElements.forEach(({ symbol, class: className, count }) => {
            for (let i = 0; i < count; i++) {
                const element = document.createElement('div');
                element.className = `subtle-float ${className}`;
                element.textContent = symbol;
                
                // Spread them out more
                element.style.left = Math.random() * 80 + 10 + '%';
                element.style.top = Math.random() * 70 + 15 + '%';
                
                // Super slow certification animations
                element.style.animationDuration = (Math.random() * 7 + 28) + 's';
                element.style.animationDelay = Math.random() * 10 + 's';
                
                container.appendChild(element);
            }
        });
    }
}

// Initialize the subtle floating system
const subtleFloating = new SubtleFloatingManager();

/**
 * Portfolio Builder Integration
 * Complete portfolio creation system
 */
var portfolioCurrentStep = 1;
var portfolioTotalSteps = 8;
var portfolioSkills = [];
var portfolioCertificates = [];
var portfolioWorkExperience = [];
var portfolioProjectCount = 1;

function openPortfolioModal() {
    document.getElementById('portfolioModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    document.getElementById('portfolioModalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closePortfolioModalOnOverlay(event) {
    if (event.target.id === 'portfolioModalOverlay') {
        closePortfolioModal();
    }
}

function showPortfolioStep(step) {
    var steps = document.querySelectorAll('.portfolio-form-step');
    for (var i = 0; i < steps.length; i++) {
        steps[i].classList.remove('active');
    }
    document.querySelector('[data-step="' + step + '"]').classList.add('active');
    
    var progress = (step / portfolioTotalSteps) * 100;
    document.getElementById('portfolioProgressFill').style.width = progress + '%';
    
    document.getElementById('portfolioPrevBtn').style.display = step === 1 ? 'none' : 'block';
    document.getElementById('portfolioNextBtn').style.display = step === portfolioTotalSteps ? 'none' : 'block';
    document.getElementById('portfolioCreateBtn').style.display = step === portfolioTotalSteps ? 'block' : 'none';
}

function nextPortfolioStep() {
    if (validatePortfolioStep(portfolioCurrentStep)) {
        portfolioCurrentStep++;
        showPortfolioStep(portfolioCurrentStep);
    }
}

function previousPortfolioStep() {
    portfolioCurrentStep--;
    showPortfolioStep(portfolioCurrentStep);
}

function validatePortfolioStep(step) {
    var currentStepEl = document.querySelector('[data-step="' + step + '"]');
    var inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
    
    for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].value.trim()) {
            alert('Please fill in all required fields');
            inputs[i].focus();
            return false;
        }
    }
    
    if (step === 2 && !document.getElementById('portfolioSelectedDomain').value) {
        alert('Please select a domain');
        return false;
    }
    
    return true;
}

function selectPortfolioDomain(domain, element) {
    var cards = document.querySelectorAll('.portfolio-domain-card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.remove('selected');
    }
    element.classList.add('selected');
    document.getElementById('portfolioSelectedDomain').value = domain;
}

function addPortfolioSkill() {
    var input = document.getElementById('portfolioSkillInput');
    var skill = input.value.trim();
    
    if (skill && portfolioSkills.indexOf(skill) === -1) {
        portfolioSkills.push(skill);
        renderPortfolioList('portfolioSkillsList', portfolioSkills, 'removePortfolioSkill');
        input.value = '';
    }
}

function removePortfolioSkill(index) {
    portfolioSkills.splice(index, 1);
    renderPortfolioList('portfolioSkillsList', portfolioSkills, 'removePortfolioSkill');
}

function addPortfolioCertificate() {
    var name = document.getElementById('portfolioCertName').value.trim();
    var issuer = document.getElementById('portfolioCertIssuer').value.trim();
    var imageFile = document.getElementById('portfolioCertImage').files[0];
    
    if (name && issuer) {
        var cert = { name: name, issuer: issuer, image: null };
        
        if (imageFile) {
            // Check file size (max 5MB)
            if (imageFile.size > 5 * 1024 * 1024) {
                alert('Image file size should be less than 5MB');
                return;
            }
            
            var reader = new FileReader();
            reader.onload = function(e) {
                cert.image = e.target.result;
                portfolioCertificates.push(cert);
                renderPortfolioCertsList();
            };
            reader.readAsDataURL(imageFile);
        } else {
            portfolioCertificates.push(cert);
            renderPortfolioCertsList();
        }
        
        document.getElementById('portfolioCertName').value = '';
        document.getElementById('portfolioCertIssuer').value = '';
        document.getElementById('portfolioCertImage').value = '';
    }
}

function renderPortfolioCertsList() {
    var html = '';
    for (var i = 0; i < portfolioCertificates.length; i++) {
        html += '<div class="portfolio-list-item"><div><strong>' + portfolioCertificates[i].name + '</strong><br><small>' + portfolioCertificates[i].issuer + '</small></div><span class="portfolio-remove-btn" onclick="removePortfolioCert(' + i + ')">×</span></div>';
    }
    document.getElementById('portfolioCertsList').innerHTML = html;
}

function removePortfolioCert(index) {
    portfolioCertificates.splice(index, 1);
    renderPortfolioCertsList();
}

function addPortfolioWork() {
    var title = document.getElementById('portfolioWorkTitle').value.trim();
    var company = document.getElementById('portfolioWorkCompany').value.trim();
    var desc = document.getElementById('portfolioWorkDesc').value.trim();
    
    if (title && company) {
        portfolioWorkExperience.push({ title: title, company: company, desc: desc });
        renderPortfolioWorkList();
        document.getElementById('portfolioWorkTitle').value = '';
        document.getElementById('portfolioWorkCompany').value = '';
        document.getElementById('portfolioWorkDesc').value = '';
    }
}

function renderPortfolioWorkList() {
    var html = '';
    for (var i = 0; i < portfolioWorkExperience.length; i++) {
        html += '<div class="portfolio-list-item"><div><strong>' + portfolioWorkExperience[i].title + '</strong> at ' + portfolioWorkExperience[i].company + '<br><small>' + portfolioWorkExperience[i].desc + '</small></div><span class="portfolio-remove-btn" onclick="removePortfolioWork(' + i + ')">×</span></div>';
    }
    document.getElementById('portfolioWorkList').innerHTML = html;
}

function removePortfolioWork(index) {
    portfolioWorkExperience.splice(index, 1);
    renderPortfolioWorkList();
}

function renderPortfolioList(containerId, items, removeFn) {
    var html = '';
    for (var i = 0; i < items.length; i++) {
        html += '<div class="portfolio-list-item"><span>' + items[i] + '</span><span class="portfolio-remove-btn" onclick="' + removeFn + '(' + i + ')">×</span></div>';
    }
    document.getElementById(containerId).innerHTML = html;
}

function selectPortfolioTheme(theme, element) {
    var themes = document.querySelectorAll('.portfolio-color-theme');
    for (var i = 0; i < themes.length; i++) {
        themes[i].classList.remove('selected');
    }
    element.classList.add('selected');
    document.getElementById('portfolioSelectedTheme').value = theme;
}

function addPortfolioProjectField() {
    portfolioProjectCount++;
    var html = '<div class="portfolio-project-card"><div class="portfolio-form-group"><label>Project Name *</label><input type="text" class="portfolio-project-name" placeholder="Project ' + portfolioProjectCount + '" required></div><div class="portfolio-form-group"><label>Description *</label><textarea class="portfolio-project-desc" placeholder="Describe your project..." rows="3" required></textarea></div><div class="portfolio-form-group"><label>Project Image URL</label><input type="url" class="portfolio-project-image" placeholder="https://..."></div><div class="portfolio-form-group"><label>Live Link</label><input type="url" class="portfolio-project-link" placeholder="https://..."></div><div class="portfolio-form-group"><label>GitHub</label><input type="url" class="portfolio-project-github" placeholder="https://github.com/..."></div></div>';
    document.getElementById('portfolioProjectsContainer').insertAdjacentHTML('beforeend', html);
}

function createPortfolioFromBuilder() {
    var projects = [];
    var projectCards = document.querySelectorAll('.portfolio-project-card');
    for (var i = 0; i < projectCards.length; i++) {
        var name = projectCards[i].querySelector('.portfolio-project-name').value.trim();
        var desc = projectCards[i].querySelector('.portfolio-project-desc').value.trim();
        if (name && desc) {
            projects.push({
                name: name,
                desc: desc,
                image: projectCards[i].querySelector('.portfolio-project-image').value.trim(),
                link: projectCards[i].querySelector('.portfolio-project-link').value.trim(),
                github: projectCards[i].querySelector('.portfolio-project-github').value.trim()
            });
        }
    }

    var formData = {
        fullName: document.getElementById('portfolioFullName').value,
        email: document.getElementById('portfolioEmail').value,
        title: document.getElementById('portfolioTitle').value,
        bio: document.getElementById('portfolioBio').value,
        profileImage: document.getElementById('portfolioProfileImage').value,
        domain: document.getElementById('portfolioSelectedDomain').value,
        experience: document.getElementById('portfolioExperience').value,
        skills: portfolioSkills,
        projects: projects,
        certificates: portfolioCertificates,
        workExperience: portfolioWorkExperience,
        education: document.getElementById('portfolioEducation').value,
        phone: document.getElementById('portfolioPhone').value,
        location: document.getElementById('portfolioLocation').value,
        linkedin: document.getElementById('portfolioLinkedin').value,
        github: document.getElementById('portfolioGithub').value,
        website: document.getElementById('portfolioWebsite').value,
        twitter: document.getElementById('portfolioTwitter').value,
        theme: document.getElementById('portfolioSelectedTheme').value
    };

    generatePortfolioHTML(formData);
}

function generatePortfolioHTML(data) {
    var themeColors = {
        dark: { primary: '#667eea', secondary: '#764ba2', bg: '#0f0f1e', cardBg: '#1a1a2e', text: '#ffffff' },
        blue: { primary: '#3b82f6', secondary: '#1e40af', bg: '#0f172a', cardBg: '#1e293b', text: '#ffffff' },
        green: { primary: '#10b981', secondary: '#047857', bg: '#064e3b', cardBg: '#065f46', text: '#ffffff' },
        orange: { primary: '#f97316', secondary: '#ea580c', bg: '#431407', cardBg: '#7c2d12', text: '#ffffff' },
        pink: { primary: '#ec4899', secondary: '#be185d', bg: '#500724', cardBg: '#831843', text: '#ffffff' }
    };
    
    var colors = themeColors[data.theme] || themeColors.dark;
    
    var skillsHTML = '';
    for (var i = 0; i < data.skills.length; i++) {
        skillsHTML += '<span class="skill-tag">' + data.skills[i] + '</span>';
    }

    var projectsHTML = '';
    for (var i = 0; i < data.projects.length; i++) {
        var p = data.projects[i];
        projectsHTML += '<div class="project-card">';
        if (p.image) {
            projectsHTML += '<img src="' + p.image + '" alt="' + p.name + '" class="project-img">';
        }
        projectsHTML += '<div class="project-content"><h3>' + p.name + '</h3><p>' + p.desc + '</p><div class="project-links">';
        if (p.link) projectsHTML += '<a href="' + p.link + '" target="_blank" class="project-btn">Live Demo</a>';
        if (p.github) projectsHTML += '<a href="' + p.github + '" target="_blank" class="project-btn">GitHub</a>';
        projectsHTML += '</div></div></div>';
    }

    var certsHTML = '';
    for (var i = 0; i < data.certificates.length; i++) {
        certsHTML += '<div class="cert-item">';
        if (data.certificates[i].image) {
            certsHTML += '<img src="' + data.certificates[i].image + '" alt="' + data.certificates[i].name + '" class="cert-image">';
        } else {
            certsHTML += '<div class="cert-icon">🏆</div>';
        }
        certsHTML += '<div><h4>' + data.certificates[i].name + '</h4><p>' + data.certificates[i].issuer + '</p></div></div>';
    }

    var workHTML = '';
    for (var i = 0; i < data.workExperience.length; i++) {
        workHTML += '<div class="work-item"><h4>' + data.workExperience[i].title + '</h4><p class="company">' + data.workExperience[i].company + '</p><p>' + data.workExperience[i].desc + '</p></div>';
    }

    var portfolioHTML = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' + data.fullName + ' - Portfolio</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Segoe UI",system-ui,sans-serif;background:' + colors.bg + ';color:' + colors.text + ';line-height:1.6}a{color:' + colors.primary + ';text-decoration:none}.container{max-width:1200px;margin:0 auto;padding:0 20px}header{background:linear-gradient(135deg,' + colors.primary + ',' + colors.secondary + ');padding:100px 20px;text-align:center;position:relative;overflow:hidden}header::before{content:"";position:absolute;top:-50%;right:-50%;width:100%;height:100%;background:rgba(255,255,255,0.1);transform:rotate(45deg)}';
    
    portfolioHTML += '.profile-img{width:150px;height:150px;border-radius:50%;border:5px solid rgba(255,255,255,0.3);object-fit:cover;margin-bottom:20px}h1{font-size:3rem;margin-bottom:10px;text-shadow:2px 2px 4px rgba(0,0,0,0.3)}@media(max-width:768px){h1{font-size:2rem}}.tagline{font-size:1.3rem;opacity:0.95;margin-bottom:15px}.bio{max-width:700px;margin:20px auto;opacity:0.9;font-size:1.1rem}section{padding:80px 20px}.section-title{font-size:2.5rem;margin-bottom:40px;text-align:center;background:linear-gradient(135deg,' + colors.primary + ',' + colors.secondary + ');-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}';
    
    portfolioHTML += '.skills-grid{display:flex;flex-wrap:wrap;gap:15px;justify-content:center;max-width:800px;margin:0 auto}.skill-tag{background:' + colors.cardBg + ';padding:12px 24px;border-radius:30px;border:2px solid ' + colors.primary + ';font-weight:500;transition:all 0.3s}.skill-tag:hover{transform:translateY(-3px);box-shadow:0 5px 15px rgba(102,126,234,0.3)}';
    
    portfolioHTML += '.projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:30px;margin-top:40px}.project-card{background:' + colors.cardBg + ';border-radius:15px;overflow:hidden;transition:transform 0.3s,box-shadow 0.3s;border:1px solid rgba(255,255,255,0.1)}.project-card:hover{transform:translateY(-10px);box-shadow:0 15px 40px rgba(0,0,0,0.3)}.project-img{width:100%;height:200px;object-fit:cover}.project-content{padding:25px}.project-content h3{color:' + colors.primary + ';margin-bottom:10px;font-size:1.5rem}.project-content p{opacity:0.9;margin-bottom:15px}.project-links{display:flex;gap:10px;margin-top:15px}.project-btn{background:' + colors.primary + ';color:#fff;padding:10px 20px;border-radius:8px;transition:all 0.3s}.project-btn:hover{background:' + colors.secondary + ';transform:scale(1.05)}';
    
    portfolioHTML += '.certs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:25px;max-width:1000px;margin:0 auto}.cert-item{background:' + colors.cardBg + ';padding:25px;border-radius:12px;display:flex;gap:20px;align-items:center;border-left:4px solid ' + colors.primary + '}.cert-icon{font-size:2.5rem}.cert-image{width:80px;height:80px;object-fit:cover;border-radius:8px;border:2px solid ' + colors.primary + ';flex-shrink:0}.cert-item h4{color:' + colors.primary + ';margin-bottom:5px}.cert-item p{opacity:0.8;font-size:0.95rem}';
    
    portfolioHTML += '.work-timeline{max-width:800px;margin:0 auto}.work-item{background:' + colors.cardBg + ';padding:30px;border-radius:12px;margin-bottom:25px;border-left:4px solid ' + colors.primary + '}.work-item h4{color:' + colors.primary + ';font-size:1.4rem;margin-bottom:8px}.company{font-weight:600;opacity:0.9;margin-bottom:10px}.work-item p{opacity:0.85}';
    
    portfolioHTML += '.contact-section{background:' + colors.cardBg + ';border-radius:20px;padding:50px;text-align:center;margin:40px auto;max-width:800px}.contact-grid{display:flex;flex-wrap:wrap;gap:20px;justify-content:center;margin-top:30px}.contact-item{background:rgba(255,255,255,0.05);padding:15px 30px;border-radius:10px;display:flex;align-items:center;gap:10px;transition:all 0.3s;border:1px solid rgba(255,255,255,0.1)}.contact-item:hover{background:' + colors.primary + ';transform:translateY(-3px)}';
    
    portfolioHTML += 'footer{text-align:center;padding:40px;opacity:0.7;border-top:1px solid rgba(255,255,255,0.1)}@media(max-width:768px){.projects-grid,.certs-grid{grid-template-columns:1fr}.section-title{font-size:2rem}section{padding:50px 20px}}</style></head><body>';
    
    portfolioHTML += '<header><div class="container">';
    if (data.profileImage) {
        portfolioHTML += '<img src="' + data.profileImage + '" alt="' + data.fullName + '" class="profile-img">';
    }
    portfolioHTML += '<h1>' + data.fullName + '</h1><p class="tagline">' + data.title + '</p>';
    if (data.experience) {
        portfolioHTML += '<p style="opacity:0.9;margin-top:10px">🎯 ' + data.experience + ' Experience</p>';
    }
    if (data.bio) {
        portfolioHTML += '<p class="bio">' + data.bio + '</p>';
    }
    portfolioHTML += '</div></header>';
    
    portfolioHTML += '<div class="container">';
    
    if (data.skills.length > 0) {
        portfolioHTML += '<section><h2 class="section-title">Skills & Expertise</h2><div class="skills-grid">' + skillsHTML + '</div></section>';
    }
    
    if (data.projects.length > 0) {
        portfolioHTML += '<section><h2 class="section-title">Featured Projects</h2><div class="projects-grid">' + projectsHTML + '</div></section>';
    }
    
    if (data.workExperience.length > 0) {
        portfolioHTML += '<section><h2 class="section-title">Work Experience</h2><div class="work-timeline">' + workHTML + '</div></section>';
    }
    
    if (data.certificates.length > 0) {
        portfolioHTML += '<section><h2 class="section-title">Certificates & Achievements</h2><div class="certs-grid">' + certsHTML + '</div></section>';
    }
    
    if (data.education) {
        portfolioHTML += '<section><h2 class="section-title">Education</h2><div style="max-width:600px;margin:0 auto;background:' + colors.cardBg + ';padding:25px;border-radius:12px;border-left:4px solid ' + colors.primary + '"><p style="font-size:1.1rem">' + data.education + '</p></div></section>';
    }
    
    portfolioHTML += '<section class="contact-section"><h2 class="section-title">Get In Touch</h2><p style="opacity:0.9;margin-bottom:20px">Let\'s connect and discuss opportunities!</p><div class="contact-grid">';
    
    if (data.email) portfolioHTML += '<a href="mailto:' + data.email + '" class="contact-item">📧 Email</a>';
    if (data.phone) portfolioHTML += '<a href="tel:' + data.phone + '" class="contact-item">📱 Phone</a>';
    if (data.location) portfolioHTML += '<span class="contact-item">📍 ' + data.location + '</span>';
    if (data.linkedin) portfolioHTML += '<a href="' + data.linkedin + '" target="_blank" class="contact-item">💼 LinkedIn</a>';
    if (data.github) portfolioHTML += '<a href="' + data.github + '" target="_blank" class="contact-item">💻 GitHub</a>';
    if (data.website) portfolioHTML += '<a href="' + data.website + '" target="_blank" class="contact-item">🌐 Website</a>';
    if (data.twitter) portfolioHTML += '<a href="' + data.twitter + '" target="_blank" class="contact-item">🐦 Twitter</a>';
    
    portfolioHTML += '</div></section></div>';
    
    portfolioHTML += '<footer><p>© 2024 ' + data.fullName + '. All rights reserved.</p><p style="margin-top:10px;font-size:0.9rem">Built with Professional Portfolio Builder</p></footer></body></html>';

    // Open in new window and offer download
    var newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(portfolioHTML);
        newWindow.document.close();
        
        setTimeout(function() {
            var blob = new Blob([portfolioHTML], { type: 'text/html' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = data.fullName.replace(/\s+/g, '_') + '_Portfolio.html';
            
            if (confirm('Portfolio created successfully! Would you like to download it as an HTML file?')) {
                a.click();
            }
            
            URL.revokeObjectURL(url);
        }, 500);
    }
    
    closePortfolioModal();
    
    // Reset form after creation
    setTimeout(function() {
        document.getElementById('portfolioBuilderForm').reset();
        portfolioSkills = [];
        portfolioCertificates = [];
        portfolioWorkExperience = [];
        portfolioProjectCount = 1;
        portfolioCurrentStep = 1;
        showPortfolioStep(1);
        document.getElementById('portfolioProjectsContainer').innerHTML = '<div class="portfolio-project-card"><div class="portfolio-form-group"><label>Project Name *</label><input type="text" class="portfolio-project-name" placeholder="Amazing Project" required></div><div class="portfolio-form-group"><label>Description *</label><textarea class="portfolio-project-desc" placeholder="Describe what you built, technologies used, and impact..." rows="3" required></textarea></div><div class="portfolio-form-group"><label>Project Image URL (optional)</label><input type="url" class="portfolio-project-image" placeholder="https://..."></div><div class="portfolio-form-group"><label>Live Link / Demo</label><input type="url" class="portfolio-project-link" placeholder="https://..."></div><div class="portfolio-form-group"><label>GitHub / Source Code</label><input type="url" class="portfolio-project-github" placeholder="https://github.com/..."></div></div>';
        // Clear certificate lists and form fields
        document.getElementById('portfolioCertsList').innerHTML = '';
        document.getElementById('portfolioSkillsList').innerHTML = '';
        document.getElementById('portfolioWorkList').innerHTML = '';
    }, 1000);
}

// Initialize portfolio builder step
showPortfolioStep(1);
