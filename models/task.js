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
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          required: true,
        },
      },
    ],
    // Recurrence fields
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "custom"],
      default: "none",
    },
    recurrenceInterval: {
      type: Number, // e.g., every 2 days/weeks/months
      default: 1,
    },
    recurrenceEndDate: {
      type: Date, // when to stop recurring
    },
    recurrenceDaysOfWeek: [
      {
        type: Number, // 0 (Sunday) - 6 (Saturday), for weekly pattern
      },
    ],
    recurrenceCustomDates: [
      {
        type: Date, // for custom recurrence dates
      },
    ],
  },
  { timestamps: true }
);

const Task = model("task", taskSchema);

module.exports = Task;
