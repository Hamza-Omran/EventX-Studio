const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/userController");
const upload = require("../config/multer.js");

router.post("/register", upload.single('image'), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
