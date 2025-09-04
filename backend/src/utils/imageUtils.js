const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const imagesDir = path.join(__dirname, '../../images');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const saveImage = (file) => {
    if (!file) return '';

    const extension = path.extname(file.originalname);
    const filename = `${uuidv4()}${extension}`;
    const filepath = path.join(imagesDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return `images/${filename}`;
};

const deleteImage = (imagePath) => {
    if (!imagePath) return;

    const fullPath = path.join(__dirname, '../../', imagePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

const updateImage = (newFile, oldImagePath) => {
    const newImagePath = saveImage(newFile);

    if (oldImagePath && newImagePath !== oldImagePath) {
        deleteImage(oldImagePath);
    }

    return newImagePath;
};

module.exports = {
    saveImage,
    deleteImage,
    updateImage
};
