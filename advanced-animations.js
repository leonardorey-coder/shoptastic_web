// ============================================
// SHOPTASTIC ADVANCED ANIMATIONS
// Using GSAP + ScrollTrigger + Lenis + Three.js
// ============================================

class ShoptasticAnimations {
    constructor() {
        this.init();
        this.setupLenis();
        this.setupGSAP();
        this.setupCustomCursor();
        this.setup3DScenes();
        this.setupScrollAnimations();
        this.setupInteractiveElements();
    }

    init() {
        console.log('🚀 Initializing Shoptastic Advanced Animations');
        
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        
        // Set default GSAP settings
        gsap.defaults({
            ease: "power2.out",
            duration: 1.2
        });
    }

    // ============================================
    // LENIS SMOOTH SCROLL SETUP
    // ============================================
    setupLenis() {
        // Simpler Lenis configuration for better performance
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.8,
            smoothTouch: false,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Connect Lenis with GSAP ScrollTrigger
        this.lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        console.log('✅ Lenis smooth scroll initialized');
    }

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    setupCustomCursor() {
        // Only enable custom cursor on desktop
        if (window.innerWidth < 768) return;

        // Create custom cursor
        const cursor = document.createElement('div');
        cursor.classList.add('cursor');
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;

        // Mouse movement with throttling
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    cursor.style.left = mouseX + 'px';
                    cursor.style.top = mouseY + 'px';
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .morphing-card, .app-screenshot');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        console.log('✅ Custom cursor initialized');
    }

    // ============================================
    // GSAP ANIMATIONS SETUP
    // ============================================
    setupGSAP() {
        // Hero text split animation
        this.setupTextSplitAnimations();
        
        // Counter animations
        this.setupCounterAnimations();
        
        // Morphing buttons
        this.setupMorphingButtons();
        
        // Card animations
        this.setupCardAnimations();

        console.log('✅ GSAP animations initialized');
    }

    setupTextSplitAnimations() {
        const splitTexts = document.querySelectorAll('.split-text');
        
        splitTexts.forEach(text => {
            const chars = text.textContent.split('');
            text.innerHTML = chars.map(char => 
                char === ' ' ? ' ' : `<span class="char">${char}</span>`
            ).join('');

            gsap.from(text.querySelectorAll('.char'), {
                duration: 0.8,
                opacity: 0,
                y: 50,
                rotationX: -90,
                stagger: 0.02,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: text,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter-stat');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const counterEl = counter.querySelector('.counter');
            const progressBar = counter.querySelector('.stat-progress');
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 80%",
                onEnter: () => {
                    // Counter animation
                    gsap.to({ val: 0 }, {
                        duration: 2,
                        val: target,
                        ease: "power2.out",
                        onUpdate: function() {
                            const suffix = counterEl.textContent.includes('%') ? '%' : 'x';
                            counterEl.textContent = Math.round(this.targets()[0].val) + suffix;
                        }
                    });

                    // Progress bar animation
                    gsap.to(progressBar, {
                        width: "100%",
                        duration: 2,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    setupMorphingButtons() {
        const buttons = document.querySelectorAll('.morphing-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4)",
                    duration: 0.3
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.2)",
                    duration: 0.3
                });
            });

            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
            });
        });
    }

    setupCardAnimations() {
        const cards = document.querySelectorAll('.morphing-card');
        
        // Clear any existing CSS transitions that might conflict
        cards.forEach(card => {
            card.style.transition = 'none';
        });
        
        // Set initial state for cards
        gsap.set(cards, {
            y: 50,
            opacity: 0
        });
        
        cards.forEach((card, index) => {
            // Simple one-time entrance animation
            ScrollTrigger.create({
                trigger: card,
                start: "top 85%",
                once: true, // Solo ejecutar una vez
                onEnter: () => {
                    gsap.to(card, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: "power2.out"
                    });
                }
            });

            // Simplified hover animations
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -5,
                    scale: 1.02,
                    duration: 0.3
                });

