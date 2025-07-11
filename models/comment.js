const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  task: { type: Schema.Types.ObjectId, ref: "task", required: true },
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("comment", commentSchema);
