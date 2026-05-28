const Interview = require('../models/Interview');
const User = require('../models/User');
const Question = require('../models/Question');
const {
  generateInterviewQuestions,
  generateMockQuestions,
  analyzeAnswer,
  generateFullReport,
  getAIInterviewerResponse
} = require('../services/aiService');

// @route   POST /api/interviews/generate-questions
const generateAIQuestions = async (req, res, next) => {
  try {
    let { technology, experienceLevel } = req.body;

    if (!technology || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both technology and experience level.'
      });
    }

    // Normalize experienceLevel to match Model enum (e.g., "Mid-Level" -> "mid")
    experienceLevel = experienceLevel.toLowerCase();
    if (experienceLevel.includes('mid')) experienceLevel = 'mid';
    if (experienceLevel.includes('junior')) experienceLevel = 'junior';
    if (experienceLevel.includes('senior')) experienceLevel = 'senior';
    if (experienceLevel.includes('expert') || experienceLevel.includes('lead') || experienceLevel.includes('staff')) experienceLevel = 'expert';

    const result = await generateMockQuestions({
      technology,
      experienceLevel
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/interviews/start
const startInterview = async (req, res, next) => {
  try {
    let { technology, experienceLevel, mode, type = 'ai-mock' } = req.body;
    
    // Normalize experienceLevel to match Model enum
    experienceLevel = (experienceLevel || req.user.experienceLevel || 'junior').toLowerCase();
    if (experienceLevel.includes('mid')) experienceLevel = 'mid';
    else if (experienceLevel.includes('junior')) experienceLevel = 'junior';
    else if (experienceLevel.includes('senior')) experienceLevel = 'senior';
    else if (experienceLevel.includes('expert') || experienceLevel.includes('lead') || experienceLevel.includes('staff')) experienceLevel = 'expert';

    let questionsData = [];
    let correctAnswers = [];

    if (type === 'mcq-session') {
      const filter = { 
        technology: { $regex: new RegExp(`^${technology}$`, 'i') }, 
        isActive: true 
      };
      // Map experience level to difficulty
      if (experienceLevel) filter.difficulty = experienceLevel;

      const rawQuestions = await Question.aggregate([
        { $match: filter },
        { $sample: { size: 10 } }
      ]);

      if (rawQuestions.length === 0) {
        delete filter.difficulty;
        const fallbackQuestions = await Question.aggregate([
          { $match: filter },
          { $sample: { size: 10 } }
        ]);
        rawQuestions.push(...fallbackQuestions);
      }

      questionsData = rawQuestions.map(q => ({
        id: q._id,
        question: q.question,
        options: q.options.map(o => ({ text: o.text })),
        type: 'mcq'
      }));
      correctAnswers = rawQuestions.map(q => q.options.findIndex(o => o.isCorrect));
    } else {
      // Generate 10 questions with AI
      const generatedQuestions = await generateInterviewQuestions({
        technology,
        experienceLevel
      });
      questionsData = generatedQuestions;
    }

    const questionTexts = questionsData.map(q => typeof q === 'string' ? q : q.question);

    const interview = await Interview.create({
      user: req.user.id,
      type,
      technology,
      experienceLevel: experienceLevel || req.user.experienceLevel,
      mode: mode || 'text',
      questions: questionsData,
      correctAnswers,
      analytics: { totalQuestions: questionsData.length },
      conversationHistory: [{
        role: 'assistant',
        content: `Hello! I'm Alex, your AI interviewer today. I'll be asking you ${questionsData.length} questions focused on ${technology}. Let's begin!\n\nQuestion 1: ${questionTexts[0]}`
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Interview session started!',
      interviewId: interview._id,
      questions: questionsData,
      firstMessage: interview.conversationHistory[0].content
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/interviews/:id/answer
// Submit one answer, get AI response + transition to next question
const submitInterviewAnswer = async (req, res, next) => {
  try {
    const { answer, questionIndex, timeSpent } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }
    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    if (interview.status !== 'in-progress') {
      return res.status(400).json({ success: false, message: 'Interview is not active.' });
    }

    const currentQuestionData = interview.questions[questionIndex];
    const currentQuestionText = typeof currentQuestionData === 'string' 
      ? currentQuestionData 
      : (currentQuestionData.question || 'Next Question');

    const isLast = questionIndex >= interview.questions.length - 1;
    const nextQuestionData = isLast ? null : interview.questions[questionIndex + 1];
    const nextQuestionText = nextQuestionData 
      ? (typeof nextQuestionData === 'string' ? nextQuestionData : nextQuestionData.question)
      : null;

    // Analyze answer with AI (async — don't block the response)
    let analysis;
    try {
      analysis = await analyzeAnswer({
        question: currentQuestionText,
        answer,
        technology: interview.technology,
        experienceLevel: interview.experienceLevel,
        questionType: 'technical'
      });
    } catch (aiErr) {
      console.error('AI analysis error:', aiErr.message);
      analysis = {
        score: 50, grade: 'Average',
        feedback: 'Analysis unavailable.',
        strengths: [], improvements: []
      };
    }

    // Get AI interviewer conversational reply
    let aiResponse = '';
    try {
      aiResponse = await getAIInterviewerResponse({
        conversationHistory: interview.conversationHistory.map(m => ({
          role: m.role, content: m.content
        })),
        currentQuestion: nextQuestionText,
        userAnswer: answer,
        questionNumber: questionIndex + 1,
        totalQuestions: interview.questions.length
      });
    } catch (err) {
      aiResponse = isLast
        ? 'Great effort! Your interview is complete. Generating your feedback report now...'
        : `Thank you for that answer. Let's move on. Question ${questionIndex + 2}: ${nextQuestionText}`;
    }

    // Record answer
    interview.answers.push({
      questionNumber: questionIndex + 1,
      question: currentQuestionText,
      userAnswer: answer,
      aiAnalysis: analysis,
      timeSpent,
      skipped: answer === '[Skipped]'
    });

    // Update conversation history
    interview.conversationHistory.push(
      { role: 'user', content: answer },
      { role: 'assistant', content: aiResponse }
    );

    if (isLast) {
      interview.status = 'completed';
      interview.completedAt = new Date();
      interview.analytics.totalDuration = timeSpent;

      // Update user stats
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'stats.totalInterviews': 1, 'stats.points': Math.round(analysis.score / 10) }
      });
    }

    await interview.save();

    res.json({
      success: true,
      questionIndex,
      isLast,
      aiResponse,
      analysis: {
        score: analysis.score,
        grade: analysis.grade,
        feedback: analysis.feedback
      },
      nextQuestion: isLast ? null : {
        index: questionIndex + 1,
        question: nextQuestionText
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/interviews/:id/complete
// Generate full report for completed interview
const completeInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found.' });
    if (interview.user.toString() !== req.user.id) return res.status(403).json({ success: false });

    const fullReport = await generateFullReport({
      technology: interview.technology,
      experienceLevel: interview.experienceLevel,
      answers: interview.answers,
      type: interview.type
    });

    // Save metrics to interview
    interview.analytics.metrics = fullReport.metrics;
    interview.analytics.overallScore = Math.round(
      Object.values(fullReport.metrics).reduce((a, b) => a + b, 0) / 5
    );
    await interview.save();

    // Update user average score
    const userInterviews = await Interview.find({ user: req.user.id, status: 'completed' });
    const avgScore = userInterviews.reduce((sum, i) => sum + i.analytics.overallScore, 0) / userInterviews.length;
    await User.findByIdAndUpdate(req.user.id, { 'stats.averageScore': Math.round(avgScore) });

    res.json({ success: true, report: fullReport, interview });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/interviews
const getMyInterviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, technology } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (technology) filter.technology = technology;

    const interviews = await Interview.find(filter)
      .select('type technology experienceLevel status analytics startedAt completedAt')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Interview.countDocuments(filter);

    res.json({ success: true, count: interviews.length, total, data: interviews });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/interviews/:id
const getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('user', 'name email');
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found.' });
    if (interview.user._id.toString() !== req.user.id) return res.status(403).json({ success: false });

    res.json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/interviews/:id
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found.' });
    if (interview.user.toString() !== req.user.id) return res.status(403).json({ success: false });

    await interview.deleteOne();
    res.json({ success: true, message: 'Interview deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateAIQuestions,
  startInterview,
  submitInterviewAnswer,
  completeInterview,
  getMyInterviews,
  getInterview,
  deleteInterview
};
