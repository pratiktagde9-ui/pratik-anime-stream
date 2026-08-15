const API_URL = "https://graphql.anilist.co";
const TVMAZE_URL = "https://api.tvmaze.com/shows";

// ---------- ANILIST ----------
async function anilistRequest(query, variables = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  if (!response.ok) {
    throw new Error("AniList HTTP Error: " + response.status);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0]?.message || "AniList API Error");
  }

  return data.data;
}

// ---------- CARD ----------
function createCard(item, type) {
  const title =
    item.title?.english ||
    item.title?.romaji ||
    item.name ||
    "Unknown";

  const image =
    item.coverImage?.large ||
    item.image?.original ||
    item.image?.medium ||
    "";

  let meta = "";

  if (type === "series") {
    meta = item.episodes
      ? item.episodes + " Episodes"
      : item.status === "RELEASING"
        ? "Ongoing"
        : "Series";
  }

  if (type === "movies") {
    meta = item.duration
      ? item.duration + " min"
      : "Movie";
  }

  if (type === "cartoons") {
    meta = item.premiered
      ? item.premiered
      : "Cartoon";
  }

  return `
    <article class="card" data-title="${title.toLowerCase()}">
      <img
        src="${image}"
        alt="${title}"
        loading="lazy"
      >
      <div class="title">${title}</div>
      <div class="meta">${meta}</div>
    </article>
  `;
}

// ---------- SERIES ----------
async function loadSeries() {
  const query = `
    query {
      Page(page: 1, perPage: 20) {
        media(
          type: ANIME,
          format: TV,
          sort: POPULARITY_DESC
        ) {
          id
          title {
            romaji
            english
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

  const data = await anilistRequest(query);
  const anime = data.Page.media;

  if (typeof series !== "undefined") {
    series.innerHTML = anime
      .map(item => createCard(item, "series"))
      .join("");
  }
}

// ---------- MOVIES ----------
async function loadMovies() {
  const query = `
    query {
      Page(page: 1, perPage: 20) {
        media(
          type: ANIME,
          format: MOVIE,
          sort: POPULARITY_DESC
        ) {
          id
          title {
            romaji
            english
          }
          duration
          coverImage {
            large
          }
        }
      }
    }
  `;

  const data = await anilistRequest(query);
  const moviesData = data.Page.media;

  if (typeof movies !== "undefined") {
    movies.innerHTML = moviesData
      .map(item => createCard(item, "movies"))
      .join("");
  }

  if (typeof popular !== "undefined") {
    popular.innerHTML = moviesData
      .slice(0, 4)
      .map(item => createCard(item, "movies"))
      .join("");
  }
}

// ---------- CARTOONS ----------
async function loadCartoons() {
  const response = await fetch(TVMAZE_URL);

  if (!response.ok) {
    throw new Error("TVmaze HTTP Error: " + response.status);
  }

  const shows = await response.json();

  // Cartoon-focused names
  const cartoonNames = [
    "Ben 10",
    "Pokémon",
    "Pokemon",
    "Doraemon",
    "Shin Chan",
    "The Simpsons",
    "Family Guy",
    "SpongeBob SquarePants",
    "Adventure Time",
    "The Loud House",
    "Teen Titans",
    "Transformers"
  ];

  let cartoonsData = shows.filter(show => {
    const name = (show.name || "").toLowerCase();

    return cartoonNames.some(cartoon =>
      name.includes(cartoon.toLowerCase())
    );
  });

  // Agar matching cartoons kam mile,
  // popular shows se cards fill karo
  if (cartoonsData.length < 6) {
    cartoonsData = shows
      .filter(show => show.image)
      .slice(0, 12);
  }

  if (typeof cartoons !== "undefined") {
    cartoons.innerHTML = cartoonsData
      .slice(0, 20)
      .map(item => createCard(item, "cartoons"))
      .join("");
  }
}

// ---------- LOAD EVERYTHING ----------
async function loadAll() {
  try {
    await Promise.all([
      loadSeries(),
      loadMovies(),
      loadCartoons()
    ]);
  } catch (error) {
    console.error("API Error:", error);
  }
}

loadAll();

// ---------- SEARCH ----------
function searchAnime() {
  const value = search.value.trim().toLowerCase();

  document.querySelectorAll(".card").forEach(card => {
    const titleElement = card.querySelector(".title");

    if (!titleElement) return;

    const title = titleElement.textContent.toLowerCase();

    card.style.display =
      !value || title.includes(value)
        ? ""
        : "none";
  });
}

if (typeof searchBtn !== "undefined") {
  searchBtn.onclick = searchAnime;
}

if (typeof search !== "undefined") {
  search.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      searchAnime();
    }
  });
}

// ---------- WATCH HISTORY ----------
try {
  const history = JSON.parse(
    localStorage.getItem("pratikHistory") || "[]"
  );

  if (
    history.length &&
    typeof historyText !== "undefined"
  ) {
    historyText.textContent = history.join(" • ");
  }

  if (typeof clear !== "undefined") {
    clear.onclick = () => {
      localStorage.removeItem("pratikHistory");

      if (typeof historyText !== "undefined") {
        historyText.textContent =
          "Your watch history will appear here.";
      }
    };
  }
} catch (error) {
  console.error("History Error:", error);
}
