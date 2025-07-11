const { Router } = require("express");
const router = Router();
const { GetActivityLogs } = require("../controllers/activityLog");
const { checkForAuthenticationCookie } = require("../middlewares/auth");

router.get("/:taskId", checkForAuthenticationCookie, GetActivityLogs);

module.exports = router;
