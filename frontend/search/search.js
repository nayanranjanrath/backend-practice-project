const RAWG_KEY = "d2baeb53430e46738e58026498e22258";

function goHome() { window.location.href = "/homepage/homepage.html"; }

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 3000);
}

function getQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q");
}

function searchGame() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;
    window.history.pushState({}, "", `?q=${query}`);
    loadSearch(query);
}

async function loadSearch(queryParam) {
    const query = queryParam || getQuery();
    if (!query) return;

    const container = document.getElementById("gamesContainer");
    container.innerHTML = "<p>Scanning local database...</p>";

    try {
        // 1. Try Backend
        const res = await fetch(`http://localhost:3000/api/games/${query}`);
        let games = await res.json();
        let isFallback = false;

        // 2. Fallback Logic: If DB has no results or returns your custom error message
        if (!games || games.length === 0 || games.success === false || games.reson) {
            isFallback = true;
            const rawgSearch = await fetch(`https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=1`);
            const rawgData = await rawgSearch.json();

            if (!rawgData.results || rawgData.results.length === 0) {
                container.innerHTML = "<p>Game not found anywhere.</p>";
                return;
            }

            games = rawgData.results.map(g => ({
                gamename: g.name,
                averageStars: g.rating,
                totalRatings: g.ratings_count,
                review: "Official RAWG profile. No community reviews yet.",
                isRawg: true
            }));
        }

        container.innerHTML = "";

        for (const game of games) {
            let backgroundImage = 'https://via.placeholder.com/300x200?text=No+Image';
            let description = "Description loading...";
            let screenshotsHtml = "";

            try {
                // Fetch Details using Game Name
                const sRes = await fetch(`https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(game.gamename)}&page_size=1`);
                const sData = await sRes.json();
                
                if (sData.results && sData.results.length > 0) {
                    const found = sData.results[0];
                    backgroundImage = found.background_image;
                    
                    const detailRes = await fetch(`https://api.rawg.io/api/games/${found.id}?key=${RAWG_KEY}`);
                    const detailData = await detailRes.json();
                    description = detailData.description_raw?.substring(0, 350) + "..." || "No description available.";

                    const ssRes = await fetch(`https://api.rawg.io/api/games/${found.id}/screenshots?key=${RAWG_KEY}`);
                    const ssData = await ssRes.json();
                    if (ssData.results) {
                        screenshotsHtml = ssData.results.map(ss => `<img src="${ss.image}" alt="ss">`).join('');
                    }
                }
            } catch (e) { console.error("RAWG secondary fetch failed", e); }

            const badge = isFallback || game.isRawg 
                ? `<div class="source-tag rawg">Official RAWG Data</div>` 
                : `<div class="source-tag community">Verified Community</div>`;

            const card = document.createElement("div");
            card.className = "game-card";
            card.innerHTML = `
                <div class="card-left">
                    <img src="${backgroundImage}" class="game-logo">
                    <div class="game-name">${game.gamename}</div>
                    ${badge}
                </div>
                <div class="card-right">
                    <div class="stats-row">
                        <div class="rating">⭐ ${game.averageStars || 'N/A'}</div>
                        <div>${game.totalRatings || 0} Ratings</div>
                    </div>
                    <div class="game-description">${description}</div>
                    <div class="game-review">
                        <strong>Review:</strong><br>"${game.review}"
                    </div>
                    <div class="screenshot-slider">
                        <div class="screenshot-gallery">${screenshotsHtml || '<p>No screenshots.</p>'}</div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }
        showToast(isFallback ? "Loaded from RAWG" : "Found in Community DB");
    } catch (err) {
        container.innerHTML = "<p>Error connecting to service.</p>";
    }
}

document.getElementById("searchInput").addEventListener("keypress", (e) => { if (e.key === "Enter") searchGame(); });
loadSearch();