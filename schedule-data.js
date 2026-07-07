// ============================================
// NLAS 2026 - Schedule Configuration
// ============================================
// How to edit this file:
//
// - Times are 24-hour "HH:MM" strings (e.g. "14:30"), always on a 15-minute
//   increment (:00, :15, :30, :45). Start/end define how tall a session block
//   is and where it lines up against other rooms.
// - `room` must exactly match one of the names in SCHEDULE_CONFIG.rooms, or
//   be null for a session that isn't tied to a single room (e.g. registration,
//   a lunch break, or anything that applies across all rooms at once) - those
//   render as a full-width banner instead of a single column.
// - `speakers` is a list of names. If a name matches an entry in
//   SPEAKERS_CONFIG (speakers.js), the schedule pulls that speaker's photo and
//   title automatically. For someone not on the Speakers page, use an inline
//   object instead of a plain string: { name: "Jane Doe", title: "Moderator" }.
// - `type` drives the color coding / legend. Stick to: "Keynote", "Panel",
//   "Workshop", "Break", "Networking" (add a new one + a matching entry in the
//   TYPE_COLORS map in script.js if you need another category).
// - Day 3 (Friday, July 17) is intentionally left out until that lineup is
//   finalized. Add a new entry to `days` (with a new `id`) when it's ready.
// - A day can optionally have `venue: { name, mapUrl }` for a small map-pin
//   link under its heading, and `rsvp: { label, url }` for a highly visible
//   RSVP banner + button under the heading.
// - A session can optionally have `rsvpUrl`/`rsvpLabel` to show a matching
//   RSVP button inside its own detail popup.
//
// ---- Panels from Google Sheets ----
// The actual panel lineup (title, description, moderator, speakers, room,
// times) is NOT hand-entered here anymore - it's pulled live from a Google
// Sheet at page load and merged into the Thursday day below. Only fixed,
// non-panel programming (registration, meals, opening/closing remarks) stays
// hand-entered in this file.
//
// To connect a sheet:
//   1. In Google Sheets: File -> Share -> Publish to web.
//   2. Under "Link", pick the specific tab with the schedule, and set the
//      format dropdown to "Comma-separated values (.csv)".
//   3. Click Publish, then copy the generated URL below into `sheetCsvUrl`.
//   4. Anyone with that URL can view the sheet's contents, so don't put
//      anything in it you don't want public - the schedule itself is public
//      anyway.
//   Note: Google can take a few minutes to pick up edits after you publish,
//   so a change may not show up on the site instantly.
//
// Expected columns (header row, any order):
//   Panel Name | Description | Moderator | Speaker 1 | Speaker 2 | Speaker 3
//   | Room | Start Time | End Time
// - Room must match one of SCHEDULE_CONFIG.rooms below (case-insensitive).
// - Start/End Time can be written like "10:00 AM" or "14:00".
// - Moderator/Speaker cells should match a name in SPEAKERS_CONFIG
//   (speakers.js) to automatically pull that person's photo; otherwise the
//   name is still shown, just without a photo.
// - Leave Speaker 2/3 blank if a panel doesn't have that many speakers.
// ============================================

var SCHEDULE_CONFIG = {
    // Paste your "Publish to web" CSV URL here to connect the panel sheet.
    // Leave as "" to show only the manually-entered sessions below.
    sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQz7FzG33Xaz7QGmkmEvC1yZLeHxWcgAm54oG3HuKHg_hl0Nuna8vPhOF8WWYceGbk4FQnKnw22xFKn/pub?gid=612136120&single=true&output=csv",

    // Room columns for days where sessions run in parallel, in display order.
    rooms: ["Theater", "Rehearsal Hall", "Workshop"],

    days: [
        {
            id: 1,
            label: "Wednesday",
            date: "July 15",
            hasRooms: false,
            // `venue` renders a small map-pin link under the day heading.
            // `rsvp` renders a highly visible banner + button under the
            // heading (in addition to a matching button inside the session's
            // own modal) - use it for a day that needs its own RSVP flow.
            venue: {
                name: "Bluejacket, Navy Yard",
                mapUrl: "https://www.google.com/maps/search/?api=1&query=Bluejacket+300+Tingey+St+SE+Washington+DC+20003"
            },
            rsvp: {
                label: "RSVP on Partiful",
                url: "https://partiful.com/e/zCdmixiAxGXghQORqBzD?c=yqnSH4UP"
            },
            sessions: [
                {
                    id: "wed-opening-reception",
                    start: "17:00",
                    end: "20:00",
                    title: "Opening Reception",
                    location: "Bluejacket, Navy Yard",
                    room: null,
                    type: "Networking",
                    description: "Kick off NLAS 2026 a night early with drinks and conversation at Bluejacket in Navy Yard. U.S. Representative Jake Auchincloss will offer opening remarks.",
                    speakers: ["Jake Auchincloss"],
                    rsvpUrl: "https://partiful.com/e/zCdmixiAxGXghQORqBzD?c=yqnSH4UP",
                    rsvpLabel: "RSVP on Partiful"
                }
            ]
        },
        {
            id: 2,
            label: "Thursday",
            date: "July 16",
            hasRooms: true,
            venue: {
                name: "Woolly Mammoth Theatre",
                mapUrl: "https://www.google.com/maps/search/?api=1&query=Woolly+Mammoth+Theatre+641+D+St+NW+Washington+DC+20004"
            },
            // The sheet is the sole source for Thursday - registration,
            // opening/closing, meals, and panels are all rows there (Room =
            // "Full Venue" renders as a full-width banner, same as leaving
            // Room blank). Only add a session by hand here if it's genuinely
            // NOT in the sheet - otherwise it'll render twice, stacked on
            // top of each other.
            sessions: []
        }
        // Day 3 - Friday, July 17: not yet finalized, left out for now.
    ]
};
