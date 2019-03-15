const mongoose = require("../mongodb");

const sessionSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  status: { type: String, enum: ["online", "offline"], required: true },
  createdAt: { type: Date, default: Date.now }
});

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  contacts: { type: Array, required: true, ref: "Users" },
  session: { sessionSchema }
});

module.exports = mongoose.model("Users", schema);
