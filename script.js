/* =========================================================
   PRATIK ANIME STREAM - SCRIPT.JS
   30 SERIES + 30 MOVIES + 30 CARTOONS + 30 POPULAR MOVIES
   15 CARDS IN EACH HORIZONTAL ROW
========================================================= */

const API_URL = "https://graphql.anilist.co";

const MAX_CARDS = 30;
const ROW_SIZE = 15;

/* =========================================================
   HORIZONTAL SCROLL CSS
========================================================= */

(function addPratikCSS() {
  if (document.getElementById("pratik-scroll-css")) return;

  const style = document.createElement("style");
  style.id = "pratik-scroll-css";

  style.textContent = `
    .pratik-card-row {
      display: flex !important;
      flex-wrap: nowrap !important;
      gap: 12px !important;
      width: 100% !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      padding: 5px 3px 15px !important;
      margin: 0 0 18px !important;
      box-sizing: border-box !important;
      scroll-behavior: smooth !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: thin !important;
    }

    .pratik-card-row > .card {
      flex: 0 0 180px !important;
      width: 180px !important;
      min-width: 180px !important;
      max-width: 180px !important;
      box-sizing: border-box !important;
    }

    .pratik-card-row .card-img {
      width: 100% !important;
      height: 255px !important;
      object-fit: cover !important;
      display: block !important;
    }

    .pratik-card-row::-webkit-scrollbar {
      height: 6px;
    }

    .pratik-card-row::-webkit-scrollbar-track {
      background: #111;
    }

    .pratik-card-row::-webkit-scrollbar-thumb {
      background: #ff003c;
      border-radius: 10px;
    }

    @media (max-width: 600px) {
      .pratik-card-row > .card {
        flex: 0 0 180px !important;
        width: 180px !important;
        min-width: 180px !important;
      }
    }
  `;

  document.head.appendChild(style);
})();

/* =========================================================
   ANILIST QUERY
========================================================= */

const MEDIA_QUERY = `
query (
  $page: Int,
  $perPage: Int,
  $type: MediaType,
  $format: MediaFormat,
  $sort: [MediaSort]
) {
  Page(
    page: $page,
    perPage: $perPage
  ) {
    media(
      type: $type,
      format: $format,
      sort: $sort,
      isAdult: false
    ) {
      id

      title {
        romaji
        english
        native
      }

      coverImage {
        large
        extraLarge
      }

      episodes
      averageScore
      format
      status
    }
  }
}
`;

/* =========================================================
   SEARCH QUERY
========================================================= */

