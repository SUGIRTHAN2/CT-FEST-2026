// Intro.js - Advanced Cinematic Introduction System
// Handles the complete bullet impact sequence and title reveal

class AdvancedCinematicIntro {
    constructor() {
        this.titleText = "CT FEST,2K26 ";
        this.letterIndex = 0;
        this.titleContainer = document.getElementById('titleContainer');
        this.bullet = document.getElementById('bullet');
        this.impactFlash = document.getElementById('impactFlash');
        this.introContainer = document.getElementById('introContainer');
        this.mainContent = document.getElementById('mainContent');
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        this.bulletSpeed = 0.6; // seconds
        this.impactDelay = 0.4; // seconds
        this.nextBulletDelay = 0.8; // seconds
        this.sparkCount = 20;

        this.soundEnabled = false; // Set to true if you add sound files
        this.sounds = {};

        this.init();
    }

    init() {
        document.body.classList.add('intro-active');
        this.createVignette();

        // Wait 2 seconds before starting
        setTimeout(() => {
            this.startIntroSequence();
        }, 2000);
    }

    createVignette() {
        const vignette = document.createElement('div');
        vignette.className = 'vignette';
        document.body.appendChild(vignette);
    }

    startIntroSequence() {
        this.shootNextBullet();
    }

    shootNextBullet() {
        if (this.letterIndex >= this.titleText.length) {
            this.completeIntro();
            return;
        }

        // Shoot bullet
        this.bullet.classList.add('shooting');

        // Play shoot sound (if enabled)
        if (this.soundEnabled && this.sounds.shoot) {
            this.sounds.shoot.play();
        }

        // Create screen shake
        this.triggerScreenShake();

        // Impact flash at peak
        setTimeout(() => {
            this.triggerImpact();
        }, this.impactDelay * 1000);

        // Reset bullet for next shot
        setTimeout(() => {
            this.bullet.classList.remove('shooting');
        }, this.bulletSpeed * 1000);

        // Schedule next bullet
        setTimeout(() => {
            this.shootNextBullet();
        }, this.nextBulletDelay * 1000);
    }

    triggerScreenShake() {
        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 300);
    }

    triggerImpact() {
        // Flash effect
        this.impactFlash.classList.add('active');

        // Create spark particles
        this.createSparkParticles();

        // Create glass crack effect
        this.createGlassCrack();

        // Reveal letter
        this.revealLetter();

        // Play impact sound (if enabled)
        if (this.soundEnabled && this.sounds.impact) {
            this.sounds.impact.play();
        }

        // Remove flash
        setTimeout(() => {
            this.impactFlash.classList.remove('active');
        }, 400);
    }

    createSparkParticles() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < this.sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark-particle';

            const angle = (Math.PI * 2 * i) / this.sparkCount;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            spark.style.left = centerX + 'px';
            spark.style.top = centerY + 'px';
            spark.style.setProperty('--tx', tx + 'px');
            spark.style.setProperty('--ty', ty + 'px');

            document.body.appendChild(spark);

            spark.style.animation = `sparkFly ${0.5 + Math.random() * 0.3}s ease-out forwards`;

            setTimeout(() => {
                spark.remove();
            }, 800);
        }
    }

    createGlassCrack() {
        const crack = document.createElement('div');
        crack.className = 'crack-overlay';

        // Create radial crack lines
        for (let i = 0; i < 8; i++) {
            const line = document.createElement('div');
            line.className = 'crack-line';

            const angle = (360 / 8) * i;
            const length = 50 + Math.random() * 100;

            line.style.width = '2px';
            line.style.height = length + 'px';
            line.style.left = '50%';
            line.style.top = '50%';
            line.style.transform = `rotate(${angle}deg) translateY(-50%)`;

            crack.appendChild(line);
        }

        document.body.appendChild(crack);
        crack.classList.add('active');

        setTimeout(() => {
            crack.remove();
        }, 500);
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

        // Add elastic bounce to the letter
        setTimeout(() => {
            letterSpan.classList.add('elastic-bounce');
        }, 50);
    }

    completeIntro() {
        // Add complete class for glow effect
        this.titleContainer.classList.add('complete');

        // Add final flourish
        this.createFinalFlourish();

        // Wait a moment, then transition to main content
        setTimeout(() => {
            this.transitionToMain();
        }, 1500);
    }

    createFinalFlourish() {
        // Create particles bursting from the title
        const rect = this.titleContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'spark-particle';
            particle.style.background = '#ff6b35';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 150;
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

        // Show main content
        this.mainContent.classList.remove('hidden');
        document.body.classList.remove('intro-active');

        // Remove vignette
        const vignette = document.querySelector('.vignette');
        if (vignette) {
            setTimeout(() => {
                vignette.remove();
            }, 800);
        }

        // Trigger event cards animation
        setTimeout(() => {
            this.animateEventCards();
        }, 400);
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

                // Add hover animation class after a delay
                setTimeout(() => {
                    card.classList.add('floating');
                }, 1000 + (index * 100));
            }, index * 100);
        });
    }

    // Optional: Add sound effects
    loadSounds() {
        this.sounds.shoot = new Audio('path/to/shoot-sound.mp3');
        this.sounds.impact = new Audio('path/to/impact-sound.mp3');

        // Preload
        this.sounds.shoot.load();
        this.sounds.impact.load();

        this.soundEnabled = true;
    }

    // Skip intro (can be triggered by a button or key press)
    skipIntro() {
        this.letterIndex = this.titleText.length;
        this.titleContainer.innerHTML = '';

        // Add all letters instantly
        for (let char of this.titleText) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'title-letter';

            if (char === ' ') {
                letterSpan.classList.add('space');
                letterSpan.innerHTML = '&nbsp;';
            } else {
                letterSpan.textContent = char;
            }

            letterSpan.style.opacity = '1';
            letterSpan.style.transform = 'scale(1) rotate(0deg)';
            this.titleContainer.appendChild(letterSpan);
        }

        this.completeIntro();
    }
}

