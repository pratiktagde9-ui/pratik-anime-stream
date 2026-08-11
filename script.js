/* =========================================================
   PRATIK ANIME STREAM
   30 CARDS + HORIZONTAL RIGHT/LEFT SCROLL
========================================================= */

const API = "https://graphql.anilist.co";
const MAX_CARDS = 30;

/* ---------- HORIZONTAL SCROLL CSS ---------- */

(function addPratikScrollCSS() {

  if (document.getElementById("pratik-horizontal-css")) return;

  const style = document.createElement("style");

  style.id = "pratik-horizontal-css";

  style.textContent = `

    .pratik-card-row {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      gap: 12px !important;
      width: 100% !important;
      max-width: 100% !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      padding: 5px 4px 16px !important;
      margin: 0 0 15px !important;
      box-sizing: border-box !important;
      scroll-behavior: smooth !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: thin !important;
    }

    .pratik-card-row > .anime-card,
    .pratik-card-row > .cartoon-card {

      flex: 0 0 180px !important;
      width: 180px !important;
      min-width: 180px !important;
      max-width: 180px !important;
      margin: 0 !important;
      box-sizing: border-box !important;
    }

    .pratik-card-row .card-img {

      width: 100% !important;
      height: 250px !important;
      object-fit: cover !important;
      display: block !important;

    }

    .pratik-card-row::-webkit-scrollbar {
      height: 6px !important;
    }

    .pratik-card-row::-webkit-scrollbar-track {
      background: #111 !important;
    }

    .pratik-card-row::-webkit-scrollbar-thumb {
      background: #ff003c !important;
      border-radius: 10px !important;
    }

  `;

  document.head.appendChild(style);

})();


/* =========================================================
   ANILIST QUERY
========================================================= */

const MEDIA_QUERY = `

query(
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
      genres

    }

  }

}`;


/* =========================================================
   SEARCH QUERY
========================================================= */

const SEARCH_QUERY = `

query($search: String) {

  Page(
    page: 1,
    perPage: 30
  ) {

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
      genres

    }

  }

}`;


/* =========================================================
   HELPERS
========================================================= */

function esc(value) {

  return String(value ?? "")
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

  return item?.averageScore
    ? (Number(item.averageScore) / 10).toFixed(1)
    : "N/A";

}


