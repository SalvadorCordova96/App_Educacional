// frontend/src/shared/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState, User } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        // Aquí iría la llamada a la API para verificar el token
        // const response = await fetch('/api/auth/verify', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();

        // Simulamos un usuario para desarrollo
        const mockUser: User = {
          id: '1',
          name: 'Usuario Demo',
          email: 'demo@example.com',
          role: 'student',
          avatar: '',
          createdAt: new Date().toISOString(),
        };

        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Error de autenticación',
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // Aquí iría la llamada a la API para login
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();

      // Simulamos un login exitoso para desarrollo
      const mockUser: User = {
        id: '1',
        name: 'Usuario Demo',
        email: credentials.email,
        role: 'student',
        avatar: '',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('token', 'mock-token');
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
      navigate('/dashboard');
    } catch (error) {
      setAuthState({
        ...authState,
        error: error instanceof Error ? error.message : 'Error al iniciar sesión',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
  };

  return {
    ...authState,
    login,
    logout,
  };
};
