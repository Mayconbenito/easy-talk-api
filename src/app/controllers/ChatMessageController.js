import { SendChatMessageUseCase } from "../useCases/SendChatMessageUseCase/SendChatMessageUseCase";
import { ShowChatMessagesUseCase } from "../useCases/ShowChatMessagesUseCase/ShowChatMessagesUseCase";

export default {
  store: async (req, res, next) => {
    try {
      const { _id, message } = req.body;
      const { chatId } = req.params;

      const sendChatMessageUseCase = new SendChatMessageUseCase()

      const response = await sendChatMessageUseCase.execute({ userId: req.user.id, messageId: _id, chatId, message })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
  index: async (req, res, next) => {
    try {
      let { page, limit } = req.query;
      limit = parseInt(limit || 10);
      const { chatId } = req.params;

      const showChatMessagesUseCase = new ShowChatMessagesUseCase()

      const response = await showChatMessagesUseCase.execute({ page, limit, chatId })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
};
