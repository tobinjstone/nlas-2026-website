// ============================================
// NLAS 2026 - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Apply site configuration (hide/show sections, pages, features)
    applyConfig();

    // Initialize navigation
    initNavigation();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize countdown timer
    initCountdown();

    // Initialize FAQ accordion
    initFAQAccordion();

    // Initialize schedule tabs
    initScheduleTabs();
});

// ============================================
// Site Configuration
// ============================================
function applyConfig() {
    if (typeof window.SITE_CONFIG === 'undefined') return;

    // Hide disabled sections
    for (const [section, enabled] of Object.entries(SITE_CONFIG.sections)) {
        if (!enabled) {
            const el = document.getElementById(section) || document.querySelector(`.${section}-section`);
            if (el) el.style.display = 'none';
        }
    }

    // Remove nav links for disabled pages
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
                if (li) {
                    li.remove();
                } else {
                    link.remove();
                }
            });
        }
    }

    // Handle registration feature toggle
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
    const links = document.querySelectorAll('.nav-links a');

    // Scroll effect for nav (throttled with rAF)
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                if (window.pageYOffset > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
            
            const spans = toggle.querySelectorAll('span');
            if (toggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// ============================================
// Countdown Timer
// ============================================
function initCountdown() {
    const eventDate = new Date('2026-07-15T09:00:00-04:00'); // July 15, 2026 9 AM ET
    const elDays = document.getElementById('countdown-days');
    const elHours = document.getElementById('countdown-hours');
    const elMinutes = document.getElementById('countdown-minutes');
    const elSeconds = document.getElementById('countdown-seconds');

    if (!elDays) return; // Not on a page with countdown

    let timerId = null;

    function update() {
        const diff = eventDate - new Date();

        if (diff <= 0) {
            elDays.textContent = '0';
            elHours.textContent = '0';
            elMinutes.textContent = '0';
            elSeconds.textContent = '0';
            if (timerId) clearInterval(timerId);
            return;
        }

        elDays.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
        elHours.textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        elMinutes.textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        elSeconds.textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    }

    update();
    timerId = setInterval(update, 1000);

    // Pause when tab is hidden, resume when visible
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
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
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
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');

                // Refresh torn paper background after expand/collapse transition
                const paperEl = item.closest('.paper-torn');
                if (paperEl && window.tornPaperEffect) {
                    setTimeout(() => window.tornPaperEffect.applyTo(paperEl), 350);
                }
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

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `day-${day}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

