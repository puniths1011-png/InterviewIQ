const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionNumber: Number,
  question: String,
  userAnswer: String,
  aiAnalysis: {
    score: { type: Number, min: 0, max: 100 },
    feedback: String,
    strengths: [String],
    improvements: [String],
    grade: { type: String, enum: ['Excellent', 'Good', 'Average', 'Poor'] }
  },
  timeSpent: Number, // seconds
  skipped: { type: Boolean, default: false }
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['ai-mock', 'resume-based', 'mcq-session'],
    required: true
  },
  technology: { type: String, required: true },
  experienceLevel: {
    type: String,
    enum: ['junior', 'mid', 'senior', 'expert'],
    default: 'junior'
  },
  mode: {
    type: String,
    enum: ['text', 'voice'],
    default: 'text'
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },

  // Questions and answers
  questions: [String],
  answers: [answerSchema],

  // Resume-based interview extras
  resumeData: {
    filename: String,
    parsedText: String,
    skills: [String],
    experience: [String],
    education: [String],
    resumeAnalysis: {
      atsScore: Number,
      experienceLevel: String,
      detectedDomains: [String],
      strengths: [String],
      missingSkills: [String],
      recommendedRoles: [String]
    }
  },

  // Session analytics
  analytics: {
    totalQuestions: { type: Number, default: 10 },
    answeredQuestions: { type: Number, default: 0 },
    skippedQuestions: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    totalDuration: Number, // seconds
    metrics: {
      technicalAccuracy: Number,
      communication: Number,
      problemSolving: Number,
      codeKnowledge: Number,
      systemThinking: Number
    }
  },

  // AI conversation history (for context)
  conversationHistory: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],

  startedAt: { type: Date, default: Date.now },
  completedAt: Date

}, { timestamps: true });

// Calculate overall score before save
interviewSchema.pre('save', function (next) {
  if (this.answers && this.answers.length > 0) {
    const answered = this.answers.filter(a => !a.skipped);
    if (answered.length > 0) {
      const total = answered.reduce((sum, a) => sum + (a.aiAnalysis?.score || 0), 0);
      this.analytics.overallScore = Math.round(total / answered.length);
    }
    this.analytics.answeredQuestions = answered.length;
    this.analytics.skippedQuestions = this.answers.filter(a => a.skipped).length;
  }
  next();
});

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ technology: 1, status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
