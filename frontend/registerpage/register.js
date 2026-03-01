console.log("JS Loaded");

document.getElementById("registerForm").addEventListener("submit", async function(e) {
  e.preventDefault();
console.log("inside the submit ");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const username = document.getElementById("username").value.trim();
  const fullname = document.getElementById("fullname").value.trim();
  const avatar = document.getElementById("avatar").files[0];

  const message = document.getElementById("message");

  // Create FormData object
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("username", username);

  if (fullname) {
    formData.append("fullname", fullname);
  }

  if (avatar) {
    formData.append("avatar", avatar);
  }

  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      message.style.color = "lightgreen";
      message.textContent = "Registration successful!";
      document.getElementById("registerForm").reset();
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Registration failed.";
    }

  } catch (error) {
    message.style.color = "red";
    message.textContent = "Server error. Please try again.";
  }
});