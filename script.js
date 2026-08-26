// ==========================================
// ANIME WORLD INDIA - COMPLETE JAVASCRIPT
// ==========================================

// Anime Data
const animeData = [
    {
        id: 1,
        title: "Jujutsu Kaisen Season 3",
        image: "https://via.placeholder.com/300x420/e94560/ffffff?text=JJK+S3",
        episode: "EP 12",
        rating: 9.2,
        type: "TV",
        year: 2024,
        language: "Hindi Dubbed",
        status: "ongoing",
        genre: ["Action", "Supernatural"]
    },
    {
        id: 2,
        title: "Demon Slayer Season 4",
        image: "https://via.placeholder.com/300x420/0f3460/ffffff?text=DS+S4",
        episode: "EP 8",
        rating: 9.5,
        type: "TV",
        year: 2024,
        language: "Hindi Dubbed",
        status: "completed",
        genre: ["Action", "Fantasy"]
    },
    {
        id: 3,
        title: "One Piece",
        image: "https://via.placeholder.com/300x420/16c79a/ffffff?text=OP",
        episode: "EP 1115",
        rating: 9.8,
        type: "TV",
        year: 1999,
        language: "Hindi Subbed",
        status: "ongoing",
        genre: ["Adventure", "Action"]
    },
    {
        id: 4,
        title: "Dragon Ball Super",
        image: "https://via.placeholder.com/300x420/ff6b35/ffffff?text=DBS",
        episode: "EP 131",
        rating: 9.0,
        type: "TV",
        year: 2015,
        language: "Hindi Dubbed",
        status: "completed",
        genre: ["Action", "Adventure"]
    },
    {
        id: 5,
        title: "Naruto Shippuden",
        image: "https://via.placeholder.com/300x420/4ecdc4/ffffff?text=NS",
        episode: "EP 500",
        rating: 9.3,
        type: "TV",
        year: 2007,
        language: "Hindi Dubbed",
        status: "completed",
        genre: ["Action", "Adventure"]
    },
    {
        id: 6,
        title: "Attack on Titan Final",
        image: "https://via.placeholder.com/300x420/1a1a2e/e94560?text=AOT",
        episode: "EP 16",
        rating: 9.7,
        type: "TV",
        year: 2023,
        language: "Hindi Subbed",
        status: "completed",
        genre: ["Action", "Drama"]
    },
    {
        id: 7,
        title: "Solo Leveling",
        image: "https://via.placeholder.com/300x420/533483/ffffff?text=SL",
        episode: "EP 12",
        rating: 8.9,
        type: "TV",
        year: 2024,
        language: "Hindi Subbed",
        status: "completed",
        genre: ["Action", "Fantasy"]
    },
    {
        id: 8,
        title: "My Hero Academia S7",
        image: "https://via.placeholder.com/300x420/45b7d1/ffffff?text=MHA",
        episode: "EP 21",
        rating: 8.5,
        type: "TV",
        year: 2024,
        language: "Hindi Dubbed",
        status: "ongoing",
        genre: ["Action", "Shounen"]
    },
    {
        id: 9,
        title: "Black Clover",
        image: "https://via.placeholder.com/300x420/2c3e50/ffffff?text=BC",
        episode: "EP 170",
        rating: 8.7,
        type: "TV",
        year: 2017,
        language: "Hindi Dubbed",
        status: "completed",
        genre: ["Action", "Fantasy"]
    },
    {
        id: 10,
        title: "Bleach TYBW Part 3",
        image: "https://via.placeholder.com/300x420/e74c3c/ffffff?text=Bleach",
        episode: "EP 13",
        rating: 9.1,
        type: "TV",
        year: 2024,
        language: "Hindi Subbed",
        status: "ongoing",
        genre: ["Action", "Supernatural"]
    },
    {
        id: 11,
        title: "Spy x Family S2",
        image: "https://via.placeholder.com/300x420/f39c12/ffffff?text=SxF",
        episode: "EP 12",
        rating: 8.8,
        type: "TV",
        year: 2023,
        language: "Hindi Dubbed",
        status: "completed",
        genre: ["Comedy", "Action"]
    },
    {
        id: 12,
        title: "Chainsaw Man",
        image: "https://via.placeholder.com/300x420/c0392b/ffffff?text=CSM",
        episode: "EP 12",
        rating: 8.6,
        type: "TV",
        year: 2022,
        language: "Hindi Subbed",
        status: "completed",
        genre: ["Action", "Horror"]
    },
    {
        id: 13,
        title: "Death Note",
        image: "https://via.placeholder.com/300x420/1a1a1a/ffffff?text=DN",
        episode: "EP 37",
        rating: 9.6,
        type: "TV",
        year: 2006,
        language: "Hindi Dubbed",
        status: "completed",
        genre: ["Thriller", "Mystery"]
    },
    {
        id: 14,
        title: "Sword Art Online",
        image: "https://via.placeholder.com/300x420/3498db/ffffff?text=SAO",
        episode: "EP 96",
        rating: 7.8,
        type: "TV",
        year: 2012,
        language: "Hindi Dubbed",
        status: "completed",
        genre: ["Action", "Fantasy"]
    },
    {
        id: 15,
        title: "Tokyo Revengers S3",
        image: "https://via.placeholder.com/300x420/8e44ad/ffffff?text=TR",
        episode: "EP 13",
        rating: 8.3,
        type: "TV",
        year: 2023,
        language: "Hindi Subbed",
        status: "completed",
        genre: ["Action", "Drama"]
    },
    {
        id: 16,
        title: "Hunter x Hunter",
        image: "https://via.placeholder.com/300x420/27ae60/ffffff?text=HxH",
        episode: "EP 148",
        rating: 9.4,
        type: "TV",
        year: 2011,
        language: "Hindi Dubbed",
        status: "completed",
        genre: ["Action", "Adventure"]
    }
];

