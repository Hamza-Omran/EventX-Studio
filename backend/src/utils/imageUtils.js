const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload an image to Cloudinary
 * @param {Object} file - The multer file object (with buffer)
 * @returns {Promise<string>} - The Cloudinary URL of the uploaded image
 */
const saveImage = async (file) => {
    if (!file) return '';

    try {
        // Convert buffer to base64 data URI
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'eventx-studio',
            public_id: uuidv4(),
            resource_type: 'image'
        });

        // Return the secure URL
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return '';
    }
};

/**
 * Delete an image from Cloudinary
 * @param {string} imageUrl - The full Cloudinary URL of the image
 */
const deleteImage = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        // Handle old local paths (images/filename.ext) - skip deletion for these
        if (imageUrl.startsWith('images/')) {
            console.log('Skipping deletion of local path:', imageUrl);
            return;
        }

        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v.../folder/public_id.ext
        const urlParts = imageUrl.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${filenameWithExt.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
};

/**
 * Update an image - upload new one and delete old one
 * @param {Object} newFile - The new multer file object
 * @param {string} oldImageUrl - The old Cloudinary URL to delete
 * @returns {Promise<string>} - The new Cloudinary URL
 */
const updateImage = async (newFile, oldImageUrl) => {
    const newImageUrl = await saveImage(newFile);

    if (oldImageUrl && newImageUrl && newImageUrl !== oldImageUrl) {
        await deleteImage(oldImageUrl);
    }

    return newImageUrl;
};

module.exports = {
    saveImage,
    deleteImage,
    updateImage
};
