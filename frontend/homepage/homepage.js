async function loadUserProfile() {

  const username = localStorage.getItem("username");

  if (!username) {
    window.location.href = "http://localhost:3000/loginpage/loginpage.html";
    return;
  }

  try {
   const viewer = localStorage.getItem("username");

const response = await fetch(
  `http://localhost:3000/api/${username}?viewer=${viewer}`
);

    const data = await response.json();

    const user = data.channel;  

    // Set username (you can use fullname if you prefer)
    document.getElementById("usernameDisplay").textContent =
       user.username;

    // Set avatar
    if (user.avatar) {
      document.querySelector(".avatar").src = user.avatar;
    }

  } catch (error) {
    console.error("Error loading profile:", error);
    localStorage.removeItem("username");
    window.location.href = "http://localhost:3000/loginpage/loginpage.html";
  }
}



function goToSearch() {
  const query = document.getElementById("searchInput").value;

  if (!query) return;

  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

function goToChat() {
  window.location.href = "chat.html";
}

function goToRecruit() {
  window.location.href = "recruit.html";
}

function goToAllRecruiting() {
  window.location.href = "allRecruiting.html";
}

// function goToPost() {
//   window.open("post.html", "_blank");
// }
function goToPost() {
  window.location.href = "http://localhost:3000/post/post.html";
}

function goToExplore() {
  window.location.href = "http://localhost:3000/feed/feed.html";
}

function goToProfile() {

  const username = localStorage.getItem("username");

  if (!username) {
    window.location.href =
      "http://localhost:3000/loginpage/loginpage.html";
    return;
  }

  window.location.href =
    `http://localhost:3000/profile/profile.html?username=${username}`;
}






async function loadUpcomingGames() {

  const API_KEY = "d2baeb53430e46738e58026498e22258";
  const today = new Date().toISOString().split("T")[0];

  const response = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&dates=${today},2027-12-31&page_size=20`
  );

  const data = await response.json();
  const games = data.results;

  const container = document.getElementById("gamesContainer");
  container.innerHTML = "";

  for (let game of games) {

    if (!game.background_image) continue;

    const card = document.createElement("div");
    card.className = "game-card";

    // Fetch screenshots
    let screenshots = [];

    try {
      const shotRes = await fetch(
        `https://api.rawg.io/api/games/${game.id}/screenshots?key=${API_KEY}`
      );
      const shotData = await shotRes.json();

      screenshots = shotData.results.slice(0, 4).map(s => s.image);
    } catch (err) {
      console.log("No screenshots for", game.name);
    }

    card.innerHTML = `
      <div class="media-container">
        <img src="${game.background_image}" class="game-img"/>
      </div>

      <div class="game-info">
        <h3>${game.name}</h3>
        <p>Release: ${game.released || "TBA"}</p>
      </div>
    `;

    container.appendChild(card);

    //  HOVER SLIDESHOW
    let interval;
    let index = 0;

    card.addEventListener("mouseenter", () => {
      if (screenshots.length === 0) return;

      const img = card.querySelector(".game-img");

      interval = setInterval(() => {
        img.src = screenshots[index];
        index = (index + 1) % screenshots.length;
      }, 1500);
    });

    card.addEventListener("mouseleave", () => {
      clearInterval(interval);
      card.querySelector(".game-img").src = game.background_image;
      index = 0;
    });
  }
}
loadUserProfile();
loadUpcomingGames();