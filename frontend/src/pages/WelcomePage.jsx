import React from 'react';

function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900">
      <div className="w-full max-w-2xl p-10 mt-20 bg-black shadow-2xl bg-opacity-80 rounded-2xl">
        <h1 className="mb-6 text-4xl font-extrabold text-blue-400 md:text-5xl animate-pulse">¡Bienvenido a la Plataforma Educativa del Futuro!</h1>
        <p className="mb-8 text-lg text-white md:text-xl">Explora, aprende y colabora en un entorno diseñado para inspirar, motivar y transformar la educación. Personaliza tu experiencia, accede a recursos innovadores y conecta con una comunidad que impulsa el cambio.</p>
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <a href="/register" className="px-8 py-3 font-bold text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 hover:from-blue-800 hover:to-blue-800 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">Crear cuenta</a>
          <a href="/login" className="px-8 py-3 font-bold text-white transition-all duration-300 bg-gray-700 rounded-lg shadow-md hover:bg-blue-900 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">Iniciar sesión</a>
        </div>
        <div className="mt-8 text-sm text-blue-300">Innovación, inclusión y aprendizaje sin límites.</div>
      </div>
    </div>
  );
}

export default WelcomePage;