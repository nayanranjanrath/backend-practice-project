// ===============================
// NAVIGATION
// ===============================
function goHome() {
  window.location.href = "http://localhost:3000/homepage/homepage.html";
}

// ===============================
// LOAD USER (USERNAME ONLY)
// ===============================
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
    window.location.href = "login.html";
  }
}

loadUserProfile();


// ===============================
// IMAGE PREVIEW
// ===============================
const imageInput = document.getElementById("images");
const previewContainer = document.getElementById("imagePreview");

if (imageInput) {
  imageInput.addEventListener("change", () => {

    previewContainer.innerHTML = "";

    const files = imageInput.files;

    for (let i = 0; i < files.length; i++) {

      const reader = new FileReader();

      reader.onload = function(e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        previewContainer.appendChild(img);
      };

      reader.readAsDataURL(files[i]);
    }
  });
}


// ===============================
// SUBMIT POST
// ===============================
const postForm = document.getElementById("postForm");

if (postForm) {

  postForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = localStorage.getItem("username");

    if (!username) {
      window.location.href = "http://localhost:3000/loginpage/loginpage.html";
      return;
    }

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title) {
      alert("Title is required");
      return;
    }

    const formData = new FormData();

    // Match backend field names EXACTLY
    formData.append("tittle", title);
    formData.append("description", description);
    formData.append("username", username);

    const files = imageInput.files;

    for (let i = 0; i < files.length; i++) {
      formData.append("postcontent", files[i]);
    }

    try {

      const response = await fetch(
        "http://localhost:3000/api/post",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Post created successfully!");

        // Clear form
        postForm.reset();
        previewContainer.innerHTML = "";

        // Redirect to explore page
        window.location.href =
          "http://localhost:3000/feed/feed.html";
      }
      else {
        alert("Failed to create post");
      }

    } catch (error) {
      console.error("Error creating post:", error);
      alert("Something went wrong");
    }

  });

}