import jwt from "jsonwebtoken";
import "dotenv/config";

export default (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).send({ error: "NO_TOKEN_PROVIDED" });
  }

  const parts = authorizationHeader.split(" ");

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "MALFORMATTED_TOKEN" });
  }

  jwt.verify(token, process.env.JWT_HASH, (err, decoded) => {
    if (err) return res.status(401).send({ error: "INVALID_TOKEN" });
    req.user = { id: decoded.id };
    return next();
  });
};
