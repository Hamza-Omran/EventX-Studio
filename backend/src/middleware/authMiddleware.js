const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

const protectAdmin = async (req, res, next) => {
    let token = req.cookies.jwt;
    
    // Also check Authorization header if cookie is not present
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    
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
    let token = req.cookies.jwt;
    
    // Also check Authorization header if cookie is not present
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    
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
    let token = req.cookies.jwt;
    
    // Also check Authorization header if cookie is not present
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    
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

module.exports = {
    protectAdmin,
    protectUser,
    protectAny
};
