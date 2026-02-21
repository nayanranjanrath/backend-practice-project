// Connect to backend
const socket = io("http://localhost:3000");

const params = new URLSearchParams(window.location.search);

const senderId = params.get("sender");
const receiverId = params.get("receiver");

// http://localhost:3000/privetchat/privetchatfrontend.html?sender=697edb4ffdd2a17623f4f443&receiver=6977417a5ff4bdf6cb6a918f

// 6977417a5ff4bdf6cb6a918f
// 697edb4ffdd2a17623f4f443
socket.on("roomInfo", (data) => {
  const chatTitle = document.getElementById("chattittle");
  chatTitle.textContent = `${data.user1name}-${data.user2name}`;
});

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Join private room
socket.emit("joinPrivateRoom", {
  user1: senderId,
  user2: receiverId

});

// Send message
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  socket.emit("privateMessage", {
    senderId,
    receiverId,
    message
  });

  addMessage(message, "sent");
  messageInput.value = "";
}

// Receive message
socket.on("receiveMessage", ({ senderId: incomingSenderId, message }) => {
  if (incomingSenderId !== senderId) {
    addMessage(message, "received");
  }
});

function addMessage(message, type) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);
  msgDiv.textContent = message;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}