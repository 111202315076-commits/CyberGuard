import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeSingleUrl = async (url) => {
  const response = await api.post('/analyze-url', { url });
  return response.data;
};

export const analyzeMultipleUrls = async (urls) => {
  const response = await api.post('/analyze-urls', { urls });
  return response.data;
};

export const analyzeFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/analyze-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const getExportUrl = (analysisId) => {
  return `${API_BASE_URL}/export/${analysisId}`;
};

export default api;