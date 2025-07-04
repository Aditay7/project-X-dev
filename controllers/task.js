const Task = require("../models/task");

const CreateTask = async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, user: req.user._id });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const GetAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const UpdateTask = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, dueDate, priority, category } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(400).json({ message: "Task not found" });

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (category) task.category = category;

    const updatedTask = await task.save();
    res.status(200).json({
      message: "Task updated Successfully",
      task: {
        id: updatedTask._id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        dueDate: updatedTask.dueDate,
        priority: updatedTask.priority,
        category: updatedTask.category,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error while Updating Task", error });
  }
};

const DeleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.status(200).json({
      message: "Task is deleted Sucessfully",
      deletedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching Task", error });
  }
};

module.exports = {
  CreateTask,
  GetAllTasks,
  UpdateTask,
  DeleteTask,
};
