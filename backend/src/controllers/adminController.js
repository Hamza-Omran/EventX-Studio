const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken.js");
const { saveImage } = require("../utils/imageUtils.js");

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await Admin.findOne({ email });
        if (existing) return res.status(400).json({ message: "Admin already exists" });

        const imagePath = req.file ? saveImage(req.file) : '';
        const admin = await Admin.create({
            name,
            email,
            password,
            role: "admin",
            image: imagePath
        });
        const token = generateToken(admin._id, "admin");

        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            image: admin.image,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.matchPassword(password)))
            return res.status(401).json({ message: "Invalid email or password" });

        const token = generateToken(admin._id, "admin");
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24,
        });

        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: "admin",
            image: admin.image || ""
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const logoutAdmin = (req, res) => {
    res.clearCookie("jwt");
    res.json({ message: "Logged out successfully" });
};

module.exports = { registerAdmin, loginAdmin, logoutAdmin };
