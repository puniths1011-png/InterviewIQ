const mongoose = require('mongoose');
require('dotenv').config();
const LearningPath = require('../models/LearningPath');
const connectDB = require('../config/database');

const samplePaths = [
  {
    id: 1,
    title: 'Frontend Development',
    level: 'Beginner',
    emoji: '💻',
    desc: 'Master the basics of web development with HTML, CSS, and JavaScript.',
    category: 'Web Development',
    color: '#3B82F6',
    modules: 5,
    topics: [
      { name: 'HTML5 Basics', content: ['Tags and Elements', 'Forms and Inputs', 'Semantic HTML'] },
      { name: 'CSS Fundamentals', content: ['Box Model', 'Flexbox', 'Grid'] },
      { name: 'JavaScript Intro', content: ['Variables', 'Functions', 'DOM Manipulation'] }
    ]
  },
  {
    id: 2,
    title: 'Backend Engineering',
    level: 'Intermediate',
    emoji: '⚙️',
    desc: 'Learn how to build scalable server-side applications and APIs.',
    category: 'Software Engineering',
    color: '#10B981',
    modules: 8,
    topics: [
      { name: 'Node.js Basics', content: ['Event Loop', 'File System', 'Modules'] },
      { name: 'Express Framework', content: ['Routing', 'Middleware', 'Error Handling'] },
      { name: 'Database Design', content: ['SQL vs NoSQL', 'MongoDB Basics', 'Mongoose'] }
    ]
  },
  {
    id: 3,
    title: 'System Design',
    level: 'Advanced',
    emoji: '🏗️',
    desc: 'Architect high-availability systems and distributed services.',
    category: 'Architecture',
    color: '#8B5CF6',
    modules: 12,
    topics: [
      { name: 'Scalability', content: ['Vertical vs Horizontal Scaling', 'Load Balancing'] },
      { name: 'Caching', content: ['Redis', 'CDN', 'Cache Invalidation'] },
      { name: 'Distributed Systems', content: ['Microservices', 'Message Queues', 'CAP Theorem'] }
    ]
  }
];

const seedLearningPaths = async () => {
  try {
    await connectDB();
    await LearningPath.deleteMany();
    console.log('🗑️  Cleared existing learning paths');
    await LearningPath.insertMany(samplePaths);
    console.log('✅  Successfully seeded learning paths with numeric IDs');
    process.exit();
  } catch (err) {
    console.error('❌  Error seeding database:', err.message);
    process.exit(1);
  }
};

seedLearningPaths();
