import React, { useState } from 'react';

function AutomationSettings() {
  // Mock de automatizaciones configurables
  const [automatizaciones, setAutomatizaciones] = useState([
    { nombre: 'Recordatorio de tareas', activo: true, descripcion: 'Envía notificaciones automáticas antes de la fecha de entrega.' },
    { nombre: 'Resúmenes semanales', activo: false, descripcion: 'Recibe un resumen semanal de tu progreso y actividades.' },
    { nombre: 'Alertas de inactividad', activo: false, descripcion: 'Notifica si no se detecta actividad en 7 días.' },
  ]);

  // Práctica revolucionaria: feedback inmediato y control granular
  const toggleAutomatizacion = idx => {
    setAutomatizaciones(prev => prev.map((auto, i) => i === idx ? { ...auto, activo: !auto.activo } : auto));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-3xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Automatización y Recordatorios</h2>
        <div className="flex flex-col gap-4">
          {automatizaciones.map((auto, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="flex-1 text-left">
                <div className="mb-1 text-lg font-semibold text-white">{auto.nombre}</div>
                <div className="text-blue-300 text-sm">{auto.descripcion}</div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${auto.activo ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{auto.activo ? 'Activo' : 'Inactivo'}</span>
                <button onClick={() => toggleAutomatizacion(idx)} className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white font-bold shadow-md transition-all duration-300 hover:from-blue-800 hover:to-blue-800 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60">
                  {auto.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AutomationSettings;