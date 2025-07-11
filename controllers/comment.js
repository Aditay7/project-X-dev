const Comment = require("../models/comment");
const ActivityLog = require("../models/activityLog");

const AddComment = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;
    const taskId = req.params.taskId;
    const comment = await Comment.create({
      task: taskId,
      user: userId,
      message,
    });
    // Log activity
    await ActivityLog.create({
      task: taskId,
      user: userId,
      action: "added comment",
      meta: { commentId: comment._id, message },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetComments = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const comments = await Comment.find({ task: taskId })
      .populate("user", "name avatar")
      .sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { AddComment, GetComments };
