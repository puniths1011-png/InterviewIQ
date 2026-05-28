const mongoose = require("mongoose");
const Question = require("../models/Question");
const connectDB = require("../config/database");

const dockerQuestions = [
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "easy",
    question:
      "What problem does Docker solve in modern application development?",
    options: [
      { text: "UI issues", isCorrect: false },
      { text: "Environment inconsistency across systems", isCorrect: true },
      { text: "Routing", isCorrect: false },
      { text: "API", isCorrect: false },
    ],
    explanation: "Solves environment inconsistency.",
    points: 10,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "easy",
    question: "What is the difference between a Docker image and a container?",
    options: [
      { text: "Same", isCorrect: false },
      {
        text: "Image is blueprint, container is running instance",
        isCorrect: true,
      },
      { text: "Container stores code", isCorrect: false },
      { text: "Image runs code", isCorrect: false },
    ],
    explanation: "Image is a blueprint.",
    points: 10,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "easy",
    question: "How does Docker improve deployment consistency?",
    options: [
      { text: "Using APIs", isCorrect: false },
      {
        text: "Packaging application with dependencies into containers",
        isCorrect: true,
      },
      { text: "Using DB", isCorrect: false },
      { text: "Using UI", isCorrect: false },
    ],
    explanation: "Packages dependencies for consistency.",
    points: 10,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "easy",
    question: "What is the role of a Dockerfile?",
    options: [
      { text: "Run container", isCorrect: false },
      { text: "Define steps to build a Docker image", isCorrect: true },
      { text: "API", isCorrect: false },
      { text: "DB", isCorrect: false },
    ],
    explanation: "Build steps definition.",
    points: 10,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What is the purpose of Docker volumes?",
    options: [
      { text: "Networking", isCorrect: false },
      { text: "Persist data outside container lifecycle", isCorrect: true },
      { text: "UI", isCorrect: false },
      { text: "API", isCorrect: false },
    ],
    explanation: "Data persistence.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What is container isolation in Docker?",
    options: [
      { text: "Sharing resources", isCorrect: false },
      {
        text: "Running applications independently with separate environments",
        isCorrect: true,
      },
      { text: "API", isCorrect: false },
      { text: "DB", isCorrect: false },
    ],
    explanation: "Independent environments.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What is Docker Compose used for?",
    options: [
      { text: "Single container", isCorrect: false },
      { text: "Define and run multi-container applications", isCorrect: true },
      { text: "API", isCorrect: false },
      { text: "DB", isCorrect: false },
    ],
    explanation: "Multi-container orchestration.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What is the difference between CMD and ENTRYPOINT?",
    options: [
      { text: "Same", isCorrect: false },
      {
        text: "ENTRYPOINT is fixed, CMD provides default arguments",
        isCorrect: true,
      },
      { text: "CMD fixed", isCorrect: false },
      { text: "ENTRYPOINT ignored", isCorrect: false },
    ],
    explanation: "ENTRYPOINT is the fixed command.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "easy",
    question: "What is a Docker registry?",
    options: [
      { text: "API", isCorrect: false },
      {
        text: "Storage and distribution system for Docker images (e.g., Docker Hub)",
        isCorrect: true,
      },
      { text: "DB", isCorrect: false },
      { text: "UI", isCorrect: false },
    ],
    explanation: "Image storage/distribution.",
    points: 10,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "easy",
    question: "What is the purpose of docker build command?",
    options: [
      { text: "Run container", isCorrect: false },
      { text: "Build image from Dockerfile", isCorrect: true },
      { text: "Stop container", isCorrect: false },
      { text: "Delete image", isCorrect: false },
    ],
    explanation: "Builds image.",
    points: 10,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What is the difference between docker run and docker start?",
    options: [
      { text: "Same", isCorrect: false },
      {
        text: "run creates new container, start runs existing one",
        isCorrect: true,
      },
      { text: "start creates", isCorrect: false },
      { text: "run stops", isCorrect: false },
    ],
    explanation: "run creates vs start runs.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question:
      "How does Docker networking enable communication between containers?",
    options: [
      { text: "API", isCorrect: false },
      { text: "Virtual networks and bridge drivers", isCorrect: true },
      { text: "DB", isCorrect: false },
      { text: "UI", isCorrect: false },
    ],
    explanation: "Bridge networking.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What is the role of .dockerignore file?",
    options: [
      { text: "API", isCorrect: false },
      { text: "Exclude files from build context", isCorrect: true },
      { text: "DB", isCorrect: false },
      { text: "UI", isCorrect: false },
    ],
    explanation: "Build context file exclusion.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "hard",
    question: "What is container orchestration?",
    options: [
      { text: "UI", isCorrect: false },
      {
        text: "Managing multiple containers (e.g., scaling, deployment)",
        isCorrect: true,
      },
      { text: "API", isCorrect: false },
      { text: "DB", isCorrect: false },
    ],
    explanation: "Managing multiple containers.",
    points: 20,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    
    question:
      "What is the advantage of lightweight containers over virtual machines?",
    options: [
      { text: "Slower", isCorrect: false },
      { text: "Faster startup and less resource usage", isCorrect: true },
      { text: "More memory", isCorrect: false },
      { text: "Less secure", isCorrect: false },
    ],
    explanation: "Startup speed and efficiency.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What is image layering in Docker?",
    options: [
      { text: "API", isCorrect: false },
      {
        text: "Images built in layers for efficiency and caching",
        isCorrect: true,
      },
      { text: "DB", isCorrect: false },
      { text: "UI", isCorrect: false },
    ],
    explanation: "Layered build system.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What happens when a container is removed without a volume?",
    options: [
      { text: "Data saved", isCorrect: false },
      { text: "Data is lost", isCorrect: true },
      { text: "API", isCorrect: false },
      { text: "DB", isCorrect: false },
    ],
    explanation: "Data loss without volume.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question: "What is the purpose of docker exec?",
    options: [
      { text: "Build image", isCorrect: false },
      { text: "Run command inside running container", isCorrect: true },
      { text: "Stop container", isCorrect: false },
      { text: "Delete container", isCorrect: false },
    ],
    explanation: "Executes command in running container.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "medium",
    question:
      "What is the difference between public and private Docker registries?",
    options: [
      { text: "Same", isCorrect: false },
      {
        text: "Public accessible to all, private restricted access",
        isCorrect: true,
      },
      { text: "Private faster", isCorrect: false },
      { text: "Public secure", isCorrect: false },
    ],
    explanation: "Registry access controls.",
    points: 15,
  },
  {
    technology: "Docker",
    category: "DevOps",
    difficulty: "hard",
    question: "What is the main limitation of Docker compared to VMs?",
    options: [
      { text: "Speed", isCorrect: false },
      {
        text: "Less isolation compared to full virtual machines",
        isCorrect: true,
      },
      { text: "Storage", isCorrect: false },
      { text: "API", isCorrect: false },
    ],
    explanation: "Isolation limitations.",
    points: 20,
  },
];

async function seed() {
  await connectDB();
  await Question.insertMany(dockerQuestions);
  console.log(
    `Seed successful! Inserted ${dockerQuestions.length} Docker questions.`,
  );
  process.exit();
}
seed();
