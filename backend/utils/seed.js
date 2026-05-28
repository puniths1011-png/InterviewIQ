require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const User = require('../models/User');

const connectDB = require('../config/database');

const questions = [
  // ── REACT ──────────────────────────────────────────────────────
  {
    technology: 'React', category: 'Frontend', difficulty: 'easy',
    question: 'What is the purpose of the key prop in React lists?',
    options: [
      { text: 'To style list items', isCorrect: false },
      { text: 'To help React identify which items have changed, added, or removed', isCorrect: true },
      { text: 'To pass data between components', isCorrect: false },
      { text: 'To trigger re-renders', isCorrect: false }
    ],
    explanation: 'Keys help React identify which items in a list have changed, been added, or removed, enabling efficient reconciliation of the virtual DOM.',
    tags: ['lists', 'reconciliation', 'virtual-dom'], points: 10
  },
  {
    technology: 'React', category: 'Frontend', difficulty: 'medium',
    question: 'What is the difference between useMemo and useCallback?',
    options: [
      { text: 'They are identical hooks', isCorrect: false },
      { text: 'useMemo memoizes a value; useCallback memoizes a function', isCorrect: true },
      { text: 'useCallback memoizes a value; useMemo memoizes a function', isCorrect: false },
      { text: 'useMemo is for class components only', isCorrect: false }
    ],
    explanation: 'useMemo returns a memoized value (result of a computation), while useCallback returns a memoized function reference. Both accept dependency arrays.',
    tags: ['hooks', 'performance', 'memoization'], points: 15
  },
  {
    technology: 'React', category: 'Frontend', difficulty: 'hard',
    question: 'What does React.StrictMode do in development?',
    options: [
      { text: 'Prevents all console errors', isCorrect: false },
      { text: 'Enables TypeScript type checking', isCorrect: false },
      { text: 'Intentionally double-invokes certain functions to detect side effects', isCorrect: true },
      { text: 'Disables all lifecycle methods', isCorrect: false }
    ],
    explanation: 'React.StrictMode double-invokes render methods, useState updaters, and other functions in development to surface side effects and deprecated API usage.',
    tags: ['strict-mode', 'debugging', 'side-effects'], points: 20
  },

  // ── NODE.JS ────────────────────────────────────────────────────
  {
    technology: 'Node.js', category: 'Backend', difficulty: 'easy',
    question: 'What is the Node.js event loop?',
    options: [
      { text: 'A loop that runs JavaScript synchronously', isCorrect: false },
      { text: 'A mechanism that allows Node.js to perform non-blocking I/O operations', isCorrect: true },
      { text: 'A built-in caching mechanism', isCorrect: false },
      { text: 'A loop for iterating over arrays', isCorrect: false }
    ],
    explanation: 'The event loop allows Node.js to perform non-blocking I/O by offloading operations to the system kernel and processing callbacks when operations complete.',
    tags: ['event-loop', 'async', 'non-blocking'], points: 10
  },
  {
    technology: 'Node.js', category: 'Backend', difficulty: 'medium',
    question: 'What is the difference between process.nextTick() and setImmediate()?',
    options: [
      { text: 'They behave identically', isCorrect: false },
      { text: 'process.nextTick() fires before I/O callbacks; setImmediate() fires after', isCorrect: true },
      { text: 'setImmediate() fires before I/O callbacks; process.nextTick() fires after', isCorrect: false },
      { text: 'process.nextTick() is deprecated', isCorrect: false }
    ],
    explanation: 'process.nextTick() callbacks execute before any I/O events in the current iteration. setImmediate() executes in the check phase, after I/O events.',
    tags: ['event-loop', 'timers', 'nextTick'], points: 15
  },
  {
    technology: 'Node.js', category: 'Backend', difficulty: 'hard',
    question: 'How does Node.js handle CPU-intensive tasks without blocking the event loop?',
    options: [
      { text: 'It cannot handle CPU-intensive tasks', isCorrect: false },
      { text: 'By using Worker Threads or child_process module', isCorrect: true },
      { text: 'By automatically spawning new processes', isCorrect: false },
      { text: 'By using async/await syntax', isCorrect: false }
    ],
    explanation: 'Worker Threads (worker_threads module) allow CPU-intensive JavaScript operations to run in parallel threads. child_process.fork() can also spawn separate Node processes.',
    tags: ['worker-threads', 'cpu-intensive', 'performance'], points: 20
  },

  // ── MONGODB ─────────────────────────────────────────────────────
  {
    technology: 'MongoDB', category: 'Database', difficulty: 'easy',
    question: 'What type of database is MongoDB?',
    options: [
      { text: 'Relational database', isCorrect: false },
      { text: 'Document-oriented NoSQL database', isCorrect: true },
      { text: 'Key-value store', isCorrect: false },
      { text: 'Graph database', isCorrect: false }
    ],
    explanation: 'MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like BSON documents rather than rows and columns.',
    tags: ['nosql', 'document', 'bson'], points: 10
  },
  {
    technology: 'MongoDB', category: 'Database', difficulty: 'medium',
    question: 'What is the aggregation pipeline in MongoDB?',
    options: [
      { text: 'A way to insert bulk documents', isCorrect: false },
      { text: 'A framework for data aggregation using stages that transform documents', isCorrect: true },
      { text: 'A replication mechanism', isCorrect: false },
      { text: 'An indexing strategy', isCorrect: false }
    ],
    explanation: 'The aggregation pipeline processes documents through multiple stages ($match, $group, $sort, $project, etc.) to perform complex data transformations and analytics.',
    tags: ['aggregation', 'pipeline', 'analytics'], points: 15
  },
  {
    technology: 'MongoDB', category: 'Database', difficulty: 'hard',
    question: 'What is the difference between an embedded document and a reference in MongoDB?',
    options: [
      { text: 'There is no difference', isCorrect: false },
      { text: 'Embedded stores related data in one document; references store IDs linking to other collections', isCorrect: true },
      { text: 'References store data inline; embedded use ObjectIds', isCorrect: false },
      { text: 'Only embedded documents support indexing', isCorrect: false }
    ],
    explanation: 'Embedding denormalizes data into a single document (faster reads, atomic updates). References normalize data across collections (avoids duplication, suits large/frequently-updated subdocuments).',
    tags: ['schema-design', 'embedding', 'references'], points: 20
  },

  // ── EXPRESS.JS ──────────────────────────────────────────────────
  {
    technology: 'Express.js', category: 'Backend', difficulty: 'easy',
    question: 'What is middleware in Express.js?',
    options: [
      { text: 'A database connection layer', isCorrect: false },
      { text: 'Functions that execute during the request-response cycle', isCorrect: true },
      { text: 'A template engine', isCorrect: false },
      { text: 'A routing algorithm', isCorrect: false }
    ],
    explanation: 'Middleware functions have access to req, res, and next(). They can execute code, modify req/res, end the cycle, or call next() to pass control to the next middleware.',
    tags: ['middleware', 'request-response', 'pipeline'], points: 10
  },
  {
    technology: 'Express.js', category: 'Backend', difficulty: 'medium',
    question: 'What is the purpose of express.Router()?',
    options: [
      { text: 'To connect to a database', isCorrect: false },
      { text: 'To create modular, mountable route handlers', isCorrect: true },
      { text: 'To serve static files', isCorrect: false },
      { text: 'To handle WebSocket connections', isCorrect: false }
    ],
    explanation: 'express.Router() creates a mini Express application with its own route and middleware stack, enabling modular route organization.',
    tags: ['router', 'modular', 'routes'], points: 15
  },

  // ── TYPESCRIPT ──────────────────────────────────────────────────
  {
    technology: 'TypeScript', category: 'Language', difficulty: 'easy',
    question: 'What is the difference between interface and type in TypeScript?',
    options: [
      { text: 'They are completely interchangeable with no differences', isCorrect: false },
      { text: 'interface can be extended/merged; type supports unions and computed types', isCorrect: true },
      { text: 'type can only be used for primitives', isCorrect: false },
      { text: 'interface cannot describe function types', isCorrect: false }
    ],
    explanation: 'Interfaces support declaration merging and are better for OOP patterns. Types are more flexible, supporting union types, intersection types, and mapped types.',
    tags: ['interface', 'type', 'typescript-basics'], points: 10
  },
  {
    technology: 'TypeScript', category: 'Language', difficulty: 'hard',
    question: 'What are TypeScript generics used for?',
    options: [
      { text: 'To create components that work with only one type', isCorrect: false },
      { text: 'To create reusable components that work with any type while maintaining type safety', isCorrect: true },
      { text: 'To cast types at runtime', isCorrect: false },
      { text: 'To replace interfaces', isCorrect: false }
    ],
    explanation: 'Generics enable writing flexible, reusable code components. A generic function or class operates on a type parameter (T), preserving type information throughout.',
    codeSnippet: 'function identity<T>(arg: T): T { return arg; }',
    tags: ['generics', 'type-safety', 'reusability'], points: 20
  },

  // ── JAVASCRIPT ──────────────────────────────────────────────────
  {
    technology: 'JavaScript', category: 'Language', difficulty: 'easy',
    question: 'What is a closure in JavaScript?',
    options: [
      { text: 'A way to close a browser window', isCorrect: false },
      { text: 'A function that retains access to its outer scope even after that scope has closed', isCorrect: true },
      { text: 'A method to terminate loops', isCorrect: false },
      { text: 'An ES6 class feature', isCorrect: false }
    ],
    explanation: 'A closure is a function that "remembers" the variables from its outer lexical scope, even when that outer function has finished executing.',
    tags: ['closures', 'scope', 'lexical-environment'], points: 10
  },
  {
    technology: 'JavaScript', category: 'Language', difficulty: 'medium',
    question: 'What is the difference between == and === in JavaScript?',
    options: [
      { text: 'No difference; they are identical', isCorrect: false },
      { text: '== performs type coercion; === checks type and value strictly', isCorrect: true },
      { text: '=== performs type coercion; == is strict', isCorrect: false },
      { text: '== only works with numbers', isCorrect: false }
    ],
    explanation: 'The == operator coerces types before comparison (e.g., "1" == 1 is true). The === operator requires both value AND type to match (e.g., "1" === 1 is false).',
    tags: ['equality', 'type-coercion', 'comparison'], points: 15
  },
  {
    technology: 'JavaScript', category: 'Language', difficulty: 'hard',
    question: 'What does the following code output?\n\nconsole.log(typeof null)',
    options: [
      { text: '"null"', isCorrect: false },
      { text: '"undefined"', isCorrect: false },
      { text: '"object"', isCorrect: true },
      { text: '"boolean"', isCorrect: false }
    ],
    explanation: 'typeof null === "object" is a well-known JavaScript bug from the original implementation. null is a primitive, not an object, but typeof returns "object" for historical reasons.',
    codeSnippet: 'console.log(typeof null); // "object"',
    tags: ['typeof', 'null', 'quirks'], points: 20
  },

  // ── DOCKER ──────────────────────────────────────────────────────
  {
    technology: 'Docker', category: 'DevOps', difficulty: 'easy',
    question: 'What is a Docker container?',
    options: [
      { text: 'A virtual machine with a full OS', isCorrect: false },
      { text: 'A lightweight, isolated process running from a Docker image', isCorrect: true },
      { text: 'A cloud storage service', isCorrect: false },
      { text: 'A version control system', isCorrect: false }
    ],
    explanation: 'A container is a runnable instance of an image. It is isolated from other containers and the host, but shares the OS kernel — making it far lighter than a VM.',
    tags: ['containers', 'isolation', 'images'], points: 10
  },
  {
    technology: 'Docker', category: 'DevOps', difficulty: 'medium',
    question: 'What is the difference between CMD and ENTRYPOINT in a Dockerfile?',
    options: [
      { text: 'They are identical', isCorrect: false },
      { text: 'ENTRYPOINT defines the executable; CMD provides default arguments', isCorrect: true },
      { text: 'CMD defines the executable; ENTRYPOINT provides default arguments', isCorrect: false },
      { text: 'ENTRYPOINT runs only once; CMD runs every time', isCorrect: false }
    ],
    explanation: 'ENTRYPOINT sets the command that always runs. CMD provides defaults that can be overridden at runtime. Used together: ENTRYPOINT is the binary, CMD is its default args.',
    tags: ['dockerfile', 'cmd', 'entrypoint'], points: 15
  },

  // ── GRAPHQL ─────────────────────────────────────────────────────
  {
    technology: 'GraphQL', category: 'API', difficulty: 'medium',
    question: 'What is a GraphQL resolver?',
    options: [
      { text: 'A tool for resolving merge conflicts', isCorrect: false },
      { text: 'A function responsible for returning data for a specific field in the schema', isCorrect: true },
      { text: 'A built-in caching layer', isCorrect: false },
      { text: 'A mutation validator', isCorrect: false }
    ],
    explanation: 'Resolvers are functions that fetch the data for each field defined in the GraphQL schema. Each field can have its own resolver that returns the field\'s value.',
    tags: ['resolver', 'schema', 'graphql-server'], points: 15
  },

  // ── JEST ────────────────────────────────────────────────────────
  {
    technology: 'Jest', category: 'Testing', difficulty: 'easy',
    question: 'What is the purpose of jest.mock()?',
    options: [
      { text: 'To create test database entries', isCorrect: false },
      { text: 'To automatically replace a module with a mock implementation', isCorrect: true },
      { text: 'To generate test data', isCorrect: false },
      { text: 'To run tests in parallel', isCorrect: false }
    ],
    explanation: 'jest.mock() replaces the actual module with a mock version, allowing you to control its behavior in tests and verify how it was called.',
    tags: ['mocking', 'unit-testing', 'test-isolation'], points: 10
  },

  // ── REST APIs ───────────────────────────────────────────────────
  {
    technology: 'REST APIs', category: 'API', difficulty: 'easy',
    question: 'Which HTTP status code indicates a resource was successfully created?',
    options: [
      { text: '200 OK', isCorrect: false },
      { text: '201 Created', isCorrect: true },
      { text: '204 No Content', isCorrect: false },
      { text: '202 Accepted', isCorrect: false }
    ],
    explanation: '201 Created is the correct response when a POST request successfully creates a new resource. The response should include a Location header pointing to the new resource.',
    tags: ['http-status', 'post', 'rest'], points: 10
  },

  // ── POSTGRESQL ──────────────────────────────────────────────────
  {
    technology: 'PostgreSQL', category: 'Database', difficulty: 'medium',
    question: 'What is the difference between INNER JOIN and LEFT JOIN?',
    options: [
      { text: 'They return the same results', isCorrect: false },
      { text: 'INNER JOIN returns only matching rows; LEFT JOIN returns all left rows plus matches', isCorrect: true },
      { text: 'LEFT JOIN returns only matching rows; INNER JOIN returns all rows', isCorrect: false },
      { text: 'INNER JOIN works only with one table', isCorrect: false }
    ],
    explanation: 'INNER JOIN returns rows only when there is a match in both tables. LEFT JOIN returns ALL rows from the left table and matched rows from the right (NULLs for non-matches).',
    tags: ['joins', 'sql', 'relational'], points: 15
  },

  // ── KUBERNETES ──────────────────────────────────────────────────
  {
    technology: 'Kubernetes', category: 'DevOps', difficulty: 'hard',
    question: 'What is the role of a Kubernetes Pod?',
    options: [
      { text: 'A Pod is a single container', isCorrect: false },
      { text: 'The smallest deployable unit that can hold one or more containers sharing network and storage', isCorrect: true },
      { text: 'A Pod is a node in the cluster', isCorrect: false },
      { text: 'A Pod manages the control plane', isCorrect: false }
    ],
    explanation: 'A Pod is the smallest unit in Kubernetes. It can contain one or more tightly coupled containers that share the same IP, port space, and storage volumes.',
    tags: ['pod', 'kubernetes', 'containers'], points: 20
  },

  // ── NEXT.JS ─────────────────────────────────────────────────────
  {
    technology: 'Next.js', category: 'Frontend', difficulty: 'medium',
    question: 'What is the difference between getStaticProps and getServerSideProps in Next.js?',
    options: [
      { text: 'They are identical', isCorrect: false },
      { text: 'getStaticProps runs at build time; getServerSideProps runs on every request', isCorrect: true },
      { text: 'getServerSideProps runs at build time; getStaticProps runs on every request', isCorrect: false },
      { text: 'getStaticProps only works with databases', isCorrect: false }
    ],
    explanation: 'getStaticProps generates static HTML at build time (fast, CDN-cacheable). getServerSideProps runs on every request (always fresh data, slower due to server processing).',
    tags: ['ssr', 'ssg', 'data-fetching'], points: 15
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');

    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    const inserted = await Question.insertMany(questions);
    console.log(`✅ Inserted ${inserted.length} questions across ${[...new Set(questions.map(q => q.technology))].length} technologies`);

    // Create a demo user
    await User.deleteMany({ email: 'demo@interviewiq.dev' });
    await User.create({
      name: 'Demo User',
      email: 'demo@interviewiq.dev',
      password: 'Demo@1234',
      experienceLevel: 'mid',
      stats: { totalQuestions: 48, correctAnswers: 37, totalInterviews: 5, averageScore: 78, streak: 7, points: 420 }
    });
    console.log('👤 Demo user created: demo@interviewiq.dev / Demo@1234');

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seedDatabase();
