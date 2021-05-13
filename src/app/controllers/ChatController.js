import { CreateChaseUseCase } from "../useCases/CreateChatUseCase/CreateChatUseCase";
import { ShowUserChatsUseCase } from "../useCases/ShowUserChatsUseCase/ShowUserChatsUseCase";

export default {
  store: async (req, res, next) => {
    try {
      const { participants } = req.body;

      const createChatUseCase = new CreateChaseUseCase()

      const response = await createChatUseCase.execute({ participants, userId: req.user.id })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
  index: async (req, res, next) => {
    try {

      const showUserChatsUseCase = new ShowUserChatsUseCase()

      const response = await showUserChatsUseCase.execute({ userId: req.user.id })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
};
