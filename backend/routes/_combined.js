const express = require('express');
const { protect } = require('../middleware/auth');
const Interview = require('../models/Interview');
const User = require('../models/User');

// ─── Feedback Router ────────────────────────────────────────
const feedbackRouter = express.Router();
feedbackRouter.use(protect);

// GET /api/feedback/latest — most recent completed interview report
feedbackRouter.get('/latest', async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      user: req.user.id,
      status: 'completed'
    }).sort('-completedAt');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'No completed interviews found.' });
    }
    res.json({ success: true, data: interview });
  } catch (err) { next(err); }
});

// GET /api/feedback/:interviewId — full feedback for one interview
feedbackRouter.get('/:interviewId', async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.interviewId,
      user: req.user.id,
      status: 'completed'
    });
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found.' });
    res.json({ success: true, data: interview });
  } catch (err) { next(err); }
});

// ─── Users Router ────────────────────────────────────────────
const usersRouter = express.Router();
usersRouter.use(protect);

// GET /api/users/dashboard — aggregated dashboard data
usersRouter.get('/dashboard', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const recentInterviews = await Interview.find({ user: req.user.id, status: 'completed' })
      .sort('-completedAt').limit(5)
      .select('technology analytics.overallScore completedAt type');

    // Weekly activity (last 7 days)
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyActivity = await Interview.aggregate([
      { $match: { user: user._id, createdAt: { $gte: weekAgo } } },
      { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 }, avgScore: { $avg: '$analytics.overallScore' } } }
    ]);

    res.json({
      success: true,
      data: {
        user: { name: user.name, email: user.email, plan: user.plan, stats: user.stats, techProgress: user.techProgress },
        recentInterviews,
        weeklyActivity
      }
    });
  } catch (err) { next(err); }
});

// GET /api/users/progress — tech progress breakdown
usersRouter.get('/progress', async (req, res, next) => {
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

// ─── Leaderboard Router ──────────────────────────────────────
const leaderboardRouter = express.Router();
leaderboardRouter.use(protect);

// GET /api/leaderboard — top users by points
leaderboardRouter.get('/', async (req, res, next) => {
  try {
    const { limit = 20, tech } = req.query;

    let pipeline = [
      { $match: { isActive: true } },
      { $sort: { 'stats.points': -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          name: 1, plan: 1,
          points: '$stats.points',
          totalInterviews: '$stats.totalInterviews',
          accuracy: '$stats.averageScore',
          streak: '$stats.streak'
        }
      }
    ];

    const topUsers = await User.aggregate(pipeline);

    // Find current user's rank
    const userRank = await User.countDocuments({ 'stats.points': { $gt: req.user.stats.points } }) + 1;

    res.json({
      success: true,
      data: topUsers.map((u, i) => ({ ...u, rank: i + 1, isMe: u._id.toString() === req.user.id })),
      myRank: userRank,
      myPoints: req.user.stats.points
    });
  } catch (err) { next(err); }
});

module.exports = { feedbackRouter, usersRouter, leaderboardRouter };
