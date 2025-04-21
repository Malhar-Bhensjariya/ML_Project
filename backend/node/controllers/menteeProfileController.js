const User = require('../models/UserModel');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('mentor', 'name email')
            .populate('mentees', 'name email');

        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Ensure required fields are present for students
        if (req.user.userType === 'Student') {
            if (!updates.education || !updates.futureGoals) {
                return res.status(400).json({
                    message: 'Education and future goals are required for students'
                });
            }
        }

        // Filter out empty arrays for optional sections
        ['extracurricular', 'internships', 'achievements'].forEach(field => {
            if (Array.isArray(updates[field]) && updates[field].length === 0) {
                delete updates[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Profile update failed', error: error.message });
    }
};

// Edit Profile (Ensures profileCompleted is not reset)
exports.editProfile = async (req, res) => {
    try {
        const updates = req.body;
        updates.profileCompleted = true;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Profile edit failed', error: error.message });
    }
};
