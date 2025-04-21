// const File = require('../models/fileModel');
// const path = require('path');

// const uploadFile = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const fileUrl = req.file.path;
//         const fileExt = path.extname(req.file.originalname).toLowerCase();
//         const fileType = getFileType(fileExt);

//         // Save to MongoDB (optional but useful to check history)
//         const newFile = new File({
//             fileName: req.file.originalname,
//             fileUrl: fileUrl,
//             fileType: fileType,
//         });

//         await newFile.save();

//         res.status(200).json({
//             message: 'File uploaded successfully',
//             fileUrl: fileUrl,
//             fileType: fileType,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Upload failed', error: error.message });
//     }
// };

// // Helper function to determine file type
// const getFileType = (ext) => {
//     if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return 'image';
//     if (['.pdf'].includes(ext)) return 'pdf';
//     if (['.doc', '.docx'].includes(ext)) return 'document';
//     return 'unknown';
// };

// module.exports = { uploadFile };
