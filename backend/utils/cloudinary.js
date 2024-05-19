const cloudinary = require("cloudinary");
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Cloudinary Upload Image
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto',
        });
        return data;
    } catch (e) {
        console.error("Error uploading image to Cloudinary:", e);
        throw new Error("Internal Server Error (cloudinary)");
    }
};

// Cloudinary Remove Image
const cloudinaryRemoveImage = async (imagePublicId) => {
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId);
        return result;
    } catch (e) {
        console.error("Error removing image from Cloudinary:", e);
        throw new Error("Internal Server Error (cloudinary)");
    }
};

module.exports = {
    cloudinaryRemoveImage,
    cloudinaryUploadImage
};
