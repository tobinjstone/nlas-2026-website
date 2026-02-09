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
    // Google Sheets data sources
    // Sheet should have columns: Question, Answer (first row is header)
    // Use the original spreadsheet URL (not the "publish to web" URL)
    // Example: https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
    // The sheet must be shared as "Anyone with the link can view"
    dataSources: {
        faqsSheetUrl: 'https://docs.google.com/spreadsheets/d/1XToStpV5oizXrwzgjSdOAzNTxXXLwmvo7v_uy3gZRVI/edit?usp=sharing' // Paste your Google Sheet URL here
    },
    sections: {
        countdown: true,
        about: true,
        'featured-speakers': false,
        'schedule-overview': true,
        partners: false,
        cta: true
    },
    pages: {
        speakers: false,
        schedule: false,
        logistics: true,
        faqs: true,
        scholarships: false,
        sponsors: false,
        register: true,
    },
    features: {
        registrationOpen: true,
        scholarshipApplicationsOpen: true
    }
};
