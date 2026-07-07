// ============================================
// NLAS 2026 - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    renderSpeakers();
    initNavigation();
    initSmoothScroll();
    initCountdown();
    initFAQAccordion();
    initSchedulePage();
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
// Schedule Page
// ============================================
const SCHEDULE_TYPE_COLORS = {
    Keynote: 'coral',
    Panel: 'teal',
    Workshop: 'sky',
    Networking: 'amber',
    Break: 'neutral'
};

// per-day room filter state, keyed by day id ('all' or a room name)
const scheduleRoomFilters = {};

function scheduleTimeToMinutes(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}

function formatScheduleTime(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return m === 0 ? `${h12} ${period}` : `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// Strips a leading honorific ("Rep.", "Sen.", "Mayor", ...) so sheet entries
// like "Rep. Don Beyer" still match the plain "Don Beyer" in SPEAKERS_CONFIG.
function stripScheduleHonorific(raw) {
    let name = raw.trim();
    const honorific = /^(rep\.?|sen\.?|mayor|gov\.?|dr\.?|amb\.?|hon\.?|mr\.?|mrs\.?|ms\.?|president|vp)\s+/i;
    while (honorific.test(name)) {
        name = name.replace(honorific, '').trim();
    }
    return name;
}

function findScheduleSpeaker(entry) {
    if (typeof entry !== 'string') {
        return { name: entry.name, title: entry.title || '', photo: null };
    }
    const list = (typeof SPEAKERS_CONFIG !== 'undefined') ? SPEAKERS_CONFIG : [];
    const cleaned = stripScheduleHonorific(entry);

    let match = list.find(s => s.name.toLowerCase() === cleaned.toLowerCase());

    // Fall back to a last-name-only match (e.g. "Frank Fukuyama" -> "Francis
    // Fukuyama") but only when it's unambiguous - exactly one roster entry
    // shares that last name.
    if (!match) {
        const lastName = cleaned.split(/\s+/).pop().toLowerCase();
        const lastNameMatches = list.filter(s => s.name.split(/\s+/).pop().toLowerCase() === lastName);
        if (lastNameMatches.length === 1) match = lastNameMatches[0];
    }

    return match
        ? { name: match.name, title: match.title, photo: match.photo }
        : { name: cleaned, title: '', photo: null };
}

function getAllScheduleSessions() {
    const sessions = {};
    if (typeof SCHEDULE_CONFIG === 'undefined') return sessions;
    SCHEDULE_CONFIG.days.forEach(day => {
        day.sessions.forEach(session => { sessions[session.id] = session; });
    });
    return sessions;
}

function getScheduleSessionDay(sessionId) {
    if (typeof SCHEDULE_CONFIG === 'undefined') return null;
    return SCHEDULE_CONFIG.days.find(day => day.sessions.some(s => s.id === sessionId)) || null;
}

// ---- "Add to calendar" links for the session popup ----
// The schedule only ever runs in DC (America/New_York), so this builds
// wall-clock timestamps for that day rather than doing real timezone math.
const SCHEDULE_MONTHS = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

function scheduleSessionDateParts(day) {
    const match = day && day.date ? day.date.match(/([A-Za-z]+)\s+(\d+)/) : null;
    if (!match || !SCHEDULE_MONTHS[match[1]]) return null;
    return { year: 2026, month: SCHEDULE_MONTHS[match[1]], day: parseInt(match[2], 10) };
}

function scheduleTimeStamp(hhmm, parts) {
    return `${parts.year}${String(parts.month).padStart(2, '0')}${String(parts.day).padStart(2, '0')}T${hhmm.replace(':', '')}00`;
}

function scheduleSessionToGCalUrl(session, day) {
    const parts = scheduleSessionDateParts(day);
    if (!parts) return null;
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: session.title,
        dates: `${scheduleTimeStamp(session.start, parts)}/${scheduleTimeStamp(session.end, parts)}`,
        details: session.description || '',
        location: session.location || '',
        ctz: 'America/New_York'
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
}

function scheduleSessionToIcsDataUrl(session, day) {
    const parts = scheduleSessionDateParts(day);
    if (!parts) return null;
    const escapeIcs = (str) => (str || '').replace(/[\\,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
    const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//NLAS 2026//Schedule//EN',
        'BEGIN:VEVENT',
        `UID:${session.id}@nlas.cnliberalism.org`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART:${scheduleTimeStamp(session.start, parts)}`,
        `DTEND:${scheduleTimeStamp(session.end, parts)}`,
        `SUMMARY:${escapeIcs(session.title)}`,
        `LOCATION:${escapeIcs(session.location)}`,
        `DESCRIPTION:${escapeIcs(session.description)}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}

// ---- Google Sheets panel import ----
// Parses a CSV string into rows of fields, honoring quoted fields that
// contain commas, quotes ("" escaping), or newlines.
function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else { inQuotes = false; }
            } else {
                field += c;
            }
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === ',') {
            row.push(field); field = '';
        } else if (c === '\r') {
            // skip; \n (below) closes the row
        } else if (c === '\n') {
            row.push(field); rows.push(row); row = []; field = '';
        } else {
            field += c;
        }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
}

// Accepts "10:00 AM", "10:00:00", "14:00", or a bare "1:00" and returns
// "HH:MM" (24-hour), rounded to the nearest 15 minutes. Returns null if it
// can't be parsed.
//
// Bare hours with no AM/PM (e.g. "1:00") are assumed PM for 1-6 and AM for
// 7-12, since that matches a normal midday conference schedule (9am-6pm).
// A session genuinely meant to start before 7am or after 6pm needs an
// explicit "AM"/"PM" in the sheet, or it'll be parsed on the wrong side of
// noon.
function parseSheetTime(raw) {
    if (!raw) return null;
    const str = raw.trim();

    let h, m;
    let match = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])$/);
    if (match) {
        h = parseInt(match[1], 10);
        m = parseInt(match[2], 10);
        const period = match[3].toUpperCase();
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
    } else {
        match = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
        if (!match) return null;
        h = parseInt(match[1], 10);
        m = parseInt(match[2], 10);
        if (h >= 1 && h <= 6) h += 12; // bare "1:00"-"6:59" -> assume afternoon
    }
    if (h > 23 || m > 59) return null;

    let totalMin = Math.round((h * 60 + m) / 15) * 15;
    totalMin = ((totalMin % 1440) + 1440) % 1440; // wrap safely into a single day
    return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
}

// The sheet only has a "Panel Name" column, so non-panel rows (registration,
// meals, a reception someone adds straight to the sheet) are guessed from
// the title's wording rather than requiring a separate Type column.
function inferScheduleSessionType(title) {
    const t = title.toLowerCase();
    if (/reception|networking|happy hour|mixer/.test(t)) return 'Networking';
    if (/registration|coffee|lunch|breakfast|dinner|\bbreak\b/.test(t)) return 'Break';
    if (/keynote|opening remarks|closing remarks|welcome/.test(t)) return 'Keynote';
    return 'Panel';
}

function parseSheetSessions(csvText) {
    const rows = parseCsv(csvText).filter(r => r.some(cell => cell.trim() !== ''));
    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.trim());
    const col = (row, name) => {
        const idx = headers.indexOf(name);
        return idx === -1 ? '' : (row[idx] || '').trim();
    };

    const sessions = [];
    rows.slice(1).forEach((row, i) => {
        const rowNum = i + 2; // account for header row + 1-indexing, for warnings
        const title = col(row, 'Panel Name');
        if (!title) return;

        const start = parseSheetTime(col(row, 'Start Time'));
        const end = parseSheetTime(col(row, 'End Time'));
        if (!start || !end) {
            console.warn(`Schedule sheet row ${rowNum}: couldn't parse a time for "${title}", skipping.`);
            return;
        }

        const roomRaw = col(row, 'Room');
        const fullVenue = /^(full venue|all rooms|all|everywhere)$/i.test(roomRaw.trim());
        const room = fullVenue ? null : (SCHEDULE_CONFIG.rooms.find(r => r.toLowerCase() === roomRaw.toLowerCase()) || null);
        if (roomRaw && !fullVenue && !room) {
            console.warn(`Schedule sheet row ${rowNum}: room "${roomRaw}" doesn't match a known room for "${title}".`);
        }

        const moderator = col(row, 'Moderator');
        const speakers = ['Speaker 1', 'Speaker 2', 'Speaker 3']
            .map(key => col(row, key))
            .filter(Boolean);

        sessions.push({
            id: `sheet-${rowNum}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            start,
            end,
            title,
            location: room || roomRaw || 'TBD',
            room,
            type: inferScheduleSessionType(title),
            description: col(row, 'Description'),
            moderator: moderator || null,
            speakers
        });
    });

    return sessions;
}

async function fetchScheduleSheetSessions() {
    const url = SCHEDULE_CONFIG.sheetCsvUrl;
    if (!url) return { sessions: [], error: null };

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        return { sessions: parseSheetSessions(text), error: null };
    } catch (err) {
        console.error('Could not load the panel schedule from Google Sheets:', err);
        return { sessions: [], error: err };
    }
}

async function initSchedulePage() {
    const panelsEl = document.getElementById('schedule-day-panels');
    if (!panelsEl || typeof SCHEDULE_CONFIG === 'undefined') return;

    for (const day of SCHEDULE_CONFIG.days) {
        const block = document.createElement('div');
        block.className = 'schedule-day-block';
        block.id = `day-${day.id}`;
        const venueHtml = day.venue
            ? `<a class="schedule-day-venue" href="${day.venue.mapUrl}" target="_blank" rel="noopener">📍 ${day.venue.name}</a>`
            : '';
        const rsvpHtml = day.rsvp
            ? `<div class="schedule-day-rsvp">
                <span>Don't forget to RSVP for the ${day.label} kickoff!</span>
                <a class="btn btn-primary schedule-day-rsvp-btn" href="${day.rsvp.url}" target="_blank" rel="noopener">${day.rsvp.label} &rarr;</a>
            </div>`
            : '';
        block.innerHTML = `<h2 class="schedule-day-heading">${day.label} <span>— ${day.date}</span></h2>${venueHtml}${rsvpHtml}`;
        panelsEl.appendChild(block);

        const content = document.createElement('div');
        block.appendChild(content);

        if (day.hasRooms) {
            scheduleRoomFilters[day.id] = 'all';
            content.innerHTML = '<p class="schedule-empty">Loading panels…</p>';
            const { sessions: sheetSessions, error } = await fetchScheduleSheetSessions();
            day.sessions = day.sessions.concat(sheetSessions);
            renderScheduleRoomDay(day, content, error);
        } else {
            renderScheduleSimpleDay(day, content);
        }
    }

    initScheduleModal();
}

function renderScheduleSimpleDay(day, container) {
    if (!day.sessions.length) {
        container.innerHTML = '<p class="schedule-empty">Schedule coming soon.</p>';
        return;
    }

    container.innerHTML = `<div class="schedule-simple-list">${day.sessions.map(session => `
        <button type="button" class="schedule-simple-card" data-session-id="${session.id}" style="--session-color: var(--nlas-${SCHEDULE_TYPE_COLORS[session.type] || 'teal'});">
            <span class="schedule-simple-time">${formatScheduleTime(session.start)} – ${formatScheduleTime(session.end)}</span>
            <span class="schedule-simple-title">${session.title}</span>
            <span class="schedule-simple-location">${session.location}</span>
        </button>`).join('')}</div>`;

    container.querySelectorAll('[data-session-id]').forEach(card => {
        card.addEventListener('click', () => openScheduleModal(card.dataset.sessionId));
    });
}

function renderScheduleRoomDay(day, container, sheetLoadError) {
    container.innerHTML = `
        ${sheetLoadError ? '<p class="schedule-sheet-warning">Couldn\'t load the latest panels from Google Sheets — showing what\'s available. Try refreshing the page.</p>' : ''}
        <div class="room-filters" id="room-filters-${day.id}"></div>
        <div class="schedule-legend" id="schedule-legend-${day.id}"></div>
        <div class="schedule-grid-scroll">
            <div class="schedule-grid" id="schedule-grid-${day.id}"></div>
        </div>`;

    const filtersEl = container.querySelector(`#room-filters-${day.id}`);
    const chipLabels = ['All Rooms', ...SCHEDULE_CONFIG.rooms];
    chipLabels.forEach(label => {
        const value = label === 'All Rooms' ? 'all' : label;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'room-filter-chip' + (value === scheduleRoomFilters[day.id] ? ' active' : '');
        chip.textContent = label;
        chip.dataset.room = value;
        chip.addEventListener('click', () => {
            scheduleRoomFilters[day.id] = value;
            filtersEl.querySelectorAll('.room-filter-chip').forEach(c => c.classList.toggle('active', c.dataset.room === value));
            buildScheduleGrid(day, container.querySelector(`#schedule-grid-${day.id}`));
        });
        filtersEl.appendChild(chip);
    });

    const typesUsed = [...new Set(day.sessions.map(s => s.type))];
    container.querySelector(`#schedule-legend-${day.id}`).innerHTML = typesUsed.map(type =>
        `<span class="schedule-legend-item"><span class="schedule-legend-swatch" style="background: var(--nlas-${SCHEDULE_TYPE_COLORS[type] || 'teal'});"></span>${type}</span>`
    ).join('');

    buildScheduleGrid(day, container.querySelector(`#schedule-grid-${day.id}`));
}

function buildScheduleGrid(day, gridEl) {
    const sessions = day.sessions;
    if (!sessions.length) {
        gridEl.innerHTML = '<p class="schedule-empty">Schedule coming soon.</p>';
        return;
    }

    const activeRoom = scheduleRoomFilters[day.id];
    const visibleRooms = activeRoom === 'all' ? SCHEDULE_CONFIG.rooms : [activeRoom];

    const dayStart = Math.min(...sessions.map(s => scheduleTimeToMinutes(s.start)));
    const dayEnd = Math.max(...sessions.map(s => scheduleTimeToMinutes(s.end)));
    const totalSlots = (dayEnd - dayStart) / 15;

    gridEl.style.gridTemplateColumns = `88px repeat(${visibleRooms.length}, minmax(160px, 1fr))`;
    gridEl.style.gridTemplateRows = `44px repeat(${totalSlots}, 18px)`;

    let html = `<div class="schedule-grid-corner" style="grid-column: 1; grid-row: 1;"></div>`;
    visibleRooms.forEach((room, i) => {
        html += `<div class="schedule-grid-room-header" style="grid-column: ${i + 2}; grid-row: 1;">${room}</div>`;
    });

    const firstHour = Math.ceil(dayStart / 60) * 60;
    for (let t = firstHour; t < dayEnd; t += 60) {
        const row = ((t - dayStart) / 15) + 2;
        const span = Math.min(4, totalSlots - ((t - dayStart) / 15));
        const label = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
        html += `<div class="schedule-time-label" style="grid-row: ${row} / span ${span};">${formatScheduleTime(label)}</div>`;
    }

    sessions.forEach(session => {
        let colStart, colSpan;
        if (session.room === null) {
            colStart = 2;
            colSpan = visibleRooms.length;
        } else {
            const idx = visibleRooms.indexOf(session.room);
            if (idx === -1) return; // filtered out
            colStart = idx + 2;
            colSpan = 1;
        }
        const startMin = scheduleTimeToMinutes(session.start);
        const endMin = scheduleTimeToMinutes(session.end);
        const rowStart = ((startMin - dayStart) / 15) + 2;
        const rowEnd = ((endMin - dayStart) / 15) + 2;
        const color = `var(--nlas-${SCHEDULE_TYPE_COLORS[session.type] || 'teal'})`;
        const duration = endMin - startMin;
        // Under 45 min there's no room to show the time line under a
        // 2-line title without overlapping it; under 30 min, drop to a
        // single-line title too.
        const compact = duration <= 45;
        const tight = duration <= 30;
        const classes = ['schedule-session', compact && 'schedule-session-compact', tight && 'schedule-session-tight'].filter(Boolean).join(' ');
        const timeLabel = `${formatScheduleTime(session.start)}–${formatScheduleTime(session.end)}`;

        html += `<button type="button" class="${classes}" data-session-id="${session.id}"
            title="${session.title} (${timeLabel})"
            style="grid-column: ${colStart} / span ${colSpan}; grid-row: ${rowStart} / ${rowEnd}; --session-color: ${color};">
            <span class="schedule-session-title">${session.title}</span>
            ${compact ? '' : `<span class="schedule-session-time">${timeLabel}</span>`}
        </button>`;
    });

    gridEl.innerHTML = html;

    gridEl.querySelectorAll('[data-session-id]').forEach(card => {
        card.addEventListener('click', () => openScheduleModal(card.dataset.sessionId));
    });
}

function initScheduleModal() {
    const modal = document.getElementById('schedule-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-modal-close]').forEach(el => {
        el.addEventListener('click', closeScheduleModal);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) closeScheduleModal();
    });
}

