const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  technology: {
    type: String,
    required: true,
    index: true,
    enum: [
      'React', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript',
      'JavaScript', 'CSS3', 'Next.js', 'Python', 'Java',
      'Docker', 'Kubernetes', 'GraphQL', 'Webpack',
      'Jest', 'Git', 'REST APIs', 'PostgreSQL', 'ML Basics'
    ]
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Language', 'Testing', 'API', 'AI'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['mcq', 'true-false', 'code'],
    default: 'mcq'
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  codeSnippet: {
    type: String,
    default: null
  },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  explanation: {
    type: String,
    required: true
  },
  tags: [{ type: String }],
  timeLimit: { type: Number, default: 90 }, // seconds
  points: { type: Number, default: 10 },
  stats: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    avgTimeSpent: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Virtual for success rate
questionSchema.virtual('successRate').get(function () {
  if (this.stats.totalAttempts === 0) return 0;
  return Math.round((this.stats.correctAttempts / this.stats.totalAttempts) * 100);
});

questionSchema.index({ technology: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema);
