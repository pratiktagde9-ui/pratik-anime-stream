/* =====================================================
   PRATIK ANIME STREAM
   20 CARDS - HORIZONTAL RIGHT SCROLL
===================================================== */

const API_URL = "https://graphql.anilist.co";
const TOTAL_CARDS = 20;

/* =====================================================
   HORIZONTAL CARD CSS
===================================================== */

(function () {
  const style = document.createElement("style");

  style.textContent = `
    /* HORIZONTAL ROW */
    .pratik-horizontal-row {
      display: flex !important;
      flex-wrap: nowrap !important;
      gap: 10px !important;
      width: 100% !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      padding: 5px 2px 15px !important;
      margin: 0 !important;
      box-sizing: border-box !important;
      scroll-behavior: smooth !important;
      -webkit-overflow-scrolling: touch !important;
    }

    /* CARD */
    .pratik-horizontal-row .card {
      flex: 0 0 180px !important;
      width: 180px !important;
      min-width: 180px !important;
      max-width: 180px !important;
      margin: 0 !important;
      box-sizing: border-box !important;
    }

    /* IMAGE */
    .pratik-horizontal-row .card-img {
      width: 100% !important;
      height: 255px !important;
      object-fit: cover !important;
      display: block !important;
    }

    /* SCROLLBAR */
    .pratik-horizontal-row::-webkit-scrollbar {
      height: 5px;
    }

    .pratik-horizontal-row::-webkit-scrollbar-track {
      background: #111;
    }

    .pratik-horizontal-row::-webkit-scrollbar-thumb {
      background: #ff003c;
      border-radius: 10px;
    }

    /* PHONE */
    @media (max-width: 600px) {
      .pratik-horizontal-row .card {
        flex: 0 0 180px !important;
        width: 180px !important;
        min-width: 180px !important;
      }
    }
  `;

  document.head.appendChild(style);
})();


/* =====================================================
   ANILIST QUERY
===================================================== */

