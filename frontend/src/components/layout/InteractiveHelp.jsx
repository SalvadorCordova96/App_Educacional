import React, { useState } from 'react';

function InteractiveHelp() {
  const [step, setStep] = useState(0);
  const pasos = [
    {
      titulo: 'Bienvenido a la Ayuda Interactiva',
      descripcion: 'Te guiaremos por las funciones clave de la plataforma para que aproveches al máximo tu experiencia.',
    },
    {
      titulo: 'Navegación',
      descripcion: 'Utiliza la barra lateral y la barra superior para acceder rápidamente a todas las secciones importantes.',
    },
    {
      titulo: 'Personalización',
      descripcion: 'Cambia el tema visual, ajusta la accesibilidad y configura tus preferencias desde el menú de usuario.',
    },
    {
      titulo: 'Recursos y Comunidad',
      descripcion: 'Accede a materiales, foros, chat y proyectos colaborativos para potenciar tu aprendizaje.',
    },
    {
      titulo: '¡Listo!',
      descripcion: 'Ya puedes explorar la plataforma. Si necesitas ayuda, accede a esta guía desde el menú principal.',
    },
  ];

  return (
    <div className="fixed z-50 w-full max-w-xs p-6 text-white shadow-2xl bottom-8 right-8 bg-blue-950 bg-opacity-90 rounded-xl animate-fade-in">
      <h3 className="mb-2 text-xl font-bold text-blue-400">{pasos[step].titulo}</h3>
      <p className="mb-4 text-blue-200">{pasos[step].descripcion}</p>
      <div className="flex justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 font-bold text-white bg-gray-700 rounded-lg disabled:opacity-50"
        >Anterior</button>
        <button
          onClick={() => setStep(s => Math.min(pasos.length - 1, s + 1))}
          disabled={step === pasos.length - 1}
          className="px-4 py-2 font-bold text-white bg-blue-700 rounded-lg disabled:opacity-50"
        >Siguiente</button>
      </div>
    </div>
  );
}

export default InteractiveHelp;