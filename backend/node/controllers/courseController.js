const mongoose = require('mongoose');
const Course = require('../models/CourseModel');
const User = require('../models/UserModel');

// Create Course and Link to User
exports.createCourse = async (req, res) => {
    try {
        const { chapters } = req.body;

        if (chapters && chapters.length > 5) {
            return res.status(400).json({ message: 'A course can have a maximum of 5 chapters only.' });
        }

        const userId = req.user.id; // From authMiddleware

        const course = new Course(req.body);
        await course.save();

        // ✅ Only push course's ObjectId to user's courses array
        await User.findByIdAndUpdate(
            userId,
            { $push: { courses: course._id } },  // Only ObjectId stored
            { new: true }
        );

        res.status(201).json({ message: 'Course created successfully', course });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create course', error: error.message });
    }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
    try {
        const userId = req.user.id; // From authMiddleware

        // Fetch only courses linked to this user
        const user = await User.findById(userId).populate('courses'); // Assuming `courses` is an array of ObjectIds in UserModel

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.courses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
    }
};

// Get Single Course
exports.getCourseById = async (req, res) => {
    try {
        const userId = req.user.id; // From authMiddleware
        const courseId = req.params.id;

        // Find the user and check if the course exists in their courses array
        const user = await User.findById(userId).populate({
            path: 'courses',
            match: { _id: courseId } // Only match the specific course
        });

        if (!user || user.courses.length === 0) {
            return res.status(404).json({ message: 'Course not found for this user' });
        }

        // course will be in user.courses[0] if found
        res.status(200).json(user.courses[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course', error: error.message });
    }
};

//// Update Course
exports.updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const updateData = req.body;

    try {
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error });
    }
};


// Update Chapter
exports.updateChapter = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params;
        const userId = req.user.id;  // From authMiddleware

        // Find the user and check if they own this course
        const user = await User.findById(userId).populate({
            path: 'courses',
            match: { _id: courseId }  // Check if this course exists for this user
        });

        if (!user || user.courses.length === 0) {
            return res.status(404).json({ message: 'Course not found for this user' });
        }

        const course = user.courses[0];  // The matched course
        const chapter = course.chapters.id(chapterId);

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Update the chapter fields with req.body
        Object.assign(chapter, req.body);

        await course.save();

        res.status(200).json({ message: 'Chapter updated successfully', chapter });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update chapter', error: error.message });
    }
};


// Delete Course and Remove from User
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Remove course from all users' `courses` array
        await User.updateMany(
            { courses: course._id },
            { $pull: { courses: course._id } }
        );

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete course', error: error.message });
    }
};

// Chapter by ID
exports.getChapterById = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const chapter = course.chapters.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chapter', error: error.message });
    }
};

// Section By ID
exports.getSectionById = async (req, res) => {
    try {
        const { courseId, chapterId, sectionId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const chapter = course.chapters.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const section = chapter.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch section', error: error.message });
    }
};

// Update course layout
exports.updateCourseLayout = async (req, res) => {
    const { courseId } = req.params;
    const { courseName, description, level, courseOutcomes, duration, chapters } = req.body;

    try {
        // ✅ Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // ✅ Update Course-Level Details
        if (courseName) course.courseName = courseName;
        if (description) course.description = description;
        if (level) course.level = level;
        if (courseOutcomes) course.courseOutcomes = courseOutcomes;
        if (duration) course.duration = duration;

        // ✅ Step 1: Bulk Update Existing Chapters
        const bulkOperations = chapters
            .filter(chapter => chapter._id) // ✅ Only update existing chapters
            .map(chapter => ({
                updateOne: {
                    filter: { _id: courseId, "chapters._id": chapter._id },
                    update: {
                        $set: {
                            "chapters.$.chapterName": chapter.chapterName,
                            "chapters.$.about": chapter.about,
                            "chapters.$.duration": chapter.duration
                        }
                    }
                }
            }));

        if (bulkOperations.length > 0) {
            await Course.bulkWrite(bulkOperations);
        }

        // ✅ Step 2: Push New Chapters (if any)
        chapters
            .filter(chapter => !chapter._id) // ✅ Only push new chapters without _id
            .forEach(chapter => {
                course.chapters.push({
                    chapterName: chapter.chapterName,
                    about: chapter.about,
                    duration: chapter.duration
                });
            });

        // ✅ Step 3: Save the course
        await course.save();

        res.status(200).json({ message: 'Course layout updated successfully', course });
    } catch (error) {
        console.error('Error in updateCourseLayout:', error);
        res.status(500).json({ message: 'Failed to update course layout', error: error.message });
    }
};



// Update chapter layout
exports.updateChapterLayout = async (req, res) => {
    const { courseId, chapterId } = req.params;
    const { chapterName, about, duration, sections, video, ppt } = req.body;

    try {
        // ✅ Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // ✅ Find the specific chapter
        const chapter = course.chapters.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // ✅ Update Chapter Details (NEW!!)
        chapter.chapterName = chapterName;
        chapter.about = about;
        chapter.duration = duration;

        // ✅ Handle Sections (Add, Edit, Delete)
        chapter.sections = sections.map(section => {
            if (mongoose.isValidObjectId(section._id)) {
                // ✅ Existing section (keep same ID)
                return {
                    _id: section._id,
                    title: section.title,
                    explanation: section.explanation,
                    codeExample: section.codeExample
                };
            } else {
                // ✅ New Section (Generate New ID)
                return {
                    _id: new mongoose.Types.ObjectId(),
                    title: section.title,
                    explanation: section.explanation,
                    codeExample: section.codeExample
                };
            }
        });

        // ✅ Handle Video (if provided)
        if (video) {
            chapter.video.url = video.url || chapter.video.url;
            chapter.video.thumbnail = video.thumbnail || chapter.video.thumbnail;
        }

        // ✅ Handle PPT (if provided)
        if (ppt) {
            chapter.ppt.title = ppt.title || chapter.ppt.title;
            chapter.ppt.link = ppt.link || chapter.ppt.link;
        }

        // ✅ Save the course
        await course.save();

        res.status(200).json({ 
            message: 'Chapter layout updated successfully', 
            chapter 
        });
    } catch (error) {
        console.error('Error updating chapter layout:', error);
        res.status(500).json({ 
            message: 'Failed to update chapter layout', 
            error: error.message 
        });
    }
};
