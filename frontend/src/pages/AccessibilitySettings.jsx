import React, { useState } from 'react';

function AccessibilitySettings() {
  // Mock de configuraciones de accesibilidad
  const [accesibilidad, setAccesibilidad] = useState({
    altoContraste: false,
    textoGrande: false,
    modoLectura: false,
  });

  // Práctica revolucionaria: feedback inmediato y accesibilidad real
  const toggleAcc = key => {
    setAccesibilidad(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-3xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Accesibilidad</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
            <div className="text-left">
              <div className="mb-1 text-lg font-semibold text-white">Alto Contraste</div>
              <div className="text-blue-300 text-sm">Mejora la visibilidad para usuarios con baja visión.</div>
            </div>
            <button onClick={() => toggleAcc('altoContraste')} className={`ml-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 ${accesibilidad.altoContraste ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{accesibilidad.altoContraste ? 'Activado' : 'Desactivado'}</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
            <div className="text-left">
              <div className="mb-1 text-lg font-semibold text-white">Texto Grande</div>
              <div className="text-blue-300 text-sm">Aumenta el tamaño de fuente para facilitar la lectura.</div>
            </div>
            <button onClick={() => toggleAcc('textoGrande')} className={`ml-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 ${accesibilidad.textoGrande ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{accesibilidad.textoGrande ? 'Activado' : 'Desactivado'}</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
            <div className="text-left">
              <div className="mb-1 text-lg font-semibold text-white">Modo Lectura</div>
              <div className="text-blue-300 text-sm">Simplifica la interfaz para una experiencia de lectura sin distracciones.</div>
            </div>
            <button onClick={() => toggleAcc('modoLectura')} className={`ml-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 ${accesibilidad.modoLectura ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{accesibilidad.modoLectura ? 'Activado' : 'Desactivado'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessibilitySettings;