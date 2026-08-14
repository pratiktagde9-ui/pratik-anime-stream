const input = document.getElementById("searchInput");

function focusSearch(){
  input?.focus();
  window.scrollTo({top:0,behavior:"smooth"});
}

function searchCards(){
  const q = (input?.value || "").trim().toLowerCase();
  document.querySelectorAll(".poster").forEach(card=>{
    const text = card.innerText.toLowerCase();
    card.style.display = !q || text.includes(q) ? "" : "none";
  });
}

input?.addEventListener("input", searchCards);

function toggleMenu(){
  document.getElementById("menu")?.classList.toggle("show");
}

function clearHistory(){
  const grid = document.getElementById("historyGrid");
  if(grid) grid.innerHTML = '<div class="empty">Your watch history will appear here.</div>';
}

document.addEventListener("click",(e)=>{
  const menu=document.getElementById("menu");
  if(menu && !menu.contains(e.target) && !e.target.closest('[onclick="toggleMenu()"]')){
    menu.classList.remove("show");
  }
});
