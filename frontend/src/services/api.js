import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 30000,
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("iq_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 globally
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("iq_token");
      localStorage.removeItem("iq_user");
      window.location.href = "/login";
    }
    
    const errorData = error.response?.data;
    const errorMessage = (typeof errorData === "string" ? errorData : (errorData?.message || errorData?.error)) || "Network error";
    
    return Promise.reject({ message: errorMessage });
  },
);

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/update-profile", data),
  changePassword: (data) => API.put("/auth/change-password", data),
};

// ── Questions ────────────────────────────────────────────────
export const questionsAPI = {
  getAll: (params) => API.get("/questions", { params }),
  getTechnologies: () => API.get("/questions/technologies"),
  getById: (id) => API.get(`/questions/${id}`),
  getQuiz: (technology, params) =>
    API.get(`/questions/quiz/${technology}`, { params }),
  submitAnswer: (id, data) => API.post(`/questions/${id}/submit`, data),
};

// ── Interviews ───────────────────────────────────────────────
export const interviewsAPI = {
  start: (data) => API.post("/interviews/start", data),
  generateQuestions: (data) => API.post("/interviews/generate-questions", data),
  getAll: (params) => API.get("/interviews", { params }),
  getById: (id) => API.get(`/interviews/${id}`),
  submitAnswer: (id, data) => API.post(`/interviews/${id}/answer`, data),
  complete: (id) => API.post(`/interviews/${id}/complete`),
  delete: (id) => API.delete(`/interviews/${id}`),
  getResumeInterviewQuestion: (id) =>
    API.post(`/interviews/${id}/answer`, { answer: null }),
};

export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    return API.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
    });
  },
  startInterview: (data) => API.post("/resume/start-interview", data),
};

// ── Feedback ─────────────────────────────────────────────────
export const feedbackAPI = {
  getLatest: () => API.get("/feedback/latest"),
  getById: (id) => API.get(`/feedback/${id}`),
};

// ── Users ────────────────────────────────────────────────────
export const usersAPI = {
  getDashboard: () => API.get("/users/dashboard"),
  getProgress: () => API.get("/users/progress"),
};

// ── Leaderboard ──────────────────────────────────────────────
export const leaderboardAPI = {
  get: (params) => API.get("/leaderboard", { params }),
};

// ── Learning ─────────────────────────────────────────────────
export const learningAPI = {
  getAll: (params) => API.get("/learning", { params }),
  getById: (id) => API.get(`/learning/${id}`),
};

export default API;
