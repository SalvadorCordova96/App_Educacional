import React from 'react';

function ProjectsPage() {
  // Mock de proyectos colaborativos para visualización
  const proyectos = [
    { nombre: 'Proyecto STEAM', estado: 'En curso', participantes: 5 },
    { nombre: 'Revista Escolar', estado: 'Completado', participantes: 8 },
    { nombre: 'Feria de Ciencias', estado: 'Planeado', participantes: 3 },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Proyectos Colaborativos</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {proyectos.map((proyecto, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-2 text-xl font-semibold text-white">{proyecto.nombre}</div>
              <div className="mb-2 text-blue-300">Estado: {proyecto.estado}</div>
              <div className="mb-2 text-sm text-white">Participantes: {proyecto.participantes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;