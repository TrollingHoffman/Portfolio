document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    // Only run these if elements exist to avoid errors
    if(document.querySelector('.progress-bar')) initProgressBars();
    if(document.querySelector('.stat-number')) initCounterAnimations();
});

// Main scroll animation function
function initScrollAnimations() {
    // UPDATED SELECTOR: Added .service-card and .calculator-container
    const fadeElements = document.querySelectorAll(
        '.fade-in, .skill-card, .activity-card, .about-card, .expertise-card, .service-card, .calculator-container'
    );
    
    if (fadeElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger effect based on index in current view
                const delay = index * 50; 
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const observerOptions = { threshold: 0.5 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.style.getPropertyValue('--progress') || progressBar.dataset.width;
                
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-out';
                    progressBar.style.width = progress;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => observer.observe(bar));
}

function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number, .counter');
    const observerOptions = { threshold: 0.7 };
    
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
    
    statNumbers.forEach(element => observer.observe(element));
}

function animateCounter(element, target, originalText) {
    const duration = 2000;
    const start = 0;
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const currentVal = Math.floor(progress * (target - start) + start);
        
        // Preserve non-digit characters (like + or %)
        if (progress < 1) {
            element.textContent = originalText.replace(/\d+/, currentVal);
            requestAnimationFrame(animation);
        } else {
            element.textContent = originalText;
        }
    }
    
    requestAnimationFrame(animation);
}

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