function openScheduleModal(sessionId) {
    const session = getAllScheduleSessions()[sessionId];
    const modal = document.getElementById('schedule-modal');
    if (!session || !modal) return;

    document.getElementById('schedule-modal-type').textContent = session.type;
    document.getElementById('schedule-modal-title').textContent = session.title;
    document.getElementById('schedule-modal-meta').textContent =
        `${formatScheduleTime(session.start)} – ${formatScheduleTime(session.end)} · ${session.location}`;

    const rsvpEl = document.getElementById('schedule-modal-rsvp');
    if (session.rsvpUrl) {
        const rsvpLink = document.getElementById('schedule-modal-rsvp-link');
        rsvpLink.href = session.rsvpUrl;
        rsvpLink.textContent = session.rsvpLabel || 'Register';
        rsvpEl.hidden = false;
    } else {
        rsvpEl.hidden = true;
    }

    const calEl = document.getElementById('schedule-modal-calendar');
    const sessionDay = getScheduleSessionDay(sessionId);
    const gcalUrl = sessionDay && scheduleSessionToGCalUrl(session, sessionDay);
    if (gcalUrl) {
        document.getElementById('schedule-modal-gcal').href = gcalUrl;
        const icsLink = document.getElementById('schedule-modal-ics');
        icsLink.href = scheduleSessionToIcsDataUrl(session, sessionDay);
        icsLink.setAttribute('download', `${session.title.replace(/[^a-z0-9]+/gi, '-')}.ics`);
        calEl.hidden = false;
    } else {
        calEl.hidden = true;
    }

    const descEl = document.getElementById('schedule-modal-description');
    descEl.textContent = session.description || 'Details coming soon.';

    const speakersEl = document.getElementById('schedule-modal-speakers');
    const people = [];
    if (session.moderator) people.push({ entry: session.moderator, role: 'Moderator' });
    (session.speakers || []).forEach(entry => people.push({ entry, role: null }));

    if (people.length) {
        speakersEl.innerHTML = people.map(({ entry, role }) => {
            const speaker = findScheduleSpeaker(entry);
            const photo = speaker.photo
                ? `<img src="assets/speakers/${speaker.photo}.png" alt="${speaker.name}" loading="lazy" decoding="async">`
                : `<span class="schedule-modal-speaker-initial">${speaker.name.charAt(0)}</span>`;
            const subtitle = role
                ? `<span class="schedule-modal-speaker-role">${role}</span>`
                : (speaker.title ? `<span class="schedule-modal-speaker-title">${speaker.title}</span>` : '');
            return `<div class="schedule-modal-speaker">
                <div class="schedule-modal-speaker-photo">${photo}</div>
                <span class="schedule-modal-speaker-name">${speaker.name}</span>
                ${subtitle}
            </div>`;
        }).join('');
        speakersEl.hidden = false;
    } else {
        speakersEl.innerHTML = '';
        speakersEl.hidden = true;
    }

    modal.hidden = false;
    document.body.classList.add('schedule-modal-open');
}

