function RolesPage() {
  // Mock de roles para visualización
  const roles = [
    { nombre: 'Alumno', permisos: 'Acceso a cursos y tareas' },
    { nombre: 'Docente', permisos: 'Gestión de cursos y tareas' },
    { nombre: 'Administrador', permisos: 'Gestión total de la plataforma' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Roles y Permisos</h2>
        <div className="flex flex-col gap-4">
          {roles.map((rol, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{rol.nombre}</div>
              <div className="text-sm text-blue-300">Permisos: {rol.permisos}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RolesPage;