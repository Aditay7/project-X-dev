const { Router } = require("express");
const router = Router();
const {
  getOverview,
  getCompletedPerDay,
  getAverageCompletionTime,
  getProductivityStreak,
  getTasksByStatus,
} = require("../controllers/analytics");

router.get("/overview", getOverview);
router.get("/completed-per-day", getCompletedPerDay);
router.get("/average-completion-time", getAverageCompletionTime);
router.get("/streak", getProductivityStreak);
router.get("/tasks-by-status", getTasksByStatus);

module.exports = router;
