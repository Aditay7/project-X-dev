const { Router } = require("express");
const router = Router();
const {
  CreateTask,
  GetAllTasks,
  UpdateTask,
  DeleteTask,
} = require("../controllers/task");


router.post("/", CreateTask);
router.get("/", GetAllTasks);
router.patch("/:id", UpdateTask);
router.delete("/:id", DeleteTask);

module.exports = router;
