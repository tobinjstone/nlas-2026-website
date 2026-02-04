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
    // Google Sheets data sources (publish sheet as CSV: File > Share > Publish to web > CSV)
    // Sheet should have columns: Question, Answer
    dataSources: {
        faqsSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTTGEgscjLxJ4sv4Jv5-EIHJn73lT7bM90IAGgbg-bcG0vhfQbFRQuriykkCG8Y1re0o5mLhOhr6b8/pub?output=csv' // Paste your published Google Sheet CSV URL here
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
