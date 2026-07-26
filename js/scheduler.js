import { Storage } from "./storage.js";

// Leitner-style boxes: each successful "read" pushes a story further out.
const BOX_INTERVAL_DAYS = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
const MAX_BOX = 5;

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const Scheduler = {
  todayStr,

  // Call this whenever a user actually opens/reads a story.
  markRead(storyId) {
    const progress = Storage.getProgress();
    const today = todayStr();
    const existing = progress[storyId];
    const nextBox = existing ? Math.min(MAX_BOX, existing.box + 1) : 1;
    progress[storyId] = {
      box: nextBox,
      lastShown: today,
      nextDue: addDays(today, BOX_INTERVAL_DAYS[nextBox]),
      timesShown: existing ? existing.timesShown + 1 : 1
    };
    Storage.setProgress(progress);
  },

  isDue(storyId) {
    const progress = Storage.getProgress();
    const entry = progress[storyId];
    if (!entry) return false;
    return entry.nextDue <= todayStr();
  },

  hasBeenSeen(storyId) {
    const progress = Storage.getProgress();
    return Boolean(progress[storyId]);
  },

  getStats(storyId) {
    const progress = Storage.getProgress();
    return progress[storyId] || null;
  },

  // Returns { [categoryId]: { storyId, isRevisit } } for today, computing and
  // persisting a fresh pick per category the first time it's called each day.
  getDailyPicks(categories, stories) {
    const today = todayStr();
    let daily = Storage.getDaily();
    if (daily && daily.date === today) {
      return daily.picks;
    }

    const progress = Storage.getProgress();
    const seenOrder = Storage.getSeenOrder();
    const picks = {};

    for (const cat of categories) {
      const catStories = stories.filter((s) => s.category === cat.id);
      if (catStories.length === 0) continue;

      const due = catStories.filter((s) => {
        const p = progress[s.id];
        return p && p.nextDue <= today;
      });

      const unseen = catStories.filter((s) => !progress[s.id]);

      if (due.length > 0) {
        // earliest due first
        due.sort((a, b) => progress[a.id].nextDue.localeCompare(progress[b.id].nextDue));
        picks[cat.id] = { storyId: due[0].id, isRevisit: true };
      } else if (unseen.length > 0) {
        const cursor = seenOrder[cat.id] || 0;
        const idx = cursor % unseen.length;
        picks[cat.id] = { storyId: unseen[idx].id, isRevisit: false };
        seenOrder[cat.id] = cursor + 1;
      } else {
        // everything seen, nothing due yet: fall back to the least-recently-shown
        const sorted = [...catStories].sort((a, b) => {
          const pa = progress[a.id]?.lastShown || "0000-00-00";
          const pb = progress[b.id]?.lastShown || "0000-00-00";
          return pa.localeCompare(pb);
        });
        picks[cat.id] = { storyId: sorted[0].id, isRevisit: true };
      }
    }

    Storage.setSeenOrder(seenOrder);
    Storage.setDaily({ date: today, picks });
    return picks;
  }
};
