import "dotenv/config";
import jwt from "../../helpers/jwt";

export default async (socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error("NO_TOKEN_PROVIDED"));
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_HASH);
    socket.session = { token, decoded };

    next();
  } catch (err) {
    console.log(err);
    return next(new Error("INVALID_TOKEN"));
  }
};
