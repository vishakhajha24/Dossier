import { Storage } from "./storage.js";
import { Scheduler } from "./scheduler.js";

const app = document.getElementById("app");
let DATA = { categories: [], stories: [] };

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h12v-9"/></svg>`,
  archive: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="5" width="16" height="4"/><path d="M5 9v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M10 13h4"/></svg>`,
  saved: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 4h12v16l-6-4-6 4Z"/></svg>`
};

function catById(id) {
  return DATA.categories.find((c) => c.id === id);
}
function storyById(id) {
  return DATA.stories.find((s) => s.id === id);
}
function accentVar(catId) {
  return `var(--cat-${catId})`;
}

function sealMarkSVG() {
  return `<svg class="seal-mark" viewBox="0 0 40 40" width="18" height="18" aria-hidden="true">
    <circle cx="20" cy="20" r="17" fill="none" stroke="#8C6FE8" stroke-width="1.8"/>
    <circle cx="20" cy="20" r="13" fill="none" stroke="#C3B3F5" stroke-width="1"/>
    <text x="20" y="26" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="16" fill="#8C6FE8">D</text>
  </svg>`;
}

function fmtDate() {
  const d = new Date();
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

// ---------------- Routing ----------------

function route() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace("#/", "").split("/").filter(Boolean);

  if (parts[0] === "category" && parts[1]) {
    renderReader(parts[1], parts[2] || null);
  } else if (parts[0] === "archive") {
    renderArchive();
  } else if (parts[0] === "saved") {
    renderSaved();
  } else {
    renderHome();
  }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);

// ---------------- Shell ----------------

function shell(innerHTML, activeNav) {
  app.innerHTML = `
    <div class="header">
      <div class="brand">${sealMarkSVG()}Dossier</div>
      <div class="date">${fmtDate()}</div>
    </div>
    <div id="view">${innerHTML}</div>
    ${bottomNav(activeNav)}
  `;
}

function bottomNav(active) {
  const items = [
    { id: "home", label: "Today", icon: ICONS.home, href: "#/" },
    { id: "archive", label: "Archive", icon: ICONS.archive, href: "#/archive" },
    { id: "saved", label: "Saved", icon: ICONS.saved, href: "#/saved" }
  ];
  return `
    <nav class="bottom-nav">
      ${items.map((i) => `
        <a class="nav-btn ${active === i.id ? "active" : ""}" href="${i.href}">
          ${i.icon}
          <span>${i.label}</span>
        </a>
      `).join("")}
    </nav>
  `;
}

// ---------------- Home ----------------

function renderHome() {
  const picks = Scheduler.getDailyPicks(DATA.categories, DATA.stories);

  const cards = DATA.categories.map((cat) => {
    const pick = picks[cat.id];
    if (!pick) return "";
    const story = storyById(pick.storyId);
    if (!story) return "";
    return `
      <button class="cat-card ${pick.isRevisit ? "is-revisit" : ""}" style="--accent:${accentVar(cat.id)}" data-cat="${cat.id}" data-story="${story.id}">
        <div class="cat-card-top">
          <span class="stamp ${pick.isRevisit ? "revisit" : ""}">${pick.isRevisit ? "Revisit" : cat.stamp}</span>
          <span class="readtime">${story.readTime}m</span>
        </div>
        <div class="cat-card-title">${story.title}</div>
        <div class="cat-card-bottom">
          <span class="cat-card-cat">${cat.name}</span>
          ${pick.isRevisit ? "" : '<span class="unread-mark"></span>'}
        </div>
      </button>
    `;
  }).join("");

  shell(`
    <div class="deck">
      <div class="deck-intro">Today's pick, one per category. Tap for the full read, swipe inside for more.</div>
      ${cards}
    </div>
  `, "home");

  document.querySelectorAll(".cat-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      const story = btn.dataset.story;
      window.location.hash = `#/category/${cat}/${story}`;
    });
  });
}

// ---------------- Reader (swipeable stack within a category) ----------------