function getInfo(item, isMovie) {

  if (isMovie || item?.format === "MOVIE") {
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

function makeCard(item, isMovie = false) {

  const id = esc(item?.id || "");
  const title = getTitle(item);
  const image = getImage(item);
  const info = getInfo(item, isMovie);
  const score = getScore(item);

  return `

    <article class="card anime-card">

      <a
        class="anime-card-link"
        href="#"
        data-id="${id}"
        style="
          text-decoration:none;
          color:inherit;
          display:block;
        "
      >

        <div class="card-image-wrap">

          <span class="card-badge">
            ${isMovie ? "Movie" : "HD"}
          </span>

          <img
            class="card-img"
            src="${esc(image)}"
            alt="${esc(title)}"
            loading="lazy"
            onerror="
              this.onerror=null;
              this.src='https://placehold.co/300x430/111111/ffffff?text=No+Image';
            "
          >

        </div>

        <div class="card-body">

          <h3 class="card-title">
            ${esc(title)}
          </h3>

          <p class="card-meta">
            ${esc(info)}
          </p>

          <p class="card-score">
            ★ ${esc(score)}
          </p>

        </div>

      </a>

    </article>

  `;

}


/* =========================================================
   RENDER 30 CARDS - ONE HORIZONTAL ROW
========================================================= */

function render(grid, list, isMovie = false) {

  if (!grid) return;

  if (!list || !list.length) {

    grid.innerHTML = `
      <p class="loading">
        No content found.
      </p>
    `;

    return;
  }

  const cards = list.slice(0, MAX_CARDS);

  grid.innerHTML = `

    <div class="pratik-card-row">

      ${cards
        .map(item => makeCard(item, isMovie))
        .join("")}

    </div>

  `;

}


/* =========================================================
   ANILIST FETCH
========================================================= */

async function anilist(query, variables = {}) {

  const response = await fetch(API, {

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

    throw new Error(
      "AniList HTTP " + response.status
    );

  }

  const data = await response.json();

  if (data.errors?.length) {

    throw new Error(
      data.errors[0].message
    );

  }

  return data?.data?.Page?.media || [];

}


/* =========================================================
   FETCH MEDIA
========================================================= */

async function fetchMedia(format, sort) {

  const result = await anilist(
    MEDIA_QUERY,
    {
      page: 1,
      perPage: MAX_CARDS,
      type: "ANIME",
      format: format,
      sort: sort
    }
  );

  return result.slice(0, MAX_CARDS);

}


/* =========================================================
   30 CARTOONS
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
  "Courage the Cowardly Dog",
  "Ben 10 Alien Force",
  "Ben 10 Ultimate Alien",
  "Ben 10 Omniverse",
  "Pokemon Journeys",
  "Gravity Falls",
  "Adventure Time"

];


/* =========================================================
   CARTOON CARD
========================================================= */

function makeCartoonCard(name) {

  const image =
    "https://placehold.co/300x430/111111/ffffff?text=" +
    encodeURIComponent(name);

  return `

    <article class="card cartoon-card">

      <div class="card-image-wrap">

        <span class="card-badge">
          Cartoon
        </span>

        <img
          class="card-img"
          src="${image}"
          alt="${esc(name)}"
          loading="lazy"
        >

      </div>

      <div class="card-body">

        <h3 class="card-title">
          ${esc(name)}
        </h3>

        <p class="card-meta">
          Cartoon
        </p>

      </div>

    </article>

  `;

}


/* =========================================================
   RENDER CARTOONS
========================================================= */

function renderCartoons(grid) {

  if (!grid) return;

  grid.innerHTML = `

    <div class="pratik-card-row">

      ${CARTOONS
        .slice(0, 30)
        .map(name => makeCartoonCard(name))
        .join("")}

    </div>

  `;

}


/* =========================================================
   LOADING
========================================================= */

function showLoading(grid, text = "Loading...") {

  if (!grid) return;

  grid.innerHTML = `
    <p class="loading">
      ${esc(text)}
    </p>
  `;

}


/* =========================================================
   ERROR
========================================================= */

function showError(grid, text) {

  if (!grid) return;

  grid.innerHTML = `
    <p class="loading">
      ${esc(text)}
    </p>
  `;

}


/* =========================================================
   LOAD HOME
========================================================= */

async function loadHome() {

  const seriesGrid =
    document.querySelector("#series-grid");

  const movieGrid =
    document.querySelector("#movie-grid");

  const latestMovieGrid =
    document.querySelector("#latest-movie-grid");

  const cartoonGrid =
    document.querySelector("#cartoon-grid");


  showLoading(
    seriesGrid,
    "Loading 30 series..."
  );

  showLoading(
    movieGrid,
    "Loading 30 movies..."
  );

  showLoading(
    latestMovieGrid,
    "Loading 30 latest movies..."
  );


  renderCartoons(
    cartoonGrid
  );


  /* SERIES */

  try {

    const series =
      await fetchMedia(
        "TV",
        ["POPULARITY_DESC"]
      );

    render(
      seriesGrid,
      series,
      false
    );

  } catch (error) {

    console.error(
      "Series:",
      error
    );

    showError(
      seriesGrid,
      "Latest Series load nahi hui."
    );

  }


  /* MOVIES */

  try {

    const movies =
      await fetchMedia(
        "MOVIE",
        ["POPULARITY_DESC"]
      );

    render(
      movieGrid,
      movies,
      true
    );

  } catch (error) {

    console.error(
      "Movies:",
      error
    );

    showError(
      movieGrid,
      "Movies load nahi hui."
    );

  }


  /* LATEST MOVIES */

  try {

    const latestMovies =
      await fetchMedia(
        "MOVIE",
        ["START_DATE_DESC"]
      );

    render(
      latestMovieGrid,
      latestMovies,
      true
    );

  } catch (error) {

    console.error(
      "Latest Movies:",
      error
    );

    showError(
      latestMovieGrid,
      "Latest Movies load nahi hui."
    );

  }


  setupCardLinks();

}


/* =========================================================
   SEARCH
========================================================= */

async function searchAnime(value) {

  const seriesGrid =
    document.querySelector("#series-grid");

  const movieGrid =
    document.querySelector("#movie-grid");

  const latestMovieGrid =
    document.querySelector("#latest-movie-grid");


  if (!value || value.trim().length < 2) {

    loadHome();

    return;

  }


  showLoading(
    seriesGrid,
    "Searching..."
  );

  showLoading(
    movieGrid,
    "Searching..."
  );

  showLoading(
    latestMovieGrid,
    "Searching..."
  );


  try {

    const results =
      await anilist(
        SEARCH_QUERY,
        {
          search: value.trim()
        }
      );


    const series =
      results
        .filter(item =>
          [
            "TV",
            "TV_SHORT",
            "ONA",
            "OVA"
          ].includes(item.format)
        )
        .slice(0, MAX_CARDS);


    const movies =
      results
        .filter(item =>
          item.format === "MOVIE"
        )
        .slice(0, MAX_CARDS);


    render(
      seriesGrid,
      series,
      false
    );

    render(
      movieGrid,
      movies,
      true
    );

    render(
      latestMovieGrid,
      movies,
      true
    );


    setupCardLinks();


  } catch (error) {

    console.error(
      "Search:",
      error
    );

    showError(
      seriesGrid,
      "Search nahi ho paayi."
    );

    showError(
      movieGrid,
      "Search nahi ho paayi."
    );

    showError(
      latestMovieGrid,
      "Search nahi ho paayi."
    );

  }

}


/* =========================================================
   SEARCH INPUT + BUTTON
========================================================= */

function setupSearch() {

  const search =
    document.querySelector("#search") ||
    document.querySelector(
      'input[type="search"]'
    ) ||
    document.querySelector(
      'input[placeholder*="Search" i]'
    );


  if (!search) return;


  const button =
    document.querySelector("#search-button") ||
    document.querySelector(".search-button") ||
    document.querySelector(
      'button[type="submit"]'
    );


  let timer;


  search.addEventListener(
    "input",
    function() {

      clearTimeout(timer);

      const value =
        this.value.trim();

      timer = setTimeout(
        function() {

          searchAnime(value);

        },
        400
      );

    }
  );


  if (button) {

    button.addEventListener(
      "click",
      function(e) {

        e.preventDefault();

        clearTimeout(timer);

        searchAnime(
          search.value.trim()
        );

      }
    );

  }


  search.addEventListener(
    "keydown",
    function(e) {

      if (e.key === "Enter") {

        e.preventDefault();

        clearTimeout(timer);

        searchAnime(
          this.value.trim()
        );

      }

    }
  );

}


/* =========================================================
   CARD CLICK
========================================================= */

function setupCardLinks() {

  document
    .querySelectorAll(
      ".anime-card-link"
    )
    .forEach(
      link => {

        if (
          link.dataset.pratikBound === "1"
        ) {
          return;
        }

        link.dataset.pratikBound = "1";


        link.addEventListener(
          "click",
          function(e) {

            e.preventDefault();

            const id =
              this.dataset.id;

            console.log(
              "Anime selected:",
              id
            );

          }
        );

      }
    );

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    setupSearch();

    loadHome();

  }
);
