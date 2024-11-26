import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;

        // Detect file extension
        const fileExtension = path.extname(localFilePath).toLowerCase();
        const resourceType = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension.slice(1))
        ? "image"
        : "raw";

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
        });

        fs.unlinkSync(localFilePath)

        return response
    }
    catch (error) {
        console.error("Cloudinary Upload Error Details:", error);
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {uploadOnCloudinary}