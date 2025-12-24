import multer from 'multer';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/temp'); // Temporary storage before uploading
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Timestamp + random number
//     cb(null, uniqueSuffix + '-' + file.originalname); // Prepend unique value to the original filename
//   },
// });

// export const upload = multer({ storage });

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1*1024*1024,
  },
  fileFilter: (req, file, cb)=>{
    const allowedTypes= [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/webp',
      'video/mp4',
    ]

    if(!allowedTypes.includes(file.mimetype)){
      return cb(new Error('Unsupported file type'), false)
    }

    cb(null, true)
  }
})