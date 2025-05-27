import React, { useState } from 'react';

function ThemeCustomizer() {
  // Mock de temas disponibles y estado actual
  const [tema, setTema] = useState('Oscuro');
  const temas = ['Oscuro', 'Claro', 'Futurista', 'Minimalista'];

  // Práctica: cambio visual inmediato y preview
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Personalización de Tema</h2>
        <div className="flex flex-col gap-4">
          {temas.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setTema(t)}
              className={`px-6 py-2 rounded-lg font-bold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 ${tema === t ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-8 text-white text-lg">Tema actual: <span className="font-bold text-blue-400">{tema}</span></div>
        <div className="mt-4 p-4 rounded-lg bg-blue-950 bg-opacity-80 text-blue-200 shadow-inner">
          {/* Preview visual del tema seleccionado (simulado) */}
          <span>Vista previa del tema <b>{tema}</b></span>
        </div>
      </div>
    </div>
  );
}

export default ThemeCustomizer;