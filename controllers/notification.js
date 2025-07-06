const admin = require("../firebase");
const Notification = require("../models/notification");
const User = require("../models/user");

const CreateNotification = async (req, res) => {
  try {
    const { user, title, message, type } = req.body;

    // 1. Save notification in DB
    const notification = new Notification({ user, title, message, type });
    await notification.save();

    // 2. Send FCM Push Notification4
    const recipient = await User.findById(user);
    if (recipient?.fcmToken) {
      const payload = {
        notification: {
          title: title,
          body: message,
        },
        token: recipient.fcmToken,
      };

      admin
        .messaging()
        .send(payload)
        .then((response) => {
          console.log("Successfully sent push notification:", response);
        })
        .catch((error) => {
          console.error("Error sending push notification:", error);
        });
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
