const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

require("dotenv").config();

const connectDB = require("./config/database");

// Routes
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const interviewRoutes = require("./routes/interviews");
const resumeRoutes = require("./routes/resume");
const feedbackRoutes = require("./routes/feedback");
const userRoutes = require("./routes/users");
const leaderboardRoutes = require("./routes/leaderboard");
const learningRoutes = require("./routes/learning");

const app = express();

/* ========================
   TRUST PROXY (RENDER FIX)
======================== */
app.set("trust proxy", 1);

/* ========================
   DB CONNECTION
======================== */
connectDB();

/* ========================
   SECURITY MIDDLEWARE
======================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* ========================
   CORS CONFIGURATION
======================== */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://interview-iq-beryl-xi.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile/postman support

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // TEMP SAFE MODE (prevents CORS blocking in production)
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* ========================
   RATE LIMITING
======================== */
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", limiter);

/* AI LIMITER */
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many AI requests, please slow down.",
  },
});

app.use("/api/interviews/ai", aiLimiter);

/* ========================
   BODY PARSER
======================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ========================
   LOGGING
======================== */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ========================
   STATIC FILES
======================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ========================
   ROUTES
======================== */
app.get("/", (req, res) => {
  res.send("InterviewIQ Backend Running 🚀");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InterviewIQ API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/learning", learningRoutes);

/* ========================
   404 HANDLER
======================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ========================
   GLOBAL ERROR HANDLER
======================== */
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ========================
   START SERVER
======================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔍 Health: /api/health`);
});