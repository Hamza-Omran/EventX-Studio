const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Fallback to local storage if Cloudinary is not configured
const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

const imagesDir = path.join(__dirname, '../../images');

if (!fs.existsSync(imagesDir) && !useCloudinary) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const saveImage = async (file) => {
    if (!file) return '';

    if (useCloudinary) {
        try {
            const result = await cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'eventx-studio',
                    public_id: uuidv4(),
                },
                (error, result) => {
                    if (error) throw error;
                    return result;
                }
            );
            
            // Convert buffer to stream for cloudinary
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'eventx-studio',
                    public_id: uuidv4(),
                },
            );
            
            stream.end(file.buffer);
            
            return new Promise((resolve, reject) => {
                stream.on('result', (result) => {
                    resolve(result.secure_url);
                });
                stream.on('error', (error) => {
                    reject(error);
                });
            });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            // Fallback to local storage
            return saveImageLocally(file);
        }
    } else {
        return saveImageLocally(file);
    }
};

const saveImageLocally = (file) => {
    const extension = path.extname(file.originalname);
    const filename = `${uuidv4()}${extension}`;
    const filepath = path.join(imagesDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return `images/${filename}`;
};

const deleteImage = async (imagePath) => {
    if (!imagePath) return;

    if (useCloudinary && imagePath.startsWith('http')) {
        try {
            // Extract public_id from Cloudinary URL
            const publicId = imagePath.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);
        }
    } else {
        // Local file deletion
        const fullPath = path.join(__dirname, '../../', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
};

const updateImage = async (oldImagePath, newFile) => {
    if (oldImagePath) {
        await deleteImage(oldImagePath);
    }
    
    if (newFile) {
        return await saveImage(newFile);
    }
    
    return oldImagePath;
};

module.exports = { saveImage, deleteImage, updateImage };
