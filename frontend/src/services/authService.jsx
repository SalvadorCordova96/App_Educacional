// frontend/src/services/authService.jsx
import API_BASE_URL from '../config/apiConfig';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    return data; // Devuelve el token y la información del usuario
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const registerUser = async (name, email, password, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar');
    }

    return data; // Devuelve la información del usuario registrado
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};