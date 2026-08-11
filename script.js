const API_URL = "https://graphql.anilist.co";

const CARDS_PER_SECTION = 90;
const PAGE_SIZE = 50;

/* =====================================================
   ANILIST QUERY
===================================================== */

const QUERY = `
query (
  $page: Int,
  $perPage: Int,
  $type: MediaType,
  $format: MediaFormat,
  $sort: [MediaSort]
) {
  Page(page: $page, perPage: $perPage) {
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

/* =====================================================
   SEARCH QUERY
===================================================== */

const SEARCH_QUERY = `
query ($page: Int, $perPage: Int, $search: String) {
  Page(page: $page, perPage: $perPage) {
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

/* =====================================================
   HELPERS
===================================================== */

function titleOf(a) {
  return a?.title?.english ||
         a?.title?.romaji ||
         "Unknown Anime";
}

function imageOf(a) {
  return a?.coverImage?.extraLarge ||
         a?.coverImage?.large ||
         "https://placehold.co/300x430/111/fff?text=No+Image";
}

function scoreOf(a) {
  return a?.averageScore
    ? (a.averageScore / 10).toFixed(1)
    : "N/A";
}

function escapeHTML(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =====================================================
   FETCH ANILIST
===================================================== */

async function fetchAniList(format, sort, pages = 2) {

  let result = [];

  for (let page = 1; page <= pages; page++) {

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },

      body: JSON.stringify({
        query: QUERY,

        variables: {
          page: page,
          perPage: PAGE_SIZE,
          type: "ANIME",
          format: format,
          sort: sort
        }
      })
    });

    if (!response.ok) {
      throw new Error("AniList error " + response.status);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const media =
      data?.data?.Page?.media || [];

    result.push(...media);

    if (media.length < PAGE_SIZE) {
      break;
    }
  }

  return result.slice(0, CARDS_PER_SECTION);
}

/* =====================================================
   CARD
===================================================== */

function makeCard(anime, type = "Series") {

  const title = titleOf(anime);
  const image = imageOf(anime);

  let meta = "Anime";

  if (type === "Movie") {
    meta = "Movie";
  } else if (anime.episodes) {
    meta = anime.episodes + " Episodes";
  } else if (anime.status === "RELEASING") {
    meta = "Ongoing";
  }

  return `
    <article class="card anime-card">

      <div class="card-image-wrap">

        <span class="card-badge">
          ${escapeHTML(type)}
        </span>

        <img
          class="card-img"
          src="${escapeHTML(image)}"
          alt="${escapeHTML(title)}"
          loading="lazy"
          onerror="
            this.onerror=null;
            this.src='https://placehold.co/300x430/111/fff?text=No+Image';
          "
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
          ★ ${escapeHTML(scoreOf(anime))}
        </p>

      </div>

    </article>
  `;
}

/* =====================================================
   RENDER
===================================================== */

function render(grid, data, type) {

  if (!grid) return;

  if (!data || data.length === 0) {

    grid.innerHTML =
      `<p>No content found.</p>`;

    return;
  }

  grid.innerHTML = data
    .slice(0, CARDS_PER_SECTION)
    .map(a => makeCard(a, type))
    .join("");
}

/* =====================================================
   LOADING
===================================================== */

function loading(grid) {

  if (!grid) return;

  grid.innerHTML =
    `<p>Loading...</p>`;
}

/* =====================================================
   LATEST SERIES
===================================================== */

async function loadSeries() {

  const grid =
    document.querySelector("#series-grid");

  loading(grid);

  try {

    const data =
      await fetchAniList(
        null,
        ["START_DATE_DESC"],
        4
      );

    const series =
      data.filter(a =>
        a.format === "TV" ||
        a.format === "ONA" ||
        a.format === "OVA"
      );

    render(
      grid,
      series,
      "HD"
    );

  } catch (error) {

    console.error(error);

    if (grid) {
      grid.innerHTML =
        `<p>Series load nahi ho payi.</p>`;
    }
  }
}

/* =====================================================
   LATEST MOVIES
===================================================== */

async function loadMovies() {

  const grid =
    document.querySelector("#movie-grid");

  loading(grid);

  try {

    const movies =
      await fetchAniList(
        "MOVIE",
        ["START_DATE_DESC"],
        2
      );

    render(
      grid,
      movies,
      "Movie"
    );

  } catch (error) {

    console.error(error);

    if (grid) {
      grid.innerHTML =
        `<p>Movies load nahi ho payi.</p>`;
    }
  }
}

/* =====================================================
   POPULAR MOVIES
===================================================== */

async function loadPopularMovies() {

  let grid =
    document.querySelector(
      "#popular-movie-grid"
    );

  if (!grid) {

    const movieGrid =
      document.querySelector(
        "#movie-grid"
      );

    if (!movieGrid) return;

    const oldSection =
      movieGrid.closest("section");

    if (!oldSection) return;

    const section =
      document.createElement("section");

    section.innerHTML = `

      <div class="section-head">

        <h2>
          Popular Movies
        </h2>

        <a
          href="#"
          class="view-all"
        >
          View All ›
        </a>

      </div>

      <div
        id="popular-movie-grid"
        class="grid"
      ></div>
    `;

    oldSection.insertAdjacentElement(
      "afterend",
      section
    );

    grid =
      document.querySelector(
        "#popular-movie-grid"
      );
  }

  loading(grid);

  try {

    const movies =
      await fetchAniList(
        "MOVIE",
        ["POPULARITY_DESC"],
        2
      );

    render(
      grid,
      movies,
      "Movie"
    );

  } catch (error) {

    console.error(error);

    grid.innerHTML =
      `<p>Popular movies load nahi ho payi.</p>`;
  }
}

/* =====================================================
   CARTOONS - 15 CARDS
===================================================== */

function loadCartoons() {

  const grid =
    document.querySelector(
      "#cartoon-grid"
    );

  if (!grid) return;

  const cartoons = [

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
    "Courage the Cowardly Dog"

  ];

  grid.innerHTML =
    cartoons.map(name => `

      <article class="card cartoon-card">

        <div class="card-image-wrap">

          <span class="card-badge">
            Cartoon
          </span>

          <img
            class="card-img"
            src="https://placehold.co/300x430/111/fff?text=${encodeURIComponent(name)}"
            alt="${escapeHTML(name)}"
            loading="lazy"
          >

        </div>

        <div class="card-body">

          <h3 class="card-title">
            ${escapeHTML(name)}
          </h3>

          <p class="card-meta">
            Cartoon
          </p>

        </div>

      </article>

    `).join("");
}

/* =====================================================
   SEARCH
===================================================== */

async function searchAnime(value) {

  const seriesGrid =
    document.querySelector("#series-grid");

  const movieGrid =
    document.querySelector("#movie-grid");

  if (!value) {

    loadSeries();
    loadMovies();

    return;
  }

  loading(seriesGrid);
  loading(movieGrid);

  try {

    const response =
      await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "Accept":
            "application/json"
        },

        body: JSON.stringify({

          query: SEARCH_QUERY,

          variables: {
            page: 1,
            perPage: 50,
            search: value
          }

        })

      });

    const data =
      await response.json();

    const results =
      data?.data?.Page?.media || [];

    const series =
      results.filter(a =>
        a.format === "TV" ||
        a.format === "ONA" ||
        a.format === "OVA"
      );

    const movies =
      results.filter(a =>
        a.format === "MOVIE"
      );

    render(
      seriesGrid,
      series,
      "HD"
    );

    render(
      movieGrid,
      movies,
      "Movie"
    );

  } catch (error) {

    console.error(
      "Search Error:",
      error
    );

    if (seriesGrid) {
      seriesGrid.innerHTML =
        `<p>Search error.</p>`;
    }

    if (movieGrid) {
      movieGrid.innerHTML =
        `<p>Search error.</p>`;
    }
  }
}

