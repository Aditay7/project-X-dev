const Task = require("../models/task");

const checkTaskRole = (requiredRoles) => async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const collaborator = task.collaborators.find(
      (c) => c.userId.toString() === req.user.id
    );

    if (!collaborator || !requiredRoles.includes(collaborator.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.task = task;
    req.userRole = collaborator.role;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { checkTaskRole };
