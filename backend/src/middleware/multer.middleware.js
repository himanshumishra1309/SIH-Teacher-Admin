import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Temporary storage before uploading
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Timestamp + random number
    cb(null, uniqueSuffix + '-' + file.originalname); // Prepend unique value to the original filename
  },
});

export const upload = multer({ storage });
