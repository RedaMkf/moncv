// ============================================
// CV Interactif Reda MOUKHFI
// Animation IoT Network & Interactions
// ============================================

// ============================================
// 1. ANIMATION DU RÉSEAU IoT (Canvas)
// ============================================
const canvas = document.getElementById('iot-network');
const ctx = canvas.getContext('2d');

// Ajuster la taille du canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
}

resizeCanvas();

// Classe pour les nœuds IoT
class IoTNode {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 3 + 1;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebond sur les bords
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        this.pulsePhase += 0.02;
    }

    draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${0.4 + pulse * 0.3})`;
        ctx.fill();
        
        // Ajouter un anneau autour des gros nœuds
        if (this.radius > 2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 + pulse * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}

// Créer les nœuds
const nodes = [];
const nodeCount = 60;

for (let i = 0; i < nodeCount; i++) {
    nodes.push(new IoTNode());
}

// Connecter les nœuds proches
function connectNodes() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                const opacity = 1 - distance / 150;
                ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                // Effet de données qui circulent
                if (Math.random() < 0.01) {
                    const midX = (nodes[i].x + nodes[j].x) / 2;
                    const midY = (nodes[i].y + nodes[j].y) / 2;
                    ctx.beginPath();
                    ctx.arc(midX, midY, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(118, 75, 162, 0.6)';
                    ctx.fill();
                }
            }
        }
    }
}

// Animation principale
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    connectNodes();

    requestAnimationFrame(animate);
}

animate();

// Redimensionner le canvas au resize
window.addEventListener('resize', () => {
    resizeCanvas();
});

// ============================================
// 2. SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ============================================
// NAVIGATION MOBILE
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const siteHeader = document.querySelector('.site-header');
const navMenu = document.getElementById('nav-menu');
if (navToggle && siteHeader && navMenu) {
    const toggleMenu = (force) => {
        const willOpen = typeof force === 'boolean' ? force : !siteHeader.classList.contains('menu-open');
        siteHeader.classList.toggle('menu-open', willOpen);
        document.body.classList.toggle('menu-open', willOpen);
        navToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        navMenu.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
        navToggle.setAttribute('aria-label', willOpen ? 'Fermer la navigation' : 'Ouvrir la navigation');
    };

    navToggle.addEventListener('click', () => toggleMenu());

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1100) {
            toggleMenu(false);
        }
    });

    toggleMenu(false);
}

// ============================================
// 3. SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// 4. HERO MOTION (DÉSACTIVÉ POUR LISIBILITÉ)
// ============================================
const hero = document.querySelector('.hero');
if (hero) {
    hero.style.transform = 'none';
    hero.style.opacity = '1';
}

// ============================================
// 5. ANIMATION DES CARTES AU SCROLL
// ============================================
const cards = document.querySelectorAll('.skill-card, .project-card, .cert-card, .tech-card, .tech-sphere, .contact-item');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotate(0deg)';
            }, index * 80);
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    cardObserver.observe(card);
});

// ============================================
// 6. EFFET HOVER SUR LES CONTACT ITEMS
// ============================================
const contactItems = document.querySelectorAll('.contact-item');
contactItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// 7. TYPING EFFECT POUR LE TAGLINE
// ============================================
const heroTagline = document.querySelector('.hero .hero-tagline');
if (heroTagline) {
    const text = heroTagline.textContent;
    heroTagline.textContent = '';
    heroTagline.style.borderRight = '2px solid white';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            heroTagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 40);
        } else {
            setTimeout(() => {
                heroTagline.style.borderRight = 'none';
            }, 500);
        }
    };
    
    setTimeout(typeWriter, 800);
}

// ============================================
// 8. ANIMATION DE PULSATION DES DOTS
// ============================================
const timelineDots = document.querySelectorAll('.timeline-dot');
timelineDots.forEach((dot, index) => {
    dot.style.animationDelay = `${index * 0.3}s`;
});

// ============================================
// 9. INDICATEUR DE PROGRESSION DE SCROLL
// ============================================
const scrollIndicator = document.createElement('div');
scrollIndicator.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(to right, #667eea, #764ba2);
    z-index: 9999;
    transition: width 0.3s ease;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.5);
`;
document.body.appendChild(scrollIndicator);

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollIndicator.style.width = scrolled + '%';
});

