const { Schema, model } = require("mongoose");

const activityLogSchema = new Schema({
  task: { type: Schema.Types.ObjectId, ref: "task", required: true },
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  action: { type: String, required: true }, // e.g., "marked as done", "added comment"
  meta: { type: Object }, // optional: extra info
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("activitylog", activityLogSchema);