const QUERY = `
query(
  $page: Int,
  $perPage: Int,
  $format: MediaFormat,
  $sort: [MediaSort]
) {
  Page(
    page: $page,
    perPage: $perPage
  ) {
    media(
      type: ANIME,
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


/* =====================================================
   FETCH
===================================================== */

async function getAnime(format, sort) {

  const response = await fetch(API_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },

    body: JSON.stringify({
      query: QUERY,

      variables: {
        page: 1,
        perPage: TOTAL_CARDS,
        format: format,
        sort: sort
      }
    })
  });

  if (!response.ok) {
    throw new Error("AniList error");
  }

  const data = await response.json();

  return data?.data?.Page?.media || [];
}


/* =====================================================
   TITLE
===================================================== */

function titleOf(item) {

  return (
    item?.title?.english ||
    item?.title?.romaji ||
    item?.title?.native ||
    "Unknown"
  );
}


/* =====================================================
   IMAGE
===================================================== */

function imageOf(item) {

  return (
    item?.coverImage?.extraLarge ||
    item?.coverImage?.large ||
    "https://placehold.co/300x430/111111/ffffff?text=No+Image"
  );
}


/* =====================================================
   ANIME CARD
===================================================== */

function animeCard(item, movie) {

  const title = titleOf(item);

  const image = imageOf(item);

  const meta =
    movie
      ? "Movie"
      : item?.episodes
        ? item.episodes + " Episodes"
        : "Ongoing";

  const score =
    item?.averageScore
      ? (item.averageScore / 10).toFixed(1)
      : "N/A";

  return `
    <article class="card">

      <div class="card-image-wrap">

        <span class="card-badge">
          ${movie ? "Movie" : "HD"}
        </span>

        <img
          class="card-img"
          src="${image}"
          alt="${title}"
          loading="lazy"
          onerror="
            this.onerror=null;
            this.src='https://placehold.co/300x430/111111/ffffff?text=No+Image';
          "
        >

      </div>

      <div class="card-body">

        <h3 class="card-title">
          ${title}
        </h3>

        <p class="card-meta">
          ${meta}
        </p>

        <p class="card-score">
          ★ ${score}
        </p>

      </div>

    </article>
  `;
}


/* =====================================================
   RENDER HORIZONTAL 20 CARDS
===================================================== */

function renderHorizontal(grid, items, movie) {

  if (!grid) return;

  if (!items || items.length === 0) {

    grid.innerHTML =
      "<p>No content found.</p>";

    return;
  }

  const cards =
    items.slice(0, TOTAL_CARDS);

  grid.innerHTML = `
    <div class="pratik-horizontal-row">
      ${cards.map(item =>
        animeCard(item, movie)
      ).join("")}
    </div>
  `;
}


/* =====================================================
   CARTOONS - 20
===================================================== */

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
  "Teen Titans",
  "Powerpuff Girls",
  "Johnny Bravo"
];


/* =====================================================
   CARTOON CARD
===================================================== */

function cartoonCard(name) {

  const image =
    "https://placehold.co/300x430/111111/ffffff?text=" +
    encodeURIComponent(name);

  return `
    <article class="card">

      <div class="card-image-wrap">

        <span class="card-badge">
          Cartoon
        </span>

        <img
          class="card-img"
          src="${image}"
          alt="${name}"
          loading="lazy"
        >

      </div>

      <div class="card-body">

        <h3 class="card-title">
          ${name}
        </h3>

        <p class="card-meta">
          Cartoon
        </p>

      </div>

    </article>
  `;
}


/* =====================================================
   LOAD CARTOONS
===================================================== */

function loadCartoons(grid) {

  if (!grid) return;

  grid.innerHTML = `
    <div class="pratik-horizontal-row">
      ${CARTOONS.map(name =>
        cartoonCard(name)
      ).join("")}
    </div>
  `;
}


/* =====================================================
   HOME
===================================================== */

async function loadHome() {

  const seriesGrid =
    document.querySelector("#series-grid");

  const latestMovieGrid =
    document.querySelector("#latest-movie-grid");

  const cartoonGrid =
    document.querySelector("#cartoon-grid");

  const popularMovieGrid =
    document.querySelector("#movie-grid");


  /* CARTOONS */

  loadCartoons(cartoonGrid);


  /* SERIES */

  if (seriesGrid)
    seriesGrid.innerHTML =
      "<p>Loading...</p>";

  try {

    const series =
      await getAnime(
        "TV",
        ["START_DATE_DESC"]
      );

    renderHorizontal(
      seriesGrid,
      series,
      false
    );

  } catch (error) {

    console.error(error);

    if (seriesGrid)
      seriesGrid.innerHTML =
        "<p>Series load nahi hui.</p>";
  }


  /* LATEST MOVIES */

  if (latestMovieGrid)
    latestMovieGrid.innerHTML =
      "<p>Loading...</p>";

  try {

    const movies =
      await getAnime(
        "MOVIE",
        ["START_DATE_DESC"]
      );

    renderHorizontal(
      latestMovieGrid,
      movies,
      true
    );

  } catch (error) {

    console.error(error);

    if (latestMovieGrid)
      latestMovieGrid.innerHTML =
        "<p>Movies load nahi hui.</p>";
  }


  /* POPULAR MOVIES */

  if (popularMovieGrid)
    popularMovieGrid.innerHTML =
      "<p>Loading...</p>";

  try {

    const movies =
      await getAnime(
        "MOVIE",
        ["POPULARITY_DESC"]
      );

    renderHorizontal(
      popularMovieGrid,
      movies,
      true
    );

  } catch (error) {

    console.error(error);

    if (popularMovieGrid)
      popularMovieGrid.innerHTML =
        "<p>Popular Movies load nahi hui.</p>";
  }

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    loadHome();
  }
);
