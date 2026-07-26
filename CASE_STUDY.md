# Dossier — Case Study

**Role**: Solo Product Manager & Builder (concept, PRD, UX decisions, content
strategy, build)
**Timeline**: Single build cycle, iterated through two design passes based on
self-directed usability review
**Stack**: PWA (vanilla JS, no framework dependency), localStorage-based
state, zero backend

**Live demo**: `https://vishakhajha24.github.io/Dossier/`

---

## The opportunity

Professionals in business, product, and strategy roles are frequently
evaluated, informally, on how fluently they reference the "canon": named
case studies (Kodak, the Amazon flywheel), economic concepts (Jevons
paradox), psychology principles (loss aversion), and consumer-behavior
patterns (the lipstick effect). This fluency is a real signal of business
literacy, and it currently has no dedicated product. It's assembled by
accident, over years, from business books, podcasts, and osmosis from
senior colleagues.

Adjacent categories exist but none solve this directly:
- **Newsletters** (Morning Brew, The Hustle) optimize for topical currency,
  not durable recall, read once, gone by next week.
- **Book-summary apps** (Blinkist, Shortform) optimize for coverage and
  compress volume, not for retention or conversational usability.
- **Spaced-repetition tools** (Anki, Duolingo) solve retention well but are
  content-agnostic, they're infrastructure, not a curated point of view on
  what's worth knowing.

The gap: nothing combines a curated, conversation-ready content point of
view with a retention mechanic built for actually using the material out
loud, not just recognizing it on a flashcard.

## What I built

A PWA that delivers one curated briefing per category per day (six fixed
categories), capped to a 3-7 minute read, with three product mechanics
doing the real work:

1. **A retention loop, not a content feed.** Leitner-style spaced
   repetition (1/3/7/14/30-day intervals) resurfaces read material instead
   of letting it disappear after one exposure, this is the core bet: the
   product is undifferentiated without it.
2. **A conversational output, not just an input.** Every entry ends with a
   "Say this" line, a scripted, ready-to-use spoken sentence. The product
   optimizes for the output behavior (using it in a room), not just the
   input behavior (reading it).
3. **A deliberately small daily surface.** Six categories, shown as a full
   grid, zero scrolling required to see the whole day's set. This was a
   direct constraint decision: more choice at a glance was weighed against
   fewer, larger cards requiring a scroll, the compact grid won on
   decision speed.

Full reasoning for each call, including what was explicitly rejected, is in
[`DECISIONS.md`](./DECISIONS.md).

## How I defined success

Full framework in [`PRD.md`](./PRD.md), summarized here:

**North Star Metric**: *Weekly Recall Sessions*, the number of sessions per
user per week where a story is either newly read or successfully revisited
via spaced repetition. This was chosen over a simpler "daily active user"
metric because DAU rewards opening the app; this product's actual value is
in the revisit loop completing, so the North Star is built around the
mechanic that differentiates the product, not raw usage.

Supporting metrics, guardrails, and the full instrumentation plan, since v1
ships with zero telemetry by design, are in the PRD.

## Product iteration, not just delivery

The visual direction changed once, materially, after a self-directed
usability pass: the original "intelligence dossier" aesthetic (dark,
formal, stamped-document styling) tested well for the *content* framing but
worked against the intended *emotional* framing, learning should feel light
and low-friction, not like clearance paperwork. A full re-theme to a
lighter, warmer visual system followed. Documented as decision #9 in the
log, this is the clearest evidence of iteration over a single first-pass
build.

## What's next

- **Phase 2, content supply**: a server-side generation pipeline (API key
  held server-side, never client-exposed) to grow the library past manual
  batches, scoped and ready to build, deliberately not built into v1 to
  avoid adding backend complexity before the core loop was validated.
- **Instrumentation**: lightweight, privacy-respecting event logging to
  actually populate the metrics framework defined in the PRD, currently a
  hypothesis, not yet measured.
- **Notification layer**: intentionally excluded from v1 to test whether
  the core loop earns a daily open on pull alone before adding push.

See [`PRD.md`](./PRD.md) for full scope, competitive landscape, risks, and
the validation plan for what I'd test first if this moved beyond a personal
tool.
