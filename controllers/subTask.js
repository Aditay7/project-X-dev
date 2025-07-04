const SubTask = require("../models/subTask");

const CreateSubTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const subTask = new SubTask({ ...req.body, task: taskId });
    await subTask.save();
    res.status(201).json({
      message: "Sub Task Created Sucessfully",
      subTask,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const GetAllSubTasks = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const subtasks = await SubTask.find({ taskId });
    res.status(200).json({
      message: "Subtasks are fetched Sucessfully",
      subtasks,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const UpdateSubTask = async (req, res) => {
  const subTaskId = req.params.id;
  const { title, status } = req.body;
  try {
    const subTask = await SubTask.findById(subTaskId);
    if (!subTask) return res.status(400).json({ message: "SubTask not found" });

    if (title) subTask.title = title;
    if (status) subTask.status = status;

    const updatedSubTask = await subTask.save();
    res.status(200).json({
      message: "Subtask is Updated Sucessfully",
      subTask: {
        id: updatedSubTask._id,
        title: updatedSubTask.title,
        status: updatedSubTask.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error while Updating SubTask", error });
  }
};


const DeleteSubTask = async(req, res) => {
  const subTaskId = req.params.id;
  try{
    const deletedSubTask = await SubTask.findByIdAndDelete(subTaskId);
     if (!deletedSubTask)
      return res.status(404).json({ message: "SubTask not found" });
    res.status(200).json({
      message: "SubTask is deleted Sucessfully",
      deletedSubTask,
    });
  } catch(error) {
    res.status(500).json({ message: "Error while fetching SubTask", error });
  }
}



module.exports = {
  CreateSubTask,
  GetAllSubTasks,
  UpdateSubTask,
  DeleteSubTask
};
