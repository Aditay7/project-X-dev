const { Schema, model } = require("mongoose");

const subTaskSchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);


const subTask = model('subtask', subTaskSchema);

module.exports = subTask;