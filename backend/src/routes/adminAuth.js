const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, logoutAdmin } = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/authMiddleware");
const upload = require("../config/multer.js");

router.post("/register", protectAdmin, upload.single('image'), registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
