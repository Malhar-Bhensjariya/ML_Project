const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');


exports.register = async (req, res) => {
    try {
        const { name, email, password, userType, ...rest } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType,
            ...rest
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user
        });

    } catch (err) {
        console.error('❌ Error in Registration:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updating password via this route
        if (updates.password) {
            return res.status(400).json({ message: "Password update is not allowed via this route." });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (err) {
        console.error("❌ Error updating user:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};
