// // services/transcription.js
// const { transcribe } = require('./aws');
// const cloudinary = require('cloudinary').v2;
// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');
// const path = require('path');
// const PDFDocument = require('pdfkit');
// // const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('ffmpeg-static');

// // Set path explicitly
// ffmpeg.setFfmpegPath(ffmpegPath);
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// async function processTranscription(lecture) {
//   try {
//     // 1. Download video from Cloudinary

//     const audioUrl = cloudinary.url(lecture.recordingUrl, {
//         resource_type: "video",
//         transformation: [
//           { flags: "waveform" },       // Optional: Add waveform visualization
//           { format: "mp3" }            // Output format (mp3, wav, ogg, etc.)
//         ],
//         secure: true
//       });
      
//       console.log(audioUrl);


//     // const videoUrl = lecture.recordingUrl;
//     // const videoPath = path.join(__dirname, `temp/${lecture._id}.mp4`);
//     // const outputPath = path.join(__dirname, `temp/${lecture._id}.flac`);

//     // // 2. Extract audio using ffmpeg
//     // await new Promise((resolve, reject) => {
//     //   ffmpeg(videoUrl)
//     //     .output(outputPath)
//     //     .audioCodec('flac')
//     //     .on('end', resolve)
//     //     .on('error', reject)
//     //     .run();
//     // });

//     // 3. Upload audio to S3 for Transcribe
//     const s3 = new AWS.S3();
//     const audioKey = `audio/${lecture._id}.flac`;
//     await s3.upload({
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: audioUrl,
//       Body: fs.createReadStream(outputPath)
//     }).promise();
//     console.log("hi")
//     // 4. Start Transcribe job
//     const jobName = `transcribe-${lecture._id}`;
//     await transcribe.startTranscriptionJob({
//       TranscriptionJobName: jobName,
//       Media: { MediaFileUri: `s3://${process.env.AWS_BUCKET_NAME}/${audioKey}` },
//       MediaFormat: 'flac',
//       LanguageCode: 'en-US',
//       OutputBucketName: process.env.AWS_BUCKET_NAME
//     }).promise();
//     console.log("hi12")
//     // 5. Poll for job completion
//     let job;
//     do {
//       await new Promise(resolve => setTimeout(resolve, 5000));
//       job = await transcribe.getTranscriptionJob({ TranscriptionJobName: jobName }).promise();
//     } while (job.TranscriptionJob.TranscriptionJobStatus === 'IN_PROGRESS');
//     console.log("hi123");
//     // 6. Get transcript
//     const transcriptFile = await s3.getObject({
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `${jobName}.json`
//     }).promise();
    
//     const transcript = JSON.parse(transcriptFile.Body.toString()).results.transcripts[0].transcript;

//     // 7. Generate PDF
//     const pdfPath = path.join(__dirname, `temp/${lecture._id}.pdf`);
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(pdfPath));
//     doc.text(transcript);
//     doc.end();

//     // 8. Upload PDF to Cloudinary
//     const pdfUpload = await cloudinary.uploader.upload(pdfPath, {
//       resource_type: 'auto',
//       folder: 'transcripts'
//     });
//     console.log(pdfUpload);
//     // 9. Update lecture with transcript URL
//     lecture.transcriptPdfUrl = pdfUpload.secure_url;
//     await lecture.save();

//     // Cleanup temp files
//     [videoPath, outputPath, pdfPath].forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
    
//   } catch (error) {
//     console.error('Transcription error:', error);
//   }
// }

// module.exports = { processTranscription };