const SEARCH_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 30) {
    media(
      search: $search,
      type: ANIME,
      sort: SEARCH_MATCH,
      isAdult: false
    ) {
      id

      title {
        romaji
        english
        native
      }

      coverImage {
        large
        extraLarge
      }

      episodes
      averageScore
      format
      status
    }
  }
}
`;

/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTitle(item) {
  return (
    item?.title?.english ||
    item?.title?.romaji ||
    item?.title?.native ||
    "Unknown"
  );
}

function getImage(item) {
  return (
    item?.coverImage?.extraLarge ||
    item?.coverImage?.large ||
    "https://placehold.co/300x430/111111/ffffff?text=No+Image"
  );
}

function getScore(item) {
  if (!item?.averageScore) return "N/A";
  return (Number(item.averageScore) / 10).toFixed(1);
}

function getMeta(item, movie) {
  if (movie || item?.format === "MOVIE") {
    return "Movie";
  }

  if (item?.episodes) {
    return item.episodes + " Episodes";
  }

  if (item?.status === "RELEASING") {
    return "Ongoing";
  }

  return "Episodes N/A";
}

/* =========================================================
   ANIME CARD
========================================================= */

function makeAnimeCard(item, movie = false) {
  const title = getTitle(item);
  const image = getImage(item);
  const score = getScore(item);
  const meta = getMeta(item, movie);

  return `
    <article class="card anime-card" data-id="${escapeHTML(item.id)}">

      <div class="card-image-wrap">

        <span class="card-badge">
          ${movie ? "Movie" : "HD"}
        </span>

        <img
          class="card-img"
          src="${escapeHTML(image)}"
          alt="${escapeHTML(title)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/300x430/111111/ffffff?text=No+Image';"
        >

      </div>

      <div class="card-body">

        <h3 class="card-title">
          ${escapeHTML(title)}
        </h3>

        <p class="card-meta">
          ${escapeHTML(meta)}
        </p>

        <p class="card-score">
          ★ ${escapeHTML(score)}
        </p>

      </div>

    </article>
  `;
}

/* =========================================================
   RENDER 30 CARDS
   15 CARDS = 1 HORIZONTAL ROW
========================================================= */

function renderCards(grid, items, movie = false) {

  if (!grid) return;

  if (!items || items.length === 0) {
    grid.innerHTML = `<p>No content found.</p>`;
    return;
  }

  const cards = items.slice(0, MAX_CARDS);

  let html = "";

  for (let i = 0; i < cards.length; i += ROW_SIZE) {

    const row = cards.slice(i, i + ROW_SIZE);

    html += `
      <div class="pratik-card-row">
        ${row.map(item => makeAnimeCard(item, movie)).join("")}
      </div>
    `;
  }

  grid.innerHTML = html;
}

/* =========================================================
   CARTOONS - 30
========================================================= */

const CARTOONS = [
  "Pokemon",
  "Ben 10",
  "Doraemon",
  "Shinchan",
  "Tom and Jerry",
  "Oggy",
  "Motu Patlu",
  "Chhota Bheem",
  "Ninja Hattori",
  "Kiteretsu",
  "Perman",
  "Courage the Cowardly Dog",
  "Dragon Tales",
  "Scooby-Doo",
  "Mr. Bean Cartoon",
  "Looney Tunes",
  "Mickey Mouse",
  "Donald Duck",
  "DuckTales",
  "Teen Titans",
  "Powerpuff Girls",
  "Johnny Bravo",
  "Dexter's Laboratory",
  "Samurai Jack",
  "Ben 10 Alien Force",
  "Ben 10 Ultimate Alien",
  "Ben 10 Omniverse",
  "Pokemon Journeys",
  "Adventure Time",
  "The Amazing World of Gumball"
];

/* =========================================================
   CARTOON CARD
========================================================= */

function makeCartoonCard(title) {

  const image =
    "https://placehold.co/300x430/111111/ffffff?text=" +
    encodeURIComponent(title);

  return `
    <article class="card cartoon-card">

      <div class="card-image-wrap">

        <span class="card-badge">
          Cartoon
        </span>

        <img
          class="card-img"
          src="${image}"
          alt="${escapeHTML(title)}"
          loading="lazy"
        >

      </div>

      <div class="card-body">

        <h3 class="card-title">
          ${escapeHTML(title)}
        </h3>

        <p class="card-meta">
          Cartoon
        </p>

      </div>

    </article>
  `;
}

/* =========================================================
   LOAD CARTOONS
========================================================= */

function loadCartoons(grid) {

  if (!grid) return;

  let html = "";

  for (let i = 0; i < CARTOONS.length; i += ROW_SIZE) {

    const row = CARTOONS.slice(i, i + ROW_SIZE);

    html += `
      <div class="pratik-card-row">
        ${row.map(title => makeCartoonCard(title)).join("")}
      </div>
    `;
  }

  grid.innerHTML = html;
}

/* =========================================================
   FETCH ANILIST
========================================================= */

async function fetchAniList(format, sort) {

  const response = await fetch(API_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },

    body: JSON.stringify({

      query: MEDIA_QUERY,

      variables: {
        page: 1,
        perPage: MAX_CARDS,
        type: "ANIME",
        format: format,
        sort: sort
      }

    })

  });

  if (!response.ok) {
    throw new Error("AniList error: " + response.status);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data?.data?.Page?.media || [];
}

/* =========================================================
   LOAD HOME
========================================================= */

async function loadHome() {

  const seriesGrid =
    document.querySelector("#series-grid");

  const latestMovieGrid =
    document.querySelector("#latest-movie-grid");

  const cartoonGrid =
    document.querySelector("#cartoon-grid");

  const popularMovieGrid =
    document.querySelector("#movie-grid");


  /* -------------------------
     CARTOONS
  ------------------------- */

  loadCartoons(cartoonGrid);


  /* -------------------------
     SERIES
  ------------------------- */

  if (seriesGrid) {
    seriesGrid.innerHTML = "<p>Loading latest series...</p>";
  }

  try {

    const series = await fetchAniList(
      "TV",
      ["START_DATE_DESC"]
    );

    renderCards(
      seriesGrid,
      series,
      false
    );

  } catch (error) {

    console.error("Series:", error);

    if (seriesGrid) {
      seriesGrid.innerHTML =
        "<p>Latest Series load nahi hui.</p>";
    }

  }


  /* -------------------------
     LATEST MOVIES
  ------------------------- */

  if (latestMovieGrid) {
    latestMovieGrid.innerHTML =
      "<p>Loading latest movies...</p>";
  }

  try {

    const movies = await fetchAniList(
      "MOVIE",
      ["START_DATE_DESC"]
    );

    renderCards(
      latestMovieGrid,
      movies,
      true
    );

  } catch (error) {

    console.error("Latest Movies:", error);

    if (latestMovieGrid) {
      latestMovieGrid.innerHTML =
        "<p>Latest Movies load nahi hui.</p>";
    }

  }


  /* -------------------------
     POPULAR MOVIES
  ------------------------- */

  if (popularMovieGrid) {
    popularMovieGrid.innerHTML =
      "<p>Loading popular movies...</p>";
  }

  try {

    const popularMovies = await fetchAniList(
      "MOVIE",
      ["POPULARITY_DESC"]
    );

    renderCards(
      popularMovieGrid,
      popularMovies,
      true
    );

  } catch (error) {

    console.error("Popular Movies:", error);

    if (popularMovieGrid) {
      popularMovieGrid.innerHTML =
        "<p>Popular Movies load nahi hui.</p>";
    }

  }

}

/* =========================================================
   SEARCH
========================================================= */

async function searchAniList(searchText) {

  const response = await fetch(API_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },

    body: JSON.stringify({

      query: SEARCH_QUERY,

      variables: {
        search: searchText
      }

    })

  });

  if (!response.ok) {
    throw new Error("Search error");
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data?.data?.Page?.media || [];
}

/* =========================================================
   SEARCH SETUP
========================================================= */

function setupSearch() {

  const search =
    document.querySelector("#search");

  if (!search) return;

  let timer;

  search.addEventListener("input", function () {

    clearTimeout(timer);

    const value =
      search.value.trim();

    if (value.length < 2) {

      loadHome();

      return;
    }

    timer = setTimeout(async function () {

      const seriesGrid =
        document.querySelector("#series-grid");

      const latestMovieGrid =
        document.querySelector("#latest-movie-grid");

      const cartoonGrid =
        document.querySelector("#cartoon-grid");

      const popularMovieGrid =
        document.querySelector("#movie-grid");


      if (seriesGrid)
        seriesGrid.innerHTML =
          "<p>Searching...</p>";

      if (latestMovieGrid)
        latestMovieGrid.innerHTML =
          "<p>Searching...</p>";

      if (popularMovieGrid)
        popularMovieGrid.innerHTML =
          "<p>Searching...</p>";


      try {

        const results =
          await searchAniList(value);


        const series =
          results
            .filter(item =>
              item.format === "TV" ||
              item.format === "ONA" ||
              item.format === "OVA"
            )
            .slice(0, MAX_CARDS);


        const movies =
          results
            .filter(item =>
              item.format === "MOVIE"
            )
            .slice(0, MAX_CARDS);


        renderCards(
          seriesGrid,
          series,
          false
        );

        renderCards(
          latestMovieGrid,
          movies,
          true
        );

        renderCards(
          popularMovieGrid,
          movies,
          true
        );

        loadCartoons(cartoonGrid);

      } catch (error) {

        console.error("Search:", error);

        if (seriesGrid)
          seriesGrid.innerHTML =
            "<p>Search failed.</p>";

      }

    }, 500);

  });
}

/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    setupSearch();

    loadHome();

  }
);
