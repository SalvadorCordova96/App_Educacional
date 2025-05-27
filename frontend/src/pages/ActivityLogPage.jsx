function ActivityLogPage() {
  // Mock de historial de actividad para visualización
  const actividades = [
    { descripcion: 'Inició sesión', fecha: '2024-06-10 08:00' },
    { descripcion: 'Entregó tarea de Historia', fecha: '2024-06-09 18:30' },
    { descripcion: 'Participó en el chat de Ciencias', fecha: '2024-06-09 17:00' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Historial de Actividad</h2>
        <div className="flex flex-col gap-4">
          {actividades.map((act, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{act.descripcion}</div>
              <div className="text-sm text-blue-300">{act.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogPage;