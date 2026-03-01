document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      message.style.color = "green";
      message.textContent = "Login successful!";
      
      
      // window.location.href = "dashboard.html";
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Login failed.";
    }

  } catch (error) {
    message.style.color = "red";
    message.textContent = "Server error. Please try again.";
  }
});