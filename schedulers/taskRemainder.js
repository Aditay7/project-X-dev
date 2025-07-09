const cron = require("node-cron");
const Task = require("../models/task");
const User = require("../models/user");
const admin = require("../firebase");

// Runs every minute (for testing)
cron.schedule("0 8 * * *", async () => {
  const start = Date.now();
  console.log("Running task reminder job...");
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  // Find tasks due tomorrow
  const tasks = await Task.find({
    dueDate: {
      $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
      $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
    },
  }).populate("user");

  console.log("Found", tasks.length, "tasks due tomorrow");

  const notificationPromises = tasks.map(async (task) => {
    const user = task.user;
    if (user && user.fcmToken) {
      console.log(
        "Sending notification to",
        user._id,
        "with token",
        user.fcmToken
      );
      const message = {
        token: user.fcmToken,
        notification: {
          title: `Task Due Soon: ${task.title}`,
          body: `Your task '${
            task.title
          }' is due on ${task.dueDate.toLocaleDateString()}.`,
        },
        data: {
          taskId: task._id.toString(),
          dueDate: task.dueDate.toISOString(),
        },
      };
      try {
        await admin.messaging().send(message);
        console.log(
          `Notification sent to user ${user._id} for task ${task._id}`
        );
      } catch (err) {
        console.error(
          `Failed to send notification to user ${user._id}:`,
          err.message
        );
      }
    } else {
      console.log("User or FCM token missing for task", task._id);
    }
  });

  await Promise.all(notificationPromises);
  console.log("Task reminder job finished in", Date.now() - start, "ms");
});
