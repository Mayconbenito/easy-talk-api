import User from "../../models/User";
import cloudinary from "cloudinary";
import { promisify } from "util";

export class UpdateUserProfilePicture {
  async execute(data) {
    if (
      !data.file ||
      !data.file.secure_url ||
      !data.file.width ||
      !data.file.height
    ) {
      return { status: 400, code: "ERROR_WHEN_UPLOADING_FILE" };
    }

    const { secure_url: secureURL, width, height } = data.file;

    let user = await User.findById(data.userId).select("picture");

    // delete old image from cloudinary
    if (user.picture) {
      const splitedUrl = user.picture.url.split("/");
      const [imagePublicId] = splitedUrl[splitedUrl.length - 1].split(".");

      await promisify(cloudinary.v2.uploader.destroy)(
        `images/${imagePublicId}`
      );
    }

    await User.updateOne(
      { _id: data.userId },
      { picture: { url: secureURL, width, height } }
    );

    user = await User.findById(data.userId);

    return { status: 200, user };
  }
}
