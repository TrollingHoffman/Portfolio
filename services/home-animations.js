document.addEventListener('DOMContentLoaded', function() {
    // מפעיל רק את האנימציות הייחודיות לדף הבית
    // שאר האנימציות (מספרים רצים, גלילה וכו') מטופלות ב-scroll-animations.js
    initHeroAnimations();
    initParallax();
});

// אנימציית כניסה לשורות הכותרת (Data Analyst | Gen AI Explorer...)
function initHeroAnimations() {
    const titleLines = document.querySelectorAll('.title-line');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    
    // אנימציה לשורות הכותרת
    if (titleLines.length > 0) {
        titleLines.forEach((line, index) => {
            // הגדרת מצב התחלתי
            line.style.opacity = '0';
            line.style.transform = 'translateY(20px)';
            line.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
            
            // הפעלת האנימציה בדירוג
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    }

    // אנימציה לתיאור
    if (heroDescription) {
        heroDescription.style.opacity = '0';
        heroDescription.style.transform = 'translateY(20px)';
        heroDescription.style.transition = 'all 0.8s ease-out';
        
        setTimeout(() => {
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translateY(0)';
        }, 1000);
    }

    // אנימציה לכפתורים
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(20px)';
        heroButtons.style.transition = 'all 0.8s ease-out';
        
        setTimeout(() => {
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 1200);
    }
}

// אפקט פרלקס עדין לרקע של ה-Hero
function initParallax() {
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroSection || window.innerWidth <= 768) return; // מבטל במובייל לביצועים טובים יותר
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // מפעיל רק כשה-Hero גלוי במסך
        if (scrolled < window.innerHeight) {
            // מזיז את התוכן במהירות שונה מהרקע
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
                heroContent.style.opacity = 1 - (scrolled / 700); // דוהה בגלילה למטה
            }
        }
    });
}
// החלף את הפונקציה initCounterAnimations והפונקציה animateCounter הקיימות בזה:

function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number, .counter');
    
    // אם אין אלמנטים כאלו בדף, נעצור כאן כדי למנוע שגיאות
    if (statNumbers.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // --- התיקון: קריאה מתוך data-target ---
                // ננסה לקחת את המספר מתוך המאפיין data-target
                const targetAttr = element.getAttribute('data-target');
                
                // אם אין data-target, ננסה לקחת מהטקסט (גיבוי)
                let target = targetAttr ? parseInt(targetAttr) : 0;
                
                // אם עדיין 0, ננסה לחלץ מספרים מהטקסט (למקרה שכתוב "50 projects")
                if (target === 0) {
                    const text = element.textContent.trim();
                    const match = text.match(/\d+/);
                    if (match) target = parseInt(match[0]);
                }

                if (target > 0) {
                    animateCounter(element, target);
                    observer.unobserve(element);
                }
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(element => {
        observer.observe(element);
    });
}

function animateCounter(element, target) {
    const duration = 2000; // משך האנימציה במילישניות
    const frameDuration = 1000 / 60; // 60 פריימים בשנייה
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t); // פונקציית האטה לקראת הסוף
    
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(target * progress);
        
        if (parseInt(element.textContent) !== currentCount) {
            element.textContent = currentCount;
        }
        
        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = target; // וידוא סופי
        }
    }, frameDuration);
}