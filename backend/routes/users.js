const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Interview = require('../models/Interview');

const router = express.Router();
router.use(protect);

router.get('/dashboard', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const recentInterviews = await Interview.find({ user: req.user.id, status: 'completed' })
      .sort('-completedAt').limit(5)
      .select('technology analytics.overallScore completedAt type');

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyActivity = await Interview.aggregate([
      { $match: { user: user._id, createdAt: { $gte: weekAgo } } },
      { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 }, avgScore: { $avg: '$analytics.overallScore' } } }
    ]);

    res.json({
      success: true,
      data: { user: { name: user.name, email: user.email, plan: user.plan, stats: user.stats, techProgress: user.techProgress }, recentInterviews, weeklyActivity }
    });
  } catch (err) { next(err); }
});

router.get('/progress', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('techProgress stats');
    const techBreakdown = user.techProgress.map(t => ({
      technology: t.technology,
      accuracy: t.questionsAttempted > 0 ? Math.round((t.correctAnswers / t.questionsAttempted) * 100) : 0,
      questionsAttempted: t.questionsAttempted,
      lastPracticed: t.lastPracticed
    })).sort((a, b) => b.questionsAttempted - a.questionsAttempted);

    res.json({ success: true, data: { techBreakdown, overallStats: user.stats } });
  } catch (err) { next(err); }
});

module.exports = router;
