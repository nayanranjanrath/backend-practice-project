const recruitmentmodel= require("../models/recruitment.model")


module.exports = (io, socket) => {
    // Join recruitment chat
    socket.on("joinRecruitmentChat", async (recruitmentId) => {

      try {
        const recruitment = await recruitmentmodel.findById(recruitmentId);

        if (!recruitment) return;

        // Check if user is recruiter or applicant
        if (
          recruitment.recruiter.toString() === socket.userId ||
          recruitment.applicant.toString() === socket.userId
        ) {
          socket.join(recruitmentId);
          console.log("User joined recruitment room");
        } else {
          console.log("Unauthorized user tried to join");
        }

      } catch (err) {
        console.log("you are inside catch block of join chat")
        console.log(err);
      }
    });

    // Send message inside recruitment chat
    socket.on("sendRecruitmentMessage", async ({ recruitmentId, message }) => {

      const recruitment = await Recruitment.findById(recruitmentId);
      if (!recruitment) return;

      // Security check again
      if (
        recruitment.recruiter.toString() === socket.userId ||
        recruitment.applicant.toString() === socket.userId
      ) {
        io.to(recruitmentId).emit("receiveRecruitmentMessage", {
          senderId: socket.userId,
          message,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

  };

