# Decisions — Dossier

A running log of the non-obvious calls made while building this, and why.
Format: Decision → Why → Tradeoff accepted.

---

### 1. PWA instead of native iOS/Android

**Decision**: Ship as an installable Progressive Web App, not a native app.

**Why**: The explicit goal was "installable, and I want to put it on GitHub
so other people can use it too." Native iOS requires a $99/year Apple
Developer account and App Store review just to distribute, which breaks
"share a repo link, anyone installs it." A PWA installs from a browser on
both iOS (Add to Home Screen) and Android (native install prompt), with one
codebase, no gatekeeper, no cost.

**Tradeoff accepted**: No push notifications on iOS PWAs. Judged acceptable
since v1 deliberately excludes push/reminder mechanics anyway (see PRD,
testing pull over push).

**Not closed off**: PWABuilder or Capacitor can wrap the same codebase into
real App Store/Play Store builds later with no rewrite, documented in the
README so this isn't a dead end, just a sequencing choice.

---

### 2. No backend, no accounts, local storage only

**Decision**: All state (read progress, saved items, spaced-repetition
schedule) lives in the browser's localStorage, per device. No login, no
server, no analytics.

**Why**: This is a personal learning tool, not a platform. A backend adds
hosting cost, auth complexity, and privacy surface area for zero benefit at
this scope. It also means anyone who forks the repo gets a fully working
app with no setup, no environment variables, no signup flow.

**Tradeoff accepted**: No cross-device sync. Reading progress on your phone
doesn't show up on your laptop. Acceptable because the primary use case is
a single phone, used daily, not a multi-device workflow.

---

### 3. 2x3 grid home screen instead of a vertical scroll

**Decision**: All six category picks are visible at once in a fixed grid,
no scrolling required to see today's full set.

**Why**: Applies Hick's Law, more visible choices scanned at once is
faster to decide from than the same choices strung out in a scroll a user
has to work through serially. Since there are exactly six categories (a
fixed, known set, not an open-ended feed), a grid that shows the whole set
in one glance is a better fit than a list designed for unbounded content.

**Tradeoff accepted**: Each card had to shrink significantly (title
line-clamped to 3 lines, hook text dropped entirely from the home card) to
fit six cards on one mobile screen without scrolling. Full context is one
tap away in the reader, so nothing is lost, just deferred a level.

---

### 4. Leitner-style spaced repetition instead of a flat "new content" feed

**Decision**: Read stories re-enter rotation on a 1/3/7/14/30-day
increasing schedule, tagged "Revisit" when due, rather than disappearing
once read.

**Why**: The stated problem wasn't "give me things to read," it was "help
me actually remember and reuse this in conversation." A pure feed optimizes
for consumption; spaced repetition is a directly evidence-based mechanism
for retention. Given the user explicitly self-identified as bad at
memorizing definitions in the abstract, retention (not volume) was the
actual product to build.

**Tradeoff accepted**: More scheduling logic to build and reason about than
a simple "next unread item" queue. Justified because retention was the
stated core goal, not a nice-to-have.

---

### 5. Visual emphasis for "Revisit" cards (Von Restorff effect)

**Decision**: A due-for-review card gets a distinct color treatment (warm
coral accent + tinted background) instead of blending into the same visual
style as new-content cards.

**Why**: The Von Restorff effect, the thing that looks different is the
thing that gets remembered, is directly useful here: the whole point of a
revisit card is that it should register as different at a glance, not
require reading the label to notice.

**Tradeoff accepted**: One more visual state to design and keep consistent
across a future re-theme (and it was: re-themed once from dark/brass to
light/lavender, and the revisit-card distinction had to be re-derived in
the new palette rather than copy-pasted).

---

### 6. Small persistent unread marker instead of a "done" checkmark (Zeigarnik effect)

**Decision**: Unread cards get a small dot; read cards get nothing (no
checkmark, no "completed" state).

**Why**: The Zeigarnik effect: unfinished things are cognitively stickier
than finished ones. A checkmark signals closure and reduces the pull to
return; a small, quiet "not yet" marker does the opposite without being
naggy about it.

**Tradeoff accepted**: Less explicit positive feedback for having read
something. Judged acceptable since positive reinforcement wasn't the
retention mechanism being relied on here, spaced repetition was.

---

### 7. Content as a plain JSON file instead of hardcoded in app logic

**Decision**: All story content lives in `content.json`, separate from
`js/app.js`, with a documented schema.

**Why**: Two reasons converged: (a) the user wanted to keep adding stories
over time without touching code, and (b) a defined AI-generation phase was
explicitly floated as a future possibility. Keeping content as data (not
code) makes both a manual edit and a future automated content pipeline
trivial, the app's rendering logic doesn't care where content.json came
from.

**Tradeoff accepted**: None significant, this is close to strictly better
than hardcoding, the only cost is one extra fetch call on load, mitigated
by the service worker caching it for offline use.

---

### 8. API key deferred to a documented Phase 2, not built into v1

**Decision**: No live AI content generation in v1. The path to add it later
(server-held key via a small serverless function, never shipped
client-side) is documented in the README, not implemented.

**Why**: A static GitHub Pages site cannot safely hold a secret, anything
shipped to the browser is publicly extractable. Building a secure version
requires a backend, which is a genuinely separate project. Rather than
either skipping the idea entirely or over-building v1, the decision was to
scope it out explicitly and leave a clear, written path back to it.

**Tradeoff accepted**: Content growth is manual (batch requests, hand-edit
JSON) until Phase 2 is actually built. Acceptable since manual batches were
already the agreed v1 content strategy.

---

### 9. Re-theme from dark "dossier" aesthetic to light lavender palette

**Decision**: Initial visual direction was an ink-navy, brass-accented
"intelligence dossier" look (stamped cards, wax-seal icon). Rebuilt
entirely around a light lavender palette with a softer violet accent,
pastel category colors, larger corner radii, and lighter shadows, on
explicit user feedback that the original felt too intense for the actual
desired vibe (light and fun).

**Why**: Visual tone is a product decision, not just decoration, "sounding
smart" and "having fun learning" are different emotional targets, and a
dark, formal, classified-file aesthetic actively worked against the second
one once that was made explicit.

**Tradeoff accepted**: A full re-theme rather than an incremental tweak,
new icon set, new accent system, new shadow/radius language, because the
color tokens were structured for exactly this (CSS custom properties
throughout), the rebuild was fast, validating that token-based theming was
worth the setup cost even in a small app.
