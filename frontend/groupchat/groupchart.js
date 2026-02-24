// Connect to backend
const socket = io("http://localhost:3000");

// Get URL params
const urlParams = new URLSearchParams(window.location.search);
const gamechatid = urlParams.get("gamechatid");
const userId = urlParams.get("userid");


// http://localhost:3000/groupchat/groupchatfrontend.html?gamechatid=699c22d304326e6835bf8c1c&userid=697edb4ffdd2a17623f4f443


// DOM elements
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");


// Basic validation
if (!gamechatid || !userId) {
  alert("Missing chat id or user id in URL");
}

// Show title
socket.on("roomInfo", (data) => {
  const chatTitle = document.getElementById("chattittle");
  chatTitle.textContent = data.gametittle;
});

// Join chat room
socket.emit("joinGameChat", {
  gamechatid: gamechatid,
  userId: userId
});

// Send message
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  socket.emit("sendGameMessage", {
    gamechatid: gamechatid,
    userId: userId,
    message: message
  });

  messageInput.value = "";
}

// Receive message
socket.on("receiveGameMessage", (data) => {

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  if (data.senderId === userId) {
    messageDiv.classList.add("sent");
  } else {
    messageDiv.classList.add("received");
  }

  messageDiv.innerHTML = `<strong>${data.senderName}</strong><br>${data.message}`;

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});