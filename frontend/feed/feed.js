// ===============================
// NAVIGATION
// ===============================
function goHome() {
  window.location.href = "http://localhost:3000/homepage/homepage.html";
}
function goToProfile(username) {
  if (!username) return;

  window.location.href =
    `http://localhost:3000/profile/profile.html?username=${username}`;
}
function goToProfile(username) {

  if (!username) return;

  window.location.href =
    `http://localhost:3000/profile/profile.html?username=${username}`;
}
// ===============================
// LOAD USER PROFILE
// ===============================
async function loadUserProfile() {

  const username = localStorage.getItem("username");

  if (!username) {
    window.location.href = "http://localhost:3000/loginpage/loginpage.html";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/${username}`
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
    window.location.href = "login.html";
  }
}


// ===============================
// LOAD FEED
// ===============================
async function loadFeed() {

  const username = localStorage.getItem("username");

  if (!username) {
    window.location.href = "login.html";
    return;
  }

  try {

    const response = await fetch(
      `http://localhost:3000/api/game/feed/${username}`
    );

    const data = await response.json();

    if (!data.success) {
      console.error("Feed not loaded properly");
      return;
    }

    const posts = data.feed;
    const container = document.getElementById("feedContainer");
    container.innerHTML = "";

    if (!posts || posts.length === 0) {
      container.innerHTML = "<p>No posts available.</p>";
      return;
    }

    posts.forEach(post => {

      const card = document.createElement("div");
      card.className = "post-card";

      // ===== MULTIPLE IMAGES (ARRAY OF STRINGS) =====
      let imagesHTML = "";

      if (Array.isArray(post.postcontent)) {
        imagesHTML = post.postcontent
          .map(imgUrl => `
            <img src="${imgUrl}" class="post-img">
          `)
          .join("");
      }

      card.innerHTML = `
   <div class="post-header"
     onclick="goToProfile('${post.postby?.username}')">

  <img src="${post.postby?.avatar || 'avatar.png'}"
       class="post-avatar">

  <span class="post-username">
    ${post.postby?.username || "Unknown User"}
  </span>

</div>
        <div class="post-title">
          ${post.tittle}
        </div>

        ${post.description ? `
          <div class="post-description">
            ${post.description}
          </div>
        ` : ""}

        <div class="post-images">
          ${imagesHTML}
        </div>

        <div class="post-actions">
          <button class="like-btn">
            ❤️ ${post.likes || 0}
          </button>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading feed:", error);
  }
}

// ===============================
// INIT
// ===============================
loadUserProfile();

loadFeed();