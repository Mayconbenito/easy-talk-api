const mongoose = require("../mongodb");

const sessionSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  status: { type: String, enum: ["online", "offline"], required: true }
});

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  contacts: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users" }
  ],
  session: { type: Object, default: sessionSchema }
});

module.exports = mongoose.model("Users", schema);
