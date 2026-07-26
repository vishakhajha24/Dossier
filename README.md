# Dossier

A small installable PWA that gives you one "briefing card" a day per category
(business strategy, economics, psychology, consumer behavior, growth
frameworks, named laws/one-liners), with a swipeable stack if you want more
than the daily pick, a save-for-later list, and spaced-repetition resurfacing
so stories you've read come back later to help you actually remember them.

No backend, no accounts, no API key required to run it. Everything (reading
progress, saved items, spaced-repetition schedule) is stored locally in the
browser via `localStorage`, per device.

**Live demo**: add your GitHub Pages URL here once deployed, e.g.
`https://vishakhajha24.github.io/Dossier/`

**Product writeup**: this repo doubles as a small case study.
- [`CASE_STUDY.md`](./CASE_STUDY.md) — the problem, the constraints, what got built, what's next
- [`PRD.md`](./PRD.md) — goal, target user, success criteria, v1 scope vs. what was deferred and why
- [`DECISIONS.md`](./DECISIONS.md) — the specific product/design tradeoffs made along the way (PWA vs. native, spaced repetition, applied UX psychology, a full visual re-theme, and more)

## Deploy it (GitHub Pages, free, ~5 minutes)

1. Create a new GitHub repo (public, so Pages works on the free tier), e.g. `dossier`.
2. Push all files in this folder to the repo root (keep the folder structure: `js/`, `css/`, `icons/` as subfolders).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`.
5. Save. GitHub gives you a URL like `https://yourname.github.io/dossier/`.
6. Open that URL on your phone in Chrome (Android) or Safari (iOS).
   - **Android/Chrome**: you'll get an "Install app" / "Add to Home Screen" prompt, or use the browser menu.
   - **iOS/Safari**: tap Share → "Add to Home Screen." This installs it with the icon, splash screen, and offline support, no App Store needed.

Any other static host works identically (Netlify, Vercel, Cloudflare Pages) if you'd rather use one of those, this app has no server-side code at all.

## Turning this into a native app store listing later

Nothing in this codebase needs to change. When you're ready:

- **PWABuilder** (pwabuilder.com, free): point it at your deployed URL, it generates an Android APK/AAB and an iOS Xcode project ready for store submission.
- **Capacitor**: wraps this same HTML/JS/CSS in a native shell if you want deeper native integration later (push notifications, etc).

## Adding more stories

Content lives entirely in `content.json`. Each story is a plain object:

```json
{
  "id": "unique-slug-no-spaces",
  "category": "business-strategy",
  "title": "Headline for the card",
  "hook": "One-line teaser shown on the home screen card",
  "readTime": 5,
  "term": "The named concept, shown as a small label",
  "body": "Paragraph one.\n\nParagraph two.\n\nParagraph three.",
  "sayThis": "The quotable one- or two-sentence line for dropping into conversation."
}
```

Valid `category` values (defined at the top of `content.json` under `categories`):
`business-strategy`, `economics`, `psychology`, `consumer-behavior`,
`frameworks`, `oneliners`.

To add stories: open `content.json`, add new objects to the `stories` array,
save, redeploy (just push to GitHub, Pages updates automatically in
1 to 2 minutes). No code changes needed. You can add as many as you want to
any category at any time, there's no cap.

You (or anyone who forks the repo) can hand-write entries directly in this
format, no coding required beyond editing JSON.

## Phase 2: AI-generated content (optional, not built yet)

Kept the door open on purpose, here's the shape it would take when ready:

- A small serverless function (Cloudflare Worker or Vercel function, both
  have free tiers) holds your Anthropic API key **server-side**. It must not
  live in this static site's code, anything shipped to the browser is
  publicly visible, so a key embedded in `app.js` or `content.json` could be
  extracted and misused by anyone who opens dev tools.
- That function calls the Anthropic API to generate a new story in the exact
  JSON shape above, for a given category, and appends it to a content store
  (could still be a `content.json` hosted somewhere writable, or a small
  database).
- The app's `fetch("./content.json")` call in `js/app.js` would point at
  that endpoint instead of (or in addition to) the local file, everything
  else, the scheduler, the swipe reader, the save list, works unchanged.

This is a genuinely separate, smaller project on top of a working app, worth
doing once you know which categories you actually want more of.

## How the daily pick and spaced repetition work

- Each category gets one "today" pick, shown on the home screen.
- If a previously-read story in that category is due for review (per a
  Leitner-style schedule: 1 day, 3 days, 7 days, 14 days, 30 days,
  increasing each time you revisit it), that's the pick, tagged "Revisit."
- Otherwise you get the next unread story in that category, in order.
- Once everything in a category has been read at least once and nothing is
  due yet, it falls back to whichever story you saw longest ago.
- Opening a category from the home card lets you swipe left/right through
  every story in that category, not just the daily one, each swipe marks
  that story as read and updates its review schedule.
- The daily picks themselves are computed once and cached for the day, they
  won't change again until your device's date rolls over, even if you read
  or swipe through everything.

## File structure

```
index.html           entry point
manifest.json         PWA metadata (name, icons, colors)
service-worker.js     offline caching
css/style.css         all styling
js/app.js             rendering, routing, swipe reader
js/storage.js         localStorage read/write helpers
js/scheduler.js       spaced repetition + daily pick logic
content.json           all story content + category definitions
icons/                 app icons
CASE_STUDY.md          product case study writeup
PRD.md                 lightweight PRD
DECISIONS.md           decision log with reasoning and tradeoffs
```

## Use this
python3 -m http.server
