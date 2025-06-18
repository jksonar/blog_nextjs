import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Centralized error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('API Error Response:', error.response.data);
      console.log('API Error Status:', error.response.status);
      console.log('API Error Headers:', error.response.headers);
      if (error.response.status === 401) {
        // Handle unauthorized errors, e.g., redirect to login
        console.log('Unauthorized, redirecting to login...');
        // Example: window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('API Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;