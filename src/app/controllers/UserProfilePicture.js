import Users from "../models/users";

export default {
  put: async (req, res) => {
    try {
      if (
        !req.file ||
        !req.file.secure_url ||
        !req.file.width ||
        !req.file.height
      ) {
        return res.status(400).json({ code: "ERROR_WHEN_UPLOADING_FILE" });
      }

      const { secure_url: secureURL, width, height } = req.file;

      await Users.updateOne(
        { _id: req.user.id },
        { picture: { url: secureURL, width, height } }
      );

      const user = await Users.findById(req.user.id);

      return res.json({ user });
    } catch (e) {
      console.log("Error", e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
