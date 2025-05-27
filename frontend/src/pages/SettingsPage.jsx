// frontend/src/pages/SettingsPage.jsx
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function SettingsPage() {
  // Mock de configuración para visualización
  const configuraciones = [
    { nombre: 'Notificaciones', valor: 'Activadas' },
    { nombre: 'Tema', valor: 'Oscuro' },
    { nombre: 'Idioma', valor: 'Español' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Configuración</h2>
        <div className="flex flex-col gap-4">
          {configuraciones.map((conf, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{conf.nombre}</div>
              <div className="text-sm text-blue-300">{conf.valor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;