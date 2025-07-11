const { Router } = require("express");
const router = Router();
const { AddComment, GetComments } = require("../controllers/comment");
const { checkForAuthenticationCookie } = require("../middlewares/auth");

router.post("/:taskId", checkForAuthenticationCookie, AddComment);
router.get("/:taskId", checkForAuthenticationCookie, GetComments);

module.exports = router;
