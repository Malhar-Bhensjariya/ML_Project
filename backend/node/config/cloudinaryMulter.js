// const { v2: cloudinary } = require('cloudinary');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
// const path = require('path');

// // Cloudinary Configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Cloudinary Storage Setup - Support images & files (like pdf, docx)
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: async (req, file) => {
//         const ext = path.extname(file.originalname).toLowerCase();
//         const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);

//         return {
//             folder: 'uploads',
//             resource_type: isImage ? 'image' : 'raw',  // 'raw' is for non-image files (pdf, docx, etc.)
//             public_id: Date.now() + '-' + file.originalname.replace(/\.[^/.]+$/, ''),
//         };
//     },
// });

// const upload = multer({ storage });

// module.exports = { cloudinary, upload };
