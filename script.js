const API_URL = "https://graphql.anilist.co";

const query = `
query {
  Page(page: 1, perPage: 20) {
    media(
      type: ANIME,
      sort: POPULARITY_DESC
    ) {
      id
      title {
        romaji
      }
      episodes
      status
      coverImage {
        large
      }
    }
  }
}
`;

async function loadAnime() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    const anime = data.data.Page.media;

    series.innerHTML = anime.map(item => `
      <article class="card">
        <img
          src="${item.coverImage.large}"
          alt="${item.title.romaji}"
          loading="lazy"
        >

        <div class="title">
          ${item.title.romaji}
        </div>

        <div class="meta">
          ${item.episodes ? item.episodes + " Episodes" : "Ongoing"}
        </div>
      </article>
    `).join("");

  } catch (error) {
    console.error("Anime API Error:", error);
    series.innerHTML = "<p>Anime load nahi ho raha.</p>";
  }
}

loadAnime();


// SEARCH
function searchAnime() {
  const value = search.value.trim().toLowerCase();

  document.querySelectorAll(".card").forEach(card => {
    const title = card
      .querySelector(".title")
      .textContent
      .toLowerCase();

    card.style.display =
      !value || title.includes(value)
        ? ""
        : "none";
  });
}

searchBtn.onclick = searchAnime;

search.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    searchAnime();
  }
});
