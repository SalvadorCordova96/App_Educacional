// frontend/src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import UserProfile from '../pages/UserProfile';
import CoursesPage from '../pages/CoursesPage';
import ChatPage from '../pages/ChatPage';
import SettingsPage from '../pages/SettingsPage';

// [MEJORA] Definición y protección de rutas
// Se asegura que las rutas principales estén protegidas y solo accesibles para usuarios autenticados y con el rol adecuado.
// Además, se documenta el motivo de la protección y la navegación segura.
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  // Si no hay usuario autenticado, redirige a login
  if (!user) {
    return <Navigate to="/login" />;
  }
  // Si el usuario no tiene el rol permitido, redirige al dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rutas protegidas con MainLayout */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      
      {/* Rutas de administrador */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<MainLayout />}>
          {/* Rutas específicas de admin */}
        </Route>
      </Route>
      
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;