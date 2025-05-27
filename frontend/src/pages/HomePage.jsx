// frontend/src/pages/HomePage.jsx
import React from 'react';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Bienvenido a AppEducacional</h1>
      <p className="text-lg text-blue-200 mb-8 max-w-xl">
        Plataforma educativa innovadora para estudiantes y docentes de secundaria. Explora, colabora y aprende con tecnología de vanguardia, IA y una experiencia visual moderna y accesible.
      </p>
      <div className="flex gap-4">
        <a href="/login" className="px-6 py-2 rounded-lg bg-blue-900 text-white font-semibold shadow-md hover:bg-blue-800 transition-all">Iniciar Sesión</a>
        <a href="/register" className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold shadow-md hover:bg-blue-600 transition-all">Registrarse</a>
      </div>
    </div>
  );
}

export default HomePage;