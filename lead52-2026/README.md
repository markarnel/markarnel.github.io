# LEAD52 landing page — editable (v2)

Everything can be changed in the browser. No coding needed.

## Start it
- **Windows:** double-click `start.bat`
- **Mac:** double-click `start.command` (first time: right-click → Open)
- **Any system:** open a terminal here, run `node server.mjs`, then open http://localhost:8080
(Needs Node.js 18+ from nodejs.org. Nothing else to install.)

## Edit it
Click **✎ Edit page** (bottom-left). Click any text and type; wrap words in `[[double brackets]]` for teal. Then use the side panel:
- **Logo (header):** upload your logo (PNG/SVG/JPG) and set its height. It replaces the default wordmark everywhere in the header.
- **Colors · Sections (show/hide) · Banner words**
- **Font sizes by section:** two sliders per section (Hero, Banner, How it works, 52 weeks, Video tour, Signup): *Headings* and *Text*, 60%–160%.
- **Hero visual (right side):** shows an animated email mockup by default. Upload an image or video to replace it with your own asset (a product screenshot, illustration, or clip).
- **Videos & images · Signup form**
Press **Save**. Changes are written to `content.json`.

## Sign-ups (first name + email)
Both forms require a **first name** and a valid email.
- **Run with `node server.mjs`:** every sign-up is saved to `subscribers.csv` (date, first_name, email). Open it in Excel or Google Sheets.
- **Or send them to your own service:** in *Signup form*, paste a URL. The page POSTs JSON `{"firstName": "...", "email": "..."}` to it.
- The success message can include the name: use `{firstName}`.
- Without the server or a URL, the form is demo-only (nothing is stored).
`subscribers.csv` contains personal data; keep it private and don't upload it to your website.

## Hand-editing
`content.json` holds every text, color, size, media path and form setting. Delete it to return to the original design.

## Put it online
Upload the folder (except `server.mjs`, `start.*`, `subscribers.csv`) to any static host. The edit button only appears on localhost. Online, point the signup form at your email service's URL.

## Files
`index.html` the page · `content.json` your edits · `assets/` videos, images, fonts · `server.mjs` local server (127.0.0.1 only)
