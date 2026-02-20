module.exports = (io) => {

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // register user
  socket.on("register", (userId) => {
    socket.userId = userId;
    socket.join(userId);
  });

  // private chat handlers
  require("./chat.socket")(io, socket);

  // group chat handlers
  require("./groupchat.socket")(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
}