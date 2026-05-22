/* Portfolio — Iron Man loader, theme toggle, minimal interactions */

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const navLinkElements = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const revealElements = document.querySelectorAll('[data-animate="reveal"]');
const contactForm = document.getElementById('contactForm');
const backToTop = document.getElementById('backToTop');
const loader = document.getElementById('loader');
const loaderStatus = document.getElementById('loaderStatus');
const loaderProgress = document.getElementById('loaderProgress');
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const CONTACT_LINKEDIN = 'https://www.linkedin.com/in/avinash-kumar-785ba3126/';
const THEME_KEY = 'portfolio-theme';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const BOOT_LINES = [
    'BOOT SEQUENCE INITIATED',
    'CALIBRATING ARC REACTOR…',
    'SYNCING HUD DATABASE…',
    'ARMOR SYSTEMS ONLINE',
    'WELCOME, AVINASH'
];

// ——— Theme ———
function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, persist = true) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
    themeToggle.title = theme === 'dark' ? 'Light mode' : 'Dark mode';
    if (persist) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch { /* ignore */ }
    }
}

function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
}

applyTheme(root.getAttribute('data-theme') || getPreferredTheme(), false);
themeToggle.addEventListener('click', toggleTheme);

// ——— Iron Man loader ———
function finishLoader() {
    loader.classList.add('is-done');
    loader.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
    }, prefersReducedMotion ? 0 : 480);
}

function runLoader() {
    if (!loader || !loaderProgress || !loaderStatus) {
        finishLoader();
        return;
    }

    if (prefersReducedMotion) {
        loaderProgress.style.width = '100%';
        loaderStatus.textContent = BOOT_LINES[BOOT_LINES.length - 1];
        finishLoader();
        return;
    }

    const duration = 2600;
    const start = performance.now();
    let lastLine = -1;

    loaderStatus.textContent = BOOT_LINES[0];

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        loaderProgress.style.width = `${progress * 100}%`;

        const lineIndex = Math.min(
            Math.floor(progress * BOOT_LINES.length),
            BOOT_LINES.length - 1
        );

        if (lineIndex !== lastLine) {
            lastLine = lineIndex;
            loaderStatus.style.opacity = '0';
            requestAnimationFrame(() => {
                loaderStatus.textContent = BOOT_LINES[lineIndex];
                loaderStatus.style.opacity = '1';
            });
        }

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            finishLoader();
        }
    }

    requestAnimationFrame(tick);
}

window.addEventListener('load', runLoader);

// ——— Navigation ———
function setNavScrolled() {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
}

function setActiveLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY > top && scrollY <= top + height) {
            navLinkElements.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${id}"]`);
            if (active) active.classList.add('active');
        }
    });
}

function closeMobileNav() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    if (!document.body.classList.contains('is-loading')) {
        document.body.style.overflow = '';
    }
}

function openMobileNav() {
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
});

navOverlay.addEventListener('click', closeMobileNav);

navLinkElements.forEach(link => {
    link.addEventListener('click', closeMobileNav);
});

window.addEventListener('scroll', () => {
    setNavScrolled();
    setActiveLink();

    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, { passive: true });

setNavScrolled();
setActiveLink();

// ——— Scroll reveal ———
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    }
);

revealElements.forEach(el => revealObserver.observe(el));

// ——— Profile photo fallback ———
document.querySelectorAll('[data-profile-photo]').forEach(photo => {
    const showFallback = () => {
        photo.classList.add('is-hidden');
        photo.removeAttribute('src');
    };

    photo.addEventListener('error', showFallback);
});

// ——— Smooth anchor scroll ———
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
        });
    });
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
});

// ——— Contact form ———
contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const draft = [
        `Subject: ${subject}`,
        '',
        `From: ${name}`,
        `Reply-to: ${email}`,
        '',
        message
    ].join('\n');

    const btn = contactForm.querySelector('button');
    const originalHTML = btn.innerHTML;
    let copied = false;

    try {
        await navigator.clipboard.writeText(draft);
        copied = true;
    } catch {
        copied = false;
    }

    btn.classList.remove('is-success', 'is-error');
    btn.classList.add(copied ? 'is-success' : 'is-error');
    btn.innerHTML = copied
        ? '<span>Copied — opening LinkedIn</span>'
        : '<span>Copy failed — use links on the left</span>';

    if (copied) {
        window.open(CONTACT_LINKEDIN, '_blank', 'noopener,noreferrer');
    }

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('is-success', 'is-error');
        if (copied) contactForm.reset();
    }, 3500);
});

document.addEventListener('click', e => {
    if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target) &&
        !themeToggle.contains(e.target)
    ) {
        closeMobileNav();
    }
});
