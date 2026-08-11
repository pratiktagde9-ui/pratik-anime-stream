/* =========================================================
   PRATIK ANIME STREAM
   30 CARDS - HORIZONTAL RIGHT SCROLL
   ========================================================= */

const API_URL = "https://graphql.anilist.co";

const MAX_CARDS = 30;
const PAGE_SIZE = 30;


/* =========================================================
   HORIZONTAL CARD CSS
   ========================================================= */

(function addPratikHorizontalCSS() {

    const old = document.getElementById("pratik-horizontal-css");

    if (old) old.remove();

    const style = document.createElement("style");

    style.id = "pratik-horizontal-css";

    style.textContent = `

    /* SECTION GRID KO NORMAL BLOCK BANAO */
    #series-grid,
    #movie-grid,
    #cartoon-grid,
    #popular-movie-grid {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow: visible !important;
        box-sizing: border-box !important;
    }


    /* =====================================================
       EK HI HORIZONTAL ROW
       ===================================================== */

    .pratik-card-row {

        display: flex !important;

        flex-direction: row !important;

        flex-wrap: nowrap !important;

        align-items: stretch !important;

        gap: 12px !important;

        width: 100% !important;

        max-width: 100% !important;

        min-width: 0 !important;

        overflow-x: auto !important;

        overflow-y: hidden !important;

        padding: 5px 8px 18px 4px !important;

        margin: 0 0 25px 0 !important;

        box-sizing: border-box !important;

        scroll-behavior: smooth !important;

        -webkit-overflow-scrolling: touch !important;

        scrollbar-width: thin !important;

        scrollbar-color: #ff1744 #111 !important;

    }


    /* =====================================================
       HAR CARD FIXED WIDTH
       ===================================================== */

    .pratik-card-row > .card,

    .pratik-card-row > .anime-card,

    .pratik-card-row > .cartoon-card {

        display: block !important;

        flex: 0 0 180px !important;

        width: 180px !important;

        min-width: 180px !important;

        max-width: 180px !important;

        margin: 0 !important;

        box-sizing: border-box !important;

        overflow: hidden !important;

    }


    /* =====================================================
       CARD IMAGE
       ===================================================== */

    .pratik-card-row .card-image-wrap {

        width: 100% !important;

        height: 250px !important;

        overflow: hidden !important;

        position: relative !important;

        box-sizing: border-box !important;

    }


    .pratik-card-row .card-img {

        width: 100% !important;

        height: 250px !important;

        min-height: 250px !important;

        max-height: 250px !important;

        object-fit: cover !important;

        display: block !important;

    }


    /* =====================================================
       CARD BODY
       ===================================================== */

    .pratik-card-row .card-body {

        width: 100% !important;

        min-height: 95px !important;

        box-sizing: border-box !important;

        overflow: hidden !important;

    }


    .pratik-card-row .card-title {

        display: -webkit-box !important;

        -webkit-line-clamp: 2 !important;

        -webkit-box-orient: vertical !important;

        overflow: hidden !important;

    }


    /* =====================================================
       MOBILE
       ===================================================== */

    @media (max-width: 600px) {

        .pratik-card-row {

            gap: 12px !important;

            padding-left: 4px !important;

            padding-right: 12px !important;

        }

        .pratik-card-row > .card,
        .pratik-card-row > .anime-card,
        .pratik-card-row > .cartoon-card {

            flex: 0 0 180px !important;

            width: 180px !important;

            min-width: 180px !important;

            max-width: 180px !important;

        }

    }


    /* =====================================================
       SCROLLBAR
       ===================================================== */

    .pratik-card-row::-webkit-scrollbar {

        height: 6px !important;

    }

    .pratik-card-row::-webkit-scrollbar-track {

        background: #111 !important;

        border-radius: 10px !important;

    }

    .pratik-card-row::-webkit-scrollbar-thumb {

        background: #ff1744 !important;

        border-radius: 10px !important;

    }


    /* =====================================================
       POPULAR MOVIES SECTION
       ===================================================== */

    .popular-movies-section {

        width: 100% !important;

        box-sizing: border-box !important;

        margin-top: 20px !important;

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

        }

    }

}

`;


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   TITLE
   ========================================================= */

function getTitle(anime) {

    return (
        anime?.title?.english ||
        anime?.title?.romaji ||
        anime?.title?.native ||
        "Unknown Anime"
    );

}


/* =========================================================
   IMAGE
   ========================================================= */

function getImage(anime) {

    return (
        anime?.coverImage?.extraLarge ||
        anime?.coverImage?.large ||
        "https://placehold.co/300x430/111111/ffffff?text=No+Image"
    );

}


/* =========================================================
   SCORE
   ========================================================= */

function getScore(anime) {

    if (!anime?.averageScore) {

        return "N/A";

    }

    return (
        Number(anime.averageScore) / 10
    ).toFixed(1);

}


/* =========================================================
   EPISODES
   ========================================================= */

function getEpisodes(anime) {

    if (!anime) {

        return "N/A";

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


/* =========================================================
   ANIME / MOVIE CARD
   ========================================================= */

function makeCard(anime, isMovie = false) {

    const title = getTitle(anime);

    const image = getImage(anime);

    const score = getScore(anime);

    const episodes = getEpisodes(anime);

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
                    ★ ${escapeHTML(score)}
                </p>

            </div>

        </article>

    `;

}


/* =========================================================
   IMPORTANT:
   30 CARDS = EK HI HORIZONTAL LINE
   ========================================================= */

function renderCards(grid, list, isMovie = false) {

    if (!grid) return;


    if (!list || list.length === 0) {

        grid.innerHTML = `
            <p class="loading-error-message">
                No content found.
            </p>
        `;

        return;

    }


    const cards = list.slice(0, MAX_CARDS);


    /* SABHI 30 CARD EK HI ROW ME */

    const html = `

        <div class="pratik-card-row">

            ${cards.map(function(anime) {

                return makeCard(
                    anime,
                    isMovie
                );

            }).join("")}

        </div>

    `;


    grid.innerHTML = html;

}


/* =========================================================
   LOADING
   ========================================================= */

function showLoading(grid, text) {

    if (!grid) return;

    grid.innerHTML = `

        <p class="loading">
            ${escapeHTML(text)}
        </p>

    `;

}


/* =========================================================
   ERROR
   ========================================================= */

function showError(grid, text) {

    if (!grid) return;

    grid.innerHTML = `

        <p class="loading-error-message">
            ${escapeHTML(text)}
        </p>

    `;

}


/* =========================================================
   FETCH ANILIST
   ========================================================= */

async function fetchAniList(
    format,
    sort
) {

    const response = await fetch(
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

                    page: 1,

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
            "AniList HTTP " +
            response.status
        );

    }


    const data =
        await response.json();


    if (data.errors) {

        throw new Error(
            data.errors[0]?.message ||
            "AniList error"
        );

    }


    return (
        data?.data?.Page?.media ||
        []
    );

}


/* =========================================================
   POPULAR MOVIES SECTION
   ========================================================= */

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

        <div id="popular-movie-grid"></div>

    `;


    movieSection.after(section);


    return document.querySelector(
        "#popular-movie-grid"
    );

}


/* =========================================================
   30 CARTOONS
   ========================================================= */

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
    "Pokemon XY",
    "Pokemon Journeys",
    "Masha and the Bear",
    "Gravity Falls"

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


    const html = `

        <div class="pratik-card-row">

            ${CARTOON_NAMES
                .slice(0, 30)
                .map(function(title) {

                    return makeCartoonCard(title);

                })
                .join("")}

        </div>

    `;


    grid.innerHTML = html;

}


/* =========================================================
   LOAD HOME
   ========================================================= */

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


    /* LOADING */

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


    /* CARTOONS */

    loadCartoons(
        cartoonGrid
    );


    /* =====================================================
       LATEST SERIES
       ===================================================== */

    try {

        const series =
            await fetchAniList(
                "TV",
                ["START_DATE_DESC"]
            );


        renderCards(
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


    /* =====================================================
       LATEST MOVIES
       ===================================================== */

    try {

        const movies =
            await fetchAniList(
                "MOVIE",
                ["START_DATE_DESC"]
            );


        renderCards(
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


    /* =====================================================
       POPULAR MOVIES
       ===================================================== */

    try {

        const popular =
            await fetchAniList(
                "MOVIE",
                ["POPULARITY_DESC"]
            );


        renderCards(
            popularMovieGrid,
            popular,
            true
        );


    } catch (error) {

        console.error(
            "Popular Movie Error:",
            error
        );


        showError(
            popularMovieGrid,
            "Popular Movies load nahi hui."
        );

    }

}


/* =========================================================
   SEARCH
   ========================================================= */

async function searchAniList(searchText) {

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

                        perPage: 30,

                        search:
                            searchText

                    }

                })

            }
        );


    if (!response.ok) {

        throw new Error(
            "Search HTTP " +
            response.status
        );

    }


    const data =
        await response.json();


    if (data.errors) {

        throw new Error(
            data.errors[0]?.message ||
            "Search error"
        );

    }


    return (
        data?.data?.Page?.media ||
        []
    );

}


/* ==========================
