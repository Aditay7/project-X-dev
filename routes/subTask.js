const { Router } = require("express");
const router = Router();

const {CreateSubTask, GetAllSubTasks, UpdateSubTask, DeleteSubTask} = require("../controllers/subTask");

router.post("/:taskId", CreateSubTask);
router.get("/:taskId", GetAllSubTasks);
router.patch("/:id", UpdateSubTask);
router.delete("/:id", DeleteSubTask);



module.exports = router;