const movieData = [
    {
        id: 101,
        title: "Dragon Ball Super: Super Hero",
        image: "https://via.placeholder.com/300x420/ff6b35/ffffff?text=DBS+Movie",
        rating: 8.5,
        type: "Movie",
        year: 2022,
        language: "Hindi Dubbed",
        genre: ["Action", "Adventure"]
    },
    {
        id: 102,
        title: "One Piece Film: Red",
        image: "https://via.placeholder.com/300x420/e94560/ffffff?text=OP+Red",
        rating: 8.7,
        type: "Movie",
        year: 2022,
        language: "Hindi Dubbed",
        genre: ["Action", "Adventure"]
    },
    {
        id: 103,
        title: "Jujutsu Kaisen 0",
        image: "https://via.placeholder.com/300x420/0f3460/ffffff?text=JJK+0",
        rating: 9.0,
        type: "Movie",
        year: 2021,
        language: "Hindi Dubbed",
        genre: ["Action", "Supernatural"]
    },
    {
        id: 104,
        title: "Demon Slayer: Mugen Train",
        image: "https://via.placeholder.com/300x420/c0392b/ffffff?text=DS+Movie",
        rating: 9.2,
        type: "Movie",
        year: 2020,
        language: "Hindi Dubbed",
        genre: ["Action", "Fantasy"]
    },
    {
        id: 105,
        title: "Your Name",
        image: "https://via.placeholder.com/300x420/3498db/ffffff?text=Your+Name",
        rating: 9.5,
        type: "Movie",
        year: 2016,
        language: "Hindi Subbed",
        genre: ["Romance", "Drama"]
    },
    {
        id: 106,
        title: "Suzume no Tojimari",
        image: "https://via.placeholder.com/300x420/16c79a/ffffff?text=Suzume",
        rating: 8.8,
        type: "Movie",
        year: 2022,
        language: "Hindi Subbed",
        genre: ["Adventure", "Fantasy"]
    }
];

