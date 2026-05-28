const express = require('express');
const { protect } = require('../middleware/auth');
const Interview = require('../models/Interview');

const router = express.Router();
router.use(protect);

router.get('/latest', async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ user: req.user.id, status: 'completed' }).sort('-completedAt');
    if (!interview) return res.status(404).json({ success: false, message: 'No completed interviews found.' });
    res.json({ success: true, data: interview });
  } catch (err) { next(err); }
});

router.get('/:interviewId', async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.interviewId, user: req.user.id, status: 'completed' });
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found.' });
    res.json({ success: true, data: interview });
  } catch (err) { next(err); }
});

module.exports = router;
