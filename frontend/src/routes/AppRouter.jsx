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
import UserProfilePage from '../pages/UserProfilePage'; // Import the new profile page
import CourseListPage from '../pages/CourseListPage'; // Import teacher's course list page
import CreateClassPage from '../pages/CreateClassPage'; // Import create class page

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
          <Route path="/profile" element={<UserProfile />} /> {/* Existing profile route */}
          <Route path="/perfil" element={<UserProfilePage />} /> {/* New profile route */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/chat" element={<ChatPage />} /> {/* Existing chat route, assumed to use the ChatPage I intend */}
          <Route path="/chat-nuevo" element={<ChatPage />} /> {/* New route for the chat components developed in this subtask */}
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      
      {/* Rutas de administrador */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<MainLayout />}>
          {/* Rutas específicas de admin */}
        </Route>
      </Route>

      {/* Rutas específicas para Docentes */}
      <Route element={<ProtectedRoute allowedRoles={['docente']} />}>
        <Route element={<MainLayout />}>
          <Route path="/docente/clases" element={<CourseListPage />} />
          <Route path="/docente/clases/crear" element={<CreateClassPage />} />
          {/* Aquí se podrían añadir más rutas específicas para docentes, ej. /docente/clases/:id/editar */}
        </Route>
      </Route>

      {/* Rutas específicas para Alumnos */}
      <Route element={<ProtectedRoute allowedRoles={['alumno', 'student']} />}>
        <Route element={<MainLayout />}>
          <Route path="/alumno/clases" element={<CourseListPage />} />
          {/* Aquí se podrían añadir más rutas específicas para alumnos, ej. /alumno/clases/:id/detalle */}
        </Route>
      </Route>
      
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;