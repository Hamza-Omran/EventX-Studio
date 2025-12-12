const express = require("express");
const router = express.Router();
const { protectAny, protectAdmin } = require("../middleware/authMiddleware");
const Admin = require("../models/Admin");
const upload = require("../config/multer.js");
const { saveImage, deleteImage, updateImage } = require("../utils/imageUtils.js");

router.get("/admins", protectAny, async (req, res) => {
    try {
        const admins = await Admin.find({}, "_id name email image");
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/admins/:id", protectAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/admins/:id", protectAdmin, upload.single('image'), async (req, res) => {
    try {
        const currentAdmin = await Admin.findById(req.params.id);
        if (!currentAdmin) return res.status(404).json({ message: "Admin not found" });

        const updateData = { ...req.body };

        if (updateData.password) {
            const bcrypt = require("bcryptjs");
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        if (req.file) {
            updateData.image = await updateImage(req.file, currentAdmin.image);
        } else if (req.body.removeImage === 'true' || req.body.image === '') {
            if (currentAdmin.image) {
                await deleteImage(currentAdmin.image);
            }
            updateData.image = "";
        }

        const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/admins/:id", protectAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        if (admin.image) {
            await deleteImage(admin.image);
        }

        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: "Admin deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
