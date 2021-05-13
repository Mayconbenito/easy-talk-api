import generateHash from "../../../helpers/crypto";
import jwt from "../../../helpers/jwt";
import User from "../../models/User";

export class RegisterUserUseCase {
  async execute(data) {
    const findUser = await User.findOne({ email: data.email });

    if (findUser) {
      return { status: 400, code: "EMAIL_ALREADY_USED" };
    }

    const passwordHash = await generateHash(process.env.APP_KEY, data.password);

    const user = await User.create({
      name: data.username,
      email: data.email,
      password: passwordHash,
    });

    user.contacts = undefined;
    user.password = undefined;

    const jwtToken = await jwt.sign({ id: user._id }, process.env.JWT_HASH);

    return { status: 200, user, jwt: jwtToken };
  }
}
