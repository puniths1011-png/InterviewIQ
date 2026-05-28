const mongoose = require('mongoose');

// --- UPDATE THIS CONNECTION STRING ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/interviewiq'; 

const LearningPathSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
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

const LearningPath = mongoose.model('LearningPath', LearningPathSchema);

const seedData = [
  {
    id: 1,
    title: "React Fundamentals",
    level: "Beginner",
    emoji: "⚛️",
    desc: "React.js, JSX, Hooks, Router, Context API, State Management",
    category: "Frontend",
    color: "rgba(99, 102, 241, 0.1)",
    modules: 6,
    topics: [
      { name: "Introduction to React & JSX", content: ["JSX Syntax", "Functional Components", "Rendering Elements"] },
      { name: "Components & Props", content: ["Props usage", "Composition", "Pure Components"] },
      { name: "React Hooks (useState, useEffect)", content: ["State hook", "Effect hook", "Rules of hooks"] },
      { name: "Event Handling & Forms", content: ["Synthetic Events", "Controlled Components", "Form Submission"] },
      { name: "Context API & State Management", content: ["Context Provider", "Consumer", "useContext"] },
      { name: "Routing with React Router", content: ["Route matching", "Navigation", "Parameters"] }
    ]
  },
  {
    id: 2,
    title: "Node.js & Express",
    level: "Intermediate",
    emoji: "🟢",
    desc: "Node.js, Express.js, REST APIs, Middleware, Auth, File System",
    category: "Backend",
    color: "rgba(16, 185, 129, 0.1)",
    modules: 5,
    topics: [
      { name: "Node.js Basics & Runtime", content: ["V8 Engine", "Event Loop", "Modules"] },
      { name: "Express Server Setup", content: ["App instances", "Middleware application", "Environment config"] },
      { name: "REST API Development", content: ["CRUD methods", "Resource modeling", "Status codes"] },
      { name: "Middleware & Authentication", content: ["JWT", "Passport.js", "Custom middleware"] },
      { name: "File Handling & Streams", content: ["fs module", "Pipe", "Buffers"] }
    ]
  },
  {
    id: 3,
    title: "MongoDB & Mongoose",
    level: "Intermediate",
    emoji: "🍃",
    desc: "MongoDB, Mongoose ODM, CRUD, Aggregation, Indexing, Schema Design",
    category: "Database",
    color: "rgba(245, 158, 11, 0.1)",
    modules: 4,
    topics: [
      { name: "MongoDB Fundamentals", content: ["NoSQL principles", "Collections", "BSON"] },
      { name: "CRUD with Mongoose", content: ["Model methods", "Validation", "Queries"] },
      { name: "Schema Design & Relationships", content: ["Embedding", "Referencing", "Virtuals"] },
      { name: "Aggregation & Indexing", content: ["Pipeline", "Stages", "Performance"] }
    ]
  },
  {
    id: 4,
    title: "TypeScript Deep Dive",
    level: "Intermediate",
    emoji: "📘",
    desc: "TypeScript, Interfaces, Generics, Decorators, Utility Types",
    category: "Language",
    color: "rgba(59, 130, 246, 0.1)",
    modules: 5,
    topics: [
      { name: "TypeScript Basics", content: ["Static Typing", "Compiling", "tsconfig"] },
      { name: "Types & Interfaces", content: ["Unions", "Intersections", "Extending"] },
      { name: "Generics & Advanced Types", content: ["Generic constraints", "Utility types", "Mapped types"] },
      { name: "Decorators & Metadata", content: ["Class decorators", "Property decorators", "Reflect-metadata"] },
      { name: "Utility Types & Best Practices", content: ["Partial", "Readonly", "Pick", "Omit"] }
    ]
  },
  {
    id: 5,
    title: "Next.js Full Stack",
    level: "Advanced",
    emoji: "🔥",
    desc: "Next.js, SSR, SSG, ISR, API Routes, App Router, Deployment",
    category: "Frontend",
    color: "rgba(239, 68, 68, 0.1)",
    modules: 6,
    topics: [
      { name: "Next.js Fundamentals", content: ["Pre-rendering", "Optimization", "Image component"] },
      { name: "Routing & Layouts", content: ["App router", "Parallel routes", "Intercepting routes"] },
      { name: "SSR, SSG & ISR", content: ["getServerSideProps", "getStaticProps", "Incremental Static Regeneration"] },
      { name: "API Routes & Backend Logic", content: ["Edge runtime", "Serverless functions", "Database connection"] },
      { name: "App Router & Server Components", content: ["Client vs Server components", "Suspense", "Streaming"] },
      { name: "Deployment & Optimization", content: ["Vercel", "Performance metrics", "Caching"] }
    ]
  },
  {
    id: 6,
    title: "Docker & DevOps",
    level: "Advanced",
    emoji: "🐳",
    desc: "Docker, Docker Compose, Kubernetes (K8s), CI/CD, Monitoring",
    category: "DevOps",
    color: "rgba(14, 165, 233, 0.1)",
    modules: 4,
    topics: [
      { name: "Docker Basics & Containers", content: ["Images", "Layers", "Registry"] },
      { name: "Docker Compose & Networking", content: ["Multi-container setup", "Volumes", "Networks"] },
      { name: "Kubernetes Fundamentals", content: ["Pods", "Services", "Deployments"] },
      { name: "CI/CD & Monitoring", content: ["GitHub Actions", "Prometheus", "Grafana"] }
    ]
  },
  {
    id: 7,
    title: "Testing Strategies",
    level: "Intermediate",
    emoji: "🧪",
    desc: "Jest, Cypress, Unit, Integration, E2E Testing",
    category: "Testing",
    color: "rgba(16, 185, 129, 0.1)",
    modules: 4,
    topics: [
      { name: "Unit Testing Fundamentals", content: ["Test runner", "Assertions", "Coverage"] },
      { name: "Integration Testing", content: ["Component testing", "Event simulation", "Snapshots"] },
      { name: "Mocking APIs & Services", content: ["jest.mock", "msw", "Spying"] },
      { name: "End-to-End Testing with Cypress", content: ["Cypress commands", "Fixtures", "Recording"] }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await LearningPath.deleteMany({});
    console.log('Cleared existing learning paths.');

    // Insert new data
    await LearningPath.insertMany(seedData);
    console.log('Successfully seeded learning paths!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();