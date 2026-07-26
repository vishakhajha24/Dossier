# PRD — Dossier

## Executive summary

Dossier is a mobile-first PWA that builds durable, conversation-ready
fluency in business strategy, economics, psychology, and consumer behavior
through a daily curated briefing and a spaced-repetition retention loop.
The core hypothesis: the market has plenty of tools for *consuming*
business knowledge (newsletters, summaries) and plenty of tools for
*retaining* arbitrary flashcards (Anki, Duolingo), but nothing that
combines a curated point of view with a retention mechanic built
specifically for spoken, in-conversation reuse.

## Problem statement

Business professionals are informally judged on how fluently they deploy
named references, case studies, mental models, principles, in
conversation. There is no dedicated path to building that fluency
deliberately; it's acquired passively over years. For people without a
formal economics or psychology background, or without a natural aptitude
for memorizing abstract definitions, that passive acquisition path is slow
and unreliable.

## Target users

**Primary**: Early-to-mid-career business, product, and strategy
professionals who want to reference case studies and mental models
fluently in meetings and conversation, and who are motivated by
communication credibility, not academic mastery.

**Secondary**: Anyone building general business literacy as a side
practice, students preparing for case-interview-style conversations,
career-switchers into business roles who need to close a vocabulary gap
quickly.

## Goals

1. Build durable recall of a curated set of business/economics/psychology
   reference points, measured by actual reuse, not just exposure.
2. Make the daily habit low-friction enough to sustain without external
   nudges (v1 deliberately tests pull before adding push).
3. Keep the product privacy-respecting and zero-dependency: no account, no
   backend, fully functional offline.

## North Star Metric

**Weekly Recall Sessions**: the count of sessions per user per week in
which at least one story is either read for the first time or successfully
revisited through the spaced-repetition scheduler.

**Why this metric and not a simpler one**: A standard DAU/WAU metric
rewards opening the app, which any content feed can inflate. This product's
actual differentiation is the *revisit loop*, content coming back and
being re-engaged with, not first-time reads. Anchoring the North Star on
sessions that include a revisit forces the metric to track the mechanic
that makes this product different from a newsletter, rather than tracking
generic engagement that a newsletter would also score well on.

## Supporting metrics framework

| Layer | Metric | What it tells us |
|---|---|---|
| **Activation** | % of installs that complete a first full read (not just an open) | Whether the core format (3-7 min briefing) lands on first exposure |
| **Engagement** | Daily category coverage (avg. categories opened per active day, out of 6) | Whether the grid's breadth is being used, or usage collapses into 1-2 favorite categories |
| **Retention (core)** | Weekly Recall Sessions (North Star) | Durable engagement with the retention mechanic specifically |
| **Retention (cohort)** | D1 / D7 / D30 return rate | Standard habit-formation curve, benchmarked against comparable daily-habit products (Duolingo-class, not newsletter-class) |
| **Perceived value** | Save rate (% of read stories saved for later) | A voluntary, low-friction signal of "this was worth keeping," cleaner than time-on-card |
| **Content health** | Library growth rate (new stories added per week) vs. consumption rate | Whether content supply is keeping pace with a user working through the library, the exact problem that motivates Phase 2 |
| **Guardrail** | Revisit dismissal rate (if added) | Protects against the retention mechanic becoming friction instead of value, watch this closely if a "skip" action is ever added |

**Current instrumentation status**: v1 ships with zero telemetry, by
design, no backend exists to receive events, and local-only storage was a
deliberate privacy stance (see `DECISIONS.md`). The framework above is the
measurement plan for the moment instrumentation is added (see Validation
Plan), not a report of collected data. Framing metrics before building the
pipe to collect them is itself the discipline this section is meant to
demonstrate: know what you'd measure and why before you instrument,
not after.

## Competitive landscape

| Product | Strength | Gap relative to Dossier |
|---|---|---|
| Morning Brew / The Hustle (newsletters) | Topical currency, low effort | No retention mechanic, content is disposable by design |
| Blinkist / Shortform (book summaries) | Breadth of coverage | Optimizes for volume consumed, not recall; no conversational output framing |
| Anki / Duolingo (spaced repetition) | Best-in-class retention mechanic | Content-agnostic infrastructure, not a curated point of view; Duolingo's mechanic is the closest structural analog, adapted here for a different content domain |
| Farnam Street / Naval-style mental-model content | High-quality curation | Long-form, not habit-sized; no built-in retention loop |

