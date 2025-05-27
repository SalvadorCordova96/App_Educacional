// import React from 'react'; // (Descomentarlo si se requiere React en futuras mejoras)

function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-xl p-8 bg-black shadow-2xl bg-opacity-80 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Acerca de la Plataforma</h2>
        <div className="text-white text-left text-base">
          <p className="mb-4">Esta plataforma educativa fue creada con la visión de transformar la experiencia de aprendizaje, integrando tecnología, inclusión y personalización para todos los usuarios.</p>
          <p className="mb-2">Nuestro objetivo es empoderar a estudiantes, docentes y familias, brindando herramientas innovadoras y un entorno seguro, motivador y colaborativo.</p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;