const API_URL = "https://graphql.anilist.co";

const MAX_CARDS = 90;
const PAGE_SIZE = 50;

/* =====================================================
   ANILIST QUERY
===================================================== */

const MEDIA_QUERY = `
query ($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    media(
      type: $type
      format: $format
      sort: $sort
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
}
`;

/* =====================================================
   SEARCH QUERY
===================================================== */

const SEARCH_QUERY = `
query ($page: Int, $perPage: Int, $search: String) {
  Page(page: $page, perPage: $perPage) {
    media(
      search: $search
      type: ANIME
      sort: SEARCH_MATCH
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
}
`;

/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =====================================================
   TITLE
===================================================== */

function getTitle(anime) {
  return (
    anime?.title?.english ||
    anime?.title?.romaji ||
    anime?.title?.native ||
    "Unknown Anime"
  );
}

/* =====================================================
   IMAGE
===================================================== */

function getImage(anime) {
  return (
    anime?.coverImage?.extraLarge ||
    anime?.coverImage?.large ||
    "https://placehold.co/300x430/111111/ffffff?text=No+Image"
  );
}

/* =====================================================
   SCORE
===================================================== */

function getScore(anime) {
  if (!anime?.averageScore) {
    return "N/A";
  }

  return (Number(anime.averageScore) / 10).toFixed(1);
}

/* =====================================================
   EPISODES
===================================================== */

function getEpisodes(anime) {

  if (!anime) {
    return "Episodes N/A";
  }

  if (anime.format === "MOVIE") {
    return "Movie";
  }

  if (anime.episodes) {
    return anime.episodes + " Episodes";
  }

  if (anime.status === "RELEASING") {
    return "Ongoing";
  }

  return "Episodes N/A";
}

/* =====================================================
   SERIES CHECK
===================================================== */

function isSeries(anime) {

  return (
    anime?.format === "TV" ||
    anime?.format === "ONA" ||
    anime?.format === "OVA"
  );
}

/* =====================================================
   MOVIE CHECK
===================================================== */

function isMovie(anime) {

  return anime?.format === "MOVIE";
}

/* =====================================================
   MAKE HORIZONTAL SCROLL
===================================================== */

function makeHorizontal(grid) {

  if (!grid) {
    return;
  }

  grid.style.display = "flex";
  grid.style.flexDirection = "row";
  grid.style.flexWrap = "nowrap";
  grid.style.overflowX = "auto";
  grid.style.overflowY = "hidden";
  grid.style.gap = "12px";
  grid.style.width = "100%";
  grid.style.maxWidth = "100%";
  grid.style.paddingBottom = "12px";
  grid.style.scrollBehavior = "smooth";
  grid.style.webkitOverflowScrolling = "touch";
  grid.style.scrollSnapType = "x proximity";

  grid.style.scrollbarWidth = "thin";

  grid.querySelectorAll(".card").forEach(function(card) {

    card.style.flex = "0 0 180px";
    card.style.width = "180px";
    card.style.minWidth = "180px";
    card.style.maxWidth = "180px";
    card.style.scrollSnapAlign = "start";

  });
}

/* =====================================================
   MAKE CARD
===================================================== */

function makeCard(anime, movie = false) {

  const title = getTitle(anime);
  const image = getImage(anime);
  const score = getScore(anime);
  const episodes = getEpisodes(anime);

  const badge = movie ? "Movie" : "HD";

  return `
    <article
      class="card anime-card"
      data-id="${escapeHTML(anime.id)}"
      style="
        flex:0 0 180px;
        width:180px;
        min-width:180px;
        max-width:180px;
        scroll-snap-align:start;
      "
    >

      <div class="card-image-wrap">

        <span class="card-badge">
          ${badge}
        </span>

        <img
          class="card-img"
          src="${escapeHTML(image)}"
          alt="${escapeHTML(title)}"
          loading="lazy"
          onerror="
            this.onerror=null;
            this.src='https://placehold.co/300x430/111111/ffffff?text=No+Image';
          "
        >

      </div>

      <div class="card-body">

        <h3 class="card-title">
          ${escapeHTML(title)}
        </h3>

        <p class="card-meta">
          ${escapeHTML(episodes)}
        </p>

        <p class="card-score">
          <span class="star">★</span>
          ${escapeHTML(score)}
        </p>

      </div>

    </article>
  `;
}

/* =====================================================
   RENDER
===================================================== */

