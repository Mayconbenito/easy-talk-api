import User from "../app/models/User";
import WebSocket from "../app/models/WebSocket";

let io;
function setupWS(server) {
  io = server;
  io.on("connection", async (socket) => {
    const { decoded, token } = socket.session;

    // When the socket connects invalidate every other socket and set the new socket status to active
    await WebSocket.updateMany(
      { token, userId: decoded.id },
      {
        status: "inactive",
      }
    );

    await WebSocket.create({
      token,
      socketId: socket.id,
      userId: decoded.id,
      status: "active",
    });

    socket.on("disconnect", async () => {
      // When the socket disconnect set the socket status to inactive
      await WebSocket.findOneAndUpdate(
        { socketId: socket.id },
        {
          status: "inactive",
        }
      );
    });
  });
}

async function sendMessage(reciverId, data) {
  try {
    const reciver = await User.findOne(reciverId).select("_id");

    if (reciver) {
      const webSocket = await WebSocket.findOne({
        userId: reciverId,
        status: "active",
      });

      if (webSocket) {
        io.to(webSocket.socketId).emit("message", data);
      }
    }
  } catch (err) {
    console.log("Error when trying to send realtime message", err);
  }
}

export { setupWS, sendMessage };
