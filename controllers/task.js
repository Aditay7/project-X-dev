const Task = require("../models/task");

const CreateTask = async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      user: req.user._id,
      collaborators: [{ userId: req.user._id, role: "owner" }],
      // Recurrence fields
      isRecurring: req.body.isRecurring || false,
      recurrencePattern: req.body.recurrencePattern || "none",
      recurrenceInterval: req.body.recurrenceInterval || 1,
      recurrenceEndDate: req.body.recurrenceEndDate,
      recurrenceDaysOfWeek: req.body.recurrenceDaysOfWeek || [],
      recurrenceCustomDates: req.body.recurrenceCustomDates || [],
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const GetAllTasks = async (req, res) => {
  const userId = req.user._id;
  try {
    const {
      status,
      priority,
      category,
      search,
      sortBy,
      sortOrder = "asc",
      dueDateFrom,
      dueDateTo,
    } = req.query;

    const query = { user: userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (dueDateFrom || dueDateTo) {
      if (dueDateFrom) query.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) query.dueDate.$lte = new Date(dueDateTo);
    }

    const sortField = sortBy || "dueDate";
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    const tasks = await Task.find(query).sort({ [sortField]: sortDirection });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const UpdateTask = async (req, res) => {
  const taskId = req.params.id;
  const {
    title,
    description,
    status,
    dueDate,
    priority,
    category,
    isRecurring,
    recurrencePattern,
    recurrenceInterval,
    recurrenceEndDate,
    recurrenceDaysOfWeek,
    recurrenceCustomDates,
  } = req.body;

  try {
    const task = await Task.findById(taskId, { new: true });
    if (!task) return res.status(400).json({ message: "Task not found" });

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (category) task.category = category;
    // Recurrence fields
    if (typeof isRecurring !== "undefined") task.isRecurring = isRecurring;
    if (recurrencePattern) task.recurrencePattern = recurrencePattern;
    if (recurrenceInterval) task.recurrenceInterval = recurrenceInterval;
    if (recurrenceEndDate) task.recurrenceEndDate = recurrenceEndDate;
    if (recurrenceDaysOfWeek) task.recurrenceDaysOfWeek = recurrenceDaysOfWeek;
    if (recurrenceCustomDates)
      task.recurrenceCustomDates = recurrenceCustomDates;

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
        isRecurring: updatedTask.isRecurring,
        recurrencePattern: updatedTask.recurrencePattern,
        recurrenceInterval: updatedTask.recurrenceInterval,
        recurrenceEndDate: updatedTask.recurrenceEndDate,
        recurrenceDaysOfWeek: updatedTask.recurrenceDaysOfWeek,
        recurrenceCustomDates: updatedTask.recurrenceCustomDates,
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

const AddCollaborator = async (req, res) => {
  const { userId, role } = req.body;

  if (!["editor", "viewer"].includes(role))
    return res.status(400).json({ message: "Invalid role" });

  const task = req.task;
  const exists = task.collaborators.find((c) => c.userId.toString() === userId);
  if (exists)
    return res.status(400).json({ message: "User already a collaborator" });

  task.collaborators.push({ userId, role });
  await task.save();

  res.json({ message: "Collaborator added", task });
};

const RemoveCollaborator = async (req, res) => {
  const { userId } = req.body;

  const task = req.task;
  task.collaborators = task.collaborators.filter(
    (c) => c.userId.toString() !== userId
  );
  await task.save();

  res.json({ message: "Collaborator removed", task });
};

const GetCollaborator = async (req, res) => {
  const task = await req.task.populate("collaborators.userId", "name email");
  res.json(task.collaborators);
};

const ChangeCollaboratorRole = async (req, res) => {
  const { userId, newRole } = req.body;

  if (!["editor", "viewer"].includes(newRole))
    return res.status(400).json({ message: "Invalid role" });

  const task = req.task;
  const collaborator = task.collaborators.find(
    (c) => c.userId.toString() === userId
  );
  if (!collaborator)
    return res.status(404).json({ message: "Collaborator not found" });
  if (collaborator.role === "owner")
    return res.status(400).json({ message: "Cannot change owner role" });

  collaborator.role = newRole;
  await task.save();

  res.json({ message: "Collaborator role updated", task });
};

module.exports = {
  CreateTask,
  GetAllTasks,
  UpdateTask,
  DeleteTask,
  AddCollaborator,
  RemoveCollaborator,
  GetCollaborator,
  ChangeCollaboratorRole,
};
