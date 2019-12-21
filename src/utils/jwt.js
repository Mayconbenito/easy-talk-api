import jwt from "jsonwebtoken";

const sign = (body, cert) =>
  new Promise((resolve, reject) => {
    jwt.sign(body, cert, { algorithm: "HS256" }, (err, token) => {
      if (err) {
        reject(err);
      }

      resolve(token);
    });
  });

const verify = (token, cert) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, cert, (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded);
    });
  });

export default {
  sign,
  verify
};
