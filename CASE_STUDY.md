# Dossier — Case Study

**Live demo**: add your GitHub Pages URL here once deployed, e.g.
`https://vishakhajha24.github.io/Dossier/`

**What it is**: A personal PWA that delivers one bite-sized "briefing card"
a day per category (business strategy, economics, psychology, consumer
behavior, growth frameworks, named laws), sized to a 3 to 7 minute read,
with spaced-repetition resurfacing so it's optimized for actually
remembering and reusing the content in conversation, not just consuming it
once.

## The problem

I wanted to build fluency in the kind of reference points sharp business
communicators use casually: named case studies, economic concepts,
psychology principles, framed consumer trends. That vocabulary usually gets
absorbed by accident over years of reading and conversation. I don't have a
strong economics/psychology background and I'm not naturally good at
memorizing definitions in the abstract, so a static list of terms wouldn't
have worked for me. I needed something built around retention, not just
delivery.

## Constraints I set going in

- **3 to 7 minutes per piece.** Long enough to earn real depth (a name with
  no story behind it isn't usable in conversation), short enough to survive
  as a daily habit.
- **No account, no backend.** This needed to be something I could hand to
  anyone via a repo link and have it just work, no signup, no server cost.
- **Installable on a phone**, since that's where the daily habit would
  actually live.

## What I built (v1)

- Six categories, one daily pick each, shown as a full grid (not a scroll)
  so the whole day's set is visible at a glance.
- A swipeable full library per category for anyone who wants to go beyond
  the daily pick.
- Leitner-style spaced repetition (1/3/7/14/30-day intervals), so read
  content comes back later instead of disappearing after one exposure,
  this is the part actually aimed at the retention problem, not just
  content delivery.
- Save-for-later list.
- A "Say this" pull-quote on every card: a ready-to-use spoken line, since
  the end goal was always conversational use, not just recognition.
- Installed as a PWA: offline-capable, no App Store gatekeeping, one
  codebase working on iOS, Android, and desktop.

See `PRD.md` for the full scope (including what was explicitly deferred)
and `DECISIONS.md` for the reasoning behind specific product and design
calls made along the way, including two applied UX psychology principles
(Von Restorff effect for surfacing due-for-review content, Zeigarnik effect
for the unread-state indicator) and a full visual re-theme made in response
to user feedback that the first version's tone didn't match the intended
experience.

## What I'd build next

Documented as Phase 2 in the README: a small server-side function to
generate new stories on demand via the Anthropic API, keeping the API key
off the client, so the content library can grow past manual batches without
compromising the "no backend" simplicity of v1 for anyone who just wants to
run the app as-is.