const scheduleData = {
    mon: [
        { time: "5:30 PM", title: "One Piece", ep: "EP 1116" },
        { time: "6:00 PM", title: "Boruto: Two Blue Vortex", ep: "EP 15" },
        { time: "8:00 PM", title: "Undead Unluck", ep: "EP 8" }
    ],
    tue: [
        { time: "5:00 PM", title: "Solo Leveling S2", ep: "EP 3" },
        { time: "7:00 PM", title: "Mashle S2", ep: "EP 10" }
    ],
    wed: [
        { time: "4:30 PM", title: "My Hero Academia S7", ep: "EP 22" },
        { time: "6:30 PM", title: "Kaiju No. 8", ep: "EP 6" },
        { time: "9:00 PM", title: "Wind Breaker", ep: "EP 8" }
    ],
    thu: [
        { time: "5:00 PM", title: "Black Clover Movie", ep: "NEW" },
        { time: "7:30 PM", title: "Tower of God S2", ep: "EP 5" }
    ],
    fri: [
        { time: "5:30 PM", title: "Blue Lock S2", ep: "EP 12" },
        { time: "7:00 PM", title: "Dandadan", ep: "EP 4" },
        { time: "9:30 PM", title: "Re:Zero S3", ep: "EP 7" }
    ],
    sat: [
        { time: "10:00 AM", title: "Dragon Ball Daima", ep: "EP 3" },
        { time: "3:00 PM", title: "Jujutsu Kaisen S3", ep: "EP 13" },
        { time: "6:00 PM", title: "Bleach TYBW P3", ep: "EP 14" },
        { time: "8:00 PM", title: "Demon Slayer S4", ep: "EP 9" }
    ],
    sun: [
        { time: "11:00 AM", title: "Naruto (Rewatch)", ep: "EP 50" },
        { time: "4:00 PM", title: "Chainsaw Man S2", ep: "EP 5" },
        { time: "7:00 PM", title: "Spy x Family Movie", ep: "NEW" }
    ]
};

// ==========================================
// CREATE ANIME CARD
// ==========================================
function createAnimeCard(anime) {
    const statusBadge = anime.status === 'ongoing'
        ? '<span class="badge ongoing">Ongoing</span>'
        : anime.status === 'completed'
            ? '<span class="badge completed">Completed</span>'
            : '';

    const langBadge = anime.language === 'Hindi Dubbed'
        ? '<span class="badge hindi">DUB</span>'
        : '<span class="badge" style="background:#0f3460;color:white">SUB</span>';

    return `
        <div class="anime-card" data-id="${anime.id}">
            <div class="card-image">
                <img src="${anime.image}" alt="${anime.title}" loading="lazy">
                <div class="card-overlay">
                    <a href="#" class="play-btn"><i class="fas fa-play"></i></a>
                </div>
                <div class="card-badges">
                    ${langBadge}
                    ${statusBadge}
                </div>
                <span class="card-rating"><i class="fas fa-star"></i> ${anime.rating}</span>
                ${anime.episode ? `<span class="card-episode">${anime.episode}</span>` : ''}
            </div>
            <div class="card-info">
                <h3 class="card-title">${anime.title}</h3>
                <div class="card-meta">
                    <span class="card-type">${anime.type}</span>
                    <span><i class="fas fa-calendar"></i> ${anime.year}</span>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// RENDER SECTIONS
// ==========================================
function renderAnimeGrid(containerId, data, count = 12) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const displayData = data.slice(0, count);
    container.innerHTML = displayData.map(anime => createAnimeCard(anime)).join('');
}

function renderTopList() {
    const container = document.getElementById('topAnimeList');
    if (!container) return;

    const topAnime = [...animeData].sort((a, b) => b.rating - a.rating).slice(0, 10);

    container.innerHTML = topAnime.map((anime, index) => {
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
        return `
            <div class="top-list-item">
                <span class="top-rank ${rankClass}">${index + 1}</span>
                <div class="top-thumb">
                    <img src="${anime.image}" alt="${anime.title}">
                </div>
                <div class="top-info">
                    <h4>${anime.title}</h4>
                    <div class="top-meta">
                        <span><i class="fas fa-star" style="color: #ffc107"></i> ${anime.rating}</span>
                        <span>${anime.type}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderSchedule(day = 'mon') {
    const container = document.getElementById('scheduleList');
    if (!container) return;

    const dayData = scheduleData[day] || [];
    container.innerHTML = dayData.map(item => `
        <div class="schedule-item">
            <span class="schedule-time">${item.time}</span>
            <span class="schedule-title">${item.title}</span>
            <span class="schedule-ep">${item.ep}</span>
        </div>
    `).join('');
}

// ==========================================
// HERO SLIDER
// ==========================================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

document.getElementById('nextSlide')?.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
});

