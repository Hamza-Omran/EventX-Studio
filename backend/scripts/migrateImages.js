/**
 * Migration Script: Upload Local Images to Cloudinary
 * 
 * This script will:
 * 1. Connect to MongoDB
 * 2. Find all Users and Admins with local image paths (images/filename.ext)
 * 3. Upload those images to Cloudinary
 * 4. Update the database with the Cloudinary URLs
 * 
 * Usage: node scripts/migrateImages.js
 * 
 * IMPORTANT: Make sure you have set up:
 * - MONGO_URI in .env
 * - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env
 */

require('dotenv').config();

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Import models
const User = require('../src/models/User');
const Admin = require('../src/models/Admin');

// Path to images directory
const IMAGES_DIR = path.join(__dirname, '../images');

/**
 * Upload a local image file to Cloudinary
 * @param {string} localPath - Local path like 'images/filename.ext'
 * @returns {Promise<string|null>} - Cloudinary URL or null if failed
 */
async function uploadToCloudinary(localPath) {
    try {
        // Construct full file path
        const fullPath = path.join(__dirname, '..', localPath);

        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            console.log(`  [WARNING] File not found: ${fullPath}`);
            return null;
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(fullPath, {
            folder: 'eventx-studio',
            resource_type: 'image'
        });

        console.log(`  [OK] Uploaded: ${localPath} -> ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`  [ERROR] Failed to upload ${localPath}:`, error.message);
        return null;
    }
}

/**
 * Check if a path is a local image path
 * @param {string} imagePath 
 * @returns {boolean}
 */
function isLocalPath(imagePath) {
    if (!imagePath) return false;
    // Local paths start with "images/" and don't include http
    return imagePath.startsWith('images/') && !imagePath.includes('http');
}

/**
 * Migrate images for a collection
 * @param {mongoose.Model} Model - Mongoose model
 * @param {string} modelName - Name for logging
 */
async function migrateCollection(Model, modelName) {
    console.log(`\n[INFO] Migrating ${modelName} images...`);

    // Find all documents with local image paths
    const docs = await Model.find({
        image: { $regex: /^images\// }
    });

    console.log(`  Found ${docs.length} ${modelName}(s) with local images`);

    let migrated = 0;
    let failed = 0;
    let skipped = 0;

    for (const doc of docs) {
        if (!isLocalPath(doc.image)) {
            skipped++;
            continue;
        }

        console.log(`\n  Processing ${modelName}: ${doc.email || doc._id}`);
        console.log(`  Current image: ${doc.image}`);

        const cloudinaryUrl = await uploadToCloudinary(doc.image);

        if (cloudinaryUrl) {
            // Update the document
            await Model.findByIdAndUpdate(doc._id, { image: cloudinaryUrl });
            migrated++;
        } else {
            // Image file not found - clear the path
            console.log(`  [WARNING] Clearing invalid image path`);
            await Model.findByIdAndUpdate(doc._id, { image: '' });
            failed++;
        }
    }

    console.log(`\n  ${modelName} Summary:`);
    console.log(`     Migrated: ${migrated}`);
    console.log(`     Failed/Cleared: ${failed}`);
    console.log(`     Skipped: ${skipped}`);

    return { migrated, failed, skipped };
}

/**
 * Main migration function
 */
async function migrate() {
    console.log('Starting Image Migration to Cloudinary\n');
    console.log('='.repeat(50));

    // Validate environment variables
    if (!process.env.MONGO_URI) {
        console.error('[ERROR] MONGO_URI is not set in .env');
        process.exit(1);
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('[ERROR] Cloudinary credentials are not set in .env');
        console.error('   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
        process.exit(1);
    }

    // Check if images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
        console.log('[WARNING] Images directory not found. Creating it...');
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    // List local images
    const localImages = fs.readdirSync(IMAGES_DIR);
    console.log(`\nLocal images found: ${localImages.length}`);
    if (localImages.length > 0) {
        localImages.forEach(img => console.log(`   - ${img}`));
    }

    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[OK] Connected to MongoDB');
    } catch (error) {
        console.error('[ERROR] Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }

    // Migrate Users
    const userResults = await migrateCollection(User, 'User');

    // Migrate Admins
    const adminResults = await migrateCollection(Admin, 'Admin');

    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('MIGRATION COMPLETE\n');
    console.log('Total Results:');
    console.log(`  Successfully migrated: ${userResults.migrated + adminResults.migrated}`);
    console.log(`  Failed/Cleared: ${userResults.failed + adminResults.failed}`);
    console.log(`  Skipped: ${userResults.skipped + adminResults.skipped}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    console.log('Migration finished!\n');
}

// Run migration
migrate().catch(error => {
    console.error('[ERROR] Migration failed:', error);
    process.exit(1);
});
