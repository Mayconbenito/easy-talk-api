import { SearchUsersUseCase } from "../useCases/SearchUsersUseCase/SearchUsersUseCase";

export default {
  index: async (req, res, next) => {
    try {
      let { searchText, limit } = req.query;
      limit = parseInt(limit || 10);

      const searchUsersUseCase = new SearchUsersUseCase()

      const response = await searchUsersUseCase.execute({ userId: req.user.id, searchText, limit })

      return res.status(response.status).json(response)
    } catch (err) {
      return next(err);
    }
  },
};
