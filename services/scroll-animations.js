// Scroll Animations for all pages
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initProgressBars();
    initCounterAnimations();
});

// Main scroll animation function
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .skill-card, .activity-card, .about-card, .expertise-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger effect
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// Animate progress bars when they come into view
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.style.getPropertyValue('--progress');
                
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-out';
                    progressBar.style.width = progress;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Counter animations
function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number, .counter');
    
    if (statNumbers.length === 0) return;
    
    const observerOptions = {
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent.trim();
                const numberMatch = text.match(/\d+/);
                
                if (numberMatch) {
                    const target = parseInt(numberMatch[0]);
                    animateCounter(element, target, text);
                    observer.unobserve(element);
                }
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(element => {
        observer.observe(element);
    });
}

function animateCounter(element, target, originalText) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = originalText;
            clearInterval(timer);
        } else {
            element.textContent = originalText.replace(/\d+/, Math.ceil(current));
        }
    }, 16);
}

// Parallax effect for hero sections
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.about-hero, .intro-section');
    
    parallaxElements.forEach(element => {
        if (scrolled < window.innerHeight) {
            element.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
});

// Add hover effects to skill cards
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});