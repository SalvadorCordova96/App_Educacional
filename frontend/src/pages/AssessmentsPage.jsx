function AssessmentsPage() {
  // Mock de evaluaciones para visualización
  const evaluaciones = [
    { titulo: 'Examen de Matemáticas', tipo: 'Examen', fecha: '2024-06-20' },
    { titulo: 'Quiz de Ciencias', tipo: 'Quiz', fecha: '2024-06-18' },
    { titulo: 'Ensayo de Historia', tipo: 'Tarea', fecha: '2024-06-15' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Evaluaciones</h2>
        <div className="flex flex-col gap-4">
          {evaluaciones.map((item, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{item.titulo}</div>
              <div className="text-sm text-blue-300">{item.tipo}</div>
              <div className="text-xs text-gray-400">{item.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssessmentsPage;