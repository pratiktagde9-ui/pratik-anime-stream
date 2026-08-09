const API = "https://graphql.anilist.co";

const SERIES_QUERY = `
query {
  Page(perPage: 12) {
    media(type: ANIME, format_in: [TV, TV_SHORT], sort: POPULARITY_DESC) {
      id
      title { romaji english }
      episodes
      averageScore
      coverImage { large extraLarge }
    }
  }
}`;

const MOVIE_QUERY = `
query {
  Page(perPage: 12) {
    media(type: ANIME, format: MOVIE, sort: POPULARITY_DESC) {
      id
      title { romaji english }
      episodes
      averageScore
      coverImage { large extraLarge }
    }
  }
}`;

const LATEST_MOVIE_QUERY = `
query {
  Page(perPage: 12) {
    media(type: ANIME, format: MOVIE, sort: START_DATE_DESC) {
      id
      title { romaji english }
      episodes
      averageScore
      coverImage { large extraLarge }
    }
  }
}`;

const CARTOON_QUERY = `
query {
  Page(perPage: 12) {
    media(type: ANIME, genre_in: ["Kids"], sort: POPULARITY_DESC) {
      id
      title { romaji english }
      episodes
      averageScore
      coverImage { large extraLarge }
    }
  }
}`;

async function anilist(query, variables = {}) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error("AniList HTTP error: " + response.status);
  }

  const json = await response.json();

  if (json.errors && json.errors.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data?.Page?.media || [];
}

function titleOf(anime) {
  return anime?.title?.english ||
         anime?.title?.romaji ||
         "Unknown Anime";
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeCard(anime, isMovie = false) {
  const image = anime?.coverImage?.extraLarge ||
                anime?.coverImage?.large || "";

  const title = titleOf(anime);
  const score = anime?.averageScore
    ? (anime.averageScore / 10).toFixed(1)
    : "N/A";

  const info = isMovie
    ? "Movie"
    : anime?.episodes
      ? `${anime.episodes} Episodes`
      : "Episodes";

  return `
    <article class="anime-card" data-id="${anime.id}">
      <a href="#" class="anime-card-link" data-id="${anime.id}">
        <div class="anime-card-image">
          <img src="${image}"
               alt="${escapeHTML(title)}"
               loading="lazy"
               onerror="this.style.display='none';">
          <span class="anime-score">★ ${score}</span>
        </div>
        <div class="anime-card-info">
          <h3>${escapeHTML(title)}</h3>
          <p>${info}</p>
        </div>
      </a>
    </article>
  `;
}

function render(grid, items, isMovie = false) {
  if (!grid) return;

  if (!items || items.length === 0) {
    grid.innerHTML = '<p class="loading">No cards found.</p>';
    return;
  }

  grid.innerHTML = items
    .map(anime => makeCard(anime, isMovie))
    .join("");
}

async function loadHome() {
  const seriesGrid = document.querySelector("#series-grid");
  const movieGrid = document.querySelector("#movie-grid");
  const latestMovieGrid =
    document.querySelector("#latest-movie-grid");
  const cartoonGrid = document.querySelector("#cartoon-grid");

  [seriesGrid, movieGrid, latestMovieGrid, cartoonGrid]
    .forEach(grid => {
      if (grid) grid.innerHTML =
        '<p class="loading">Loading...</p>';
    });

  try {
    const [series, movies, latestMovies, cartoons] =
      await Promise.all([
        anilist(SERIES_QUERY),
        anilist(MOVIE_QUERY),
        anilist(LATEST_MOVIE_QUERY),
        anilist(CARTOON_QUERY)
      ]);

    render(seriesGrid, series, false);
    render(movieGrid, movies, true);
    render(latestMovieGrid, latestMovies, true);
    render(cartoonGrid, cartoons, false);

    console.log("Pratik Anime Stream loaded:", {
      series: series.length,
      movies: movies.length,
      latestMovies: latestMovies.length,
      cartoons: cartoons.length
    });

    setupCardLinks();

  } catch (error) {
    console.error("Loading error:", error);

    const message = escapeHTML(
      error.message || "Unknown error"
    );

    [seriesGrid, movieGrid, latestMovieGrid, cartoonGrid]
      .forEach(grid => {
        if (grid) {
          grid.innerHTML =
            `<p class="loading">Cards load nahi hue: ${message}</p>`;
        }
      });
  }
}

function setupCardLinks() {
  document.querySelectorAll(".anime-card-link")
    .forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        console.log("Anime selected:", link.dataset.id);
      });
    });
}

async function searchAnime(value) {
  const seriesGrid = document.querySelector("#series-grid");
  const movieGrid = document.querySelector("#movie-grid");

  if (!value || value.trim().length < 2) {
    loadHome();
    return;
  }

  const query = `
    query ($search: String) {
      Page(perPage: 24) {
        media(
          search: $search,
          type: ANIME,
          sort: POPULARITY_DESC
        ) {
          id
          title { romaji english }
          episodes
          averageScore
          format
          coverImage { large extraLarge }
        }
      }
    }
  `;

  try {
    if (seriesGrid) {
      seriesGrid.innerHTML =
        '<p class="loading">Searching...</p>';
    }

    const results = await anilist(query, {
      search: value.trim()
    });

    if (!results.length) {
      if (seriesGrid) {
        seriesGrid.innerHTML =
          `<p class="loading">"${escapeHTML(value)}" nahi mila.</p>`;
      }
      if (movieGrid) movieGrid.innerHTML = "";
      return;
    }

    render(
      seriesGrid,
      results.filter(item => item.format !== "MOVIE"),
      false
    );

    render(
      movieGrid,
      results.filter(item => item.format === "MOVIE"),
      true
    );

  } catch (error) {
    console.error("Search error:", error);

    if (seriesGrid) {
      seriesGrid.innerHTML =
        `<p class="loading">Search error: ${escapeHTML(
          error.message
        )}</p>`;
    }
  }
}

function setupSearch() {
  const search =
    document.querySelector("#search") ||
    document.querySelector('input[type="search"]') ||
    document.querySelector('input[placeholder*="Search"]');

  if (!search) return;

  let timer;

  search.addEventListener("input", function() {
    clearTimeout(timer);

    timer = setTimeout(() => {
      searchAnime(this.value);
    }, 400);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSearch();
  loadHome();
});
