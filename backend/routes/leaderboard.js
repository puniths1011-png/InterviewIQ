const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const topUsers = await User.aggregate([
      { $match: { isActive: true } },
      { $sort: { 'stats.points': -1 } },
      { $limit: parseInt(limit) },
      { $project: { name: 1, plan: 1, points: '$stats.points', totalInterviews: '$stats.totalInterviews', accuracy: '$stats.averageScore', streak: '$stats.streak' } }
    ]);

    const userRank = await User.countDocuments({ 'stats.points': { $gt: req.user.stats.points } }) + 1;

    res.json({
      success: true,
      data: topUsers.map((u, i) => ({ ...u, rank: i + 1, isMe: u._id.toString() === req.user.id })),
      myRank: userRank,
      myPoints: req.user.stats.points
    });
  } catch (err) { next(err); }
});

module.exports = router;
