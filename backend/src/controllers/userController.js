const User = require("../models/user");
const generateToken = require("../utils/generateToken.js");
const { saveImage } = require("../utils/imageUtils.js");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, gender, location, interests } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const imagePath = req.file ? saveImage(req.file) : '';
        const user = await User.create({
            name,
            email,
            password,
            age,
            gender,
            location,
            interests,
            image: imagePath
        });

        const token = generateToken(user._id, "user");
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: "user",
            age: user.age,
            gender: user.gender,
            location: user.location,
            interests: user.interests,
            image: user.image,
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: "Invalid email or password" });

        const token = generateToken(user._id, "user");
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
            role: "user",
            age: user.age,
            gender: user.gender,
            location: user.location,
            interests: user.interests,
            image: user.image || ""
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie("jwt");
    res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