                const icon = card.querySelector('.rotating-icon');
                if (icon) {
                    gsap.to(icon, {
                        rotation: 360,
                        duration: 0.6
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3
                });
            });
        });
    }

    // ============================================
    // 3D SCENES WITH THREE.JS
    // ============================================
    setup3DScenes() {
        // Only enable 3D on high-performance devices
        if (window.innerWidth < 1024 || window.devicePixelRatio > 2) {
            console.log('⚠️ 3D scenes disabled for performance');
            return;
        }
        
        this.setupHero3D();
        console.log('✅ Three.js 3D scenes initialized');
    }

    setupHero3D() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create shopping-themed particles (cart-like shapes)
        const particlesGroup = new THREE.Group();
        
        // Shopping cart wireframes
        for (let i = 0; i < 8; i++) {
            const cartGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.25);
            const cartMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x10B981, 
                wireframe: true,
                transparent: true,
                opacity: 0.15
            });
            const cart = new THREE.Mesh(cartGeometry, cartMaterial);
            
            // Random positioning
            cart.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            );
            
            // Random rotation
            cart.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            particlesGroup.add(cart);
        }

        // Price tag shapes (diamond-like)
        for (let i = 0; i < 6; i++) {
            const tagGeometry = new THREE.OctahedronGeometry(0.2);
            const tagMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x10B981, 
                transparent: true,
                opacity: 0.1
            });
            const tag = new THREE.Mesh(tagGeometry, tagMaterial);
            
            tag.position.set(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 18,
                (Math.random() - 0.5) * 12
            );
            
            particlesGroup.add(tag);
        }

        // List checkmark particles
        const checkmarkParticles = new THREE.BufferGeometry();
        const checkmarkCount = 40;
        const checkmarkArray = new Float32Array(checkmarkCount * 3);

        for (let i = 0; i < checkmarkCount * 3; i++) {
            checkmarkArray[i] = (Math.random() - 0.5) * 30;
        }

        checkmarkParticles.setAttribute('position', new THREE.BufferAttribute(checkmarkArray, 3));
        
        const checkmarkMaterial = new THREE.PointsMaterial({
            size: 0.08,
            color: 0x10B981,
            transparent: true,
            opacity: 0.3
        });

        const checkmarkMesh = new THREE.Points(checkmarkParticles, checkmarkMaterial);
        
        scene.add(particlesGroup);
        scene.add(checkmarkMesh);

        // Barcode-like background element
        const barcodeGeometry = new THREE.PlaneGeometry(15, 0.05);
        const barcodeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x10B981, 
            transparent: true,
            opacity: 0.05
        });
        
        for (let i = 0; i < 12; i++) {
            const barcode = new THREE.Mesh(barcodeGeometry, barcodeMaterial);
            barcode.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                -8 + Math.random() * 2
            );
            barcode.rotation.z = Math.random() * Math.PI;
            scene.add(barcode);
        }

        camera.position.z = 8;

        // Optimized animation loop with FPS control
        let lastTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;

        const animate = (currentTime) => {
            requestAnimationFrame(animate);

            if (currentTime - lastTime >= frameInterval) {
                // Rotate shopping elements slowly
                particlesGroup.rotation.x += 0.001;
                particlesGroup.rotation.y += 0.002;

                // Float checkmark particles
                checkmarkMesh.rotation.x += 0.002;
                checkmarkMesh.rotation.y += 0.003;

                // Gentle floating animation for individual elements
                particlesGroup.children.forEach((child, index) => {
                    child.rotation.x += 0.01 * (index % 3 + 1);
                    child.rotation.y += 0.005 * (index % 2 + 1);
                    child.position.y += Math.sin(currentTime * 0.001 + index) * 0.002;
                });

                renderer.render(scene, camera);
                lastTime = currentTime;
            }
        };

        animate(0);

        // Responsive
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupSolution3D() {
        const canvas = document.getElementById('solution-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create orbiting spheres
        const spheres = [];
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: 0x10B981,
                transparent: true,
                opacity: 0.6
            });
            const sphere = new THREE.Mesh(geometry, material);
            
            const radius = 3 + i * 0.5;
            sphere.position.set(radius, 0, 0);
            spheres.push({ mesh: sphere, radius, angle: (i * Math.PI * 2) / 5 });
            scene.add(sphere);
        }

        camera.position.z = 8;

        const animate = () => {
            requestAnimationFrame(animate);

            spheres.forEach((sphere, index) => {
                sphere.angle += 0.01 * (index + 1);
                sphere.mesh.position.x = Math.cos(sphere.angle) * sphere.radius;
                sphere.mesh.position.y = Math.sin(sphere.angle) * sphere.radius;
            });

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    setupScrollAnimations() {
        // Parallax elements
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(el => {
            const speed = el.dataset.scrollSpeed || 0.5;
            gsap.to(el, {
                y: () => -window.innerHeight * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Las animaciones de tarjetas ya se manejan individualmente en setupCardAnimations()

        // Feature items animation
        const featureGroups = document.querySelectorAll('.staggered-features');
        featureGroups.forEach(group => {
            const features = group.querySelectorAll('.morphing-feature');
            features.forEach((feature, index) => {
                const delay = parseFloat(feature.dataset.delay) || 0;
                gsap.from(feature, {
                    x: -100,
                    opacity: 0,
                    duration: 1,
                    delay: delay,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: feature,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            });
        });

        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            ScrollTrigger.create({
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    gsap.to(scrollIndicator, {
                        opacity: self.progress > 0.1 ? 0 : 1,
                        duration: 0.3
                    });
                }
            });
        }

        console.log('✅ Scroll animations initialized');
    }

    // ============================================
    // INTERACTIVE ELEMENTS
    // ============================================
    setupInteractiveElements() {
        // Floating phone interactions
        const floatingPhones = document.querySelectorAll('.floating-phone, .floating-phone-2');
        floatingPhones.forEach(phone => {
            phone.addEventListener('mouseenter', () => {
                gsap.to(phone, {
                    scale: 1.1,
                    rotationY: 10,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            });

            phone.addEventListener('mouseleave', () => {
                gsap.to(phone, {
                    scale: 1,
                    rotationY: 0,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            });
        });

        // Pulse icons
        const pulseIcons = document.querySelectorAll('.pulse-icon');
        pulseIcons.forEach(icon => {
            gsap.to(icon, {
                scale: 1.2,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        });

        // Orbit rings
        const orbitRings = document.querySelectorAll('.orbit-ring');
        orbitRings.forEach((ring, index) => {
            gsap.to(ring, {
                rotation: 360,
                duration: 10 + index * 5,
                repeat: -1,
                ease: "none"
            });
        });

        console.log('✅ Interactive elements initialized');
    }

    // ============================================
    // UTILITY METHODS
    // ============================================
    createRippleEffect(e, button) {
        const ripple = button.querySelector('.btn-ripple');
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.set(ripple, {
            x: x,
            y: y,
            scale: 0,
            opacity: 1
        });

        gsap.to(ripple, {
            scale: 4,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    }

    // Cleanup method
    destroy() {
        this.lenis.destroy();
        ScrollTrigger.killAll();
        console.log('🧹 Animations cleaned up');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shoptasticAnimations = new ShoptasticAnimations();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoptasticAnimations;
} 