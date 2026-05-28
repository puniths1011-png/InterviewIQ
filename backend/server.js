const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

require("dotenv").config();

const connectDB = require("./config/database");

// Route imports
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const interviewRoutes = require("./routes/interviews");
const resumeRoutes = require("./routes/resume");
const feedbackRoutes = require("./routes/feedback");
const userRoutes = require("./routes/users");
const leaderboardRoutes = require("./routes/leaderboard");
const learningRoutes = require("./routes/learning");

const app = express();

// Connect MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://interview-iq-beryl-xi.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api/", limiter);

// AI Rate Limiter
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many AI requests, please slow down.",
  },
});

app.use("/api/interviews/ai", aiLimiter);

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Static Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Route
app.get("/", (req, res) => {
  res.send("InterviewIQ Backend Running 🚀");
});

// Health Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InterviewIQ API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/learning", learningRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 InterviewIQ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );

  console.log(`📡 API Ready`);
  console.log(`🔍 Health Check: /api/health`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);

  server.close(() => process.exit(1));
});