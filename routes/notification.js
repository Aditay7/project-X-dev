const { Router } = require("express");
const router = Router();
const {
  CreateNotification,
  GetAllNotification,
  GetNotificationById,
  MarkAsRead,
  MarkAllAsRead,
  DeleteNotification,
} = require("../controllers/notification");

router.post("/", CreateNotification);
router.get("/", GetAllNotification);
router.get("/:id", GetNotificationById);
router.put("/:id/read", MarkAsRead);
router.put("/read-all", MarkAllAsRead);
router.delete("/:id", DeleteNotification);

module.exports = router;
