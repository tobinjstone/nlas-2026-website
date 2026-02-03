// ============================================
// NLAS 2026 - Site Configuration
// ============================================
// Control visibility of sections, pages, and features.
// Set any value to false to hide/disable that element.
//
// sections:  Toggle homepage sections (countdown, about, featured-speakers, etc.)
// pages:     Toggle nav links to subpages (setting to false removes the link)
// features:  Toggle site-wide behaviors like registration and scholarship apps
// ============================================

var SITE_CONFIG = {
    sections: {
        countdown: true,
        about: true,
        'featured-speakers': true,
        'schedule-overview': true,
        partners: true,
        cta: true
    },
    pages: {
        speakers: false,
        schedule: true,
        faqs: true,
        scholarships: true,
        sponsors: false,
        register: true,
    },
    features: {
        registrationOpen: true,
        scholarshipApplicationsOpen: true
    }
};
