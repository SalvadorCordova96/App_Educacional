function UserAdminPage() {
  // Mock de usuarios para visualización
  const usuarios = [
    { nombre: 'Ana López', rol: 'Alumno', estado: 'Activo' },
    { nombre: 'Luis Pérez', rol: 'Docente', estado: 'Activo' },
    { nombre: 'María Torres', rol: 'Alumno', estado: 'Inactivo' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Administración de Usuarios</h2>
        <div className="flex flex-col gap-4">
          {usuarios.map((usuario, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{usuario.nombre}</div>
              <div className="text-sm text-blue-300">Rol: {usuario.rol}</div>
              <div className="text-xs text-gray-400">Estado: {usuario.estado}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserAdminPage;