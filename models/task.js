const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String, // eg. Work , Personal, School
    },
    collaborators: [
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    role: { type: String, enum: ['owner', 'editor', 'viewer'], required: true }
  }
],
  },
  { timestamps: true }
);

const Task = model("task", taskSchema);

module.exports = Task;
