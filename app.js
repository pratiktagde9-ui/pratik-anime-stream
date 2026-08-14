// ==========================================================
// Renders the UI from data.js. Swap the data source for a
// real API/backend later — this file only handles display.
// ==========================================================

function renderFeatured(){
  const row = document.getElementById('featuredRow');
  row.innerHTML = FEATURED.map(item => `
    <div class="featured-card">
      <div class="featured-thumb" style="background: linear-gradient(160deg, ${item.color1}, ${item.color2});">
        <span class="glyph">${item.glyph}</span>
        <span class="label">${item.title}</span>
      </div>
      <div class="featured-brand">
        <span class="fb-main">PRATIK</span>
        <span class="fb-sub">ANIME STREAM</span>
      </div>
    </div>
  `).join('');
}

function renderRail(containerId, items){
  const rail = document.getElementById(containerId);
  rail.innerHTML = items.map(item => `
    <div class="rail-card">
      <div class="rail-poster">
        <span class="badge">${item.tag}</span>
        <span class="glyph">${item.glyph}</span>
      </div>
      <div class="rail-title">${item.title}</div>
    </div>
  `).join('');
}

function wireNav(){
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function wireClearHistory(){
  document.getElementById('clearHistory').addEventListener('click', () => {
    document.getElementById('historyRail').innerHTML =
      '<p style="color:#8a7a75; font-size:13px;">No watch history yet.</p>';
  });
}

function wireSearch(){
  const input = document.getElementById('searchInput');
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && input.value.trim()){
      alert('Search placeholder — wire this up to your own catalog / backend.');
    }
  });
}

renderFeatured();
renderRail('historyRail', WATCH_HISTORY);
renderRail('dropsRail', NEWEST_DROPS);
wireNav();
wireClearHistory();
wireSearch();