**Positioning**: Dossier sits at the intersection of Duolingo's retention
mechanic and Farnam-Street-quality curation, applied specifically to
business conversational fluency, a combination no adjacent product
currently owns.

## Scope: v1 (built)

- Six fixed categories, one daily pick each, delivered as a full grid
  (no scroll) capped at 3-7 minutes per read.
- Swipeable full-category stack beyond the daily pick.
- Leitner-style spaced repetition (1/3/7/14/30-day intervals).
- Save-for-later list.
- Installable, offline-capable PWA, no login, no backend, no telemetry.
- 12 seed stories (2 per category).

## Explicitly out of scope for v1 (deferred, not forgotten)

- **AI-generated content on demand.** Requires a server-held API key,
  which a static site cannot hold safely, this is a scoped Phase 2, not an
  oversight.
- **Push notifications.** Deliberately excluded to isolate whether the core
  loop earns a daily open without a nudge, before adding one and losing
  the ability to measure that baseline.
- **Multi-device sync / accounts.** Local-first by design for v1; revisit
  only if cross-device usage data (once instrumented) shows it's a real
  drop-off point.
- **Native App Store distribution.** PWA now, with a documented no-rewrite
  path to native packaging later if store presence becomes a strategic
  need (e.g., discoverability).

## Risks and assumptions

| Risk / assumption | Why it matters | Mitigation |
|---|---|---|
| Assumes users will tolerate a fixed 6-category structure rather than personalization | If real usage collapses to 1-2 categories, the other 4 are dead weight in the UI | Category coverage metric (above) is designed to surface this early |
| Assumes 3-7 minutes is the right depth/brevity tradeoff | Untested outside personal use; could be too long for habit formation or too short for retention to work | First validation step, see below |
| Local-only storage means zero user data for iteration | Can't retroactively analyze what worked without shipping instrumentation first | Instrumentation is explicitly scoped as the next build step, not an afterthought |
| Manual content authoring doesn't scale | Library growth is bottlenecked on manual batches until Phase 2 ships | Phase 2 scoped and documented, sequenced deliberately after core-loop validation, not before |

## Validation plan

If this moved beyond a personal tool, the sequence I'd run:

1. **Instrument before expanding.** Ship the lightweight event logging
   needed to populate the metrics framework above. No further product
   decisions should be made on intuition once this is possible.
2. **Validate the depth assumption first.** A/B the 3-7 minute format
   against a shorter (60-90 second) variant for a subset of categories,
   activation and D7 retention are the read on this, not opinion.
3. **Test the pull-vs-push hypothesis explicitly.** Only after establishing
   a pull-only baseline (current v1 state) would I introduce an opt-in
   notification cohort and compare Weekly Recall Sessions against the
   no-notification control.
4. **Validate category breadth vs. personalization.** If category coverage
   data shows consistent collapse into 1-2 categories, test a
   personalized/adaptive category mix against the fixed 6-category grid.
5. **Only then, scale content supply.** Phase 2 (AI-assisted generation)
   gets built once activation and retention are validated, not before,
   scaling content into an unvalidated loop wastes the highest-cost part
   of the roadmap on an unproven core.  daily pick.
- Save-for-later list.
- Spaced-repetition resurfacing (Leitner-style: 1/3/7/14/30-day intervals)
  so read content comes back instead of disappearing after one exposure.
- Installable PWA, offline-capable, no login, no backend, no analytics.
- 12 seed stories (2 per category) shipped at launch.

## Explicitly out of scope for v1 (deferred, not forgotten)

- AI-generated content on demand. Requires a server-held API key (a static
  GitHub Pages site can't safely hold a secret client-side), which is a
  separate small backend project. Documented as Phase 2 in the README so
  the door stays open without blocking v1 shipping.
- Push notifications / daily reminders. Deliberately testing whether the
  product earns a daily open on its own before adding a nudge mechanic.
- Multi-user accounts or cloud sync. Everything is local-device storage by
  design, this is a personal tool first, not a platform.
- Native App Store distribution. PWA now, with an explicit, documented
  no-rewrite path to native packaging (PWABuilder/Capacitor) later if
  warranted.

## Key constraint that shaped the product

Reading time had to stay in a strict 3 to 7 minute band. Below that and a
story can't earn genuine "sound smart" depth (a name-dropped concept with
no story behind it is forgettable and risks sounding shallow in
conversation). Above that and it stops being a daily-habit-compatible
format. This constraint, not a content-length default, is what shaped every
story's structure: one case/concept, one grounding example, one quotable
line.
