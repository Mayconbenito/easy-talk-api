import Chats from "../models/chats";
import mongoose from "mongoose";

export default {
  index: async (req, res) => {
    try {
      let { page, limit } = req.query;
      limit = parseInt(limit || 10);
      const { chatId } = req.params;

      const [chat] = await Chats.aggregate([
        {
          $match: {
            _id: new mongoose.mongo.ObjectId(chatId)
          }
        },
        {
          $unwind: "$messages"
        },
        {
          $sort: {
            "messages.createdAt": -1
          }
        },
        {
          $group: {
            messages: {
              $push: "$messages"
            },
            _id: 1
          }
        },
        {
          $project: {
            _id: 0,
            messages: 1
          }
        }
      ]);

      const total = await Chats.aggregate([
        { $project: { _id: 1, count: { $size: "$messages" } } }
      ]);

      const messages = chat.messages.slice(
        limit * page - limit,
        limit * page + limit - limit
      );

      const meta = {
        total: total[0].count,
        items: messages.length
      };

      return res.json({ meta, messages });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
