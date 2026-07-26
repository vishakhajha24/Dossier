// Thin wrapper around localStorage. Everything here is per-device, per-user,
// no accounts and no server, so this is safe and appropriate (this is a
// self-hosted static PWA, not a sandboxed chat artifact).

const KEYS = {
  PROGRESS: "sb_progress_v1", // { [storyId]: { box, lastShown, nextDue, timesShown } }
  SAVED: "sb_saved_v1",       // string[] of storyId
  DAILY: "sb_daily_v1",       // { date: "YYYY-MM-DD", picks: { [categoryId]: storyId } }
  SEEN_ORDER: "sb_seen_order_v1" // { [categoryId]: number } cursor into unseen rotation
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("storage read failed for", key, e);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("storage write failed for", key, e);
  }
}

export const Storage = {
  getProgress() {
    return readJSON(KEYS.PROGRESS, {});
  },
  setProgress(progress) {
    writeJSON(KEYS.PROGRESS, progress);
  },
  getSaved() {
    return readJSON(KEYS.SAVED, []);
  },
  toggleSaved(storyId) {
    const saved = new Set(this.getSaved());
    if (saved.has(storyId)) saved.delete(storyId);
    else saved.add(storyId);
    const arr = Array.from(saved);
    writeJSON(KEYS.SAVED, arr);
    return arr;
  },
  isSaved(storyId) {
    return this.getSaved().includes(storyId);
  },
  getDaily() {
    return readJSON(KEYS.DAILY, null);
  },
  setDaily(daily) {
    writeJSON(KEYS.DAILY, daily);
  },
  getSeenOrder() {
    return readJSON(KEYS.SEEN_ORDER, {});
  },
  setSeenOrder(order) {
    writeJSON(KEYS.SEEN_ORDER, order);
  }
};
