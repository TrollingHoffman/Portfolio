document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    initDarkMode();
    initHeaderScroll();
});

// Hamburger Menu Functionality
function initHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            const isVisible = navLinks.getAttribute('data-visible') === 'true';
            
            if (!isVisible) {
                navLinks.setAttribute('data-visible', 'true');
                hamburgerIcon.setAttribute('data-visible', 'false');
                closeIcon.setAttribute('data-visible', 'true');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                navLinks.setAttribute('data-visible', 'false');
                hamburgerIcon.setAttribute('data-visible', 'true');
                closeIcon.setAttribute('data-visible', 'false');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
        
        // Close menu when clicking on a link
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 767) {
                    navLinks.setAttribute('data-visible', 'false');
                    hamburgerIcon.setAttribute('data-visible', 'true');
                    closeIcon.setAttribute('data-visible', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 767) {
            const isNavbarVisible = navLinks && navLinks.getAttribute('data-visible') === 'true';
            const isClickInsideNavbar = navLinks && navLinks.contains(event.target);
            const isClickOnHamburger = hamburgerMenu && hamburgerMenu.contains(event.target);
            
            if (isNavbarVisible && !isClickInsideNavbar && !isClickOnHamburger) {
                navLinks.setAttribute('data-visible', 'false');
                if (hamburgerIcon) hamburgerIcon.setAttribute('data-visible', 'true');
                if (closeIcon) closeIcon.setAttribute('data-visible', 'false');
                document.body.style.overflow = '';
            }
        }
    });
}

// Dark Mode Functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check for saved dark mode preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            updateDarkModeIcon(true);
        }
        
        // Toggle dark mode on click
        darkModeToggle.addEventListener('click', function() {
            const darkModeActive = document.body.classList.toggle('dark-mode');
            
            updateDarkModeIcon(darkModeActive);
            localStorage.setItem('darkMode', darkModeActive);
            
            // Add animation effect
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
}

function updateDarkModeIcon(isDarkMode) {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        if (isDarkMode) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        // if (currentScroll > lastScroll && currentScroll > 100) {
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     header.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
    });
}

// Smooth scroll for all internal links
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

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Utility function to detect mobile device
function isMobile() {
    return window.innerWidth <= 767;
}

// Add resize listener to handle responsive changes
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const navLinks = document.querySelector('.nav-links');
        if (!isMobile() && navLinks) {
            navLinks.setAttribute('data-visible', 'false');
            document.body.style.overflow = '';
        }
    }, 250);
});

// Performance optimization: Debounce function
function debounce(func, wait) {
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

// Add custom cursor effect (optional, can be removed if not needed)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid var(--accent-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease;
        display: none;
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        requestAnimationFrame(updateCursor);
    }
    
    if (!isMobile()) {
        cursor.style.display = 'block';
        updateCursor();
    }
    
    // Enlarge cursor on hover over clickable elements
    const clickableElements = document.querySelectorAll('a, button, .btn');
    clickableElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.backgroundColor = 'rgba(30, 136, 229, 0.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// Uncomment to enable custom cursor
// initCustomCursor();

// Add console message
console.log('%c👋 Welcome to my portfolio!', 'color: #1E88E5; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'color: #00D9FF; font-size: 14px;');
console.log('%cWant to work together? Contact me at: Amithoffman56@gmail.com', 'color: #00C853; font-size: 14px;');