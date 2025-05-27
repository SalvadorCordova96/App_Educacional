function ForumPage() {
  // Mock de foros para visualización
  const foros = [
    { titulo: 'Dudas de Matemáticas', mensajes: 12 },
    { titulo: 'Proyectos STEAM', mensajes: 8 },
    { titulo: 'Sugerencias para la plataforma', mensajes: 5 },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Foros de la Comunidad</h2>
        <div className="flex flex-col gap-4">
          {foros.map((foro, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{foro.titulo}</div>
              <div className="text-sm text-blue-300">Mensajes: {foro.mensajes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForumPage;