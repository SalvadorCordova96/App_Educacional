import React from 'react';

function CoursesPage() {
  // Mock de cursos para visualización
  const cursos = [
    { nombre: 'Matemáticas', estado: 'En curso', avance: 70 },
    { nombre: 'Ciencias', estado: 'Completado', avance: 100 },
    { nombre: 'Historia', estado: 'No iniciado', avance: 0 },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Mis Clases / Cursos</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cursos.map((curso, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-2 text-xl font-semibold text-white">{curso.nombre}</div>
              <div className="mb-2 text-blue-300">Estado: {curso.estado}</div>
              <div className="w-full h-3 mb-2 bg-gray-800 rounded-full">
                <div className="h-3 transition-all duration-500 bg-blue-500 rounded-full" style={{ width: `${curso.avance}%` }}></div>
              </div>
              <div className="text-sm text-white">Avance: {curso.avance}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;