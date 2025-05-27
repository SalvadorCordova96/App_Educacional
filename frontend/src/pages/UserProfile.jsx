// import React from 'react'; // (Descomentarlo si se requiere React en futuras mejoras)

function UserProfile() {
  // Mock de datos de usuario
  const usuario = {
    nombre: 'Ana López',
    correo: 'ana.lopez@email.com',
    rol: 'Estudiante',
    institucion: 'Secundaria Técnica 123',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-xl p-8 bg-black shadow-2xl bg-opacity-80 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Perfil de Usuario</h2>
        <div className="flex flex-col gap-2 text-white text-lg">
          <div><span className="font-semibold">Nombre:</span> {usuario.nombre}</div>
          <div><span className="font-semibold">Correo:</span> {usuario.correo}</div>
          <div><span className="font-semibold">Rol:</span> {usuario.rol}</div>
          <div><span className="font-semibold">Institución:</span> {usuario.institucion}</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;