const gamechatmodel =require("../models/gamechat.model")
  module.exports = (io, socket) => {

  socket.on("joinGameChat", async ({ gamechatid, userId }) => {
    try {

      const gamechat = await gamechatmodel.findById(gamechatid);
      if (!gamechat) return;

      const isRecruiter =
        gamechat.recruiter.toString() === userId;

      const isOtherPlayer =
        gamechat.otherplayer.some(
          id => id.toString() === userId
        );

      if (isRecruiter || isOtherPlayer) {

        const roomName = gamechat._id.toString(); // 
const gametittle =gamechat.gamename;
        socket.join(roomName);
 socket.emit("roomInfo", {gametittle})
    
        console.log("User joined:", roomName);
      } else {
        console.log("Unauthorized user");
      }

    } catch (err) {
      console.log(err);
    }
  });
socket.on("sendGameMessage", async ({ gamechatid, userId, message }) => {

  const gamechat = await gamechatmodel
    .findById(gamechatid)
    .populate("recruiter", "username")
    .populate("otherplayer", "username");

  if (!gamechat) return;

  let senderName = "";

  if (gamechat.recruiter._id.toString() === userId) {
    senderName = gamechat.recruiter.username;
  } else {
    const player = gamechat.otherplayer.find(
      p => p._id.toString() === userId
    );
    if (player) senderName = player.username;
  }

  const roomName = gamechat._id.toString();

  io.to(roomName).emit("receiveGameMessage", {
    senderId: userId,
    senderName,
    message
  });
});



};

