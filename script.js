// ============================================
// NLAS 2026 - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    initNavigation();
    initSmoothScroll();
    initCountdown();
    initFAQAccordion();
    initScheduleTabs();
    initScrollReveal();
});

// ============================================
// Site Configuration
// ============================================
function applyConfig() {
    if (typeof window.SITE_CONFIG === 'undefined') return;

    for (const [section, enabled] of Object.entries(SITE_CONFIG.sections)) {
        if (!enabled) {
            const el = document.getElementById(section) || document.querySelector(`.${section}-section`);
            if (el) el.style.display = 'none';
        }
    }

    const pageToHref = {
        about: 'about.html',
        speakers: 'speakers.html',
        schedule: 'schedule.html',
        logistics: 'logistics.html',
        faqs: 'faqs.html',
        scholarships: 'scholarships.html',
        sponsors: 'sponsors.html',
        register: 'register.html',
        codeOfConduct: 'code-of-conduct.html'
    };

    for (const [page, enabled] of Object.entries(SITE_CONFIG.pages)) {
        if (!enabled) {
            const href = pageToHref[page];
            if (!href) continue;
            document.querySelectorAll(`a[href="${href}"]`).forEach(link => {
                const li = link.closest('li');
                if (li) { li.remove(); } else { link.remove(); }
            });
        }
    }

    if (!SITE_CONFIG.features.registrationOpen) {
        document.querySelectorAll('a[href="register.html"]').forEach(link => {
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
            link.textContent = 'Registration Closed';
        });
    }
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!nav) return;

    // Mobile menu toggle
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            toggle.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);

            const spans = toggle.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMenu());
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });

        function closeMenu() {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }
}

// ============================================
// Countdown Timer — Split-Flap Style
// ============================================
function updateCountdownDigit(elementId, newValue) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (el.textContent !== newValue) {
        el.classList.add('flipping');
        setTimeout(() => {
            el.textContent = newValue;
            el.classList.remove('flipping');
        }, 200);
    }
}

function initCountdown() {
    const eventDate = new Date('2026-07-15T09:00:00-04:00');
    const elDays    = document.getElementById('countdown-days');
    const elHours   = document.getElementById('countdown-hours');
    const elMinutes = document.getElementById('countdown-minutes');
    const elSeconds = document.getElementById('countdown-seconds');

    if (!elDays) return;

    let timerId = null;

    function update() {
        const diff = eventDate - new Date();

        if (diff <= 0) {
            updateCountdownDigit('countdown-days',    '0');
            updateCountdownDigit('countdown-hours',   '00');
            updateCountdownDigit('countdown-minutes', '00');
            updateCountdownDigit('countdown-seconds', '00');
            if (timerId) clearInterval(timerId);
            return;
        }

        updateCountdownDigit('countdown-days',
            String(Math.floor(diff / (1000 * 60 * 60 * 24))));
        updateCountdownDigit('countdown-hours',
            String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'));
        updateCountdownDigit('countdown-minutes',
            String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'));
        updateCountdownDigit('countdown-seconds',
            String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0'));
    }

    update();
    timerId = setInterval(update, 1000);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(timerId);
            timerId = null;
        } else {
            update();
            timerId = setInterval(update, 1000);
        }
    });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = (document.querySelector('.main-nav') || {offsetHeight: 64}).offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// FAQ Accordion
// ============================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });
}

// ============================================
// Schedule Tabs
// ============================================
function initScheduleTabs() {
    const tabs = document.querySelectorAll('.schedule-tab');
    const contents = document.querySelectorAll('.schedule-day-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const day = tab.dataset.day;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `day-${day}`) content.classList.add('active');
            });
        });
    });
}

// ============================================
// Scroll Reveal — Speaker Cards
// ============================================
function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Reveal immediately for reduced-motion users
        document.querySelectorAll('.speaker-card').forEach(card => {
            card.classList.add('revealed');
        });
        return;
    }

    const cards = document.querySelectorAll('.speaker-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('revealed'), i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
}