function renderReader(catId, startStoryId) {
  const cat = catById(catId);
  const stories = DATA.stories.filter((s) => s.category === catId);
  if (!cat || stories.length === 0) {
    renderHome();
    return;
  }
  let startIndex = stories.findIndex((s) => s.id === startStoryId);
  if (startIndex < 0) startIndex = 0;

  app.innerHTML = `
    <div class="reader-topbar">
      <button class="icon-btn" id="backBtn">&larr;</button>
      <span class="reader-progress" id="readerProgress">${cat.name.toUpperCase()}</span>
      <span style="width:36px"></span>
    </div>
    <div class="reader-scroll" id="readerScroll">
      ${stories.map((s) => readerCardHTML(s, cat)).join("")}
    </div>
    <div class="swipe-hint">&larr; swipe for more in ${cat.name} &rarr;</div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.hash = "#/";
  });

  const scrollEl = document.getElementById("readerScroll");
  const cardWidth = () => scrollEl.clientWidth;

  // jump to the requested story without an animated scroll
  scrollEl.scrollLeft = startIndex * cardWidth();

  let currentIndex = startIndex;
  markAndUpdate(stories[currentIndex].id);

  scrollEl.addEventListener("scroll", debounce(() => {
    const idx = Math.round(scrollEl.scrollLeft / cardWidth());
    if (idx !== currentIndex && stories[idx]) {
      currentIndex = idx;
      document.getElementById("readerProgress").textContent =
        `${cat.name.toUpperCase()} · ${idx + 1}/${stories.length}`;
      markAndUpdate(stories[idx].id);
    }
  }, 150));

  document.getElementById("readerProgress").textContent =
    `${cat.name.toUpperCase()} · ${startIndex + 1}/${stories.length}`;

  attachSaveHandlers();
}

function markAndUpdate(storyId) {
  Scheduler.markRead(storyId);
}

function readerCardHTML(story, cat) {
  const saved = Storage.isSaved(story.id);
  const paragraphs = story.body.split("\n\n").map((p) => `<p>${p}</p>`).join("");
  return `
    <div class="reader-card">
      <div class="paper-card" style="--accent:${accentVar(cat.id)}">
        <div class="stamp-row">
          <span class="stamp" style="--accent:${accentVar(cat.id)}">${cat.stamp}</span>
          <span class="term">${story.term}</span>
        </div>
        <h1>${story.title}</h1>
        <div class="body">${paragraphs}</div>
        <div class="say-this" style="--accent:${accentVar(cat.id)}">
          <span class="say-label">Say this</span>
          <p>&ldquo;${story.sayThis}&rdquo;</p>
        </div>
        <div class="reader-actions">
          <button class="pill-btn ${saved ? "saved" : ""}" data-save="${story.id}">
            ${saved ? "&#9733; Saved" : "&#9734; Save for later"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachSaveHandlers() {
  document.querySelectorAll("[data-save]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.save;
      const savedList = Storage.toggleSaved(id);
      const isSaved = savedList.includes(id);
      btn.classList.toggle("saved", isSaved);
      btn.innerHTML = isSaved ? "&#9733; Saved" : "&#9734; Save for later";
    });
  });
}

// ---------------- Archive ----------------

function renderArchive() {
  const sections = DATA.categories.map((cat) => {
    const stories = DATA.stories.filter((s) => s.category === cat.id);
    const items = stories.map((s) => {
      const stats = Scheduler.getStats(s.id);
      const seen = Boolean(stats);
      const meta = seen
        ? `Box ${stats.box} &middot; next review ${stats.nextDue}`
        : "Not read yet";
      return `
        <button class="list-item" data-cat="${cat.id}" data-story="${s.id}">
          <div>
            <div class="list-item-title">${s.title}</div>
            <div class="list-item-meta"><span>${s.readTime} min</span><span>&middot;</span><span>${meta}</span></div>
          </div>
          <span class="dot ${seen ? "" : "unseen"}" style="--accent:${accentVar(cat.id)}; background:${seen ? accentVar(cat.id) : ""}"></span>
        </button>
      `;
    }).join("");
    return `<div class="list-section-title" style="--accent:${accentVar(cat.id)}">${cat.name}</div>${items}`;
  }).join("");

  shell(`<div class="list-view">${sections}</div>`, "archive");
  attachListNav();
}

// ---------------- Saved ----------------

function renderSaved() {
  const savedIds = Storage.getSaved();
  if (savedIds.length === 0) {
    shell(`
      <div class="empty-state">
        <div class="em-title">Nothing saved yet</div>
        <div class="em-body">Tap the star on any story to keep it here for later.</div>
      </div>
    `, "saved");
    return;
  }

  const items = savedIds.map((id) => {
    const story = storyById(id);
    if (!story) return "";
    const cat = catById(story.category);
    return `
      <button class="list-item" data-cat="${cat.id}" data-story="${story.id}">
        <div>
          <div class="list-item-title">${story.title}</div>
          <div class="list-item-meta"><span>${cat.name}</span><span>&middot;</span><span>${story.readTime} min</span></div>
        </div>
        <span class="dot" style="background:${accentVar(cat.id)}"></span>
      </button>
    `;
  }).join("");

  shell(`<div class="list-view">${items}</div>`, "saved");
  attachListNav();
}

function attachListNav() {
  document.querySelectorAll(".list-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = `#/category/${btn.dataset.cat}/${btn.dataset.story}`;
    });
  });
}

// ---------------- Utils ----------------

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ---------------- Boot ----------------

async function boot() {
  try {
    const res = await fetch("./content.json");
    DATA = await res.json();
  } catch (e) {
    app.innerHTML = `<div class="empty-state"><div class="em-title">Couldn't load content</div><div class="em-body">Check that content.json is present and reload.</div></div>`;
    return;
  }
  route();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

boot();
