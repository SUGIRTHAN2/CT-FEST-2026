// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Blue-themed particles
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(100, 180, 255, ${particle.opacity})`;
            this.ctx.fill();

            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(45, 127, 249, ${0.15 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Realistic Cinematic Intro with Bullet Effects - FIXED TIMING
class CinematicIntro {
    constructor() {
        this.titleText = "CT FEST,2026 ";
        this.letterIndex = 0;
        this.titleContainer = document.getElementById('titleContainer');
        this.bullet = document.getElementById('bullet');
        this.impactFlash = document.getElementById('impactFlash');
        this.introContainer = document.getElementById('introContainer');
        this.mainContent = document.getElementById('mainContent');

        // Create additional effect elements
        this.createEffectElements();

        this.init();
    }

    createEffectElements() {
        // Muzzle Flash
        this.muzzleFlash = document.createElement('div');
        this.muzzleFlash.className = 'muzzle-flash';
        document.body.appendChild(this.muzzleFlash);

        // Bullet Trail
        this.bulletTrail = document.createElement('div');
        this.bulletTrail.className = 'bullet-trail';
        document.body.appendChild(this.bulletTrail);

        // Shell Casing
        this.shellCasing = document.createElement('div');
        this.shellCasing.className = 'shell-casing';
        document.body.appendChild(this.shellCasing);

        // Gun Smoke
        this.gunSmoke = document.createElement('div');
        this.gunSmoke.className = 'gun-smoke';
        document.body.appendChild(this.gunSmoke);

        // Shockwave Ring
        this.shockwave = document.createElement('div');
        this.shockwave.className = 'shockwave-ring';
        document.body.appendChild(this.shockwave);

        // Bullet Hole
        this.bulletHole = document.createElement('div');
        this.bulletHole.className = 'bullet-hole';
        document.body.appendChild(this.bulletHole);
    }

    init() {
        document.body.classList.add('intro-active');

        // Wait 0.5 seconds before starting
        setTimeout(() => {
            this.shootNextBullet();
        }, 500);
    }

    shootNextBullet() {
        if (this.letterIndex >= this.titleText.length) {
            this.completeIntro();
            return;
        }

        // Reveal letter at the start of the sequence
        this.revealLetter();

        // 1. Muzzle Flash
        this.triggerMuzzleFlash();

        // 2. Shoot Bullet with trail
        setTimeout(() => {
            this.triggerBulletShot();
        }, 50);

        // 3. Eject Shell Casing
        setTimeout(() => {
            this.triggerShellEject();
        }, 100);

        // 4. Gun Smoke
        setTimeout(() => {
            this.triggerGunSmoke();
        }, 150);

        // 5. Screen Shake
        this.triggerScreenShake();

        // 6. Impact at target (without reveal, since letter is already shown)
        setTimeout(() => {
            this.triggerImpact();
        }, 250);

        // 7. Reset bullet for next shot
        setTimeout(() => {
            this.bullet.classList.remove('shooting');
            this.bulletTrail.classList.remove('active');
        }, 400);

        // 8. Schedule next bullet
        setTimeout(() => {
            this.shootNextBullet();
        }, 300);
    }

    triggerMuzzleFlash() {
        this.muzzleFlash.classList.add('active');
        setTimeout(() => {
            this.muzzleFlash.classList.remove('active');
        }, 150);
    }

    triggerBulletShot() {
        this.bullet.classList.add('shooting');
        this.bulletTrail.classList.add('active');
    }

    triggerShellEject() {
        this.shellCasing.classList.add('active');
        setTimeout(() => {
            this.shellCasing.classList.remove('active');
        }, 800);
    }

    triggerGunSmoke() {
        this.gunSmoke.classList.add('active');
        setTimeout(() => {
            this.gunSmoke.classList.remove('active');
        }, 1200);
    }

    triggerScreenShake() {
        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 200);
    }

    triggerImpact() {
        // Main impact flash
        this.impactFlash.classList.add('active');

        // Bullet hole
        this.bulletHole.classList.add('active');

        // Create spark particles
        this.createRealisticSparks();

        // Create glass shatter effect
        this.createGlassShatter();

        // Letter is already revealed at start, so no reveal here

        // Remove effects
        setTimeout(() => {
            this.impactFlash.classList.remove('active');
        }, 400);

        setTimeout(() => {
            this.bulletHole.classList.remove('active');
        }, 2000);
    }

    createRealisticSparks() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const sparkCount = 25;

        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark-particle';

            const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.3;
            const velocity = 80 + Math.random() * 120;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity + Math.random() * 30;

            spark.style.left = centerX + 'px';
            spark.style.top = centerY + 'px';
            spark.style.setProperty('--tx', tx + 'px');
            spark.style.setProperty('--ty', ty + 'px');

            const size = 0.6 + Math.random() * 0.8;
            spark.style.transform = `scale(${size})`;

            document.body.appendChild(spark);

            spark.style.animation = `sparkFly ${0.4 + Math.random() * 0.3}s ease-out forwards`;

            setTimeout(() => {
                spark.remove();
            }, 700);
        }
    }

    createGlassShatter() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const shardCount = 12;

        for (let i = 0; i < shardCount; i++) {
            const shard = document.createElement('div');
            shard.className = 'glass-shard';

            const angle = (Math.PI * 2 * i) / shardCount;
            const distance = 60 + Math.random() * 80;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rotate = Math.random() * 360;

            shard.style.left = '50%';
            shard.style.top = '50%';
            shard.style.setProperty('--tx', tx + 'px');
            shard.style.setProperty('--ty', ty + 'px');
            shard.style.setProperty('--rotate', rotate + 'deg');
            shard.style.transform = `rotate(${angle * (180 / Math.PI)}deg)`;

            document.body.appendChild(shard);

            shard.classList.add('active');

            setTimeout(() => {
                shard.remove();
            }, 600);
        }
    }

    revealLetter() {
        const char = this.titleText[this.letterIndex];
        const letterSpan = document.createElement('span');
        letterSpan.className = 'title-letter';

        if (char === ' ') {
            letterSpan.classList.add('space');
            letterSpan.innerHTML = '&nbsp;';
        } else if (char === ',') {
            letterSpan.textContent = char;
        } else {
            letterSpan.textContent = char;
        }

        this.titleContainer.appendChild(letterSpan);
        this.letterIndex++;
    }

    completeIntro() {
        // Add complete class for glow effect
        this.titleContainer.classList.add('complete');

        // Final dramatic effect
        this.createFinalFlourish();

        // Keep "CT FEST,26" visible for 2 full seconds BEFORE starting fade transition
        setTimeout(() => {
            this.transitionToMain();
        }, 1000);  // Changed from 1000 to 2000 - title stays visible for 2 seconds
    }

    createFinalFlourish() {
        const rect = this.titleContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'spark-particle';
            // Blue themed particles
            particle.style.background = 'linear-gradient(to bottom, #fff 0%, #00d4ff 50%, #2d7ff9 100%)';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');

            document.body.appendChild(particle);

            particle.style.animation = `sparkFly ${1 + Math.random() * 0.5}s ease-out forwards`;

            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    }

    transitionToMain() {
        // Fade out intro
        this.introContainer.classList.add('fade-out');

        // Show main content AFTER fade completes (not immediately)
        setTimeout(() => {
            this.mainContent.classList.remove('hidden');
            document.body.classList.remove('intro-active');
        }, 500);  // Wait for fade-out animation to complete

        // Clean up effect elements safely
        setTimeout(() => {
            if (this.muzzleFlash && this.muzzleFlash.parentNode) this.muzzleFlash.remove();
            if (this.bulletTrail && this.bulletTrail.parentNode) this.bulletTrail.remove();
            if (this.shellCasing && this.shellCasing.parentNode) this.shellCasing.remove();
            if (this.gunSmoke && this.gunSmoke.parentNode) this.gunSmoke.remove();
            if (this.shockwave && this.shockwave.parentNode) this.shockwave.remove();
            if (this.bulletHole && this.bulletHole.parentNode) this.bulletHole.remove();
        }, 1000);

        // Trigger event cards animation
        setTimeout(() => {
            this.animateEventCards();
        }, 800);  // Start animating cards slightly before main content fully appears

        // Mark intro as shown
        sessionStorage.setItem('introShown', 'true');
    }

    animateEventCards() {
        const eventCards = document.querySelectorAll('.event-card');
        const container = document.querySelector('.events-container');

        if (container) {
            container.classList.add('fade-slide-up-stagger', 'active');
        }

        eventCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');

                setTimeout(() => {
                    card.classList.add('floating');
                }, 1000 + (index * 100));
            }, index * 80);
        });
    }
}

// FIXED Event Card Handler - Clean navigation without modal bugs
class EventCardHandler {
    constructor() {
        this.eventCards = document.querySelectorAll('.event-card');
        this.init();
    }

    init() {
        this.eventCards.forEach(card => {
            // Add click handler to the entire card
            card.addEventListener('click', (e) => {
                // Get event ID from data attribute
                const eventId = card.getAttribute('data-event');

                if (eventId) {
                    // Navigate to the event detail page
                    window.location.href = `/event/${eventId}`;
                }
            });

            // Add keyboard support for accessibility
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }
}

// Smooth Interactions
class SmoothInteractions {
    constructor() {
        this.init();
    }

    init() {
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

        this.addRippleEffect();
    }

    addRippleEffect() {
        const buttons = document.querySelectorAll('.apply-btn');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// Performance Optimizer
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeForDevice();
        this.optimizeParticles();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeForDevice() {
        const isLowEnd = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isLowEnd) {
            document.body.classList.add('low-end-device');
        }
    }

    optimizeParticles() {
        if (window.innerWidth < 768) {
            const canvas = document.getElementById('particleCanvas');
            if (canvas && window.particleSystem) {
                window.particleSystem.particleCount = 40;
                window.particleSystem.init();
            }
        }
    }
}

// Accessibility Enhancer
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addFocusIndicators();
    }

    addKeyboardNavigation() {
        const eventCards = document.querySelectorAll('.event-card-front');

        eventCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            const titleElement = card.querySelector('.event-title');
            if (titleElement) {
                card.setAttribute('aria-label', `Event ${index + 1}: ${titleElement.textContent}`);
            }
        });
    }

    addFocusIndicators() {
        const focusableElements = document.querySelectorAll('a, button, [tabindex="0"]');

        focusableElements.forEach(element => {
            element.addEventListener('focus', function () {
                this.style.outline = '2px solid #2d7ff9';
                this.style.outlineOffset = '4px';
            });

            element.addEventListener('blur', function () {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
}

// Function to animate event cards
function animateEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    const container = document.querySelector('.events-container');

    if (container) {
        container.classList.add('fade-slide-up-stagger', 'active');
    }

    eventCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');

            setTimeout(() => {
                card.classList.add('floating');
            }, 1000 + (index * 100));
        }, index * 80);
    });
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .apply-btn {
        position: relative;
        overflow: hidden;
    }
    
    .apply-btn .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .low-end-device .particle-canvas {
        display: none;
    }
    
    .low-end-device .title-letter {
        animation-duration: 0.2s !important;
    }
    
    .low-end-device .bullet.shooting {
        animation-duration: 0.3s !important;
    }
`;
document.head.appendChild(style);

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        if (el && el.parentNode) el.remove();
    });
});

