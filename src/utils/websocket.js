import Users from "../app/models/users";

let io;
function setupWS (server) {
  io = server;
  io.on("connection", async socket => {
    const { decoded } = socket.session;

    // When the socket connect set the socket status to active
    await Users.findOneAndUpdate(
      { _id: decoded.id },
      {
        ws: {
          socket: { id: socket.id, status: "active", createdAt: Date.now() }
        }
      }
    );

    socket.on("disconnect", async () => {
      // When the socket disconnect set the socket status to unactive
      await Users.findOneAndUpdate(
        { "ws.socket.id": socket.id },
        {
          ws: {
            socket: { id: socket.id, status: "unactive", createdAt: Date.now() }
          }
        }
      );
    });
  });
}

async function sendMessage (reciverId, data) {
  try {
    const reciver = await Users.findOne(reciverId).select("+ws");

    if (reciver.ws.socket.status === "active") {
      const socketId = reciver.ws.socket.id;

      io.to(socketId).emit("message", data);
    }
  } catch (err) {
    console.log("Error when trying to send realtime message", err);
  }
}

export { setupWS, sendMessage };
