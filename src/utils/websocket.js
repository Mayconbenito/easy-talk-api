import User from "../app/models/User";

let io;
function setupWS (server) {
  io = server;
  io.on("connection", async socket => {
    const { decoded, token } = socket.session;

    // When the socket connect set the socket status to active
    await User.findOneAndUpdate(
      { _id: decoded.id },
      {
        $push: {
          ws: {
            token,
            socket: { id: socket.id, status: "active", createdAt: Date.now() }
          }
        }
      }
    );

    socket.on("disconnect", async () => {
      // When the socket disconnect set the socket status to unactive
      await User.findOneAndUpdate(
        { "ws.socket.id": socket.id },
        {
          $pull: {
            ws: {
              "socket.id": socket.id
            }
          }
        },

      );
    });
  });
}

async function sendMessage (reciverId, data) {
  try {
    const reciver = await User.findOne(reciverId).select("+ws");

    if (reciver && reciver.ws) {
      reciver.ws.forEach(async ({ socket }) => {
        if (socket.status === "active") {
          io.to(socket.id).emit("message", data);
        }
      })
    }
  } catch (err) {
    console.log("Error when trying to send realtime message", err);
  }
}

export { setupWS, sendMessage };
