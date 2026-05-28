const express = require('express');
const router = express.Router();
const {
  generateAIQuestions,
  startInterview,
  submitInterviewAnswer,
  completeInterview,
  getMyInterviews,
  getInterview,
  deleteInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.use(protect); // All interview routes require auth

router.post('/generate-questions', generateAIQuestions);
router.post('/start', startInterview);
router.get('/', getMyInterviews);
router.get('/:id', getInterview);
router.post('/:id/answer', submitInterviewAnswer);
router.post('/:id/complete', completeInterview);
router.delete('/:id', deleteInterview);

module.exports = router;
