function DashboardOverview() {
  // Mock de resumen visual
  const resumen = [
    { titulo: 'Progreso General', valor: '80%' },
    { titulo: 'Tareas Pendientes', valor: 3 },
    { titulo: 'Cursos Activos', valor: 5 },
    { titulo: 'Mensajes Nuevos', valor: 2 },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-3xl p-8 bg-black shadow-2xl bg-opacity-80 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumen.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-2 text-xl font-semibold text-white">{item.titulo}</div>
              <div className="mb-2 text-blue-300 text-2xl font-bold">{item.valor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;