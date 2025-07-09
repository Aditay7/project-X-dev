const { Router } = require("express");
const router = Router();
const { checkTaskRole } = require("../middlewares/checkAcess");


const {
  CreateTask,
  GetAllTasks,
  UpdateTask,
  DeleteTask,
  AddCollaborator,
  RemoveCollaborator,
  GetCollaborator,
  ChangeCollaboratorRole,
} = require("../controllers/task");

router.post("/", CreateTask);
router.get("/", GetAllTasks);
router.patch("/:id", checkTaskRole(["owner", "editor"]), UpdateTask);
router.delete("/:id", checkTaskRole(["owner"]), DeleteTask);

// Colloboration
router.post(
  "/:taskId/add-collaborator",
  checkTaskRole(["owner"]),
  AddCollaborator
);

router.post(
  "/:taskId/remove-collaborator",
  checkTaskRole(["owner"]),
  RemoveCollaborator
);

router.post(
  "/:taskId/change-collaborator-role",
  checkTaskRole(["owner"]),
  ChangeCollaboratorRole
);

router.get(
  "/:taskId/collaborators",
  checkTaskRole(["owner", "editor", "viewer"]),
  GetCollaborator
);

module.exports = router;
