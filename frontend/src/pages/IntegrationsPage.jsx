import React, { useState } from 'react';

function IntegrationsPage() {
  // Mock de integraciones activas y disponibles
  const [integraciones, setIntegraciones] = useState([
    { nombre: 'Google Classroom', estado: 'Activa', descripcion: 'Sincroniza tareas y cursos automáticamente.' },
    { nombre: 'Microsoft Teams', estado: 'Disponible', descripcion: 'Integra videollamadas y chats educativos.' },
    { nombre: 'Khan Academy', estado: 'Disponible', descripcion: 'Accede a recursos y ejercicios interactivos.' },
  ]);

  // Práctica revolucionaria: integración con APIs externas y feedback visual inmediato
  const handleActivar = idx => {
    setIntegraciones(prev => prev.map((intg, i) => i === idx ? { ...intg, estado: 'Activa' } : intg));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-3xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Integraciones Externas</h2>
        <div className="flex flex-col gap-4">
          {integraciones.map((intg, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="flex-1 text-left">
                <div className="mb-1 text-lg font-semibold text-white">{intg.nombre}</div>
                <div className="text-blue-300 text-sm">{intg.descripcion}</div>
              </div>
              <div className="mt-2 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${intg.estado === 'Activa' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{intg.estado}</span>
                {intg.estado !== 'Activa' && (
                  <button onClick={() => handleActivar(idx)} className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white font-bold shadow-md transition-all duration-300 hover:from-blue-800 hover:to-blue-800 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60">
                    Activar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IntegrationsPage;