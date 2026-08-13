/* =====================================================
   PRATIK ANIME STREAM
   20 CARDS - HORIZONTAL RIGHT SCROLL
===================================================== */

const API_URL = "https://graphql.anilist.co";
const CARD_LIMIT = 20;

/* =====================================================
   HORIZONTAL CARD CSS
===================================================== */

(function addPratikScrollCSS() {

  if (document.getElementById("pratik-scroll-css")) return;

  const style = document.createElement("style");

  style.id = "pratik-scroll-css";

  style.textContent = `

    /* SECTION GRID KO NORMAL BLOCK BANAO */

    #series-grid,
    #latest-movie-grid,
    #cartoon-grid,
    #movie-grid,
    #popular-movie-grid {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      overflow: visible !important;
    }


    /* ONE HORIZONTAL ROW */

    .pratik-horizontal-row {

      display: flex !important;

      flex-direction: row !important;

      flex-wrap: nowrap !important;

      gap: 12px !important;

      width: 100% !important;

      max-width: 100% !important;

      overflow-x: auto !important;

      overflow-y: hidden !important;

      padding: 5px 18px 18px 0 !important;

      margin: 0 !important;

      box-sizing: border-box !important;

      scroll-behavior: smooth !important;

      -webkit-overflow-scrolling: touch !important;

      scrollbar-width: thin !important;

      touch-action: pan-x !important;

    }


    /* CARD FIX */

    .pratik-horizontal-row .card,
    .pratik-horizontal-row .anime-card,
    .pratik-horizontal-row .cartoon-card {

      flex: 0 0 180px !important;

      width: 180px !important;

      min-width: 180px !important;

      max-width: 180px !important;

      margin: 0 !important;

      box-sizing: border-box !important;

      display: block !important;

    }


    /* IMAGE */

    .pratik-horizontal-row .card-image-wrap {

      width: 100% !important;

      height: 250px !important;

      overflow: hidden !important;

    }


    .pratik-horizontal-row .card-img {

      width: 100% !important;

      height: 250px !important;

      object-fit: cover !important;

      display: block !important;

    }


    /* BODY */

    .pratik-horizontal-row .card-body {

      width: 100% !important;

      box-sizing: border-box !important;

      padding: 10px !important;

    }


    .pratik-horizontal-row .card-title {

      margin: 0 0 6px 0 !important;

      font-size: 15px !important;

      line-height: 1.25 !important;

    }


    .pratik-horizontal-row .card-meta,
    .pratik-horizontal-row .card-score {

      margin: 4px 0 !important;

      font-size: 13px !important;

    }


    /* SCROLLBAR */

    .pratik-horizontal-row::-webkit-scrollbar {

      height: 7px;

    }

    .pratik-horizontal-row::-webkit-scrollbar-track {

      background: #111;

      border-radius: 10px;

    }

    .pratik-horizontal-row::-webkit-scrollbar-thumb {

      background: #ff003c;

      border-radius: 10px;

    }


    /* MOBILE */

    @media (max-width: 600px) {

      .pratik-horizontal-row {

        gap: 12px !important;

      }

      .pratik-horizontal-row .card,
      .pratik-horizontal-row .anime-card,
      .pratik-horizontal-row .cartoon-card {

        flex: 0 0 180px !important;

        width: 180px !important;

        min-width: 180px !important;

        max-width: 180px !important;

      }

    }

  `;

  document.head.appendChild(style);

})();


/* =====================================================
   HELPERS
===================================================== */

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

  return (
    Number(item.averageScore) / 10
  ).toFixed(1);

}


/* =====================================================
   ANIME CARD
===================================================== */

function animeCard(item, isMovie = false) {

  const title = getTitle(item);

  const image = getImage(item);

  const episodes =
    isMovie
      ? "Movie"
      : item?.episodes
        ? item.episodes + " Episodes"
        : "Ongoing";

  return `

    <article class="card anime-card">

      <div class="card-image-wrap">

        <span class="card-badge">

          ${isMovie ? "Movie" : "HD"}

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

          ★ ${escapeHTML(getScore(item))}

        </p>

      </div>

    </article>

  `;

}