function closeScheduleModal() {
    const modal = document.getElementById('schedule-modal');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('schedule-modal-open');
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

// ============================================
// Speakers Grid Renderer
// ============================================
function renderSpeakers() {
    const grid = document.getElementById('speakers-grid');
    if (!grid || typeof SPEAKERS_CONFIG === 'undefined') return;

    // color scheme: [card-color, card-bg]
    const schemes = [
        ['#59abda', '#01b27c'],
        ['#e5a2c4', '#59abda'],
        ['#f1ea7d', '#59abda'],
        ['#01b27c', '#e5a2c4'],
    ];
    const rotations = [-1.5, 1, -0.8, 1.5, -0.5, 0.8, -1.2, 1, -0.6, 1.2, -1, 0.5];

    const active = SPEAKERS_CONFIG.filter(s => s.enabled);

    active.forEach((speaker, i) => {
        const [schemeColor, schemeBg] = schemes[i % schemes.length];
        const cardColor = speaker.cardColor || schemeColor;
        const cardBg = speaker.cardBg || schemeBg;
        const rotation = rotations[i % rotations.length];
        const num = String(i + 1).padStart(2, '0');

        const card = document.createElement('div');
        card.className = 'speaker-card';
        card.style.cssText = `--card-color: ${cardColor}; --card-bg: ${cardBg}; --rotation: ${rotation}deg;`;

        card.innerHTML = `
            <div class="card-header"><span class="card-number">NO. ${num}</span></div>
            <div class="card-photo">
                <img src="assets/speakers/${speaker.photo}.png" alt="${speaker.name}" loading="lazy" decoding="async">
            </div>
            <div class="card-caption">
                <h3>${speaker.name}</h3>
                <p>${speaker.title}</p>
            </div>`;

        grid.appendChild(card);
    });

    initScrollReveal();
}
