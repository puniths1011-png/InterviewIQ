# InterviewIQ — Full Stack MERN Interview Preparation Platform

AI-powered interview prep with MCQ practice, AI mock interviews, resume-based sessions, real-time feedback, flashcards, leaderboard, and detailed analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI Engine | Anthropic Claude (claude-sonnet-4-20250514) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Upload | Multer + pdf-parse |
| Security | Helmet, CORS, express-rate-limit |

---

## Project Structure

```
interviewiq/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   ├── questionController.js # MCQ CRUD + answer submit
│   │   ├── interviewController.js# AI interview sessions
│   │   └── resumeController.js  # Resume upload + parse
│   ├── middleware/
│   │   └── auth.js              # JWT protect middleware
│   ├── models/
│   │   ├── User.js              # User schema + methods
│   │   ├── Question.js          # Question schema
│   │   └── Interview.js         # Interview session schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── interviews.js
│   │   ├── resume.js
│   │   ├── feedback.js
│   │   ├── users.js
│   │   └── leaderboard.js
│   ├── services/
│   │   └── claudeService.js     # All Claude AI integrations
│   ├── utils/
│   │   └── seed.js              # Database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   └── layout/
        │       ├── Layout.js    # Sidebar + topbar shell
        │       └── Layout.css
        ├── context/
        │   └── AuthContext.js   # Global auth state
        ├── pages/
        │   ├── Home.js          # Landing dashboard
        │   ├── Dashboard.js     # Analytics overview
        │   ├── MCQPage.js       # MCQ quiz engine
        │   ├── LearningPage.js  # Learning materials
        │   ├── FlashcardsPage.js# Spaced repetition
        │   ├── AIInterviewPage.js# AI chat interview
        │   ├── ResumePage.js    # Resume upload + parse
        │   ├── FeedbackPage.js  # Detailed report
        │   ├── HistoryPage.js   # Past sessions
        │   ├── LeaderboardPage.js# Global rankings
        │   ├── SettingsPage.js  # Profile + prefs
        │   └── LoginPage.js     # Auth pages
        ├── services/
        │   └── api.js           # Axios API layer
        ├── App.js               # Router + routes
        ├── index.css            # Global styles
        └── index.js
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd interviewiq

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/interviewiq
JWT_SECRET=your_very_secret_key_here_min_32_chars
ANTHROPIC_API_KEY=sk-ant-your-key-here
CLIENT_URL=http://localhost:3000
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- **25 MCQ questions** across 20 technologies
- **Demo account**: `demo@interviewiq.dev` / `Demo@1234`

### 4. Run the application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App running at http://localhost:3000
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | List with filters |
| GET | `/api/questions/technologies` | All tech stats |
| GET | `/api/questions/quiz/:tech` | Random quiz set |
| GET | `/api/questions/:id` | Single question |
| POST | `/api/questions/:id/submit` | Submit answer + get result |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews/start` | Start AI interview |
| GET | `/api/interviews` | List my interviews |
| GET | `/api/interviews/:id` | Get interview |
| POST | `/api/interviews/:id/answer` | Submit answer |
| POST | `/api/interviews/:id/complete` | Generate full report |
| DELETE | `/api/interviews/:id` | Delete interview |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload & parse resume |
| POST | `/api/resume/start-interview` | Start resume-based interview |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/dashboard` | Dashboard data |
| GET | `/api/users/progress` | Tech progress |
| GET | `/api/feedback/latest` | Latest interview report |
| GET | `/api/feedback/:id` | Specific report |
| GET | `/api/leaderboard` | Top users by points |

---

## Features

### ✅ Implemented
- JWT authentication (register, login, profile)
- 20 technologies with seeded MCQ questions
- Live quiz engine with timer, answer validation, explanations
- AI mock interviews powered by Claude (10 questions)
- Resume upload → AI parsing → tailored interview questions
- Per-answer AI analysis with score, grade, feedback
- Full interview report with metrics and recommendations
- Flashcard system with spaced repetition rating
- Learning materials by technology
- Interview history with pagination and filters
- Global leaderboard with points system
- Dashboard with charts and progress tracking
- Settings with profile management and password change
- Rate limiting and security headers
- Responsive design (mobile + desktop)

### 🔧 Production Checklist
- [ ] Set strong `JWT_SECRET` (32+ chars)
- [ ] Use MongoDB Atlas for production database
- [ ] Add HTTPS / SSL termination
- [ ] Set `NODE_ENV=production`
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Railway/Render/EC2
- [ ] Add email verification (nodemailer)
- [ ] Add voice recording (Web Speech API)
- [ ] Add more questions via admin panel

---

## Claude AI Integration

All AI features are in `backend/services/claudeService.js`:

| Function | Purpose |
|----------|---------|
| `generateInterviewQuestions()` | Creates 10 tailored questions |
| `analyzeAnswer()` | Scores + gives feedback on each answer |
| `generateFullReport()` | Full interview analytics report |
| `getAIInterviewerResponse()` | Conversational interviewer responses |
| `parseResumeWithAI()` | Extracts structured data from resume |

---

## License

MIT — Free to use and modify.
