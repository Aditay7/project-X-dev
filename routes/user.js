const { Router } = require("express");
const router = Router();
const { Register, Login, Update } = require("../controllers/user");


router.post("/register", Register);
router.post("/login", Login);
router.patch("/:id", Update)





module.exports = router;