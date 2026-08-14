/* =========================================
   PRATIK ANIME STREAM
   Dynamic Anime + Movies + Cartoons
   No API key required
========================================= */

const ANILIST_API = "https://graphql.anilist.co";

/* ---------- AniList Request ---------- */

async function aniListRequest(query, variables = {}) {
  try {
    const response = await fetch(ANILIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    if (!response.ok) {
      throw new Error("AniList request failed");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("AniList Error:", error);
    return null;
  }
}

/* ---------- Create Poster ---------- */

function createPoster(item, type = "Series") {

  const article = document.createElement("article");
  article.className = "poster";

  const imageBox = document.createElement("div");
  imageBox.className = "poster-img";

  const badge = document.createElement("span");
  badge.textContent = type === "Movie" ? "Movie" : "HD";

  const image = document.createElement("img");

  image.src =
    item.image ||
    "https://placehold.co/400x600/111111/ffffff?text=No+Image";

  image.alt = item.title || "Pratik Anime Stream";

  image.loading = "lazy";

  image.onerror = function () {
    this.src =
      "https://placehold.co/400x600/111111/ffffff?text=No+Image";
  };

  imageBox.appendChild(image);
  imageBox.appendChild(badge);

  const title = document.createElement("div");
  title.className = "poster-title";
  title.textContent = item.title || "Unknown";

  const meta = document.createElement("div");
  meta.className = "poster-meta";

  if (type === "Movie") {
    meta.textContent = "Movie";
  } else {
    meta.textContent = item.episodes
      ? `${item.episodes} Episodes`
      : "Ongoing";
  }

  article.appendChild(imageBox);
  article.appendChild(title);
  article.appendChild(meta);

  return article;
}

/* ---------- Load Latest Series ---------- */

async function loadSeries() {

  const container = document.getElementById("series");

  if (!container) return;

  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(
          type: ANIME,
          sort: POPULARITY_DESC,
          status: RELEASING
        ) {
          id
          episodes
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `;

  const data = await aniListRequest(query);

  if (!data || !data.Page) {
    console.log("Series data unavailable");
    return;
  }

  container.innerHTML = "";

  data.Page.media.forEach(anime => {

    const item = {
      title: anime.title.english || anime.title.romaji,
      image: anime.coverImage.large,
      episodes: anime.episodes
    };

    container.appendChild(
      createPoster(item, "Series")
    );

  });
}

/* ---------- Load Latest Movies ---------- */

async function loadMovies() {

  const container = document.getElementById("movies");

  if (!container) return;

  const query = `
    query {
      Page(page: 1, perPage: 10) {
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
          coverImage {
            large
          }
        }
      }
    }
  `;

  const data = await aniListRequest(query);

  if (!data || !data.Page) {
    console.log("Movie data unavailable");
    return;
  }

  container.innerHTML = "";

  data.Page.media.forEach(movie => {

    const item = {
      title: movie.title.english || movie.title.romaji,
      image: movie.coverImage.large
    };

    container.appendChild(
      createPoster(item, "Movie")
    );

  });
}

/* ---------- Load Cartoons ---------- */

async function getCartoon(searchName) {

  try {

    const response = await fetch(
      "https://api.tvmaze.com/singlesearch/shows?q=" +
      encodeURIComponent(searchName)
    );

    if (!response.ok) return null;

    const show = await response.json();

    return {
      title: show.name,
      image:
        show.image?.original ||
        show.image?.medium ||
        "https://placehold.co/400x600/111111/ffffff?text=No+Image"
    };

  } catch (error) {

    console.error("Cartoon Error:", error);
    return null;

  }
}


async function loadCartoons() {

  const container =
    document.getElementById("cartoons");

  if (!container) return;

  container.innerHTML = "";

  const cartoonNames = [
    "Pokemon",
    "Ben 10",
    "Doraemon",
    "Shin-chan",
    "Dragon Ball",
    "Transformers"
  ];

  for (const name of cartoonNames) {

    const cartoon = await getCartoon(name);

    if (cartoon) {

      container.appendChild(
        createPoster(cartoon, "Cartoon")
      );

    }

  }
}

/* ---------- Search ---------- */

async function searchCards() {

  const input =
    document.getElementById("searchInput");

  if (!input) return;

  const value =
    input.value.trim();

  if (!value) {

    loadSeries();
    loadMovies();
    return;

  }

  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 20) {
        media(
          search: $search,
          type: ANIME
        ) {
          id
          episodes
          format
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `;

  const data =
    await aniListRequest(
      query,
      { search: value }
    );

  if (!data || !data.Page) return;

  const series =
    document.getElementById("series");

  const movies =
    document.getElementById("movies");

  if (series) series.innerHTML = "";
  if (movies) movies.innerHTML = "";

  data.Page.media.forEach(item => {

    const posterData = {
      title:
        item.title.english ||
        item.title.romaji,

      image:
        item.coverImage.large,

      episodes:
        item.episodes
    };

    if (item.format === "MOVIE") {

      if (movies) {
        movies.appendChild(
          createPoster(
            posterData,
            "Movie"
          )
        );
      }

    } else {

      if (series) {
        series.appendChild(
          createPoster(
            posterData,
            "Series"
          )
        );
      }

    }

  });
}

/* ---------- Search Enter Key ---------- */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const searchInput =
      document.getElementById("searchInput");

    if (searchInput) {

      searchInput.addEventListener(
        "keydown",
        function (event) {

          if (event.key === "Enter") {
            searchCards();
          }

        }
      );

    }

    /* Load everything */

    loadSeries();
    loadMovies();
    loadCartoons();

  }
);

/* ---------- Focus Search ---------- */

function focusSearch() {

  const search =
    document.getElementById("searchInput");

  if (search) {

    search.focus();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

}

/* ---------- Watch History ---------- */

function clearHistory() {

  localStorage.removeItem(
    "pratikAnimeHistory"
  );

  const history =
    document.getElementById("historyGrid");

  if (history) {

    history.innerHTML =
      '<div class="empty">Your watch history will appear here.</div>';

  }

}

/* ---------- Save History ---------- */

function saveHistory(item) {

  let history =
    JSON.parse(
      localStorage.getItem(
        "pratikAnimeHistory"
      )
    ) || [];

  history =
    history.filter(
      x => x.title !== item.title
    );

  history.unshift(item);

  history =
    history.slice(0, 10);

  localStorage.setItem(
    "pratikAnimeHistory",
    JSON.stringify(history)
  );

}

/* ---------- Show History ---------- */

function showHistory() {

  const container =
    document.getElementById("historyGrid");

  if (!container) return;

  const history =
    JSON.parse(
      localStorage.getItem(
        "pratikAnimeHistory"
      )
    ) || [];

  if (history.length === 0) {

    container.innerHTML =
      '<div class="empty">Your watch history will appear here.</div>';

    return;

  }

  container.innerHTML = "";

  history.forEach(item => {

    container.appendChild(
      createPoster(
        item,
        item.type || "Series"
      )
    );

  });

}

/* ---------- Start History ---------- */

document.addEventListener(
  "DOMContentLoaded",
  showHistory
);
