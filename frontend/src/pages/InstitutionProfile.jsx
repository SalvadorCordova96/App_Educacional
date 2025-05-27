function InstitutionProfile() {
  // Mock de datos institucionales
  const institucion = {
    nombre: 'Secundaria Técnica 123',
    ubicacion: 'Ciudad de México',
    tipo: 'Pública',
    estudiantes: 520,
    docentes: 32,
  };
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Perfil Institucional</h2>
        <div className="flex flex-col gap-2 text-white text-lg">
          <div><span className="font-semibold">Nombre:</span> {institucion.nombre}</div>
          <div><span className="font-semibold">Ubicación:</span> {institucion.ubicacion}</div>
          <div><span className="font-semibold">Tipo:</span> {institucion.tipo}</div>
          <div><span className="font-semibold">Estudiantes:</span> {institucion.estudiantes}</div>
          <div><span className="font-semibold">Docentes:</span> {institucion.docentes}</div>
        </div>
      </div>
    </div>
  );
}

export default InstitutionProfile;