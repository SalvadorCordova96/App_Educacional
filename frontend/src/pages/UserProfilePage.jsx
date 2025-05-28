import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Corrected path based on previous analysis

const UserProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  if (!user) {
    // This case might occur if the user is not authenticated but somehow reaches this page
    // or if there was an error fetching the user.
    // ProtectedRoute should ideally prevent unauthenticated access.
    return <p>No se pudo cargar la información del usuario. Por favor, intente iniciar sesión de nuevo.</p>;
  }

  const handleUpdateProfile = () => {
    console.log('Botón "Actualizar Perfil" clickeado. Funcionalidad pendiente.');
    // Aquí se implementaría la lógica para la actualización del perfil,
    // como mostrar un modal o redirigir a una página de edición.
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Perfil de Usuario</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-bold mb-2">Nombre Completo:</p>
          <p className="text-gray-700">{user.nombre_completo || user.name || 'No disponible'}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-bold mb-2">Correo Electrónico:</p>
          <p className="text-gray-700">{user.correo_electronico || user.email || 'No disponible'}</p>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 text-sm font-bold mb-2">Rol:</p>
          <p className="text-gray-700 capitalize">{user.rol || user.role || 'No disponible'}</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Actualizar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