document.getElementById('prevSlide')?.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});

// Auto slide
setInterval(() => {
    goToSlide(currentSlide + 1);
}, 5000);

// ==========================================
// THEME TOGGLE
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('light-theme')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
    const icon = themeToggle?.querySelector('i');
    if (icon) icon.className = 'fas fa-sun';
}

// ==========================================
// MOBILE MENU
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
let navOverlay = null;

menuToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('active');

    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    navOverlay.classList.toggle('active');

    navOverlay.addEventListener('click', () => {
        mainNav.classList.remove('active');
        navOverlay.classList.remove('active');
    });
});

// Mobile Dropdown Toggle
document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            link.parentElement.classList.toggle('active');
        }
    });
});

// ==========================================
// SEARCH MODAL
// ==========================================
const searchToggle = document.getElementById('searchToggle');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
const modalSearchInput = document.getElementById('modalSearchInput');
const searchResults = document.getElementById('searchResults');

searchToggle?.addEventListener('click', () => {
    searchModal.classList.add('active');
    setTimeout(() => modalSearchInput?.focus(), 300);
});

closeSearch?.addEventListener('click', () => {
    searchModal.classList.remove('active');
});

searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.classList.remove('active');
    }
});

// Search Functionality
modalSearchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    const results = [...animeData, ...movieData].filter(anime =>
        anime.title.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">No results found 😔</p>';
        return;
    }

    searchResults.innerHTML = results.map(anime => `
        <div class="search-result-item">
            <img src="${anime.image}" alt="${anime.title}">
            <div class="search-result-info">
                <h4>${anime.title}</h4>
                <p>${anime.type} • ${anime.year} • ${anime.language} • ⭐ ${anime.rating}</p>
            </div>
        </div>
    `).join('');
});

// Desktop search
const searchInput = document.getElementById('searchInput');
searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchModal.classList.add('active');
        modalSearchInput.value = searchInput.value;
        modalSearchInput.dispatchEvent(new Event('input'));
    }
});

// ==========================================
// BACK TO TOP
// ==========================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Sticky header shadow
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
        header.style.boxShadow = 'var(--shadow)';
    }
});

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================
// SCROLL BUTTONS
// ==========================================
document.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const scrollContainer = btn.parentElement.querySelector('.anime-scroll');
        const scrollAmount = 400;

        if (btn.classList.contains('scroll-left')) {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    });
});

// ==========================================
// FILTER TABS
// ==========================================
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let filteredData;

        switch (filter) {
            case 'hindi-dubbed':
                filteredData = animeData.filter(a => a.language === 'Hindi Dubbed');
                break;
            case 'hindi-subbed':
                filteredData = animeData.filter(a => a.language === 'Hindi Subbed');
                break;
            case 'ongoing':
                filteredData = animeData.filter(a => a.status === 'ongoing');
                break;
            case 'completed':
                filteredData = animeData.filter(a => a.status === 'completed');
                break;
            case 'popular':
                filteredData = [...animeData].sort((a, b) => b.rating - a.rating);
                break;
            case 'movies':
                filteredData = movieData;
                break;
            case 'new':
                filteredData = animeData.filter(a => a.year >= 2024);
                break;
            default:
                filteredData = animeData;
        }

        renderAnimeGrid('recentlyUpdated', filteredData, 12);
    });
});

// ==========================================
// SCHEDULE TABS
// ==========================================
document.querySelectorAll('.schedule-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('ac
