import { RegisterUserUseCase } from "../useCases/RegisterUserUseCase/RegisterUserUseCase";
import { ShowUserProfileUseCase } from "../useCases/ShowUserProfileUseCase/ShowUserProfileUseCase";

export default {
  show: async (req, res, next) => {
    try {
      const { id } = req.params;

      const showUserProfileUseCase = new ShowUserProfileUseCase()

      const response = await showUserProfileUseCase.execute({ userId: req.user.id, id, isMe: req.path.split("/")[1] === "me" })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
  store: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const registerUserUseCase = new RegisterUserUseCase()

      const response = await registerUserUseCase.execute({ username, email, password })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
};