// ============================================
// 10. EASTER EGG - CLIC SUR LA PHOTO
// ============================================
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    let clickCount = 0;
    let clickTimer = null;
    
    profileImage.addEventListener('click', () => {
        clickCount++;
        
        // Effet visuel au clic
        profileImage.style.transform = 'scale(0.95)';
        setTimeout(() => {
            profileImage.style.transform = 'scale(1)';
        }, 100);
        
        // Reset après 2 secondes
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 2000);
        
        if (clickCount === 5) {
            // Animation spéciale
            profileImage.style.animation = 'none';
            setTimeout(() => {
                profileImage.style.animation = 'float 6s ease-in-out infinite';
            }, 10);
            
            // Message Easter Egg
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem 3rem;
                border-radius: 20px;
                font-size: 1.5rem;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: popIn 0.5s ease;
            `;
            message.innerHTML = '🚀 Passionné par l\'innovation<br>et les nouvelles technologies!';
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.animation = 'popOut 0.5s ease';
                setTimeout(() => {
                    document.body.removeChild(message);
                }, 500);
            }, 3000);
            
            clickCount = 0;
        }
    });
}

// ============================================
// 11. CURSEUR PERSONNALISÉ (EFFET PREMIUM)
// ============================================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid rgba(102, 126, 234, 0.8);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.15s ease;
    display: none;
`;
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.style.cssText = `
    width: 6px;
    height: 6px;
    background: rgba(102, 126, 234, 0.8);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.1s ease;
    display: none;
`;
document.body.appendChild(cursorDot);

// Afficher uniquement sur desktop
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursorDot.style.display = 'block';
        
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        
        cursorDot.style.left = e.clientX - 3 + 'px';
        cursorDot.style.top = e.clientY - 3 + 'px';
    });
    
    // Agrandir sur les éléments cliquables
    const clickables = document.querySelectorAll('a, button, .btn, .cert-link, .profile-image');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.8)';
            cursor.style.borderColor = 'rgba(118, 75, 162, 0.8)';
            cursorDot.style.transform = 'scale(2)';
            cursorDot.style.background = 'rgba(118, 75, 162, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'rgba(102, 126, 234, 0.8)';
            cursorDot.style.transform = 'scale(1)';
            cursorDot.style.background = 'rgba(102, 126, 234, 0.8)';
        });
    });
}

// ============================================
// 12. ANIMATION DE CHARGEMENT INITIAL
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// 13. EFFET PARTICLES AU SURVOL DES CARTES
// ============================================
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        createParticles(e.clientX, e.clientY);
    });
});

function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: rgba(102, 126, 234, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            left: ${x}px;
            top: ${y}px;
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animateParticle = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                document.body.removeChild(particle);
            }
        };
        
        animateParticle();
    }
}

// ============================================
// 14. ANIMATION COMPTEUR (STATS)
// ============================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ============================================
// 15. SYSTÈME DE NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'info' ? '#667eea' : '#f5576c'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============================================
// 16. DÉTECTION DE SCROLL POUR NAVBAR STICKY
// ============================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Vous pouvez ajouter une navbar sticky ici si besoin
    if (currentScroll > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// 17. SAUVEGARDE DES PRÉFÉRENCES
// ============================================
// Note: Utilisation de variables en mémoire uniquement
const userPreferences = {
    darkMode: false
};

// ============================================
// 18. ANALYTICS - TRACKING DES INTERACTIONS
// ============================================
const trackEvent = (category, action, label) => {
    console.log(`📊 Event: ${category} - ${action} - ${label}`);
    // Ici vous pouvez intégrer Google Analytics ou autre
};

// Tracker les clics sur les certifications
document.querySelectorAll('.cert-link').forEach(link => {
    link.addEventListener('click', function() {
        const certTitle = this.querySelector('.cert-title').textContent;
        trackEvent('Certification', 'Click', certTitle);
    });
});

// Tracker les clics sur les boutons CTA
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        trackEvent('CTA', 'Click', btnText);
    });
});

// ============================================
// 19. ANIMATIONS CSS DYNAMIQUES
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes popOut {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes slideIn {
        0% {
            transform: translateX(400px);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// 20. CONSOLE LOG STYLISÉ
// ============================================
console.log(
    '%c🚀 CV Interactif de Reda MOUKHFI',
    'color: #667eea; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%c💼 Ingénieur Arts et Métiers | Expert Industrie 4.0',
    'color: #764ba2; font-size: 16px; font-weight: bold;'
);
console.log(
    '%c📧 moukhfi.reda@gmail.com',
    'color: #0ea5e9; font-size: 14px;'
);
console.log(
    '%c🔗 https://www.linkedin.com/in/reda-moukhfi',
    'color: #06b6d4; font-size: 12px;'
);
console.log(
    '%c\n💡 Astuce: Cliquez 5 fois sur ma photo de profil pour une surprise!',
    'color: #f5576c; font-size: 12px; font-style: italic;'
);

// ============================================
// 21. GESTION DE LA PERFORMANCE
// ============================================
// Désactiver les animations sur les appareils bas de gamme
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('low-performance');
    console.log('⚠️ Mode performance réduite activé');
}

// ============================================
// 22. DÉTECTION DU NAVIGATEUR
// ============================================
const browserInfo = {
    isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    isFirefox: /Firefox/.test(navigator.userAgent),
    isSafari: /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
    isEdge: /Edg/.test(navigator.userAgent)
};

console.log('🌐 Navigateur détecté:', 
    browserInfo.isChrome ? 'Chrome' :
    browserInfo.isFirefox ? 'Firefox' :
    browserInfo.isSafari ? 'Safari' :
    browserInfo.isEdge ? 'Edge' : 'Autre'
);

// ============================================
// 23. LAZY LOADING DES IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================

// ============================================
// FIN DU SCRIPT
// ============================================
console.log('%c✅ Toutes les animations sont chargées et actives!', 'color: #10b981; font-weight: bold;');

