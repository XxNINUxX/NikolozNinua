# Nikoloz Ninua — Retro 8-bit Portfolio

A polished Super Mario Bros–inspired portfolio site built with pure HTML, CSS, and vanilla JavaScript.  No build tools required.

---

## Running Locally

```bash
# 1. Clone / download the repo
git clone https://github.com/XxNINUxX/NikolozNinua.git
cd NikolozNinua

# 2. Serve with any static server, e.g.:
npx serve .
# — or —
python -m http.server 8080
# — or —
php -S localhost:8080

# 3. Open http://localhost:8080 in your browser
```

> **Note:** Opening `index.html` directly via `file://` works for most features, but the audio detection uses an XMLHttpRequest that requires a server origin.

---

## Replacing the Pixel Avatar

The avatar is `assets/pixel-avatar.svg`.  To swap it out:

1. Create or export a new pixel-art sprite as an SVG (set `shape-rendering="crispEdges"` on the root `<svg>`) or a PNG (`image-rendering: pixelated` in CSS).
2. Replace `assets/pixel-avatar.svg` with your file (keep the same filename, or update the `src` attribute in `index.html`).
3. The inline `<svg>` fallback inside `index.html` (the `pixel-avatar--fallback` element) is only shown if the `src` attribute fails to load.  Update it to match your new avatar if you want the fallback to match.

---

## Adding Background Chiptune Audio

See `assets/PLACEHOLDER-chiptune.txt` for full instructions.  Short version:

1. Obtain a royalty-free 8-bit/chiptune loop in **MP3** format.
2. Place it at `assets/chiptune-loop.mp3`.
3. Reload the page — the ♪ Play button and volume slider will appear automatically in the header.

The audio player:
- Requires a user gesture before playing (no autoplay).
- Persists play state and volume to `localStorage`.
- Hides its UI entirely if `chiptune-loop.mp3` is absent.

---

## File Structure

```
NikolozNinua/
├── index.html               ← Main portfolio page
├── styles.css               ← Retro 8-bit stylesheet
├── script.js                ← Interactions & audio logic
├── Nikoloz_Ninua_CV.html    ← CV (unchanged — do not modify)
├── README.md                ← This file
└── assets/
    ├── pixel-avatar.svg     ← Pixel art avatar sprite
    ├── PLACEHOLDER-chiptune.txt  ← Instructions for audio file
    └── chiptune-loop.mp3    ← (Add your own — not committed)
```

---

## QA Checklist

| # | Test | Expected result |
|---|------|-----------------|
| 1 | Open `index.html` in browser | Hero loads: pixel avatar visible, name/role displayed, Download CV button present |
| 2 | Click **Download CV** | Opens `Nikoloz_Ninua_CV.html` in new tab |
| 3 | Click each nav button (PROFILE / SKILLS / PROJECTS / XP / CONTACT) | Correct panel shown; active button turns yellow; indicator slides to active button |
| 4 | Press **◄ / ►** arrow keys while no button/input is focused | Navigates between panels; active panel receives focus |
| 5 | Press arrow keys while a nav button is focused | Moves focus between nav buttons and activates the panel |
| 6 | Click **◈ Scanlines** button | Horizontal scanline overlay toggles on/off |
| 7 | Add `assets/chiptune-loop.mp3` and reload | ♪ button and volume slider appear; clicking ♪ plays music; clicking again pauses |
| 8 | While music is playing, change volume slider | Volume changes; reload page → volume is remembered |
| 9 | Click **Copy Email** chip | Toast "✉ Email copied to clipboard!" appears; clipboard contains the address |
| 10 | Block clipboard API (or use HTTP) | Toast shows the email address instead |
| 11 | Resize window to ≤ 640 px | Layout stacks vertically; nav scrolls horizontally; all text readable |
| 12 | Tab through entire page with keyboard only | All interactive elements reachable; focus outlines visible; nav arrow-keys work |
| 13 | Set OS to **Reduce Motion** | Clouds stop drifting; coin blocks stop bobbing; panel transition instant; indicator jumps instantly |
| 14 | Verify `Nikoloz_Ninua_CV.html` in repo root | File unchanged (do not modify) |
