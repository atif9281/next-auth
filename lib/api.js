import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This should point to the correct base URL for your API routes
});

export default api;