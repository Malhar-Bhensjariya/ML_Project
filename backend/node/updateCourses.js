const mongoose = require('mongoose');
const Course = require('./models/CourseModel');
require('dotenv').config();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Failed to connect", err));

// ✅ Function to update all courses
const updateCourses = async () => {
    try {
        const courses = await Course.find();

        for (let course of courses) {
            let isUpdated = false;

            course.chapters.forEach(chapter => {
                // ✅ Add Video Field if not exists
                if (!chapter.video) {
                    chapter.video = {
                        url: '',
                        thumbnail: ''
                    };
                    isUpdated = true;
                }

                // ✅ Add PPT Field if not exists
                if (!chapter.ppt) {
                    chapter.ppt = {
                        title: '',
                        link: ''
                    };
                    isUpdated = true;
                }

                // ✅ Ensure isCompleted exists
                if (chapter.isCompleted === undefined) {
                    chapter.isCompleted = false;
                    isUpdated = true;
                }
            });

            // ✅ Save only if any changes were made
            if (isUpdated) {
                await course.save();
            }
        }

        console.log("🎉 All courses have been successfully updated.");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error updating courses:", error);
        mongoose.connection.close();
    }
};

// ✅ Run the script
updateCourses();
