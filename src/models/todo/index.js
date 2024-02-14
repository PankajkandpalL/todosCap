const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "active"},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    datetimestamps: true,
  }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
