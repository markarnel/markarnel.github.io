# LEAD52 landing page

Mobile-first landing page for LEAD52 (iPhone, Android, desktop). No build step, no dependencies.

```
node server.mjs        # http://localhost:4173  (or the "lead52-landing" launch config)
```

## What's in it
- `public/index.html`, `styles.css`, `app.js` — the page. Motion: particle field (canvas), kinetic headline,
  scroll reveals, counters, 3D tilt + spotlight cards, magnetic buttons, scroll-linked step line,
  interactive 52-week grid, animated icons, rotating light rays. Honors `prefers-reduced-motion`.
- `public/manifest.webmanifest`, `sw.js`, `icons/` — installable PWA ("Add to Home Screen" on iPhone,
  real "Install app" prompt on Android Chrome), works offline (network first, cache fallback).
- `public/assets/hero.mp4` — 12 s muted seamless loop, rendered from Remotion composition `Lead52-Hero`
  (`../my-video/src/Hero/Hero.tsx`). Re-render: `npm run hero`.
- `public/assets/tour.mp4` — the LEAD52 promo (sample 2 render) for the "Watch" section.
- `server.mjs` — static files with HTTP Range (iOS Safari needs it for video) and the sign-up API:
  - `POST /api/subscribe` `{name, email}` → validates, de-duplicates, rate-limits (5 / 10 min / IP),
    honeypot field `company`; stores to `data/subscribers.json`.
  - `GET /api/stats` → `{subscribers}`.

Sign-ups are stored locally only; connect `POST /api/subscribe` to the real mailing list before going live.