/* =====================================================
   SEARCH BUTTON / INPUT
===================================================== */

function setupSearch() {

  const search =
    document.querySelector("#search");

  if (!search) return;

  let timer;

  search.addEventListener(
    "input",
    function() {

      clearTimeout(timer);

      const value =
        search.value.trim();

      timer =
        setTimeout(
          function() {
            searchAnime(value);
          },
          500
        );
    }
  );
}

/* =====================================================
   HORIZONTAL SCROLL
===================================================== */

function horizontalScroll() {

  const grids =
    document.querySelectorAll(".grid");

  grids.forEach(grid => {

    grid.style.display = "flex";
    grid.style.flexWrap = "nowrap";
    grid.style.overflowX = "auto";
    grid.style.overflowY = "hidden";
    grid.style.gap = "12px";
    grid.style.scrollBehavior = "smooth";

    grid.style.webkitOverflowScrolling =
      "touch";

    const cards =
      grid.querySelectorAll(".card");

    cards.forEach(card => {

      card.style.flex =
        "0 0 180px";

      card.style.minWidth =
        "180px";

    });

  });
}

/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  async function() {

    loadCartoons();

    await Promise.all([
      loadSeries(),
      loadMovies(),
      loadPopularMovies()
    ]);

    horizontalScroll();

    setupSearch();

  }
);