// Create smoke effect on page load
function createSmokeEffect() {
    const smokeCount = 5;

    for (let i = 0; i < smokeCount; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';
            smoke.style.left = Math.random() * window.innerWidth + 'px';
            smoke.style.bottom = '0px';
            smoke.style.animationDelay = Math.random() * 2 + 's';

            document.body.appendChild(smoke);

            setTimeout(() => {
                smoke.remove();
            }, 3000);
        }, i * 600);
    }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Smoke effect is optional
        // createSmokeEffect();
    });
} else {
    // createSmokeEffect();
}

// Export for use in main events.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedCinematicIntro;
}// Intro.js - Advanced Cinematic Introduction System
// Handles the complete bullet impact sequence and title reveal

class AdvancedCinematicIntro {
    constructor() {
        this.titleText = "CT FEST,2K26 ";
        this.letterIndex = 0;
        this.titleContainer = document.getElementById('titleContainer');
        this.bullet = document.getElementById('bullet');
        this.impactFlash = document.getElementById('impactFlash');
        this.introContainer = document.getElementById('introContainer');
        this.mainContent = document.getElementById('mainContent');
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        this.bulletSpeed = 0.6; // seconds
        this.impactDelay = 0.4; // seconds
        this.nextBulletDelay = 0.8; // seconds
        this.sparkCount = 20;

        this.soundEnabled = false; // Set to true if you add sound files
        this.sounds = {};

        this.init();
    }

    init() {
        document.body.classList.add('intro-active');
        this.createVignette();

        // Wait 2 seconds before starting
        setTimeout(() => {
            this.startIntroSequence();
        }, 2000);
    }

    createVignette() {
        const vignette = document.createElement('div');
        vignette.className = 'vignette';
        document.body.appendChild(vignette);
    }

    startIntroSequence() {
        this.shootNextBullet();
    }

    shootNextBullet() {
        if (this.letterIndex >= this.titleText.length) {
            this.completeIntro();
            return;
        }

        // Shoot bullet
        this.bullet.classList.add('shooting');

        // Play shoot sound (if enabled)
        if (this.soundEnabled && this.sounds.shoot) {
            this.sounds.shoot.play();
        }

        // Create screen shake
        this.triggerScreenShake();

        // Impact flash at peak
        setTimeout(() => {
            this.triggerImpact();
        }, this.impactDelay * 1000);

        // Reset bullet for next shot
        setTimeout(() => {
            this.bullet.classList.remove('shooting');
        }, this.bulletSpeed * 1000);

        // Schedule next bullet
        setTimeout(() => {
            this.shootNextBullet();
        }, this.nextBulletDelay * 1000);
    }

