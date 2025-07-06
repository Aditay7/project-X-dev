const { Router } = require("express");
const router = Router();
const { Register, Login, Update, RegisterFcmToken  } = require("../controllers/user");


router.post("/register", Register);
router.post("/login", Login);
router.patch("/:id", Update)


router.post('/token', RegisterFcmToken) 





module.exports = router;