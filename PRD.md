# PRD — Dossier

## Problem

In business conversations (meetings, casual work chat, networking), sharp
communicators lean on a stock of ready references: named business cases,
economic concepts, psychology principles, framed consumer-behavior trends.
This vocabulary compounds credibility over time, but it isn't taught
anywhere structured, most people absorb it by accident from books, podcasts,
or senior colleagues, over years.

The specific gap this addresses: I know I want this kind of fluency, I'm
not naturally strong at memorizing definitions in the abstract, and I don't
have a consistent input source that's both trustworthy and bite-sized enough
to actually stick with daily.

## Target user

Primary persona: me. A product/business professional who wants to reference
strategy case studies, economic concepts, psychology principles, and
consumer-behavior trends fluently in conversation, without a formal
economics/psychology background, and without the time for long-form
reading as the primary learning method.

Secondary (if shared publicly): anyone in a similar seat, early-to-mid
career, business-adjacent, wants applied vocabulary over academic depth.

## Goal

Build daily fluency in a specific, curated set of "sound smart" reference
points, and actually retain them well enough to deploy them unprompted in
live conversation, not just recognize them when reading.

## Success criteria

Not a growth/engagement metric, this is a personal learning tool. Success
looks like:
- Can recall and correctly use at least 2 to 3 concepts per week in a real
  conversation without looking them up first.
- Voluntarily open the app most days without a push reminder (no
  notification system exists yet, this is intentionally testing pull, not
  push, in v1).
- Content library grows because I keep wanting more, not because a metric
  demanded it.

## Scope: v1 (built)

- Six fixed categories: business strategy & disruption stories, economic
  concepts & mental models, psychology & behavioral concepts, consumer
  behavior across eras, product & growth frameworks, named laws/one-liners.
- One daily pick per category, delivered as a compact card grid (2x3), not
  a scrolling feed, capped reading time of 3 to 7 minutes per piece.
- Swipeable full stack per category for anyone who wants more than the
  daily pick.
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
