// frontend/src/services/authService.jsx
import { apiPost } from './apiService'; // Corrected import path

export const loginUser = async (email, password) => {
  try {
    // The 'endpoint' passed to apiPost should be relative to API_BASE in apiService.js
    // e.g., if API_BASE is 'http://localhost:5000/api/v1', this will call 'http://localhost:5000/api/v1/auth/login'
    const data = await apiPost('/auth/login', { email, password });
    return data; // apiPost handles .json() and error checking
  } catch (error) {
    // Log the error specific to this context and re-throw
    console.error('Error in loginUser (authService.jsx):', error.message);
    throw error;
  }
};

export const registerUser = async (name, email, password, role) => {
  try {
    const data = await apiPost('/auth/register', { name, email, password, role });
    return data; // apiPost handles .json() and error checking
  } catch (error) {
    // Log the error specific to this context and re-throw
    console.error('Error in registerUser (authService.jsx):', error.message);
    throw error;
  }
};

// Note: The import of API_BASE_URL from '../config/apiConfig' is removed
// as apiService.js now handles the base URL.