const API_URL = "https://graphql.anilist.co";

/* =========================
   ANILIST GRAPHQL
========================= */

const ANIME_QUERY = `
query ($page: Int, $perPage: Int, $search: String) {
  Page(page: $page, perPage: $perPage) {
    media(
      type: ANIME
      search: $search
      sort: POPULARITY_DESC
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
      genres
    }
  }
}
`;

/* =========================
   API FUNCTION
========================= */

async function fetchAnime(search = "", perPage = 30) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },

      body: JSON.stringify({
        query: ANIME_QUERY,

        variables: {
          page: 1,
          perPage: perPage,
          search: search || null
        }
      })
    });

    if (!response.ok) {
      throw new Error("AniList server error: " + response.status);
    }

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors[0].message);
    }

    return data.data.Page.media || [];

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/* =========================
   HELPERS
========================= */

function getTitle(anime) {
  if (!anime || !anime.title) {
    return "Unknown Anime";
  }

  return (
    anime.title.english ||
    anime.title.romaji ||
    "Unknown Anime"
  );
}


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


function getScore(anime) {
  if (!anime || !anime.averageScore) {
    return "N/A";
  }

  return (anime.averageScore / 10).toFixed(1);
}


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


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================
   CREATE CARD
========================= */

function makeCard(anime, isMovie = false) {

  const title = getTitle(anime);
  const image = getImage(anime);
  const score = getScore(anime);
  const episodes = getEpisodes(anime);

  const badge =
    isMovie || anime.format === "MOVIE"
      ? "Movie"
      : "HD";

  return `
    <article class="card anime-card">

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
          Episodes: ${escapeHTML(episodes)}
        </p>

        <p class="card-score">
          <span class="star">★</span>
          ${escapeHTML(score)}
        </p>

      </div>

    </article>
  `;
}


/* =========================
   LOADING
========================= */

function showLoading(grid, text = "Loading...") {

  if (!grid) {
    return;
  }

  grid.innerHTML = `
    <p class="loading">
      ${escapeHTML(text)}
    </p>
  `;
}


/* =========================
   ERROR
========================= */

function showError(grid, text) {

  if (!grid) {
    return;
  }

  grid.innerHTML = `
    <p class="loading error-message">
      ${escapeHTML(text)}
    </p>
  `;
}


/* =========================
   RENDER CARDS
========================= */

function renderCards(grid, animeList, isMovie = false) {

  if (!grid) {
    return;
  }

  if (!animeList || animeList.length === 0) {

    grid.innerHTML = `
      <p class="loading">
        Koi content nahi mila.
      </p>
    `;

    return;
  }

  grid.innerHTML = animeList
    .map(function (anime) {
      return makeCard(anime, isMovie);
    })
    .join("");
}


/* =========================
   LOAD HOME
========================= */

async function loadHome() {

  const seriesGrid =
    document.querySelector("#series-grid");

  const movieGrid =
    document.querySelector("#movie-grid");

  const cartoonGrid =
    document.querySelector("#cartoon-grid");


  if (
    !seriesGrid &&
    !movieGrid &&
    !cartoonGrid
  ) {
    console.warn(
      "Anime grids nahi mile."
    );

    return;
  }


  showLoading(
    seriesGrid,
    "Loading series..."
  );

  showLoading(
    movieGrid,
    "Loading movies..."
  );

  showLoading(
    cartoonGrid,
    "Loading cartoons..."
  );


  try {

    const animeList =
      await fetchAnime("", 30);


    /* =====================
       SERIES
    ===================== */

    const series =
      animeList
        .filter(function (anime) {
          return anime.format !== "MOVIE";
        })
        .slice(0, 18);


    /* =====================
       MOVIES
    ===================== */

    const movies =
      animeList
        .filter(function (anime) {
          return anime.format === "MOVIE";
        })
        .slice(0, 18);


    /* =====================
       CARTOONS
    ===================== */

    let cartoons =
      animeList.filter(function (anime) {

        const genres =
          anime.genres || [];

        return genres.some(function (genre) {

          return [
            "Comedy",
            "Adventure",
            "Fantasy",
            "Family",
            "Kids"
          ].includes(genre);

        });

      }).slice(0, 18);


    /*
      Agar cartoon-type results
      kam mile to normal anime
      dikha do.
    */

    if (cartoons.length < 6) {

      cartoons =
        animeList
          .filter(function (anime) {
            return anime.format !== "MOVIE";
          })
          .slice(0, 18);

    }


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
      cartoonGrid,
      cartoons,
      false
    );


  } catch (error) {

    console.error(
      "Home loading error:",
      error
    );


    showError(
      seriesGrid,
      "Series load nahi ho payi."
    );


    showError(
      movieGrid,
      "Movies load nahi ho payi."
    );


    showError(
      cartoonGrid,
      "Cartoons load nahi ho paye."
    );

  }
}


/* =========================
   SEARCH
========================= */

function setupSearch() {

  const search =
    document.querySelector("#search");


  if (!search) {

    console.warn(
      "Search input #search nahi mila."
    );

    return;
  }


  let searchTimer = null;


  search.addEventListener(
    "input",
    function () {

      const value =
        search.value.trim();


      clearTimeout(searchTimer);


      searchTimer =
        setTimeout(
          async function () {

            /*
              2 characters se kam
              ho to home reload.
            */

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
              cartoonGrid,
              "Searching..."
            );


            try {

              const results =
                await fetchAnime(
                  value,
                  30
                );


              const series =
                results.filter(
                  function (anime) {
                    return anime.format !== "MOVIE";
                  }
                );


              const movies =
                results.filter(
                  function (anime) {
                    return anime.format === "MOVIE";
                  }
                );


              const cartoons =
                results.filter(
                  function (anime) {

                    return (
                      anime.genres &&
                      anime.genres.some(
                        function (genre) {

                          return [
                            "Comedy",
                            "Adventure",
                            "Fantasy",
                            "Family",
                            "Kids"
                          ].includes(genre);

                        }
                      )
                    );

                  }
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
                cartoonGrid,
                cartoons.length
                  ? cartoons
                  : results,
                false
              );


            } catch (error) {

              console.error(
                "Search error:",
                error
              );


              showError(
                seriesGrid,
                "Search nahi ho paya."
              );


              showError(
                movieGrid,
                "Search nahi ho paya."
              );


              showError(
                cartoonGrid,
                "Search nahi ho paya."
              );

            }

          },
          500
        );

    }
  );
}


/* =========================
   CARD CLICK
========================= */

document.addEventListener(
  "click",
  function (event) {

    const card =
      event.target.closest(
        ".anime-card"
      );


    if (!card) {
      return;
    }


    const title =
      card.querySelector(
        ".card-title"
      );


    if (title) {

      console.log(
        "Anime selected:",
        title.textContent.trim()
      );

    }

  }
);


/* =========================
   START WEBSITE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    console.log(
      "Pratik Anime Stream started."
    );


    setupSearch();


    loadHome();

  }
);
