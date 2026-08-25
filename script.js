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

async function jikanFetch(path) {
  if (cache[path]) return cache[path];
  try {
    const res = await fetch(`${JIKAN_BASE}${path}`);
    if (!res.ok) throw new Error(`Jikan error ${res.status}`);
    const data = await res.json();
    cache[path] = data;
    return data;
  } catch (err) {
    console.error("Jikan fetch failed:", err);
    return null;
  }
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

function renderRow(containerId, animeList) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!animeList || animeList.length === 0) {
    el.innerHTML = `<p style="color:var(--text-dim);font-size:13px;">Couldn't load right now — check your connection.</p>`;
    return;
  }
  el.innerHTML = animeList.map(posterCard).join("");
}

/* ---------- Section loaders ---------- */

// Trending Now -> Jikan "top airing" anime
async function loadTrending() {
  renderSkeletons("trending", 6);
  const data = await jikanFetch("/top/anime?filter=airing&limit=10");
  renderRow("trending", data?.data);
}

// Newest Drops -> current season anime
async function loadNewestDrops() {
  renderSkeletons("drops", 6);
  const data = await jikanFetch("/seasons/now?limit=12");
  renderRow("drops", data?.data);
}

// Watch History -> we fake this with top-rated classics as a stand-in
// (a real watch history would come from your own backend / user accounts)
async function loadWatchHistory() {
  renderSkeletons("history", 4);
  const data = await jikanFetch("/top/anime?filter=bypopularity&limit=8");
  renderRow("history", data?.data);
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
      const data = await jikanFetch(`/anime?q=${encodeURIComponent(query)}&limit=10&order_by=popularity`);
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
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  loadTrending();
  loadNewestDrops();
  loadWatchHistory();
  setupSearch();
});
