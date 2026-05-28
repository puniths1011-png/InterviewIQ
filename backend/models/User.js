const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: { type: String, default: null },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  experienceLevel: {
    type: String,
    enum: ['junior', 'mid', 'senior', 'expert'],
    default: 'junior'
  },
  preferredTech: [{ type: String }],
  stats: {
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    points: { type: Number, default: 0 }
  },
  techProgress: [{
    technology: String,
    questionsAttempted: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    lastPracticed: Date
  }],
  notifications: {
    dailyReminder: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update streak
userSchema.methods.updateStreak = function () {
  const today = new Date();
  const lastActive = new Date(this.stats.lastActiveDate);
  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

  if (daysDiff === 1) {
    this.stats.streak += 1;
  } else if (daysDiff > 1) {
    this.stats.streak = 1;
  }
  this.stats.lastActiveDate = today;
};

// Get accuracy percentage
userSchema.virtual('accuracy').get(function () {
  if (this.stats.totalQuestions === 0) return 0;
  return Math.round((this.stats.correctAnswers / this.stats.totalQuestions) * 100);
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
