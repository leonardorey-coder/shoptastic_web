// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background adaptativo con Liquid Glass
function updateHeaderLiquidGlass() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const heroHeight = hero ? hero.offsetHeight : 0;
    const scrollPercentage = Math.min(window.scrollY / heroHeight, 1);
    
    // Detectar si estamos sobre fondo oscuro (hero) o claro (resto)
    const isOverDarkBackground = window.scrollY < heroHeight * 0.8;
    
    if (isOverDarkBackground) {
        // Liquid Glass para fondo oscuro
        header.style.background = `rgba(255, 255, 255, ${0.05 + scrollPercentage * 0.03})`;
        header.style.backdropFilter = 'blur(40px) saturate(180%) brightness(150%) contrast(120%)';
        header.style.webkitBackdropFilter = 'blur(40px) saturate(180%) brightness(150%) contrast(120%)';
        header.style.borderBottom = `1px solid rgba(255, 255, 255, ${0.15 + scrollPercentage * 0.1})`;
        header.style.borderTop = `1px solid rgba(255, 255, 255, ${0.1 + scrollPercentage * 0.05})`;
        header.style.boxShadow = `
            0 8px 32px rgba(0, 0, 0, ${0.1 + scrollPercentage * 0.1}),
            inset 0 1px 0 rgba(255, 255, 255, ${0.2 + scrollPercentage * 0.1}),
            inset 0 -1px 0 rgba(255, 255, 255, ${0.1 + scrollPercentage * 0.05})
        `;
        
        // Texto para fondo oscuro
        navLinks.forEach(link => {
            if (!link.matches(':hover')) {
                link.style.color = 'rgba(255, 255, 255, 0.9)';
                link.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)';
            }
        });
        
    } else {
        // Liquid Glass para fondo claro
        header.style.background = 'rgba(255, 255, 255, 0.12)';
        header.style.backdropFilter = 'blur(20px) saturate(150%) brightness(110%)';
        header.style.webkitBackdropFilter = 'blur(20px) saturate(150%) brightness(110%)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.08)';
        header.style.borderTop = '1px solid rgba(255, 255, 255, 0.6)';
        header.style.boxShadow = `
            0 4px 20px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03)
        `;
        
        // Texto para fondo claro
        navLinks.forEach(link => {
            if (!link.matches(':hover')) {
                link.style.color = 'rgba(30, 41, 59, 0.9)';
                link.style.textShadow = '0 1px 2px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.3)';
            }
        });
    }
}

window.addEventListener('scroll', updateHeaderLiquidGlass);
// Ejecutar una vez al cargar
window.addEventListener('load', updateHeaderLiquidGlass);

// Intersection Observer for animations - Solo para elementos que no tienen GSAP
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation - Excluir las que tienen GSAP (morphing-card)
document.querySelectorAll('.feature-card, .team-member, .step').forEach(el => {
    // Solo animar si no tiene la clase morphing-card (que ya maneja GSAP)
    if (!el.classList.contains('morphing-card')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    }
});

// Counter animation for stats - Arreglado para trabajar con las nuevas clases
function animateCounters() {
    const counterStats = document.querySelectorAll('.counter-stat');
    
    counterStats.forEach(stat => {
        const counter = stat.querySelector('.counter');
        const target = parseInt(stat.dataset.target);
        
        if (counter && target) {
            let currentValue = 0;
            const increment = target / 30;
            const suffix = counter.textContent.includes('%') ? '%' : 'x';
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(currentValue) + suffix;
                }
            }, 50);
        }
    });
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// App screenshot interaction
const appScreenshots = document.querySelectorAll('.app-screenshot');
appScreenshots.forEach(screenshot => {
    screenshot.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    screenshot.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Download button interactions
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.textContent.includes('Descargar')) {
            e.preventDefault();
            
            // Create a ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Show download message
            showDownloadMessage();
        }
    });
});

function showDownloadMessage() {
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'rgba(16, 185, 129, 0.95)';
    message.style.color = 'white';
    message.style.padding = '20px 40px';
    message.style.borderRadius = '12px';
    message.style.zIndex = '10000';
    message.style.textAlign = 'center';
    message.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    message.style.backdropFilter = 'blur(10px)';
    message.innerHTML = `
        <h3 style="margin: 0 0 10px 0;">¡Próximamente!</h3>
        <p style="margin: 0;">Shoptastic estará disponible pronto en App Store y Google Play</p>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 3000);
}

// Add ripple animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-radius: 0 0 12px 12px;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
        
        .nav-toggle {
            display: flex !important;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Form validation (if contact form exists)
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        let isValid = true;
        Object.values(data).forEach(value => {
            if (!value.trim()) {
                isValid = false;
            }
        });
        
        if (isValid) {
            showSuccessMessage('¡Mensaje enviado con éxito!');
            form.reset();
        } else {
            showErrorMessage('Por favor, completa todos los campos.');
        }
    });
});

function showSuccessMessage(message) {
    showMessage(message, '#10B981');
}

function showErrorMessage(message) {
    showMessage(message, '#EF4444');
}

function showMessage(text, color) {
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.background = color;
    message.style.color = 'white';
    message.style.padding = '15px 25px';
    message.style.borderRadius = '8px';
    message.style.zIndex = '10000';
    message.style.transform = 'translateX(100%)';
    message.style.transition = 'transform 0.3s ease';
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 3000);
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll events - Header Liquid Glass adaptativo
const debouncedScrollHandler = debounce(function() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const heroHeight = hero ? hero.offsetHeight : 0;
    const scrollPercentage = Math.min(window.scrollY / heroHeight, 1);
    
    // Detectar si estamos sobre fondo oscuro (hero) o claro (resto)
    const isOverDarkBackground = window.scrollY < heroHeight * 0.8;
    
    if (isOverDarkBackground) {
        // Liquid Glass para fondo oscuro
        header.style.background = `rgba(255, 255, 255, ${0.05 + scrollPercentage * 0.03})`;
        header.style.backdropFilter = 'blur(40px) saturate(180%) brightness(150%) contrast(120%)';
        header.style.webkitBackdropFilter = 'blur(40px) saturate(180%) brightness(150%) contrast(120%)';
        header.style.borderBottom = `1px solid rgba(255, 255, 255, ${0.15 + scrollPercentage * 0.1})`;
        header.style.borderTop = `1px solid rgba(255, 255, 255, ${0.1 + scrollPercentage * 0.05})`;
        header.style.boxShadow = `
            0 8px 32px rgba(0, 0, 0, ${0.1 + scrollPercentage * 0.1}),
            inset 0 1px 0 rgba(255, 255, 255, ${0.2 + scrollPercentage * 0.1}),
            inset 0 -1px 0 rgba(255, 255, 255, ${0.1 + scrollPercentage * 0.05})
        `;
    } else {
        // Liquid Glass para fondo claro
        header.style.background = 'rgba(255, 255, 255, 0.12)';
        header.style.backdropFilter = 'blur(20px) saturate(150%) brightness(110%)';
        header.style.webkitBackdropFilter = 'blur(20px) saturate(150%) brightness(110%)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.08)';
        header.style.borderTop = '1px solid rgba(255, 255, 255, 0.6)';
        header.style.boxShadow = `
            0 4px 20px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03)
        `;
    }
}, 10);

window.removeEventListener('scroll', function() {}); // Remove previous listener
window.addEventListener('scroll', debouncedScrollHandler);

console.log('🛒 Shoptastic website loaded successfully!'); 