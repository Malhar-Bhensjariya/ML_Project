const express = require("express");
const { generateCourseLayout } = require("../controllers/generateCourseController");

const router = express.Router();
router.post("/generate-course", generateCourseLayout);

module.exports = router;
