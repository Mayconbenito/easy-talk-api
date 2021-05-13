import generateHash from "../../../helpers/crypto";
import jwt from "../../../helpers/jwt";
import User from "../../models/User";

export class LoginUserUseCase {
  async execute(data) {
    const passwordHash = await generateHash(process.env.APP_KEY, data.password);

    const user = await User.findOne({
      email: data.email,
      password: passwordHash,
    }).select("-contacts +email");

    if (!user) {
      return { status: 401, code: "INVALID_CREDENTIALS" };
    }

    const jwtToken = await jwt.sign({ id: user._id }, process.env.JWT_HASH);
    const wsToken = await jwt.sign(
      { id: user._id, type: "WS" },
      process.env.JWT_HASH
    );

    await User.updateOne(
      { _id: user._id },
      {
        ws: { token: wsToken, createdAt: Date.now() },
      }
    );

    return { status: 200, user, jwt: jwtToken, wsToken }
  }
}
