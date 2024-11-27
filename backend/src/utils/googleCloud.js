import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEY_FILE, // Path to your service account key file
});

// Define bucket name
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

// Function to upload file to Google Cloud Storage
const uploadToGCS = async (localFilePath, folder) => {
  try {
    if (!localFilePath) return null;

    // Detect file extension
    const fileExtension = path.extname(localFilePath).toLowerCase();
    const fileName = path.basename(localFilePath);

    // Set destination folder based on file type
    const destinationFolder =
      folder === 'images'
        ? `images/${fileName}`
        : `pdf-report/${fileName}`;

    const bucket = storage.bucket(bucketName);

    // Upload file to the specified folder in the bucket
    const [response] = await bucket.upload(localFilePath, {
      destination: destinationFolder,
    });

    // Delete the file from local storage
    fs.unlinkSync(localFilePath);

    // Return public URL for the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${response.metadata.name}`;
    return publicUrl;
  } catch (error) {
    console.error('GCS Upload Error Details:', error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadToGCS };