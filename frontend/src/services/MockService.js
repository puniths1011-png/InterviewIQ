// MockService.js - Handles client-side data for MCQ and User Tracking

// --- REACTION QUESTIONS ---
const REACT_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `react_${i + 1}`,
  question: `React Question ${i + 1}: What is a core concept in React?`,
  options: [
    { text: "Two-way data binding" },
    { text: "Virtual DOM" },
    { text: "Direct DOM manipulation" },
    { text: "Server-side rendering only" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "React uses a Virtual DOM to optimize rendering performance."
}));

// --- NODE.JS QUESTIONS ---
const NODE_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `node_${i + 1}`,
  question: `Node.js Question ${i + 1}: Which of the following is true about Node.js?`,
  options: [
    { text: "It is multi-threaded" },
    { text: "It is built on V8" },
    { text: "It is a frontend library" },
    { text: "It uses blocking I/O" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "Node.js is a runtime built on Chrome's V8 JavaScript engine."
}));

// --- MONGODB QUESTIONS ---
const MONGODB_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `mongo_${i + 1}`,
  question: `MongoDB Question ${i + 1}: What type of database is MongoDB?`,
  options: [
    { text: "Relational" },
    { text: "NoSQL" },
    { text: "Graph" },
    { text: "Key-Value" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "MongoDB is a popular NoSQL document-oriented database."
}));

// --- TYPESCRIPT QUESTIONS ---
const TYPESCRIPT_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `ts_${i + 1}`,
  question: `TypeScript Question ${i + 1}: What does TypeScript add to JavaScript?`,
  options: [
    { text: "Static typing" },
    { text: "Runtime type checking" },
    { text: "Multi-threading" },
    { text: "A virtual machine" }
  ],
  correctOptionIndex: 0,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "TypeScript is a superset of JavaScript that adds static types."
}));

// --- JAVASCRIPT QUESTIONS ---
const JS_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `js_${i + 1}`,
  question: `JS Question ${i + 1}: Which keyword is used to declare a variable?`,
  options: [
    { text: "variable" },
    { text: "let" },
    { text: "v" },
    { text: "dec" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "let is a keyword used to declare block-scoped variables."
}));

// --- CSS3 QUESTIONS ---
const CSS_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `css_${i + 1}`,
  question: `CSS Question ${i + 1}: Which property changes text color?`,
  options: [
    { text: "font-color" },
    { text: "color" },
    { text: "text-style" },
    { text: "background-color" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "The 'color' property is used to set the color of text."
}));

// --- NEXT.JS QUESTIONS ---
const NEXTJS_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `next_${i + 1}`,
  question: `Next.js Question ${i + 1}: What is a feature of Next.js?`,
  options: [
    { text: "Server-side rendering" },
    { text: "No routing" },
    { text: "Only client-side" },
    { text: "Requires SQL" }
  ],
  correctOptionIndex: 0,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "Next.js provides server-side rendering and static site generation."
}));

// --- PYTHON QUESTIONS ---
const PYTHON_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `py_${i + 1}`,
  question: `Python Question ${i + 1}: How do you start a comment?`,
  options: [
    { text: "//" },
    { text: "#" },
    { text: "/*" },
    { text: "<!--" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "In Python, comments start with the # character."
}));

// --- JAVA QUESTIONS ---
const JAVA_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `java_${i + 1}`,
  question: `Java Question ${i + 1}: Which is a Java keyword?`,
  options: [
    { text: "class" },
    { text: "function" },
    { text: "let" },
    { text: "var" }
  ],
  correctOptionIndex: 0,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "class is a reserved keyword in Java used to declare a class."
}));

// --- DOCKER QUESTIONS ---
const DOCKER_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `docker_${i + 1}`,
  question: `Docker Question ${i + 1}: What does Docker use to build images?`,
  options: [
    { text: "Makefile" },
    { text: "Dockerfile" },
    { text: "JSON" },
    { text: "XML" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "Docker uses a Dockerfile to define the image build process."
}));

// --- KUBERNETES QUESTIONS ---
const K8S_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `k8s_${i + 1}`,
  question: `K8s Question ${i + 1}: What is the basic unit of deployment?`,
  options: [
    { text: "Node" },
    { text: "Pod" },
    { text: "Cluster" },
    { text: "Container" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "A Pod is the smallest deployable unit in Kubernetes."
}));

// --- GRAPHQL QUESTIONS ---
const GRAPHQL_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `gql_${i + 1}`,
  question: `GraphQL Question ${i + 1}: What does GraphQL allow you to do?`,
  options: [
    { text: "Query specific data" },
    { text: "Run SQL" },
    { text: "Only REST" },
    { text: "Create UIs" }
  ],
  correctOptionIndex: 0,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "GraphQL allows clients to request exactly the data they need."
}));

// --- REST API QUESTIONS ---
const REST_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `rest_${i + 1}`,
  question: `REST Question ${i + 1}: Which HTTP method is used to create a resource?`,
  options: [
    { text: "GET" },
    { text: "POST" },
    { text: "DELETE" },
    { text: "PUT" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "POST is typically used to create a new resource."
}));

// --- POSTGRESQL QUESTIONS ---
const POSTGRES_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  _id: `pg_${i + 1}`,
  question: `Postgres Question ${i + 1}: What type of database is PostgreSQL?`,
  options: [
    { text: "NoSQL" },
    { text: "Relational" },
    { text: "Document" },
    { text: "Key-Value" }
  ],
  correctOptionIndex: 1,
  difficulty: i < 3 ? "Beginner" : i < 7 ? "Intermediate" : "Advanced",
  explanation: "PostgreSQL is a powerful, open-source relational database."
}));

// --- ML & SQL QUESTIONS (Existing) ---
const ML_QUESTIONS = [
  {
    _id: "ml_1",
    question: "What is the primary goal of Supervised Learning?",
    options: [
      { text: "Finding hidden patterns in unlabeled data" },
      { text: "Mapping input data to known output labels" },
      { text: "Learning through trial and error with rewards" },
      { text: "Reducing the dimensionality of a dataset" }
    ],
    correctOptionIndex: 1,
    difficulty: "Beginner",
    explanation: "Supervised learning uses labeled data to train models that can predict output for new, unseen inputs."
  },
  {
    _id: "ml_2",
    question: "In Linear Regression, what does the R-squared value represent?",
    options: [
      { text: "The slope of the regression line" },
      { text: "The proportion of variance in the dependent variable explained by independent variables" },
      { text: "The average error of the predictions" },
      { text: "The number of outliers in the dataset" }
    ],
    correctOptionIndex: 1,
    difficulty: "Intermediate",
    explanation: "R-squared measures how well the regression model fits the observed data."
  },
  {
    _id: "ml_3",
    question: "Which algorithm is commonly used for Dimensionality Reduction?",
    options: [
      { text: "Random Forest" },
      { text: "Principal Component Analysis (PCA)" },
      { text: "Support Vector Machines (SVM)" },
      { text: "K-Nearest Neighbors (KNN)" }
    ],
    correctOptionIndex: 1,
    difficulty: "Intermediate",
    explanation: "PCA is a popular technique for reducing the number of variables in a dataset while preserving its variance."
  },
  {
    _id: "ml_4",
    question: "What is 'Overfitting' in Machine Learning?",
    options: [
      { text: "When a model is too simple to capture underlying patterns" },
      { text: "When a model performs well on training data but poorly on unseen data" },
      { text: "When a model takes too long to train" },
      { text: "When a model is trained on insufficient data" }
    ],
    correctOptionIndex: 1,
    difficulty: "Beginner",
    explanation: "Overfitting occurs when a model learns the noise in the training data rather than the intended patterns."
  },
  {
    _id: "ml_5",
    question: "Which activation function is often used in the output layer of a multi-class classification neural network?",
    options: [
      { text: "Sigmoid" },
      { text: "ReLU" },
      { text: "Softmax" },
      { text: "Tanh" }
    ],
    correctOptionIndex: 2,
    difficulty: "Intermediate",
    explanation: "Softmax converts a vector of numbers into a vector of probabilities that sum to 1.0, ideal for multi-class classification."
  },
  {
    _id: "ml_6",
    question: "What is the function of a 'Validation Set'?",
    options: [
      { text: "To train the model's weights" },
      { text: "To tune hyperparameters and prevent overfitting during development" },
      { text: "To provide the final performance metric of the model" },
      { text: "To clean the training data" }
    ],
    correctOptionIndex: 1,
    difficulty: "Intermediate",
    explanation: "The validation set is used to compare different model configurations and choose the best one before final testing."
  },
  {
    _id: "ml_7",
    question: "In Random Forest, what is the 'Out-of-Bag' (OOB) error?",
    options: [
      { text: "Error on the training data" },
      { text: "Error calculated on samples not used for training a particular tree" },
      { text: "Error due to incorrect labels" },
      { text: "Error during the feature selection process" }
    ],
    correctOptionIndex: 1,
    difficulty: "Advanced",
    explanation: "OOB error is a method of measuring the prediction error of random forests, using bootstrap aggregating (bagging)."
  },
  {
    _id: "ml_8",
    question: "What is the main difference between L1 and L2 regularization?",
    options: [
      { text: "L1 uses the square of weights, L2 uses the absolute value" },
      { text: "L1 can lead to sparse feature selection (weights become zero), L2 generally keeps weights small" },
      { text: "L2 is only used for classification" },
      { text: "There is no functional difference" }
    ],
    correctOptionIndex: 1,
    difficulty: "Advanced",
    explanation: "L1 regularization (Lasso) adds an absolute value penalty, while L2 (Ridge) adds a squared penalty."
  },
  {
    _id: "ml_9",
    question: "Which technique is used to handle 'Imbalanced Datasets'?",
    options: [
      { text: "Cross-validation" },
      { text: "SMOTE (Synthetic Minority Over-sampling Technique)" },
      { text: "Feature Scaling" },
      { text: "Grid Search" }
    ],
    correctOptionIndex: 1,
    difficulty: "Advanced",
    explanation: "SMOTE creates synthetic examples of the minority class to balance the dataset."
  },
  {
    _id: "ml_10",
    question: "What is 'Precision' in a confusion matrix?",
    options: [
      { text: "TP / (TP + FN)" },
      { text: "TP / (TP + FP)" },
      { text: "TN / (TN + FP)" },
      { text: "(TP + TN) / Total" }
    ],
    correctOptionIndex: 1,
    difficulty: "Intermediate",
    explanation: "Precision is the ratio of correctly predicted positive observations to the total predicted positives."
  }
];

const SQL_QUESTIONS = [
  {
    _id: "sql_1",
    question: "Which SQL command is used to retrieve data from a database?",
    options: [
      { text: "GET" },
      { text: "SELECT" },
      { text: "EXTRACT" },
      { text: "FETCH" }
    ],
    correctOptionIndex: 1,
    difficulty: "Beginner",
    explanation: "SELECT is the fundamental command used to query data from database tables."
  },
  {
    _id: "sql_2",
    question: "What is the purpose of the 'GROUP BY' clause?",
    options: [
      { text: "To sort the result set" },
      { text: "To filter records" },
      { text: "To arrange identical data into groups, often used with aggregate functions" },
      { text: "To join two tables" }
    ],
    correctOptionIndex: 2,
    difficulty: "Intermediate",
    explanation: "GROUP BY is used with functions like COUNT, MAX, MIN, SUM, AVG to group the result-set by one or more columns."
  },
  {
    _id: "sql_3",
    question: "What is a 'Primary Key'?",
    options: [
      { text: "A key that can be null" },
      { text: "A column that uniquely identifies each record in a table" },
      { text: "A key used to link two tables" },
      { text: "A secondary index" }
    ],
    correctOptionIndex: 1,
    difficulty: "Beginner",
    explanation: "A Primary Key must contain unique values and cannot contain NULL values."
  },
  {
    _id: "sql_4",
    question: "Which type of JOIN returns all records when there is a match in either left or right table?",
    options: [
      { text: "INNER JOIN" },
      { text: "LEFT JOIN" },
      { text: "FULL OUTER JOIN" },
      { text: "RIGHT JOIN" }
    ],
    correctOptionIndex: 2,
    difficulty: "Intermediate",
    explanation: "FULL OUTER JOIN combines the results of both LEFT and RIGHT outer joins."
  },
  {
    _id: "sql_5",
    question: "What does the 'HAVING' clause do?",
    options: [
      { text: "Filters records before they are grouped" },
      { text: "Filters records after they have been grouped" },
      { text: "Sorts the grouped data" },
      { text: "Creates a new table" }
    ],
    correctOptionIndex: 1,
    difficulty: "Intermediate",
    explanation: "The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions."
  },
  {
    _id: "sql_6",
    question: "Which constraint is used to ensure that all values in a column are different?",
    options: [
      { text: "CHECK" },
      { text: "UNIQUE" },
      { text: "NOT NULL" },
      { text: "DEFAULT" }
    ],
    correctOptionIndex: 1,
    difficulty: "Beginner",
    explanation: "The UNIQUE constraint ensures that all values in a column are distinct."
  },
  {
    _id: "sql_7",
    question: "What is a 'Common Table Expression' (CTE) in SQL?",
    options: [
      { text: "A permanent view stored in the database" },
      { text: "A temporary result set that you can reference within another SELECT, INSERT, UPDATE, or DELETE statement" },
      { text: "A type of database trigger" },
      { text: "An aggregate function" }
    ],
    correctOptionIndex: 1,
    difficulty: "Advanced",
    explanation: "CTEs (defined using the WITH keyword) make complex queries more readable and maintainable."
  },
  {
    _id: "sql_8",
    question: "What is the difference between TRUNCATE and DELETE?",
    options: [
      { text: "TRUNCATE can be rolled back, DELETE cannot" },
      { text: "DELETE is a DDL command, TRUNCATE is DML" },
      { text: "TRUNCATE is faster as it doesn't log individual row deletions; DELETE logs each row" },
      { text: "There is no difference" }
    ],
    correctOptionIndex: 2,
    difficulty: "Advanced",
    explanation: "TRUNCATE removes all rows from a table and is generally faster than DELETE."
  },
  {
    _id: "sql_9",
    question: "What is 'Normalization' in databases?",
    options: [
      { text: "Adding redundant data to improve performance" },
      { text: "The process of organizing data to minimize redundancy and dependency" },
      { text: "Securing the database against unauthorized access" },
      { text: "Backing up the database" }
    ],
    correctOptionIndex: 1,
    difficulty: "Intermediate",
    explanation: "Normalization involves dividing a database into two or more tables and defining relationships between them."
  },
  {
    _id: "sql_10",
    question: "What does a 'Window Function' do?",
    options: [
      { text: "Opens a new connection to the database" },
      { text: "Performs a calculation across a set of table rows that are somehow related to the current row" },
      { text: "Displays the data in a GUI window" },
      { text: "Limits the number of rows returned" }
    ],
    correctOptionIndex: 1,
    difficulty: "Advanced",
    explanation: "Window functions (like RANK, ROW_NUMBER, OVER) allow calculations over a range of rows without collapsing them into a single output row."
  }
];

