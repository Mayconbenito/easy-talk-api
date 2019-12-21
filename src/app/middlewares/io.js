import "dotenv/config";

export default async (socket, next) => {
  const authorizationHeader = socket.handshake.query.jwt;
  if (!authorizationHeader) {
    return next(new Error("NO_TOKEN_PROVIDED"));
  }

  return next();
};
