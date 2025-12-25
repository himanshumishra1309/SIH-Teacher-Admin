import { supabaseAdmin } from '../supabaseAdmin.js';
import fs from 'fs';

export const uploadToSupabase = async (fileInput, folder) => {
  try {
    if (!fileInput) return null;

    let fileBuffer;
    let fileName;
    let fileExtension;
    let contentType;
    let shouldDeleteLocal = false;

    // Check if fileInput is a multer file object (has buffer property) or a file path
    if (typeof fileInput === 'object' && fileInput.buffer) {
      // Multer file object with buffer (memoryStorage)
      fileBuffer = fileInput.buffer;
      fileName = fileInput.originalname;
      fileExtension = fileName.split('.').pop().toLowerCase();
      contentType = fileInput.mimetype;
    } else if (typeof fileInput === 'string') {
      // File path (diskStorage)
      fileBuffer = fs.readFileSync(fileInput);
      fileName = fileInput.split(/[\/\\]/).pop(); // Handle both Unix and Windows paths
      fileExtension = fileName.split('.').pop().toLowerCase();
      shouldDeleteLocal = true;
      
      // Determine content type
      const contentTypeMap = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'mp4': 'video/mp4'
      };
      contentType = contentTypeMap[fileExtension] || 'application/octet-stream';
    } else {
      throw new Error('Invalid file input: must be a file path or multer file object');
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Determine file path in bucket
    const filePath = folder === "images" 
      ? `images/${uniqueFileName}` 
      : `pdf-report/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_BUCKET_NAME || 'uploads')
      .upload(filePath, fileBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });

    // Delete the file from local storage if it was a file path
    if (shouldDeleteLocal && typeof fileInput === 'string') {
      fs.unlinkSync(fileInput);
    }

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(process.env.SUPABASE_BUCKET_NAME || 'uploads')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Supabase Upload Error Details:', error);
    // Clean up local file if it still exists
    if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      fs.unlinkSync(fileInput);
    }
    return null;
  }
};

export const deleteFromSupabase = async (fileName, folder) => {
  try {
    if (!fileName || !folder) {
      throw new Error('File name and folder are required to delete a file.');
    }

    // Set the file path based on the folder
    const filePath = folder === "images" 
      ? `images/${fileName}` 
      : `pdf-report/${fileName}`;

    const { error } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_BUCKET_NAME || 'uploads')
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }

    console.log(`File ${filePath} deleted successfully from Supabase bucket.`);
    return true;
  } catch (error) {
    console.error('Supabase Delete Error Details:', error);
    return false;
  }
};
