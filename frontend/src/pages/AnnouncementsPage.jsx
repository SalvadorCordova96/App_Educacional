function AnnouncementsPage() {
  // Mock de anuncios globales
  const anuncios = [
    { titulo: 'Bienvenida a la nueva plataforma', fecha: '2024-06-10', mensaje: 'Explora las nuevas funciones y personaliza tu experiencia.' },
    { titulo: 'Mantenimiento programado', fecha: '2024-06-15', mensaje: 'La plataforma estará en mantenimiento de 2am a 4am.' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-80 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Anuncios Globales</h2>
        <div className="flex flex-col gap-4">
          {anuncios.map((anuncio, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{anuncio.titulo}</div>
              <div className="text-blue-300 text-sm">{anuncio.fecha}</div>
              <div className="text-white mt-2">{anuncio.mensaje}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementsPage;