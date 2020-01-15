import "dotenv/config";
import jwt from "../../utils/jwt";

export default async (socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error("NO_TOKEN_PROVIDED"));
  }

  jwt.verify(token, process.env.JWT_HASH, (err, decoded) => {
    if (err) {
      return next(new Error("INVALID_TOKEN"));
    }

    socket.token = { token, decoded };

    return next();
  });
};
