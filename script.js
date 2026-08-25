/* =====================================================
   Pratik Anime Stream — script.js
   Fetches REAL anime data from the Jikan API (v4)
   Jikan is a free, public, unofficial MyAnimeList API.
   Docs: https://docs.api.jikan.moe/
   No API key needed. Data belongs to MyAnimeList/Jikan —
   posters shown here are their official promotional images.
   ===================================================== */

const JIKAN_BASE = "https://api.jikan.moe/v4";

// Simple in-memory cache so we don't hit rate limits (Jikan allows ~3 req/sec)
const cache = {};
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function jikanFetch(path, retries = 3) {
  if (cache[path]) return cache[path];
  try {
    const res = await fetch(`${JIKAN_BASE}${path}`);
    if ((res.status === 429 || res.status >= 500) && retries > 0) {
      await delay(1800);
      return jikanFetch(path, retries - 1);
    }
    if (!res.ok) {
      lastError = `HTTP ${res.status}`;
      throw new Error(lastError);
    }
    const data = await res.json();
    cache[path] = data;
    return data;
  } catch (err) {
    lastError = err.message || String(err);
    console.error("Jikan fetch failed:", err);
    return null;
  }
}
let lastError = "";

// Jikan caps each request at 25 items. 25 per row is already enough
// for a long horizontal scroll, so we keep it to ONE request per
// section to stay well under the free rate limit (3 req/sec).
async function jikanFetchMany(basePath, totalWanted = 25) {
  const sep = basePath.includes("?") ? "&" : "?";
  const data = await jikanFetch(`${basePath}${sep}sfw=true&limit=${Math.min(totalWanted, 25)}`);
  return data?.data || [];
}

/* ---------- Skeleton / loading placeholder ---------- */
function skeletonCard() {
  return `
    <div class="poster-card">
      <div class="poster-img skeleton"></div>
      <div class="poster-title skeleton-text">&nbsp;</div>
    </div>
  `;
}

function renderSkeletons(containerId, count = 6) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = Array(count).fill(skeletonCard()).join("");
}

/* ---------- Poster card renderer (real Jikan data) ---------- */
function posterCard(anime) {
  const title = anime.title_english || anime.title || "Untitled";
  const image = anime.images?.webp?.image_url || anime.images?.jpg?.image_url || "";
  const badge = anime.episodes ? `${anime.episodes} EP` : (anime.status === "Currently Airing" ? "Airing" : "");
  const malUrl = anime.url || "#";
  return `
    <a class="poster-card" href="${malUrl}" target="_blank" rel="noopener" data-mal-id="${anime.mal_id}">
      <div class="poster-img" style="background:#1a0808;">
        ${badge ? `<span class="badge-pill">${badge}</span>` : ""}
        <img src="${image}" alt="${title}" loading="lazy"
             style="width:100%;height:100%;object-fit:cover;"
             onerror="this.style.display='none'">
      </div>
      <div class="poster-title">${title}</div>
    </a>
  `;
}

const sectionLoaders = {}; // maps containerId -> its loader function, for retry button

function renderRow(containerId, animeList) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!animeList || animeList.length === 0) {
    el.innerHTML = `
      <div style="color:var(--text-dim);font-size:13px;">
        Couldn't load right now (${lastError || "unknown error"}).
        <button onclick="retrySection('${containerId}')" style="margin-left:8px;background:var(--accent);color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;">Retry</button>
      </div>`;
    return;
  }
  el.innerHTML = animeList.map(posterCard).join("");
}

function retrySection(containerId) {
  if (sectionLoaders[containerId]) sectionLoaders[containerId]();
}

/* ---------- Section loaders ---------- */

// Trending Now -> Jikan "top airing" anime
async function loadTrending() {
  renderSkeletons("trending", 8);
  const results = await jikanFetchMany("/top/anime?filter=airing", 30);
  renderRow("trending", results);
}

// Newest Drops -> current season anime
async function loadNewestDrops() {
  renderSkeletons("drops", 8);
  const results = await jikanFetchMany("/seasons/now", 30);
  renderRow("drops", results);
}

// Watch History -> we fake this with top-rated classics as a stand-in
// (a real watch history would come from your own backend / user accounts)
async function loadWatchHistory() {
  renderSkeletons("history", 8);
  const results = await jikanFetchMany("/top/anime?filter=bypopularity", 30);
  renderRow("history", results);
}

