import React from 'react';

function UserProgressStats() {
  // Mock de datos de progreso
  const progreso = {
    cursosCompletados: 3,
    tareasEntregadas: 12,
    porcentajeAvance: 65,
    proximoObjetivo: 'Completar el curso de Matemáticas',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-lg p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-4 text-3xl font-bold text-blue-400">Estadísticas de Progreso</h2>
        <div className="mb-2 text-lg text-white"><span className="font-semibold">Cursos Completados:</span> {progreso.cursosCompletados}</div>
        <div className="mb-2 text-lg text-white"><span className="font-semibold">Tareas Entregadas:</span> {progreso.tareasEntregadas}</div>
        <div className="mb-2 text-lg text-white"><span className="font-semibold">Avance Total:</span> {progreso.porcentajeAvance}%</div>
        <div className="mt-4 text-lg text-blue-300"><span className="font-semibold">Próximo Objetivo:</span> {progreso.proximoObjetivo}</div>
        {/* Espacio para futuras integraciones: gráficas, IA, recomendaciones, etc. */}
      </div>
    </div>
  );
}

export default UserProgressStats;