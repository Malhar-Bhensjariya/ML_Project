const express = require('express');
const router = express.Router();
const menteeProfileController = require('../controllers/menteeProfileController');
const auth = require('../middleware/authMiddleware');
// const validateProfile = require('../middleware/validateProfile');

router.get('/profile', auth, menteeProfileController.getProfile);
router.post('/profile', auth, menteeProfileController.updateProfile);
router.put('/profile', auth,  menteeProfileController.editProfile);

module.exports = router;
