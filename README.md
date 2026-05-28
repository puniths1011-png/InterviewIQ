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



### 3. Seed the database

```bash
cd backend
npm run seed
```


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


## License

MIT — Free to use and modify.
