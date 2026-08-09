const API_URL = "https://graphql.anilist.co";

const MAX_CARDS = 90;
const PAGE_SIZE = 50;

/* =====================================================
   ANILIST QUERY
===================================================== */

const MEDIA_QUERY = `
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
      startDate {
        year
        month
        day
      }
    }
  }
}
`;

/* =====================================================
   SEARCH QUERY
===================================================== */

const SEARCH_QUERY = `
query (
  $page: Int,
  $perPage: Int,
  $search: String
) {
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
   HTML ESCAPE
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
  if (!anime || !anime.title) {
    return "Unknown Anime";
  }

  return (
    anime.title.english ||
    anime.title.romaji ||
    anime.title.native ||
    "Unknown Anime"
  );
}

/* =====================================================
   IMAGE
===================================================== */

function getImage(anime) {
  if (!anime || !anime.coverImage) {
    return "https://placehold.co/300x430/111111/ffffff?text=No+Image";
  }

  return (
    anime.coverImage.extraLarge ||
    anime.coverImage.large ||
    "https://placehold.co/300x430/111111/ffffff?text=No+Image"
  );
}

/* =====================================================
   SCORE
===================================================== */

function getScore(anime) {
  if (!anime || !anime.averageScore) {
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
   MOVIE CHECK
===================================================== */

function isMovie(anime) {
  return anime && anime.format === "MOVIE";
}

/* =====================================================
   SERIES CHECK
===================================================== */

function isSeries(anime) {
  if (!anime) {
    return false;
  }

  return (
    anime.format === "TV" ||
    anime.format === "ONA" ||
    anime.format === "OVA"
  );
}

/* =====================================================
   FETCH ANILIST PAGE
===================================================== */

async function fetchAniListPage(
  page,
  format,
  sort
) {
  const response = await fetch(API_URL, {
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
  });

  if (!response.ok) {
    throw new Error(
      "AniList server error: " + response.status
    );
  }

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    throw new Error(
      data.errors[0].message
    );
  }

  if (
    !data.data ||
    !data.data.Page ||
    !data.data.Page.media
  ) {
    return [];
  }

  return data.data.Page.media;
}

/* =====================================================
   FETCH MANY PAGES
===================================================== */

async function fetchAniList(
  format,
  sort,
  requiredCards
) {
  let all = [];

  const totalPages = Math.ceil(
    requiredCards / PAGE_SIZE
  );

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    const list = await fetchAniListPage(
      page,
      format,
      sort
    );

    all = all.concat(list);

    if (list.length < PAGE_SIZE) {
      break;
    }
  }

  return all.slice(0, requiredCards);
}

/* =====================================================
   CREATE CARD
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
   RENDER CARDS
===================================================== */

function renderCards(
  grid,
  animeList,
  movie = false
) {
  if (!grid) {
    return;
  }

  if (
    !animeList ||
    animeList.length === 0
  ) {
    grid.innerHTML = `
      <p class="loading-error-message">
        No content found.
      </p>
    `;

    return;
  }

  grid.innerHTML = animeList
    .slice(0, MAX_CARDS)
    .map(function(anime) {
      return makeCard(
        anime,
        movie
      );
    })
    .join("");
}

/* =====================================================
   LOADING
===================================================== */

function showLoading(
  grid,
  text
) {
  if (!grid) {
    return;
  }

  grid.innerHTML = `
    <p class="loading">
      ${escapeHTML(text)}
    </p>
  `;
}

/* =====================================================
   ERROR
===================================================== */

function showError(
  grid,
  text
) {
  if (!grid) {
    return;
  }

  grid.innerHTML = `
    <p class="loading-error-message">
      ${escapeHTML(text)}
    </p>
  `;
}

/* =====================================================
   POPULAR MOVIES SECTION
===================================================== */

function createPopularMoviesSection() {

  let grid = document.querySelector(
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

  /* -------------------------
     LOADING
  ------------------------- */

  showLoading(
    seriesGrid,
    "Loading latest 90 series..."
  );

  showLoading(
    movieGrid,
    "Loading latest 90 movies..."
  );

  showLoading(
    popularMovieGrid,
    "Loading popular 90 movies..."
  );

  /* =================================================
     LATEST SERIES - 90
  ================================================= */

  try {

    /*
      Fetch 150 anime so that
      after filtering TV/ONA/OVA
      we can still get 90 series.
    */

    let seriesData =
      await fetchAniList(
        null,
        ["START_DATE_DESC"],
        150
      );

    seriesData =
      seriesData.filter(
        isSeries
      );

    seriesData =
      seriesData.slice(
        0,
        MAX_CARDS
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
     LATEST MOVIES - 90
  ================================================= */

  try {

    const latestMovies =
      await fetchAniList(
        "MOVIE",
        ["START_DATE_DESC"],
        MAX_CARDS
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
     POPULAR MOVIES - 90
  ================================================= */

  try {

    const popularMovies =
      await fetchAniList(
        "MOVIE",
        ["POPULARITY_DESC"],
        MAX_CARDS
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

  /* =================================================
     CARTOON
  ================================================= */

  loadCartoons(
    cartoonGrid
  );
}

/* =====================================================
   CARTOONS
   IMPORTANT:
   CARTOON SECTION ANIME DATA SE NAHI BHAREGA
===================================================== */

function loadCartoons(
  cartoonGrid
) {

  if (!cartoonGrid) {
    return;
  }

  const cartoons = [

    {
      title: "Pokemon",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Pokemon"
    },

    {
      title: "Ben 10",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Ben+10"
    },

    {
      title: "Doraemon",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Doraemon"
    },

    {
      title: "Shinchan",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Shinchan"
    },

    {
      title: "Tom and Jerry",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Tom+Jerry"
    },

    {
      title: "Oggy",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Oggy"
    },

    {
      title: "Motu Patlu",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Motu+Patlu"
    },

    {
      title: "Chhota Bheem",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Chhota+Bheem"
    },

    {
      title: "Ninja Hattori",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Ninja+Hattori"
    },

    {
      title: "Kiteretsu",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Kiteretsu"
    },

    {
      title: "Perman",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Perman"
    },

    {
      title: "Courage the Cowardly Dog",
      image:
        "https://placehold.co/300x430/111111/ffffff?text=Courage"
    }

  ];

  cartoonGrid.innerHTML =
    cartoons.map(
      function(cartoon) {

        return `
          <article class="card cartoon-card">

            <div class="card-image-wrap">

              <span class="card-badge">
                Cartoon
              </span>

              <img
                class="card-img"
                src="${escapeHTML(cartoon.image)}"
                alt="${escapeHTML(cartoon.title)}"
                loading="lazy"
              >

            </div>

            <div class="card-body">

              <h3 class="card-title">
                ${escapeHTML(cartoon.title)}
              </h3>

              <p class="card-meta">
                Cartoon
              </p>

            </div>

          </article>
        `;
      }
    ).join("");
}

/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

  const search =
    document.querySelector(
      "#search"
    );

  if (!search) {
    return;
  }

  let searchTimer = null;

  search.addEventListener(
    "input",
    function() {

      const value =
        search.value.trim();

      clearTimeout(
        searchTimer
      );

      searchTimer =
        setTimeout(
          async function() {

            /* -------------------------
               EMPTY SEARCH
            ------------------------- */

            if (
              value.length < 2
            ) {

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

            const cartoonGrid =
              document.querySelector(
                "#cartoon-grid"
              );

            const popularMovieGrid =
              document.querySelector(
                "#popular-movie-grid"
              );

            showLoading(
              seriesGrid,
              "Searching series..."
            );

            showLoading(
              movieGrid,
              "Searching movies..."
            );

            showLoading(
              popularMovieGrid,
              "Searching movies..."
            );

            /*
              Cartoon section stays separate.
            */

            loadCartoons(
              cartoonGrid
            );

            try {

              const results =
                await searchAniList(
                  value,
                  90
                );

              const series =
                results
                  .filter(
                    isSeries
                  )
                  .slice(
                    0,
                    MAX_CARDS
                  );

              const movies =
                results
                  .filter(
                    isMovie
                  )
                  .slice(
                    0,
                    MAX_CARDS
                  );

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
   SEARCH API
===================================================== */

async function searchAniList(
  search,
  limit
) {

  let all = [];

  const pages =
    Math.ceil(
      limit / PAGE_SIZE
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

    if (
      data.errors &&
      data.errors.length
    ) {

      throw new Error(
        data.errors[0].message
      );
    }

    const media =
      data?.data?.Page?.media ||
      [];

    all =
      all.concat(
        media
      );

    if (
      media.length <
      PAGE_SIZE
    ) {

      break;
    }
  }

  return all.slice(
    0,
    limit
  );
}

/* =====================================================
   START WEBSITE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadHome();

    setupSearch();

  }
);
