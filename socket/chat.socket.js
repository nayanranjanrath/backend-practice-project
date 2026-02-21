const alliesmodel = require('../models/allais.model');
const usermodel = require('../models/usermodel');


module.exports = (io, socket) => {

  // Private message between two specific users
  socket.on("privateMessage", async ({ senderId, receiverId, message }) => {
    console.log("working")
    //  Only allow communication between these two users
    const allowedUsers = await alliesmodel.findOne({
      $or: [
        { allie1: senderId, allie2: receiverId },
        { allie1: receiverId, allie2: senderId }
      ]
    });

    if (allowedUsers

    ) {
      const roomId = [senderId, receiverId].sort().join("-");

      io.to(roomId).emit("receiveMessage", {
        senderId,
        message,

      });
      console.log("Joining room:", roomId);
    }
  });



  // Join private room between two users
  socket.on("joinPrivateRoom", async({ user1, user2 }) => {
const user1data =await usermodel.findById(user1)
const user2data =await usermodel.findById(user2)
    const roomId = [user1, user2].sort().join("-");
    socket.join(roomId);
     socket.emit("roomInfo", {
    roomId,
    user1name: user1data.username,
    user2name: user2data.username
  });
    
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
};

