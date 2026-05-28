const express = require('express');
const router = express.Router();
const { getQuestions, getTechnologies, getQuestion, submitAnswer, getQuiz } = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

router.get('/technologies', getTechnologies);
router.get('/categories', getTechnologies);
router.get('/quiz/:technology', protect, getQuiz);
router.get('/', protect, getQuestions);
router.get('/:id', protect, getQuestion);
router.post('/:id/submit', protect, submitAnswer);

module.exports = router;
