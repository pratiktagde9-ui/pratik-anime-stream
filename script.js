/* =====================================================
   PRATIK ANIME STREAM - NEW SCRIPT
   90 SERIES + 90 MOVIES + 90 POPULAR MOVIES + 90 CARTOONS
   15 CARDS PER HORIZONTAL ROW
===================================================== */

const API_URL = "https://graphql.anilist.co";

const MAX_CARDS = 90;
const PAGE_SIZE = 50;

/* =====================================================
   CSS - JS SE HORIZONTAL SCROLL
===================================================== */

(function addHorizontalCardCSS() {

  if (document.getElementById("pratik-card-style")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "pratik-card-style";

  style.textContent = `

    /* MAIN ROW */

    .pratik-card-row {
      display: flex !important;
      flex-wrap: nowrap !important;
      gap: 12px !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      width: 100% !important;
      padding: 5px 4px 15px !important;
      scroll-behavior: smooth !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: thin !important;
    }

    /* 15 CARDS PER ROW */

    .pratik-card-row .anime-card,
    .pratik-card-row .cartoon-card {

      flex: 0 0 calc(
        (100% - 14 * 12px) / 15
      ) !important;

      min-width: 150px !important;
      max-width: 180px !important;

      box-sizing: border-box !important;
    }

    /* MOBILE */

    @media (max-width: 900px) {

      .pratik-card-row .anime-card,
      .pratik-card-row .cartoon-card {

        flex: 0 0 180px !important;
        min-width: 180px !important;
      }

    }

    /* VERY SMALL PHONE */

    @media (max-width: 500px) {

      .pratik-card-row .anime-card,
      .pratik-card-row .cartoon-card {

        flex: 0 0 180px !important;
        min-width: 180px !important;
      }

    }

    /* CARD IMAGE */

    .pratik-card-row .card-img {

      width: 100% !important;
      height: 250px !important;
      object-fit: cover !important;
      display: block !important;

    }

    /* CARD */

    .pratik-card-row .card {

      overflow: hidden !important;
    }

    /* SCROLLBAR */

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

  `;

  document.head.appendChild(style);

})();


/* =====================================================
   GRAPHQL QUERY
===================================================== */

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
      genres

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

  Page(
    page: $page,
    perPage: $perPage
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

  if (
    anime &&
    anime.coverImage
  ) {

    return (
      anime.coverImage.extraLarge ||
      anime.coverImage.large ||
      "https://placehold.co/300x430/111111/ffffff?text=No+Image"
    );

  }

  return "https://placehold.co/300x430/111111/ffffff?text=No+Image";

}


/* =====================================================
   SCORE
===================================================== */

function getScore(anime) {

  if (
    !anime ||
    !anime.averageScore
  ) {

    return "N/A";

  }

  return (
    Number(anime.averageScore) / 10
  ).toFixed(1);

}


/* =====================================================
   EPISODES
===================================================== */

function getEpisodes(anime) {

  if (!anime) {
    return "N/A";
  }

  if (
    anime.format === "MOVIE"
  ) {

    return "Movie";

  }

  if (anime.episodes) {

    return anime.episodes +
      " Episodes";

  }

  if (
    anime.status === "RELEASING"
  ) {

    return "Ongoing";

  }

  return "Episodes N/A";

}


/* =====================================================
   CARD
===================================================== */

function makeCard(
  anime,
  movie = false
) {

  const title =
    getTitle(anime);

  const image =
    getImage(anime);

  const score =
    getScore(anime);

  const episodes =
    getEpisodes(anime);

  return `

    <article
      class="card anime-card"
      data-id="${escapeHTML(anime.id)}"
    >

      <div class="card-image-wrap">

        <span class="card-badge">

          ${movie ? "Movie" : "HD"}

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
   RENDER 15 CARDS PER HORIZONTAL ROW
===================================================== */

function renderHorizontalCards(
  grid,
  list,
  movie = false
) {

  if (!grid) {
    return;
  }

  if (
    !list ||
    list.length === 0
  ) {

    grid.innerHTML = `
      <p class="loading-error-message">
        No content found.
      </p>
    `;

    return;

  }

  const cards =
    list.slice(
      0,
      MAX_CARDS
    );

  /*
     90 cards
     15 cards per row
     = 6 rows
  */

  let html = "";

  for (
    let i = 0;
    i < cards.length;
    i += 15
  ) {

    const row =
      cards.slice(
        i,
        i + 15
      );

    html += `

      <div
        class="pratik-card-row"
      >

        ${row.map(
          function(anime) {

            return makeCard(
              anime,
              movie
            );

          }
        ).join("")}

      </div>

    `;

  }

  grid.innerHTML = html;

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
   FETCH ANILIST
===================================================== */

async function fetchAniList(
  format,
  sort,
  amount
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
              MEDIA_QUERY,

            variables: {

              page: page,

              perPage:
                PAGE_SIZE,

              type:
                "ANIME",

              format:
                format,

              sort:
                sort

            }

          })

        }
      );

    if (!response.ok) {

      throw new Error(
        "AniList Error " +
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
    amount
  );

}


/* =====================================================
   CREATE POPULAR MOVIES SECTION
===================================================== */

function createPopularMoviesSection() {

  let existing =
    document.querySelector(
      "#popular-movie-grid"
    );

  if (existing) {
    return existing;
  }

  const movieGrid =
    document.querySelector(
      "#movie-grid"
    );

  if (!movieGrid) {
    return null;
  }

  const movieSection =
    movieGrid.closest(
      "section"
    );

  if (!movieSection) {
    return null;
  }

  const section =
    document.createElement(
      "section"
    );

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
   CARTOON LIST - 90
===================================================== */

const CARTOON_NAMES = [

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
  "Courage",
  "Samurai Jack",
  "Ben 10 Alien Force",
  "Ben 10 Ultimate Alien",
  "Ben 10 Omniverse",
  "Pokemon Indigo League",
  "Pokemon Advanced",
  "Pokemon Diamond Pearl",
  "Pokemon Black White",
  "Pokemon XY",
  "Pokemon Sun Moon",
  "Pokemon Journeys",
  "Doraemon Movies",
  "Shinchan Movies",
  "Ninja Hattori",
  "Kochikame",
  "Hagemaru",
  "Masha and the Bear",
  "Peppa Pig",
  "Chota Bheem",
  "Roll No 21",
  "Mighty Raju",
  "Little Singham",
  "Vir The Robot Boy",
  "Keymon Ache",
  "Pakdam Pakdai",
  "Lamput",
  "Bandbudh Aur Budbak",
  "Golmaal Jr",
  "Titoo",
  "Inspector Chingum",
  "F.A.Q.",
  "The Jungle Book",
  "Mowgli",
  "He-Man",
  "She-Ra",
  "Transformers",
  "Power Rangers",
  "Dragon Ball",
  "Yu-Gi-Oh!",
  "Beyblade",
  "Digimon",
  "Bakugan",
  "Dinosaur King",
  "Jackie Chan Adventures",
  "Avatar The Last Airbender",
  "The Legend of Korra",
  "Gravity Falls",
  "Adventure Time",
  "Regular Show",
  "We Bare Bears",
  "Steven Universe",
  "The Amazing World of Gumball",
  "Ben 10 Classic",
  "Tom and Jerry Kids",
  "Scooby-Doo Show",
  "Mr Bean",
  "Oggy and the Cockroaches",
  "Noddy",
  "Thomas and Friends",
  "Bob the Builder",
  "Dora the Explorer",
  "Popeye",
  "Pingu",
  "Garfield",
  "Pinky and the Brain"

];


/* =====================================================
   CARTOONS RENDER
===================================================== */

function loadCartoons(
  grid
) {

  if (!grid) {
    return;
  }

  const cartoons =
    CARTOON_NAMES
      .slice(
        0,
        MAX_CARDS
      )
      .map(
        function(title) {

          return {

            id:
              "cartoon-" +
              title,

            title:
              title

          };

        }
      );

  let html = "";

  for (
    let i = 0;
    i < cartoons.length;
    i += 15
  ) {

    const row =
      cartoons.slice(
        i,
        i + 15
      );

    html += `

      <div
        class="pratik-card-row"
      >

        ${row.map(
          function(cartoon) {

            return `

              <article
                class="card cartoon-card"
              >

                <div
                  class="card-image-wrap"
                >

                  <span
                    class="card-badge"
                  >
                    Cartoon
                  </span>

                  <img

                    class="card-img"

                    src="https://placehold.co/300x430/111111/ffffff?text=${encodeURIComponent(cartoon.title)}"

                    alt="${escapeHTML(cartoon.title)}"

                    loading="lazy"

                  >

                </div>

                <div
                  class="card-body"
                >

                  <h3
                    class="card-title"
                  >
                    ${escapeHTML(cartoon.title)}
                  </h3>

                  <p
                    class="card-meta"
                  >
                    Cartoon
                  </p>

                </div>

              </article>

            `;

          }
        ).join("")}

      </div>

    `;

  }

  grid.innerHTML =
    html;

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


  /* -----------------------------
     LOADING
  ----------------------------- */

  showLoading(
    seriesGrid,
    "Loading 90 latest series..."
  );

  showLoading(
    movieGrid,
    "Loading 90 latest movies..."
  );

  showLoading(
    popularMovieGrid,
    "Loading 90 popular movies..."
  );

  loadCartoons(
    cartoonGrid
  );


  /* =================================================
     LATEST SERIES
  ================================================= */

  try {

    const series =
      await fetchAniList(
        "TV",
        ["START_DATE_DESC"],
        MAX_CARDS
      );

    renderHorizontalCards(
      seriesGrid,
      series,
      false
    );

  } catch (error) {

    console.error(
      "Series Error:",
      error
    );

    showError(
      seriesGrid,
      "Latest Series load nahi hui."
    );

  }


  /* =================================================
     LATEST MOVIES
  ================================================= */

  try {

    const movies =
      await fetchAniList(
        "MOVIE",
        ["START_DATE_DESC"],
        MAX_CARDS
      );

    renderHorizontalCards(
      movieGrid,
      movies,
      true
    );

  } catch (error) {

    console.error(
      "Movies Error:",
      error
    );

    showError(
      movieGrid,
      "Latest Movies load nahi hui."
    );

  }


  /* =================================================
     POPULAR MOVIES
  ================================================= */

  try {

    const popular =
      await fetchAniList(
        "MOVIE",
        ["POPULARITY_DESC"],
        MAX_CARDS
      );

    renderHorizontalCards(
      popularMovieGrid,
      popular,
      true
    );

  } catch (error) {

    console.error(
      "Popular Movies Error:",
      error
    );

    showError(
      popularMovieGrid,
      "Popular Movies load nahi hui."
    );

  }

}


/* =====================================================
   SEARCH
===================================================== */

async function searchAniList(
  search
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

            page: 1,

            perPage: 50,

            search:
              search

          }

        })

      }
    );


  if (!response.ok) {

    throw new Error(
      "Search Error " +
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


  return (
    data?.data?.Page?.media ||
    []
  );

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


      clearTimeout(
        timer
      );


      if (
        value.length < 2
      ) {

        loadHome();

        return;

      }


      timer =
        setTimeout(
          async function() {

            const seriesGrid =
              document.querySelector(
                "#series-grid"
              );

            const movieGrid =
              document.querySelector(
                "#movie-grid"
              );

            const popularGrid =
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
              popularGrid,
              "Searching..."
            );


            loadCartoons(
              cartoonGrid
            );


            try {

              const results =
                await searchAniList(
                  value
                );


              const series =
                results
                  .filter(
                    function(a) {

                      return (
                        a.format === "TV" ||
                        a.format === "ONA" ||
                        a.format === "OVA"
                      );

                    }
                  )
                  .slice(
                    0,
                    MAX