function renderCards(grid, list, movie = false) {

  if (!grid) {
    return;
  }

  if (!list || list.length === 0) {

    grid.innerHTML = `
      <p class="loading-error-message">
        No content found.
      </p>
    `;

    return;
  }

  grid.innerHTML = list
    .slice(0, MAX_CARDS)
    .map(function(anime) {
      return makeCard(anime, movie);
    })
    .join("");

  makeHorizontal(grid);
}

/* =====================================================
   LOADING
===================================================== */

function showLoading(grid, text) {

  if (!grid) {
    return;
  }

  grid.style.display = "block";

  grid.innerHTML = `
    <p class="loading">
      ${escapeHTML(text)}
    </p>
  `;
}

/* =====================================================
   ERROR
===================================================== */

function showError(grid, text) {

  if (!grid) {
    return;
  }

  grid.style.display = "block";

  grid.innerHTML = `
    <p class="loading-error-message">
      ${escapeHTML(text)}
    </p>
  `;
}

/* =====================================================
   FETCH ONE PAGE
===================================================== */

async function fetchAniListPage(
  page,
  format,
  sort
) {

  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },

      body: JSON.stringify({

        query: MEDIA_QUERY,

        variables: {
          page: page,
          perPage: PAGE_SIZE,
          type: "ANIME",
          format: format,
          sort: sort
        }

      })
    }
  );

  if (!response.ok) {

    throw new Error(
      "AniList server error: " +
      response.status
    );
  }

  const data = await response.json();

  if (data.errors?.length) {

    throw new Error(
      data.errors[0].message
    );
  }

  return (
    data?.data?.Page?.media ||
    []
  );
}

/* =====================================================
   FETCH 90 CARDS
===================================================== */

async function fetchAniList(
  format,
  sort,
  amount = 90
) {

  let all = [];

  const pages = Math.ceil(
    amount / PAGE_SIZE
  );

  for (
    let page = 1;
    page <= pages;
    page++
  ) {

    const list =
      await fetchAniListPage(
        page,
        format,
        sort
      );

    all = all.concat(list);

    if (list.length < PAGE_SIZE) {
      break;
    }

    /* Small delay to avoid API overload */
    if (page < pages) {
      await new Promise(function(resolve) {
        setTimeout(resolve, 250);
      });
    }
  }

  return all.slice(0, amount);
}

/* =====================================================
   POPULAR MOVIES SECTION
===================================================== */

function createPopularMoviesSection() {

  let grid =
    document.querySelector(
      "#popular-movie-grid"
    );

  if (grid) {
    return grid;
  }

  const movieGrid =
    document.querySelector(
      "#movie-grid"
    );

  if (!movieGrid) {
    return null;
  }

  const movieSection =
    movieGrid.closest("section");

  if (!movieSection) {
    return null;
  }

  const section =
    document.createElement("section");

  section.className =
    "popular-movies-section";

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

  movieSection.insertAdjacentElement(
    "afterend",
    section
  );

  return document.querySelector(
    "#popular-movie-grid"
  );
}

/* =====================================================
   LOAD HOME
===================================================== */

async function loadHome() {

  const seriesGrid =
    document.querySelector(
      "#series-grid"
    );

  const movieGrid =
    document.querySelector(
      "#movie-grid"
    );

  const cartoonGrid =
    document.querySelector(
      "#cartoon-grid"
    );

  const popularMovieGrid =
    createPopularMoviesSection();

  /* Loading */

  showLoading(
    seriesGrid,
    "Loading latest series..."
  );

  showLoading(
    movieGrid,
    "Loading latest movies..."
  );

  showLoading(
    popularMovieGrid,
    "Loading popular movies..."
  );

  /* =================================================
     LATEST SERIES
  ================================================= */

  try {

    let seriesData =
      await fetchAniList(
        null,
        ["START_DATE_DESC"],
        90
      );

    seriesData =
      seriesData.filter(
        isSeries
      );

    renderCards(
      seriesGrid,
      seriesData,
      false
    );

  } catch (error) {

    console.error(
      "Latest Series Error:",
      error
    );

    showError(
      seriesGrid,
      "Latest Series load nahi ho payi."
    );
  }

  /* =================================================
     LATEST MOVIES
  ================================================= */

  try {

    const latestMovies =
      await fetchAniList(
        "MOVIE",
        ["START_DATE_DESC"],
        90
      );

    renderCards(
      movieGrid,
      latestMovies,
      true
    );

  } catch (error) {

    console.error(
      "Latest Movies Error:",
      error
    );

    showError(
      movieGrid,
      "Latest Movies load nahi ho payi."
    );
  }

  /* =================================================
     POPULAR MOVIES
  ================================================= */

  try {

    const popularMovies =
      await fetchAniList(
        "MOVIE",
        ["POPULARITY_DESC"],
        90
      );

    renderCards(
      popularMovieGrid,
      popularMovies,
      true
    );

  } catch (error) {

    console.error(
      "Popular Movies Error:",
      error
    );

    showError(
      popularMovieGrid,
      "Popular Movies load nahi ho payi."
    );
  }

  /* Cartoon */

  loadCartoons(
    cartoonGrid
  );
}