    triggerScreenShake() {
        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 300);
    }

    triggerImpact() {
        // Flash effect
        this.impactFlash.classList.add('active');

        // Create spark particles
        this.createSparkParticles();

        // Create glass crack effect
        this.createGlassCrack();

        // Reveal letter
        this.revealLetter();

        // Play impact sound (if enabled)
        if (this.soundEnabled && this.sounds.impact) {
            this.sounds.impact.play();
        }

        // Remove flash
        setTimeout(() => {
            this.impactFlash.classList.remove('active');
        }, 400);
    }

    createSparkParticles() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < this.sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark-particle';

            const angle = (Math.PI * 2 * i) / this.sparkCount;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            spark.style.left = centerX + 'px';
            spark.style.top = centerY + 'px';
            spark.style.setProperty('--tx', tx + 'px');
            spark.style.setProperty('--ty', ty + 'px');

            document.body.appendChild(spark);

            spark.style.animation = `sparkFly ${0.5 + Math.random() * 0.3}s ease-out forwards`;

            setTimeout(() => {
                spark.remove();
            }, 800);
        }
    }

    createGlassCrack() {
        const crack = document.createElement('div');
        crack.className = 'crack-overlay';

        // Create radial crack lines
        for (let i = 0; i < 8; i++) {
            const line = document.createElement('div');
            line.className = 'crack-line';

            const angle = (360 / 8) * i;
            const length = 50 + Math.random() * 100;

            line.style.width = '2px';
            line.style.height = length + 'px';
            line.style.left = '50%';
            line.style.top = '50%';
            line.style.transform = `rotate(${angle}deg) translateY(-50%)`;

            crack.appendChild(line);
        }

        document.body.appendChild(crack);
        crack.classList.add('active');

        setTimeout(() => {
            crack.remove();
        }, 500);
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

        // Add elastic bounce to the letter
        setTimeout(() => {
            letterSpan.classList.add('elastic-bounce');
        }, 50);
    }

    completeIntro() {
        // Add complete class for glow effect
        this.titleContainer.classList.add('complete');

        // Add final flourish
        this.createFinalFlourish();

        // Wait a moment, then transition to main content
        setTimeout(() => {
            this.transitionToMain();
        }, 1500);
    }

    createFinalFlourish() {
        // Create particles bursting from the title
        const rect = this.titleContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'spark-particle';
            particle.style.background = '#ff6b35';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 150;
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

        // Show main content
        this.mainContent.classList.remove('hidden');
        document.body.classList.remove('intro-active');

        // Remove vignette
        const vignette = document.querySelector('.vignette');
        if (vignette) {
            setTimeout(() => {
                vignette.remove();
            }, 800);
        }

        // Trigger event cards animation
        setTimeout(() => {
            this.animateEventCards();
        }, 400);
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

                // Add hover animation class after a delay
                setTimeout(() => {
                    card.classList.add('floating');
                }, 1000 + (index * 100));
            }, index * 100);
        });
    }

    // Optional: Add sound effects
    loadSounds() {
        this.sounds.shoot = new Audio('path/to/shoot-sound.mp3');
        this.sounds.impact = new Audio('path/to/impact-sound.mp3');

        // Preload
        this.sounds.shoot.load();
        this.sounds.impact.load();

        this.soundEnabled = true;
    }

    // Skip intro (can be triggered by a button or key press)
    skipIntro() {
        this.letterIndex = this.titleText.length;
        this.titleContainer.innerHTML = '';

        // Add all letters instantly
        for (let char of this.titleText) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'title-letter';

            if (char === ' ') {
                letterSpan.classList.add('space');
                letterSpan.innerHTML = '&nbsp;';
            } else {
                letterSpan.textContent = char;
            }

            letterSpan.style.opacity = '1';
            letterSpan.style.transform = 'scale(1) rotate(0deg)';
            this.titleContainer.appendChild(letterSpan);
        }

        this.completeIntro();
    }
}

// Create smoke effect on page load
function createSmokeEffect() {
    const smokeCount = 5;

    for (let i = 0; i < smokeCount; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';
            smoke.style.left = Math.random() * window.innerWidth + 'px';
            smoke.style.bottom = '0px';
            smoke.style.animationDelay = Math.random() * 2 + 's';

            document.body.appendChild(smoke);

            setTimeout(() => {
                smoke.remove();
            }, 3000);
        }, i * 600);
    }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Smoke effect is optional
        // createSmokeEffect();
    });
} else {
    // createSmokeEffect();
}

// Export for use in main events.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedCinematicIntro;
}