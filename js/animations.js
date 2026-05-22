/* Extra portfolio motion: particles, parallax, counters, typing, and tilt. */

(function () {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const scrollProgress = document.querySelector('#scrollProgress span');
    const cursorGlow = document.getElementById('cursorGlow');
    const heroRole = document.querySelector('.hero-role');
    const heroBackdrop = document.querySelector('.hero-backdrop');
    const particleCanvas = document.getElementById('particleCanvas');

    if (!prefersReducedMotion) {
        document.body.classList.add('motion-ready');
    }

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    }

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    if (!prefersReducedMotion && finePointer) {
        window.addEventListener('pointermove', event => {
            const x = event.clientX / window.innerWidth - 0.5;
            const y = event.clientY / window.innerHeight - 0.5;

            root.style.setProperty('--motion-x', String(x * -18));
            root.style.setProperty('--motion-y', String(y * -14));

            if (cursorGlow) {
                cursorGlow.style.left = `${event.clientX}px`;
                cursorGlow.style.top = `${event.clientY}px`;
                cursorGlow.classList.add('is-active');
            }
        }, { passive: true });

        window.addEventListener('pointerleave', () => {
            if (cursorGlow) cursorGlow.classList.remove('is-active');
            if (heroBackdrop) {
                root.style.setProperty('--motion-x', '0');
                root.style.setProperty('--motion-y', '0');
            }
        });
    }

    function animateCounter(counter) {
        if (counter.dataset.counted === 'true') return;

        const target = Number(counter.dataset.count || 0);
        const suffix = counter.dataset.suffix || '';
        counter.dataset.counted = 'true';

        if (prefersReducedMotion) {
            counter.textContent = `${target}${suffix}`;
            return;
        }

        const duration = 1300;
        const start = performance.now();

        function tick(now) {
            const elapsed = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - elapsed, 3);
            counter.textContent = `${Math.round(target * eased)}${suffix}`;

            if (elapsed < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    const counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.55 });

        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    function startTypewriter() {
        if (!heroRole || prefersReducedMotion) return;

        const phrases = [
            'Certified IFS Cloud Web Developer',
            'IFS ERP Technical Consultant',
            'Boomi Integration Specialist',
            'Cloud Migration Consultant'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        heroRole.classList.add('is-typing');
        heroRole.setAttribute('aria-live', 'polite');

        function typeTick() {
            const phrase = phrases[phraseIndex];
            charIndex += deleting ? -1 : 1;
            heroRole.textContent = phrase.slice(0, charIndex);

            let delay = deleting ? 34 : 54;

            if (!deleting && charIndex === phrase.length) {
                delay = 1550;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 420;
            }

            window.setTimeout(typeTick, delay);
        }

        window.setTimeout(typeTick, 900);
    }

    startTypewriter();

    function setupTiltCards() {
        if (prefersReducedMotion || !finePointer) return;

        const cards = document.querySelectorAll([
            '.profile-card',
            '.impact-card',
            '.skill-block',
            '.education-card',
            '.cert-item',
            '.award-item',
            '.contact-card:not(.contact-card-static)',
            '.contact-form-wrapper'
        ].join(','));

        cards.forEach(card => {
            card.classList.add('motion-card');

            if (!card.querySelector(':scope > .card-shine')) {
                const shine = document.createElement('span');
                shine.className = 'card-shine';
                shine.setAttribute('aria-hidden', 'true');
                card.prepend(shine);
            }

            card.addEventListener('pointermove', event => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateX = (0.5 - y) * 7;
                const rotateY = (x - 0.5) * 9;

                card.classList.add('is-tilting');
                card.style.setProperty('--shine-x', `${x * 100}%`);
                card.style.setProperty('--shine-y', `${y * 100}%`);
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            });

            card.addEventListener('pointerleave', () => {
                card.classList.remove('is-tilting');
                card.style.transform = '';
            });
        });
    }

    setupTiltCards();

    function setupFocusAnimation() {
        const focusItems = document.querySelectorAll([
            '.timeline-item',
            '.skill-block',
            '.education-card',
            '.cert-item',
            '.award-item',
            '.contact-card'
        ].join(','));

        if (!('IntersectionObserver' in window)) return;

        const focusObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle('is-animated-focus', entry.isIntersecting);
            });
        }, {
            threshold: 0.45,
            rootMargin: '-12% 0px -28% 0px'
        });

        focusItems.forEach(item => focusObserver.observe(item));
    }

    setupFocusAnimation();

    function setupParticles() {
        if (!particleCanvas || prefersReducedMotion) return;

        const ctx = particleCanvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let dpr = 1;
        let particles = [];
        let rafId = 0;
        let pointer = { x: 0, y: 0, active: false };

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        function particleCount() {
            const base = Math.floor((window.innerWidth * window.innerHeight) / 18000);
            return Math.max(32, Math.min(base, 78));
        }

        function createParticle() {
            return {
                x: random(0, width),
                y: random(0, height),
                vx: random(-0.22, 0.22),
                vy: random(-0.18, 0.18),
                radius: random(0.8, 1.8),
                pulse: random(0, Math.PI * 2)
            };
        }

        function resize() {
            const rect = particleCanvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;

            particleCanvas.width = Math.floor(width * dpr);
            particleCanvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            particles = Array.from({ length: particleCount() }, createParticle);
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i += 1) {
                for (let j = i + 1; j < particles.length; j += 1) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.22;
                        ctx.strokeStyle = `rgba(92, 225, 255, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function wrapParticle(particle) {
            if (particle.x < -20) particle.x = width + 20;
            if (particle.x > width + 20) particle.x = -20;
            if (particle.y < -20) particle.y = height + 20;
            if (particle.y > height + 20) particle.y = -20;
        }

        function updateParticle(particle) {
            particle.pulse += 0.025;
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (pointer.active) {
                const dx = particle.x - pointer.x;
                const dy = particle.y - pointer.y;
                const distance = Math.hypot(dx, dy);

                if (distance < 150 && distance > 0.01) {
                    const force = (1 - distance / 150) * 0.55;
                    particle.x += (dx / distance) * force;
                    particle.y += (dy / distance) * force;
                }
            }

            wrapParticle(particle);
        }

        function drawParticle(particle) {
            const glow = 0.45 + Math.sin(particle.pulse) * 0.25;
            ctx.fillStyle = `rgba(92, 225, 255, ${glow})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        function frame() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(updateParticle);
            drawConnections();
            particles.forEach(drawParticle);

            rafId = requestAnimationFrame(frame);
        }

        particleCanvas.addEventListener('pointermove', event => {
            const rect = particleCanvas.getBoundingClientRect();
            pointer = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                active: true
            };
        }, { passive: true });

        particleCanvas.addEventListener('pointerleave', () => {
            pointer.active = false;
        });

        window.addEventListener('pointermove', event => {
            const rect = particleCanvas.getBoundingClientRect();
            pointer = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                active: true
            };
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(rafId);
            } else {
                rafId = requestAnimationFrame(frame);
            }
        });

        resize();
        window.addEventListener('resize', resize);
        rafId = requestAnimationFrame(frame);
    }

    setupParticles();
})();
