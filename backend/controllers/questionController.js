const Question = require('../models/Question');
const User = require('../models/User');

// @route   GET /api/questions
// Query params: technology, difficulty, type, limit, page
const getQuestions = async (req, res, next) => {
  try {
    const { technology, difficulty, type, limit = 10, page = 1, shuffle = false } = req.query;

    const filter = { isActive: true };
    if (technology) filter.technology = technology;
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Question.countDocuments(filter);

    let query = Question.find(filter)
      .select('-options.isCorrect')
      .sort({ createdAt: 1 }) // Ensuring consistent ascending order
      .skip(skip)
      .limit(parseInt(limit));

    if (shuffle === 'true') {
      // Randomize with aggregation
      const questions = await Question.aggregate([
        { $match: filter },
        { $sample: { size: parseInt(limit) } },
        { $project: { 'options.isCorrect': 0 } }
      ]);
      return res.json({ success: true, count: questions.length, total, data: questions });
    }

    const questions = await query;

    res.json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: questions
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/questions/technologies
const getTechnologies = async (req, res, next) => {
  try {
    const stats = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$technology',
          count: { $sum: 1 },
          category: { $first: '$category' },
          difficulties: { $addToSet: '$difficulty' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/questions/:id
const getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).select('-options.isCorrect');
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/questions/:id/submit
// Submit an answer and get result + update stats
const submitAnswer = async (req, res, next) => {
  try {
    const { selectedOptionIndex, timeSpent } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const isCorrect = question.options[selectedOptionIndex]?.isCorrect === true;

    // Update question stats
    question.stats.totalAttempts += 1;
    if (isCorrect) question.stats.correctAttempts += 1;
    if (timeSpent) {
      question.stats.avgTimeSpent = Math.round(
        (question.stats.avgTimeSpent * (question.stats.totalAttempts - 1) + timeSpent) /
        question.stats.totalAttempts
      );
    }
    await question.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.totalQuestions += 1;
    if (isCorrect) {
      user.stats.correctAnswers += 1;
      user.stats.points += question.points;
    }

    // Update tech progress
    const techIdx = user.techProgress.findIndex(t => t.technology === question.technology);
    if (techIdx >= 0) {
      user.techProgress[techIdx].questionsAttempted += 1;
      if (isCorrect) user.techProgress[techIdx].correctAnswers += 1;
      user.techProgress[techIdx].lastPracticed = new Date();
    } else {
      user.techProgress.push({
        technology: question.technology,
        questionsAttempted: 1,
        correctAnswers: isCorrect ? 1 : 0,
        lastPracticed: new Date()
      });
    }

    user.stats.averageScore = Math.round(
      (user.stats.correctAnswers / user.stats.totalQuestions) * 100
    );
    await user.save();

    const correctOptionIndex = question.options.findIndex(o => o.isCorrect);

    res.json({
      success: true,
      isCorrect,
      correctOptionIndex,
      explanation: question.explanation,
      points: isCorrect ? question.points : 0,
      userStats: {
        totalQuestions: user.stats.totalQuestions,
        accuracy: user.stats.averageScore,
        points: user.stats.points
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/questions/quiz/:technology
// Get a full quiz set for a technology
const getQuiz = async (req, res, next) => {
  try {
    const { technology } = req.params;
    const { count = 10, difficulty } = req.query;

    const filter = { technology, isActive: true };
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(count) } },
      {
        $project: {
          question: 1, technology: 1, difficulty: 1, type: 1,
          codeSnippet: 1, timeLimit: 1, points: 1, tags: 1,
          options: { $map: { input: '$options', as: 'opt', in: { text: '$$opt.text' } } }
        }
      }
    ]);

    res.json({ success: true, count: questions.length, technology, data: questions });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestions, getTechnologies, getQuestion, submitAnswer, getQuiz };
