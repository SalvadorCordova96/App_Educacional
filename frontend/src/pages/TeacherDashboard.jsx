function TeacherDashboard() {
  // Mock de datos para panel de docente
  const resumen = [
    { titulo: 'Cursos a Cargo', valor: 3 },
    { titulo: 'Tareas por Revisar', valor: 5 },
    { titulo: 'Mensajes Recientes', valor: 7 },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Panel del Docente</h2>
        <div className="flex flex-col gap-4">
          {resumen.map((item, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{item.titulo}</div>
              <div className="text-blue-300 text-2xl font-bold">{item.valor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;