function MediaResourcesPage() {
  // Mock de recursos multimedia para visualización
  const recursos = [
    { nombre: 'Video: Introducción a la Física', tipo: 'Video', enlace: '#' },
    { nombre: 'Audio: Podcast de Historia', tipo: 'Audio', enlace: '#' },
    { nombre: 'Imagen: Mapa Conceptual', tipo: 'Imagen', enlace: '#' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Recursos Multimedia</h2>
        <div className="flex flex-col gap-4">
          {recursos.map((recurso, idx) => (
            <a key={idx} href={recurso.enlace} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80 hover:bg-blue-900 transition-all">
              <div className="mb-1 text-lg font-semibold text-white">{recurso.nombre}</div>
              <div className="text-sm text-blue-300">{recurso.tipo}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MediaResourcesPage;