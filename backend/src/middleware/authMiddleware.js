const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/user");

const protectAdmin = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) return res.status(401).json({ message: "Admin not found" });
        req.user = admin;
        req.user.role = "admin";
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

const protectUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

const protectAny = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = null;

        if (decoded.role === "admin") {
            user = await Admin.findById(decoded.id).select("-password");
            if (!user) return res.status(401).json({ message: "Admin not found" });
            user.role = "admin";
        } else {
            user = await User.findById(decoded.id).select("-password");
            if (!user) return res.status(401).json({ message: "User not found" });
            user.role = "user";
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") next();
    else res.status(403).json({ message: "Admin access only" });
};

module.exports = {
    protectAdmin,
    protectUser,
    protectAny,
    admin
};
