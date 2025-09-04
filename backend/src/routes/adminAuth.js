const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, logoutAdmin } = require("../controllers/adminController");
const { protectAdmin, admin } = require("../middleware/authMiddleware");
const upload = require("../config/multer.js");

router.post("/register", protectAdmin, admin, upload.single('image'), registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