// Top Rated -> highest-rated anime of all time
async function loadTopRated() {
  renderSkeletons("toprated", 8);
  const results = await jikanFetchMany("/top/anime?filter=favorite", 30);
  renderRow("toprated", results);
}

// Popular Movies
async function loadMovies() {
  renderSkeletons("movies", 8);
  const results = await jikanFetchMany("/top/anime?type=movie", 30);
  renderRow("movies", results);
}

// Upcoming
async function loadUpcoming() {
  renderSkeletons("upcoming", 8);
  const results = await jikanFetchMany("/seasons/upcoming", 30);
  renderRow("upcoming", results);
}

/* ---------- Search ---------- */
let searchTimeout;
function setupSearch() {
  const input = document.querySelector(".search-box input");
  if (!input) return;

  input.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    const query = input.value.trim();
    if (query.length < 2) return;

    searchTimeout = setTimeout(async () => {
      const data = await jikanFetch(`/anime?q=${encodeURIComponent(query)}&sfw=true&limit=10&order_by=popularity`);
      if (data?.data) showSearchResults(data.data);
    }, 500); // debounce so we respect Jikan's rate limit
  });
}

function showSearchResults(results) {
  let panel = document.getElementById("search-results-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "search-results-panel";
    panel.style.cssText = `
      position:relative; z-index:6; margin:10px 20px 0;
      background:rgba(10,3,3,0.95); border:1px solid var(--border);
      border-radius:12px; max-height:320px; overflow-y:auto;
    `;
    document.querySelector(".search-wrap").after(panel);
  }
  if (results.length === 0) {
    panel.innerHTML = `<p style="padding:14px;color:var(--text-dim);font-size:13px;">No results found.</p>`;
    return;
  }
  panel.innerHTML = results.map(a => `
    <a href="${a.url}" target="_blank" rel="noopener" style="display:flex;gap:12px;padding:10px 14px;align-items:center;border-bottom:1px solid var(--border);">
      <img src="${a.images?.webp?.small_image_url || ''}" style="width:40px;height:56px;object-fit:cover;border-radius:4px;">
      <div>
        <div style="font-size:13px;font-weight:600;color:#fff;">${a.title_english || a.title}</div>
        <div style="font-size:11px;color:var(--text-dim);">${a.type || ''} • ${a.episodes ? a.episodes + ' eps' : ''}</div>
      </div>
    </a>
  `).join("");
}

/* ---------- Top categories row (generic icons — Jikan has no "category" concept) ---------- */
function renderCategories() {
  const el = document.getElementById("categories");
  if (!el) return;
  const cats = [
    { name: "ACTION", icon: "hero", grad: "#e21f2b33, #150404" },
    { name: "KIDS", icon: "kid", grad: "#ffb34733, #2b1c0f" },
    { name: "SHONEN", icon: "fight", grad: "#4fd66c33, #0f2b17" },
  ];
  const icons = {
    hero: `<circle cx="12" cy="7" r="3"/><path d="M7 21l2-8h6l2 8" fill="none" stroke-width="1.6"/>`,
    kid: `<circle cx="12" cy="9" r="4"/><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke-width="1.6"/>`,
    fight: `<path d="M4 12h6l2-3 2 3h6" fill="none" stroke-width="1.8"/>`,
  };
  el.innerHTML = cats.map(c => `
    <div class="cat-card">
      <div class="cat-poster" style="background:linear-gradient(150deg, ${c.grad})">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" style="color:#fff;">${icons[c.icon]}</svg>
      </div>
      <div class="cat-label">${c.name}</div>
      <div class="cat-badge">
        <span class="b-name">ANIME</span>
        <span class="b-tag">STREAM</span>
      </div>
    </div>
  `).join("");
}

/* ---------- Init ---------- */
sectionLoaders["trending"] = loadTrending;
sectionLoaders["drops"] = loadNewestDrops;
sectionLoaders["history"] = loadWatchHistory;
sectionLoaders["toprated"] = loadTopRated;
sectionLoaders["movies"] = loadMovies;
sectionLoaders["upcoming"] = loadUpcoming;

async function initAll() {
  renderCategories();
  await loadTrending();
  await delay(1000);
  await loadNewestDrops();
  await delay(1000);
  await loadWatchHistory();
  await delay(1000);
  await loadTopRated();
  await delay(1000);
  await loadMovies();
  await delay(1000);
  await loadUpcoming();
  setupSearch();
}

document.addEventListener("DOMContentLoaded", initAll);
