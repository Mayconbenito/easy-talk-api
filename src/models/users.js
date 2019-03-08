const mongoose = require("../mongodb");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  contacts: { type: Array, required: true, ref: "Users" }
});

module.exports = mongoose.model("Users", schema);
