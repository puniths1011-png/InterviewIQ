// ============================================================
// routes/resume.js
// ============================================================
const express = require('express');
const resumeRouter = express.Router();
const { upload, uploadResume, startResumeInterview, queryResumeContent, analyzeResumeAdvanced } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

resumeRouter.use(protect);
resumeRouter.post('/upload', upload.single('resume'), uploadResume);
resumeRouter.post('/analyze', upload.single('resume'), analyzeResumeAdvanced);
resumeRouter.post('/start-interview', startResumeInterview);
resumeRouter.post('/:id/query', queryResumeContent);

module.exports = resumeRouter;
