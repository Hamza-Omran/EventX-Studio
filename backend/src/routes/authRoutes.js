const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Admin = require("../models/Admin.js");
const generateToken = require("../utils/generateToken.js");
const { protectAny, protectAdmin } = require("../middleware/authMiddleware");
const upload = require("../config/multer.js");
const { saveImage, deleteImage, updateImage } = require("../utils/imageUtils.js");
router.post("/register", upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, age, interests, gender, location, role } = req.body;

    if (role === "admin") {
      return res.status(403).json({ message: "Admin registration is not allowed from this route." });
    }

    if (!age || isNaN(age) || age <= 0) {
      return res.status(400).json({ message: "Please enter a valid age." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const imagePath = req.file ? saveImage(req.file) : '';
    const user = await User.create({
      name,
      email,
      password,
      age,
      interests: Array.isArray(interests) ? interests : [],
      gender,
      location,
      image: imagePath
    });

    if (user) {
      const token = generateToken(user._id, "user");
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
        image: user.image,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let Model = role === "admin" ? Admin : User;
    const user = await Model.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role || role || "user");

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || role || "user",
        age: user.age,
        gender: user.gender,
        location: user.location,
        interests: user.interests,
        image: user.image || ""
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
});
router.get("/me", protectAny, (req, res) => {
  res.json({
    role: req.user.role,
    name: req.user.name,
    email: req.user.email,
    _id: req.user._id,
    age: req.user.age,
    gender: req.user.gender,
    location: req.user.location,
    interests: req.user.interests,
    image: req.user.image || ""
  });
});
router.put("/users/:id", protectAny, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role === "user" && req.user._id.toString() !== req.params.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const currentUser = await User.findById(req.params.id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const updateData = { ...req.body };
    if (updateData.password) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    if (req.file) {
      updateData.image = updateImage(req.file, currentUser.image);
    } else if (req.body.removeImage === 'true' || req.body.image === '') {
      if (currentUser.image) {
        deleteImage(currentUser.image);
      }
      updateData.image = "";
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/users/:id", protectAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.image) {
      deleteImage(user.image);
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/users/:id", protectAny, async (req, res) => {
  try {
    if (req.user.role === "user" && req.user._id.toString() !== req.params.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
