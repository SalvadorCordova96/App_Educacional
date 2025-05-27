function AdvancedCommunicationPage() {
  // Mock de módulos de comunicación avanzada para visualización
  const modulos = [
    { nombre: 'Chat en tiempo real', descripcion: 'Comunicación instantánea entre usuarios y grupos.' },
    { nombre: 'Videollamadas', descripcion: 'Reuniones virtuales y clases en línea integradas.' },
    { nombre: 'Mensajería segura', descripcion: 'Canales privados y moderados para docentes y alumnos.' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Comunicación Avanzada</h2>
        <div className="flex flex-col gap-4">
          {modulos.map((mod, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{mod.nombre}</div>
              <div className="text-blue-300">{mod.descripcion}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdvancedCommunicationPage;