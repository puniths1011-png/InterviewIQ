const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Numeric ID for frontend compatibility
  title: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  emoji: { type: String },
  desc: { type: String },
  category: { type: String, required: true },
  color: { type: String },
  topics: [{
    name: String,
    content: [String]
  }],
  modules: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('LearningPath', learningPathSchema);
