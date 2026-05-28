import axios from 'axios';

const API_BASE = '/api';

export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return axios.post(`${API_BASE}/resume/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  startInterview: (data) => axios.post(`${API_BASE}/resume/start-interview`, data)
};

export const interviewsAPI = {
  // Existing methods
  start: (data) => axios.post(`${API_BASE}/interviews/start`, data).then(res => res.data),
  
  // Updated for resume-based flow
  submitAnswer: (id, data) => axios.post(`${API_BASE}/interviews/${id}/answer`, data).then(res => res.data),
  
  // New: Get initial question for resume-based interview
  getInitialQuestion: (id) => axios.post(`${API_BASE}/interviews/${id}/answer`, { answer: null }).then(res => res.data),
  
  complete: (id) => axios.post(`${API_BASE}/interviews/${id}/complete`).then(res => res.data)
};
