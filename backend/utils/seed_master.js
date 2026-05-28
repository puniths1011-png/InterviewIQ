const mongoose = require('mongoose');
const Question = require('../models/Question');
const connectDB = require('../config/database');

const generateQuestions = (tech, category, difficulty, count = 20) => {
  const qSet = [];
  for (let i = 1; i <= count; i++) {
    qSet.push({
      technology: tech,
      category: category,
      difficulty: difficulty,
      question: `${tech} Question ${i}: This is a sample technical question for ${tech}.`,
      options: [
        { text: 'Option A', isCorrect: false },
        { text: 'Option B', isCorrect: true },
        { text: 'Option C', isCorrect: false },
        { text: 'Option D', isCorrect: false }
      ],
      explanation: 'Standard technical explanation for sample question.',
      tags: [tech.toLowerCase(), 'sample'],
      points: 10
    });
  }
  return qSet;
};

const technologies = [
  { tech: 'React', cat: 'Frontend' }, { tech: 'Node.js', cat: 'Backend' }, { tech: 'MongoDB', cat: 'Database' },
  { tech: 'Express.js', cat: 'Backend' }, { tech: 'TypeScript', cat: 'Language' }, { tech: 'JavaScript', cat: 'Language' },
  { tech: 'CSS3', cat: 'Frontend' }, { tech: 'Next.js', cat: 'Frontend' }, { tech: 'Python', cat: 'Language' },
  { tech: 'Java', cat: 'Language' }, { tech: 'Docker', cat: 'DevOps' }, { tech: 'Kubernetes', cat: 'DevOps' },
  { tech: 'GraphQL', cat: 'API' }, { tech: 'Webpack', cat: 'DevOps' },
  { tech: 'Jest', cat: 'Testing' }, { tech: 'Git', cat: 'DevOps' }, { tech: 'REST APIs', cat: 'API' },
  { tech: 'PostgreSQL', cat: 'Database' }, { tech: 'ML Basics', cat: 'AI' }
];

async function seed() {
  await connectDB();
  console.log('Cleaning database...');
  await Question.deleteMany({});

  let allQuestions = [];
  technologies.forEach(t => {
    allQuestions = allQuestions.concat(generateQuestions(t.tech, t.cat, 'medium', 20));
  });

  await Question.insertMany(allQuestions);
  console.log(`Successfully seeded ${allQuestions.length} questions (20 per technology).`);
  process.exit();
}
seed();
