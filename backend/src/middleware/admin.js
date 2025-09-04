const admin = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(403).json({ message: "Admin access only" });
    }
};
