// Particles.js - Advanced Particle System with Multiple Effects

class AdvancedParticleSystem {
    constructor(canvasId = 'particleCanvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.config = {
            particleCount: 80,
            particleSize: { min: 0.5, max: 2 },
            speed: { min: 0.1, max: 0.4 },
            opacity: { min: 0.2, max: 0.6 },
            connectionDistance: 120,
            mouseInteraction: true,
            color: { r: 255, g: 255, b: 255 },
            drift: true
        };

        this.animationId = null;
        this.isPlaying = true;

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const count = window.innerWidth < 768 ?
            Math.floor(this.config.particleCount * 0.5) :
            this.config.particleCount;

        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(x = null, y = null) {
        return {
            x: x !== null ? x : Math.random() * this.canvas.width,
            y: y !== null ? y : Math.random() * this.canvas.height,
            size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
            speedX: (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min,
            speedY: (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min,
            opacity: Math.random() * (this.config.opacity.max - this.config.opacity.min) + this.config.opacity.min,
            baseOpacity: Math.random() * (this.config.opacity.max - this.config.opacity.min) + this.config.opacity.min,
            angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() - 0.5) * 0.02
        };
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        if (this.config.mouseInteraction) {
            this.canvas.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });

            // Removed click listener to prevent page freeze on event page
            // this.canvas.addEventListener('click', (e) => {
            //     this.createBurst(e.x, e.y);
            // });
        }
    }

    updateParticle(particle) {
        // Update position
        if (this.config.drift) {
            particle.angle += particle.angleSpeed;
            particle.speedX += Math.cos(particle.angle) * 0.01;
            particle.speedY += Math.sin(particle.angle) * 0.01;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction
        if (this.config.mouseInteraction && this.mouse.x !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * force * 2;
                particle.y -= Math.sin(angle) * force * 2;

                // Increase opacity near mouse
                particle.opacity = Math.min(1, particle.baseOpacity + force * 0.5);
            } else {
                particle.opacity = particle.baseOpacity;
            }
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;

        // Limit speed
        const maxSpeed = this.config.speed.max;
        particle.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, particle.speedX));
        particle.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, particle.speedY));
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${this.config.color.r}, ${this.config.color.g}, ${this.config.color.b}, ${particle.opacity})`;
        this.ctx.fill();

        // Add glow effect
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `rgba(${this.config.color.r}, ${this.config.color.g}, ${this.config.color.b}, ${particle.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * 0.15;

                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${this.config.color.r}, ${this.config.color.g}, ${this.config.color.b}, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    createBurst(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;

            const particle = this.createParticle(x, y);
            particle.speedX = Math.cos(angle) * speed;
            particle.speedY = Math.sin(angle) * speed;
            particle.opacity = 1;
            particle.size = 2;

            this.particles.push(particle);

            // Remove after animation
            setTimeout(() => {
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
            }, 2000);
        }
    }

    animate() {
        if (!this.isPlaying) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        // Draw connections
        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.animate();
        }
    }

    pause() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.createParticles();
    }

    setColor(r, g, b) {
        this.config.color = { r, g, b };
    }

    destroy() {
        this.pause();
        window.removeEventListener('resize', this.resize);
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', () => { });
            this.canvas.removeEventListener('mouseleave', () => { });
            this.canvas.removeEventListener('click', () => { });
        }
    }
}

// Utility function to create star field effect
class StarField {
    constructor(canvasId, starCount = 200) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.starCount = starCount;

        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                twinkleSpeed: 0.01 + Math.random() * 0.02,
                opacity: Math.random()
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            star.opacity += star.twinkleSpeed;
            if (star.opacity > 1 || star.opacity < 0) {
                star.twinkleSpeed *= -1;
            }

            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedParticleSystem, StarField };
}