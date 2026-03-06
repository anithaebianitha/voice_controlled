import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

export const startCamera = () => api.post('/start-camera');
export const stopCamera = () => api.post('/stop-camera');
export const runDetection = () => api.post('/detections/run');
export const getDetections = () => api.get('/detections');
export const getDetectionById = (id) => api.get(`/detections/${id}`);
export const createDetection = (data) => api.post('/detections', data);
export const updateDetection = (id, data) => api.put(`/detections/${id}`, data);
export const deleteDetection = (id) => api.delete(`/detections/${id}`);
export const getNavigationSuggestion = () => api.get('/detections/navigation/suggest');

export default api;
