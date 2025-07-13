const Task = require("../models/task");
const ActivityLog = require("../models/activityLog");
const mongoose = require("mongoose");

// Overview: total, completed, overdue, completion rate
const getOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const total = await Task.countDocuments({ user: userId });
    const completed = await Task.countDocuments({
      user: userId,
      status: "completed",
    });
    const overdue = await Task.countDocuments({
      user: userId,
      status: { $ne: "completed" },
      dueDate: { $lt: now },
    });
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    res.json({ total, completed, overdue, completionRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Completed tasks per day (last 7/30 days)
const getCompletedPerDay = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 7;
    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    const logs = await ActivityLog.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          action: "marked as done",
          createdAt: { $gte: from },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Average completion time (in hours)
const getAverageCompletionTime = async (req, res) => {
  try {
    const userId = req.user._id;
    const completedTasks = await Task.find({
      user: userId,
      status: "completed",
    });
    let totalHours = 0;
    let count = 0;
    completedTasks.forEach((task) => {
      if (task.createdAt && task.dueDate) {
        const hours = (task.dueDate - task.createdAt) / (1000 * 60 * 60);
        totalHours += hours;
        count++;
      }
    });
    const avgHours = count > 0 ? totalHours / count : 0;
    res.json({ averageCompletionTimeHours: avgHours });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Productivity streak (consecutive days with at least one completed task)
const getProductivityStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await ActivityLog.find({
      user: userId,
      action: "marked as done",
    }).sort({ createdAt: -1 });
    let streak = 0;
    let lastDate = null;
    for (const log of logs) {
      const logDate = log.createdAt.toISOString().slice(0, 10);
      if (!lastDate) {
        lastDate = logDate;
        streak = 1;
      } else {
        const prev = new Date(lastDate);
        prev.setDate(prev.getDate() - 1);
        if (logDate === prev.toISOString().slice(0, 10)) {
          streak++;
          lastDate = logDate;
        } else if (logDate !== lastDate) {
          break;
        }
      }
    }
    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tasks by status
const getTasksByStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const statuses = ["pending", "in-progress", "completed"];
    const counts = {};
    for (const status of statuses) {
      counts[status] = await Task.countDocuments({ user: userId, status });
    }
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOverview,
  getCompletedPerDay,
  getAverageCompletionTime,
  getProductivityStreak,
  getTasksByStatus,
};
