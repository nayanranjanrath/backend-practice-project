const myUsername = localStorage.getItem("username");

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

async function loadConnections() {
    const container = document.getElementById("followersList");
    container.innerHTML = "<p style='color: #9ca3af; text-align: center;'>Syncing your network...</p>";

    try {
        // 1. Fetch Allies (POST)
        const alliesResponse = await fetch(`http://localhost:3000/api/username/allies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: myUsername })
        });
        const alliesData = await alliesResponse.json();
        
        /** * NESTED MATCHING LOGIC:
         * Since your data is { user: { username: "..." }, id: "..." },
         * we map to get the username inside that user object.
         */
        const allyUsernames = (alliesData.allies || []).map(item => item.user.username);

        // 2. Fetch All Followers (POST)
        const followersResponse = await fetch(`http://localhost:3000/api/user/followers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: myUsername })
        });
        const followersData = await followersResponse.json();

        if (!followersData.success || !followersData.followers) {
            container.innerHTML = "<p style='text-align: center;'>No followers found.</p>";
            return;
        }

        container.innerHTML = ""; 

        followersData.followers.forEach(follower => {
            // Check if the follower's username exists in our extracted allyUsernames array
            const isAlly = allyUsernames.includes(follower.username);
            
            const card = document.createElement("div");
            card.className = "follower-card";
            
            card.onclick = (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    window.location.href = `/profile/profile.html?username=${follower.username}`;
                }
            };

            card.innerHTML = `
                <div class="user-info">
                    <img src="${follower.avatar || 'https://via.placeholder.com/50'}" class="avatar">
                    <span class="username-label">${follower.username}</span>
                </div>
                <div class="action-slot">
                    ${isAlly ? 
                        `<span class="ally-badge">Allies</span>` : 
                        `<button class="btn-follow" onclick="processFollow('${follower.username}')">Follow</button>`
                    }
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Fetch error:", error);
        showToast("Server connection failed.");
    }
}

async function processFollow(targetUser) {
    try {
        const response = await fetch(`http://localhost:3000/api/${targetUser}/follow`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: myUsername })
        });

        if (response.ok) {
            showToast(`Now following ${targetUser}!`);
            loadConnections(); 
        }
    } catch (err) {
        showToast("Error processing follow.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (myUsername) {
        document.getElementById("currentUsername").textContent = myUsername;
        loadConnections();
    } else {
        showToast("Please login first.");
    }
});