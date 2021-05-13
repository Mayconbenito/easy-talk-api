import { UpdateUserProfilePicture } from "../useCases/UpdateUserProfilePicture/UpdateUserProfilePicture";

export default {
  put: async (req, res, next) => {
    try {
      const updateUserProfilePicture = new UpdateUserProfilePicture()

      const response = await updateUserProfilePicture.execute({ file: req.file })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
};