/* =====================================================
   CARTOONS
===================================================== */

function loadCartoons(grid) {

  if (!grid) {
    return;
  }

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
    "Courage the Cowardly Dog",
    "Dragon Tales",
    "Scooby-Doo",
    "Mr. Bean Cartoon"
  ];

  grid.innerHTML =
    cartoons.map(function(title) {

      return `

        <article
          class="card cartoon-card"
          style="
            flex:0 0 180px;
            width:180px;
            min-width:180px;
            max-width:180px;
          "
        >

          <div class="card-image-wrap">

            <span class="card-badge">
              Cartoon
            </span>

            <img
              class="card-img"
              src="https://placehold.co/300x430/111111/ffffff?text=${encodeURIComponent(title)}"
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

    }).join("");

  makeHorizontal(grid);
}

/* =====================================================
   SEARCH
===================================================== */

async function searchAniList(
  search,
  amount = 90
) {

  let all = [];

  const pages =
    Math.ceil(
      amount / PAGE_SIZE
    );

  for (
    let page = 1;
    page <= pages;
    page++
  ) {

    const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Accept":
              "application/json"
          },

          body: JSON.stringify({

            query:
              SEARCH_QUERY,

            variables: {
              page: page,
              perPage: PAGE_SIZE,
              search: search
            }

          })
        }
      );

    if (!response.ok) {

      throw new Error(
        "Search server error: " +
        response.status
      );
    }

    const data =
      await response.json();

    if (data.errors?.length) {

      throw new Error(
        data.errors[0].message
      );
    }

    const media =
      data?.data?.Page?.media ||
      [];

    all =
      all.concat(media);

    if (
      media.length < PAGE_SIZE
    ) {
      break;
    }
  }

  return all.slice(0, amount);
}

/* =====================================================
   SEARCH SETUP
===================================================== */

function setupSearch() {

  const search =
    document.querySelector(
      "#search"
    );

  if (!search) {
    return;
  }

  let timer = null;

  search.addEventListener(
    "input",
    function() {

      const value =
        search.value.trim();

      clearTimeout(timer);

      timer =
        setTimeout(
          async function() {

            /* Empty search */

            if (value.length < 2) {

              loadHome();

              return;
            }

            const seriesGrid =
              document.querySelector(
                "#series-grid"
              );

            const movieGrid =
              document.querySelector(
                "#movie-grid"
              );

            const popularMovieGrid =
              document.querySelector(
                "#popular-movie-grid"
              );

            const cartoonGrid =
              document.querySelector(
                "#cartoon-grid"
              );

            showLoading(
              seriesGrid,
              "Searching..."
            );

            showLoading(
              movieGrid,
              "Searching..."
            );

            showLoading(
              popularMovieGrid,
              "Searching..."
            );

            try {

              const results =
                await searchAniList(
                  value,
                  90
                );

              const series =
                results
                  .filter(isSeries)
                  .slice(0, 90);

              const movies =
                results
                  .filter(isMovie)
                  .slice(0, 90);

              renderCards(
                seriesGrid,
                series,
                false
              );

              renderCards(
                movieGrid,
                movies,
                true
              );

              renderCards(
                popularMovieGrid,
                movies,
                true
              );

              /* Cartoon remains separate */

              loadCartoons(
                cartoonGrid
              );

            } catch (error) {

              console.error(
                "Search Error:",
                error
              );

              showError(
                seriesGrid,
                "Search nahi ho payi."
              );

              showError(
                movieGrid,
                "Search nahi ho payi."
              );

              showError(
                popularMovieGrid,
                "Search nahi ho payi."
              );
            }

          },
          500
        );
    }
  );
}

/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadHome();

    setupSearch();

  }
);
