import { LoginUserUseCase } from "../useCases/LoginUserUseCase/LoginUserUseCase";

export default {
  store: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const loginUserUseCase = new LoginUserUseCase()

      const response = await loginUserUseCase.execute({ email, password })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
};
