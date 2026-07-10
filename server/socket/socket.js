let users = {};

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // User joins
    socket.on("join", (userId) => {
      users[userId] = socket.id;

      console.log("Online Users:", users);

      io.emit("online-users", users);
    });

    // Call another user
    socket.on("call-user", (data) => {
      const targetSocket = users[data.to];

      if (targetSocket) {
        io.to(targetSocket).emit("incoming-call", {
          from: data.from,
          offer: data.offer,
        });
      }
    });

    // Answer a call
    socket.on("answer-call", (data) => {
      const callerSocket = users[data.to];

      if (callerSocket) {
        io.to(callerSocket).emit("call-answered", {
          answer: data.answer,
        });
      }
    });

    // Exchange ICE candidates
    socket.on("ice-candidate", (data) => {
      const targetSocket = users[data.to];

      if (targetSocket) {
        io.to(targetSocket).emit("ice-candidate", {
          candidate: data.candidate,
        });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      Object.keys(users).forEach((id) => {
        if (users[id] === socket.id) {
          delete users[id];
        }
      });

      io.emit("online-users", users);

      console.log("User Disconnected:", socket.id);
    });
  });
}