/* =====================================================
   RENDER ONE HORIZONTAL ROW
===================================================== */

function renderRow(grid, items, isMovie = false) {

  if (!grid) return;

  if (!items || items.length === 0) {

    grid.innerHTML =
      `<p>No content found.</p>`;

    return;

  }

  const row =
    document.createElement("div");

  row.className =
    "pratik-horizontal-row";

  row.innerHTML =
    items
      .slice(0, CARD_LIMIT)
      .map(item =>
        animeCard(item, isMovie)
      )
      .join("");

  grid.innerHTML = "";

  grid.appendChild(row);

}


/* =====================================================
   ANILIST
===================================================== */

async function getAnime(format, sort) {

  const query = `

    query {

      Page(
        page: 1,
        perPage: 20
      ) {

        media(

          type: ANIME,

          format: ${format},

          sort: ${sort},

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

        }

      }

    }

  `;


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

        query: query

      })

    });


  if (!response.ok) {

    throw new Error(
      "AniList error " +
      response.status
    );

  }


  const data =
    await response.json();


  return (
    data?.data?.Page?.media ||
    []
  );

}


/* =====================================================
   CARTOONS
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
  "Courage the Cowardly Dog",
  "Dragon Tales",
  "Scooby-Doo",
  "Mr. Bean Cartoon",
  "Looney Tunes",
  "Mickey Mouse",
  "Donald Duck",
  "DuckTales",
  "Teen Titans"

];


async function loadCartoons(grid) {
    if (!grid) return;

    grid.innerHTML = "<p>Cartoons loading...</p>";

    const row = document.createElement("div");
    row.className = "pratik-horizontal-row";

    const cards = await Promise.all(
        CARTOONS.map(async function(title) {
            let image = "https://placehold.co/300x430/111111/ffffff?text=Cartoon";

            try {
                const response = await fetch(
                    "https://api.tvmaze.com/search/shows?q=" +
                    encodeURIComponent(title)
                );

                const data = await response.json();

                if (data.length && data[0].show.image) {
                    image =
                        data[0].show.image.original ||
                        data[0].show.image.medium ||
                        image;
                }
            } catch (error) {
                console.error("Cartoon image error:", error);
            }

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
        })
    );

    row.innerHTML = cards.join("");

    grid.innerHTML = "";
    grid.appendChild(row);
}

  

  
    

  
    


  
    

      

        

          

          

            
              
         

            
              
              
              
              
            

          

          

            
              
            

            
              
            

          

        

      

    


  

  




/* =====================================================
   LOAD HOME
===================================================== */

async function loadHome() {

  const seriesGrid =
    document.querySelector(
      "#series-grid"
    );

  const latestMovieGrid =
    document.querySelector(
      "#latest-movie-grid"
    );

  const cartoonGrid =
    document.querySelector(
      "#cartoon-grid"
    );

  const popularMovieGrid =
    document.querySelector(
      "#movie-grid"
    );


  /* LOADING */

  if (seriesGrid)
    seriesGrid.innerHTML =
      "<p>Loading...</p>";

  if (latestMovieGrid)
    latestMovieGrid.innerHTML =
      "<p>Loading...</p>";

  if (popularMovieGrid)
    popularMovieGrid.innerHTML =
      "<p>Loading...</p>";


  /* CARTOONS */

  loadCartoons(
    cartoonGrid
  );


  /* =================================================
     LATEST SERIES
  ================================================= */

  try {

    const series =
      await getAnime(
        "TV",
        "START_DATE_DESC"
      );

    renderRow(
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


  /* =================================================
     LATEST MOVIES
  ================================================= */

  try {

    const movies =
      await getAnime(
        "MOVIE",
        "START_DATE_DESC"
      );

    renderRow(
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


  /* =================================================
     POPULAR MOVIES
  ================================================= */

  try {

    const popular =
      await getAnime(
        "MOVIE",
        "POPULARITY_DESC"
      );

    renderRow(
      popularMovieGrid,
      popular,
      true
    );

  } catch (error) {

    console.error(error);

    if (popularMovieGrid)
      popularMovieGrid.innerHTML =
        "<p>Popular movies load nahi hui.</p>";

  }

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadHome();

  }
);
