document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  const clearHistory = document.getElementById("clearHistory");
  const history = document.getElementById("history");


  /* ================= SEARCH ================= */

  function doSearch() {

    const value = searchInput.value.trim();

    if (!value) {
      searchInput.focus();
      return;
    }

    alert("Searching for: " + value);
  }

  searchBtn.addEventListener("click", doSearch);

  searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
      doSearch();
    }

  });


  /* ================= FEATURE CARDS ================= */

  document.querySelectorAll(".feature-card").forEach(card => {

    card.addEventListener("click", () => {

      const title =
        card.querySelector(".feature-title")?.textContent.trim();

      if (title) {

        localStorage.setItem(
          "lastAnime",
          title
        );

      }

    });

  });


  /* ================= CLEAR HISTORY ================= */

  clearHistory.addEventListener("click", () => {

    localStorage.removeItem("watchHistory");

    history.innerHTML = `
      <div class="empty-history">
        Your watch history will appear here.
      </div>
    `;

  });


  /* ================= WATCH HISTORY ================= */

  const savedHistory =
    JSON.parse(
      localStorage.getItem("watchHistory") || "[]"
    );

  if (savedHistory.length > 0) {

    history.innerHTML = "";

    savedHistory.forEach(item => {

      const card = document.createElement("div");

      card.className = "poster-card";

      card.innerHTML = `
        <img src="${item.image}" alt="">
        <p>${item.title}</p>
        <small>Watched</small>
      `;

      history.appendChild(card);

    });

  }

});
