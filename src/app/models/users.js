import mongoose from "../../config/mongodb";

const wsSchema = new mongoose.Schema({
  type: Object,
  token: String,
  socket: {
    id: String,
    createdAt: Date
  },
  createdAt: Date
});

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  contacts: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users" }
  ],
  ws: { type: wsSchema, select: false }
});

export default mongoose.model("Users", schema);
