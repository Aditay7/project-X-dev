const ActivityLog = require("../models/activityLog");

const GetActivityLogs = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const logs = await ActivityLog.find({ task: taskId })
      .populate("user", "name avatar")
      .sort({ createdAt: 1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { GetActivityLogs };
