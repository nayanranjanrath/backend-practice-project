module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Attach userId when connecting
    socket.on("register", (userId) => {
      socket.userId = userId;
      socket.join(userId); // personal room
    });

    // Private message between two specific users
    socket.on("privateMessage", ({ senderId, receiverId, message }) => {

      // 🔐 Only allow communication between these two users
      const allowedUsers = ["user1", "user2"];

      if (
        allowedUsers.includes(senderId) &&
        allowedUsers.includes(receiverId)
      ) {
        const roomId = [senderId, receiverId].sort().join("-");

        io.to(roomId).emit("receiveMessage", {
          senderId,
          message,
        });
      }
    });

    // Join private room between two users
    socket.on("joinPrivateRoom", ({ user1, user2 }) => {
      const roomId = [user1, user2].sort().join("-");
      socket.join(roomId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
