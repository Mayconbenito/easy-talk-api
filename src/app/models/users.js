const mongoose = require("../../config/mongodb");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  contacts: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users" }
  ],
  session: { type: Object }
});

module.exports = mongoose.model("Users", schema);