window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Function to animate event cards
function animateEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    const container = document.querySelector('.events-container');

    if (container) {
        container.classList.add('fade-slide-up-stagger', 'active');
    }

    eventCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');

            setTimeout(() => {
                card.classList.add('floating');
            }, 1000 + (index * 100));
        }, index * 80);
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if intro has already been shown in this session
        if (sessionStorage.getItem('introShown') === 'true') {
            // Skip intro, show main content directly
            const mainContent = document.getElementById('mainContent');
            const introContainer = document.getElementById('introContainer');
            if (mainContent) mainContent.classList.remove('hidden');
            if (introContainer) introContainer.style.display = 'none';
            document.body.classList.remove('intro-active');

            // Animate event cards
            setTimeout(() => {
                animateEventCards();
            }, 300);

            // Still initialize particles and other components
            window.particleSystem = new ParticleSystem();
            const eventCardHandler = new EventCardHandler();
            const smoothInteractions = new SmoothInteractions();
            const performanceOptimizer = new PerformanceOptimizer();
            const accessibilityEnhancer = new AccessibilityEnhancer();
        } else {
            // Run intro for the first time
            window.particleSystem = new ParticleSystem();
            const cinematicIntro = new CinematicIntro();
            const eventCardHandler = new EventCardHandler();
            const smoothInteractions = new SmoothInteractions();
            const performanceOptimizer = new PerformanceOptimizer();
            const accessibilityEnhancer = new AccessibilityEnhancer();
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});