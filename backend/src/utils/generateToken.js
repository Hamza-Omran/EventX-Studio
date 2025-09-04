const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        {
        expiresIn: "30d",
        issuer: "eventx-server",
        audience: "eventx-client",
        }
    );
};

module.exports = generateToken;
