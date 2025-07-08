const Notification = require("../models/notification");
const User = require("../models/user");
const Task = require("../models/task");
const admin = require("../firebase");

const CreateNotification = async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    if (!userId || !taskId) {
      return res
        .status(400)
        .json({ message: "userId and taskId are required" });
    }

    // Fetch user and task
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      return res.status(404).json({ message: "User or FCM token not found" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Build dynamic notification
    const notificationTitle = `Task Due Soon: ${task.title}`;
    const notificationBody = `Your task '${
      task.title
    }' is due on ${task.dueDate.toLocaleDateString()}.`;

    const message = {
      token: user.fcmToken,
      notification: {
        title: notificationTitle,
        body: notificationBody,
      },
      data: {
        taskId: task._id.toString(),
        dueDate: task.dueDate.toISOString(),
      },
    };

    // Send notification
    const response = await admin.messaging().send(message);
    return res
      .status(200)
      .json({ message: "Notification sent successfully", response });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to send notification", error: error.message });
  }
};

const GetAllNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!notification) return res.status(404).json({ message: "Not found" });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const MarkAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const MarkAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const DeleteNotification = async (req, res) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  CreateNotification,
  GetAllNotification,
  GetNotificationById,
  MarkAsRead,
  MarkAllAsRead,
  DeleteNotification,
};
