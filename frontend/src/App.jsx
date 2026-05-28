// App.js - Main entry point
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/layout/Layout.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// MCQ Module
import MCQSelectorPage from "./pages/MCQSelectorPage.jsx";
import MCQQuizPage from "./pages/MCQQuizPage.jsx";
import MCQResultsPage from "./pages/MCQResultsPage.jsx";

// Resume Module
import ResumeUploadPage from "./pages/ResumeUploadPage.jsx";
import ResumeAnalysisPage from "./pages/ResumeAnalysisPage.jsx";

// AI Interview Module
import AIInterviewSetupPage from "./pages/AIInterviewSetupPage.jsx";
import AIInterviewSessionPage from "./pages/AIInterviewSessionPage.jsx";

import LearningPage from "./pages/LearningPage.jsx";
import LearningDetailPage from "./pages/LearningDetailPage.jsx";
import FlashcardsPage from "./pages/FlashcardsPage.jsx";
import ResumeInterviewPage from "./pages/ResumeInterviewPage.jsx";
import AIQuestionGenerator from "./pages/AIQuestionGenerator.jsx";
import ATSPage from "./pages/ATSPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotFound from "./pages/NotFound.jsx";

import "./index.css";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading)
    return (
      <div className="app-loader">
        <div className="loader-ring" />
      </div>
    );
  return isAuthenticated ? children : <Navigate to="/register" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Routes using Layout */}
      <Route element={<Layout />}>
        {/* Public Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* MCQ Module */}
        <Route
          path="/mcq"
          element={
            <PrivateRoute>
              <MCQSelectorPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mcq/quiz/:technology"
          element={
            <PrivateRoute>
              <MCQQuizPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mcq/results"
          element={
            <PrivateRoute>
              <MCQResultsPage />
            </PrivateRoute>
          }
        />

        {/* Resume Module */}
        <Route
          path="/resume"
          element={
            <PrivateRoute>
              <ResumeUploadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume/analysis"
          element={
            <PrivateRoute>
              <ResumeAnalysisPage />
            </PrivateRoute>
          }
        />

        {/* AI Interview Module */}
        <Route
          path="/interview"
          element={
            <PrivateRoute>
              <AIInterviewSetupPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/interview/session/:interviewId"
          element={
            <PrivateRoute>
              <AIInterviewSessionPage />
            </PrivateRoute>
          }
        />

        {/* Learning Module */}
        <Route
          path="/learning"
          element={
            <PrivateRoute>
              <LearningPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/learning/:id"
          element={
            <PrivateRoute>
              <LearningDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/flashcards"
          element={
            <PrivateRoute>
              <FlashcardsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume-interview"
          element={
            <PrivateRoute>
              <ResumeInterviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/questions-gen"
          element={
            <PrivateRoute>
              <AIQuestionGenerator />
            </PrivateRoute>
          }
        />
        <Route
          path="/ats-score"
          element={
            <PrivateRoute>
              <ATSPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute>
              <FeedbackPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback/:id"
          element={
            <PrivateRoute>
              <FeedbackPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <LeaderboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
