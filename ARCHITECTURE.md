# Architecture

This is a single-page, static frontend app with no backend. It runs entirely in the browser.

## File layout

- `index.html`: UI structure (form + ticket table)
- `style.css`: styling for the page and priority indicators
- `script.js`: behavior (create/read/update tickets, persist to `localStorage`, CSV export)

## Data model

Tickets are stored in the current browser under `localStorage["hd:tickets:v1"]` as a JSON array:

- `id`: number (generated via `Date.now()`)
- `date`: string (local time display)
- `name`: string
- `email`: string
- `category`: string
- `priority`: `"Low" | "Medium" | "High"`
- `description`: string
- `status`: `"Open" | "Closed"`

## Key behaviors

- **Create**: form submit validates inputs, appends a new ticket, persists, re-renders
- **Update**: ticket table action toggles status Open/Closed, persists, re-renders
- **Export**: CSV export escapes fields correctly and emits UTF‑8 with BOM for Excel compatibility
