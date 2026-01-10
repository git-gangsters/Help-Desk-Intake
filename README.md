# Help Desk Intake & Ticket Tracker

Lightweight, browser-based help desk intake and ticket tracking system (static HTML/CSS/JS).

## Features

- **Ticket intake form**: name, email, category, priority, description
- **Ticket dashboard**: view tickets and toggle status Open/Closed
- **CSV export**: download tickets for reporting
- **Local-first storage**: tickets are stored in the current browser via `localStorage`

## Run locally

- **Option A (simplest)**: open `index.html` in your browser
- **Option B (recommended)**: serve the folder locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Development / linting

This repo includes a minimal Node toolchain for deterministic linting (HTMLHint, Stylelint, ESLint).

```bash
npm install
npm run lint
```

## Notes

- **Data location**: tickets are stored under the key `hd:tickets:v1` in your browser’s `localStorage`.
- **Security disclosure**: see `SECURITY.md`.
- **Contributing**: see `CONTRIBUTING.md`.
