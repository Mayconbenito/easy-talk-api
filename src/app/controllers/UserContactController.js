import { AddUserContactUseCase } from "../useCases/AddUserContactUseCase/AddUserContactUseCase";
import { RemoveUserContactUseCase } from "../useCases/RemoveUserContactUseCase/RemoveUserContactUseCase";
import { ShowUserContactsUseCase } from "../useCases/ShowUserContactsUseCase/ShowUserContactsUseCase";

export default {
  index: async (req, res, next) => {
    try {
      let { page, limit } = req.query;
      limit = parseInt(limit || 10);

      const showUserContactsUseCase = new ShowUserContactsUseCase()

      const response = await showUserContactsUseCase.execute({ page, limit })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
  store: async (req, res, next) => {
    try {
      const { id } = req.params;

      const addUserContactUseCase = new AddUserContactUseCase()

      const response = await addUserContactUseCase.execute({ userId: req.user.id, id })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const removeUserContactUseCase = new RemoveUserContactUseCase()

      const response = await removeUserContactUseCase.execute({ userId: req.user.id, id })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
};
