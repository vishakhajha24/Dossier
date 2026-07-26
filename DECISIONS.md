# Decisions — Dossier

A log of the non-obvious product and design calls made while building this,
and the reasoning behind each. Format: Decision → Why → Tradeoff accepted.

---

### 1. PWA instead of native iOS/Android

**Decision**: Ship as an installable Progressive Web App, not a native app.

**Why**: The distribution requirement was "installable, and shareable via a
public repo link, no gatekeeper." Native iOS requires a paid developer
account and App Store review just to distribute, which breaks that
requirement outright. A PWA installs from a browser on iOS, Android, and
desktop from one codebase, no review process, no cost.

**Tradeoff accepted**: No push notifications on iOS PWAs. Acceptable
because v1 deliberately excludes push/reminder mechanics anyway, see PRD,
the product is testing pull before push.

**Not closed off**: PWABuilder or Capacitor can wrap the same codebase into
real App Store/Play Store builds later with no rewrite, kept as a
documented, sequenced option rather than a dead end.

---

### 2. No backend, no accounts, local storage only

**Decision**: All state, read progress, saved items, spaced-repetition
schedule, lives in the browser's localStorage, per device. No login, no
server, no telemetry in v1.

**Why**: A backend adds hosting cost, auth complexity, and privacy surface
area with no corresponding value at this stage of validation. It also
means the repo is fully self-contained, anyone who forks it gets a working
product with zero setup.

**Tradeoff accepted**: No cross-device sync, and no usage data to inform
iteration until instrumentation is deliberately added (see PRD, Validation
Plan). Judged acceptable because premature analytics infrastructure on an
unvalidated core loop is a common early-stage misallocation, instrumenting
before proving the loop matters is backwards.

---

### 3. 2x3 grid home screen instead of a vertical scroll

**Decision**: All six category picks are visible at once in a fixed grid,
no scrolling required to see today's full set.

**Why**: With exactly six categories, a fixed and known set rather than an
open-ended feed, a layout that surfaces the whole set in one glance
supports faster decision-making than a list built for unbounded scrolling
content. The category count was the deciding factor, this pattern doesn't
generalize past a small, fixed number of choices.

**Tradeoff accepted**: Each card had to compress significantly, title
clamped to three lines, teaser text dropped from the home card entirely, to
fit six cards on one mobile viewport. Full context stays one tap away in
the reader, so the compression cost information density on the home
screen, not information access overall.

---

### 4. Leitner-style spaced repetition instead of a flat content feed

**Decision**: Read stories re-enter rotation on a 1/3/7/14/30-day
increasing schedule, tagged "Revisit," rather than disappearing once read.

**Why**: The product's stated value is recall and reuse, not consumption
volume. A flat feed optimizes for volume; this required optimizing for
retention specifically, which meant building the mechanic that
differentiates the product from a newsletter or summary app, not just a
content pipeline.

**Tradeoff accepted**: Materially more scheduling logic than a simple
"next unread item" queue, and a metric (Weekly Recall Sessions) that's
harder to hit than a raw open-rate number. Accepted because the North Star
was deliberately anchored to this mechanic rather than to something easier
to move.

---

### 5. Visual emphasis for due-for-review cards

**Decision**: A due-for-review card gets a distinct color treatment, warm
accent, tinted background, rather than the same visual style as new-content
cards.

**Why**: The revisit state needs to register at a glance, not require
reading a label, since the whole point of surfacing it is to catch
attention before the user has decided what to read. This is a standard,
well-documented UX heuristic (cataloged, among other places, in
growth.design's UX psychology reference), applied here rather than
originated here.

**Tradeoff accepted**: One additional visual state to keep consistent
across future re-themes, and it was, the distinction had to be re-derived
from scratch in the later light-palette redesign rather than carried over
directly.

---

### 6. Small persistent unread marker instead of a "done" checkmark

**Decision**: Unread cards get a small dot; read cards get no
"completed" indicator.

**Why**: A checkmark signals closure and can reduce the pull to return to
something; an unresolved, low-key marker doesn't. Again, a known UX
heuristic (also part of the growth.design catalog referenced during this
build) rather than a novel discovery, applied deliberately to this specific
screen rather than defaulted into.

**Tradeoff accepted**: Less explicit positive reinforcement for completed
reads. Accepted since retention here is designed to run on the spaced
repetition loop, not on completion-badge feedback.

---

### 7. Content as a plain JSON file instead of hardcoded in app logic

**Decision**: All story content lives in `content.json`, separate from
application logic, with a documented schema.

**Why**: Two requirements converged: ongoing manual content addition
without touching code, and a scoped-but-deferred AI-generation phase.
Treating content as data rather than code makes both paths trivial, the
rendering layer doesn't care where `content.json` came from.

**Tradeoff accepted**: Negligible, one additional fetch call at load time,
mitigated by service-worker caching for offline use.

---

### 8. API key deferred to a documented Phase 2, not built into v1

**Decision**: No live AI content generation in v1. The path to add it,
server-held key via a serverless function, never shipped client-side, is
scoped in the PRD and README, not implemented.

**Why**: A static site cannot hold a secret safely; anything shipped to the
browser is extractable. Building this correctly requires backend
infrastructure, which is a distinct project with its own scope. Rather
than either skip it or over-build v1 with premature infrastructure, it was
scoped explicitly and sequenced deliberately after core-loop validation
(see PRD, Validation Plan, point 5).

**Tradeoff accepted**: Content growth stays manual until Phase 2 ships.
Accepted as the correct order of operations, scaling supply into an
unvalidated loop is a common and avoidable early-stage mistake.

---

### 9. Full re-theme from a dark "dossier" aesthetic to a light palette

**Decision**: The initial visual direction, ink-navy background, brass
accents, stamped-document styling, was fully rebuilt around a light
lavender palette, a softer accent color, pastel category coding, larger
corner radii, and lighter shadows, following a self-directed usability
review that flagged a mismatch between visual tone and intended experience.

**Why**: Visual tone is a product decision with real behavioral
consequences, not decoration. "Sound sharp in conversation" and "enjoy a
daily learning habit" are related but distinct emotional targets, and a
dark, formal, clearance-document aesthetic actively worked against the
second one once that gap was identified.

**Tradeoff accepted**: A full re-theme rather than an incremental
adjustment, new icon system, new accent language, new shadow and radius
scale, because the visual system was originally structured around CSS
custom properties specifically to make a full re-theme cheap if needed.
That structural choice paid for itself directly here.