export const mockMCQ = {
  getQuiz: (tech) => {
    const techLower = tech.toLowerCase();
    
    // Improved matching for Machine Learning / AI
    if (techLower.includes('ml') || techLower.includes('machine') || techLower.includes('ai')) {
      return ML_QUESTIONS;
    }
    
    // Improved matching for SQL
    if (techLower.includes('sql')) {
      return SQL_QUESTIONS;
    }
    
    // Additional mappings
    if (techLower.includes('react')) return REACT_QUESTIONS;
    if (techLower.includes('node')) return NODE_QUESTIONS;
    if (techLower.includes('mongo')) return MONGODB_QUESTIONS;
    if (techLower.includes('type')) return TYPESCRIPT_QUESTIONS;
    if (techLower.includes('java')) {
      if (techLower.includes('script')) return JS_QUESTIONS;
      return JAVA_QUESTIONS;
    }
    if (techLower.includes('css')) return CSS_QUESTIONS;
    if (techLower.includes('next')) return NEXTJS_QUESTIONS;
    if (techLower.includes('python')) return PYTHON_QUESTIONS;
    if (techLower.includes('docker')) return DOCKER_QUESTIONS;
    if (techLower.includes('kube')) return K8S_QUESTIONS;
    if (techLower.includes('graph')) return GRAPHQL_QUESTIONS;
    if (techLower.includes('rest')) return REST_QUESTIONS;
    if (techLower.includes('postgres')) return POSTGRES_QUESTIONS;
    
    return null;
  }
};

// ── Journey Tracking ──
export const journeyTracker = {
  trackEvent: (eventName, metadata = {}) => {
    try {
      const journey = JSON.parse(localStorage.getItem('user_journey') || '[]');
      const newEvent = {
        event: eventName,
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
        metadata,
        userId: JSON.parse(localStorage.getItem('iq_user') || '{}')._id || 'anonymous'
      };
      
      journey.push(newEvent);
      // Keep only last 100 events to manage storage
      if (journey.length > 100) journey.shift();
      
      localStorage.setItem('user_journey', JSON.stringify(journey));
      
      // In a real world app, you would send this to an analytics endpoint:
      // console.log('[Journey Tracked]', newEvent);
    } catch (e) {
      console.error('Tracking error:', e);
    }
  },
  
  getJourney: () => {
    return JSON.parse(localStorage.getItem('user_journey') || '[]');
  }
};

// ── Learning Paths ──
export const mockLearningPaths = [
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
