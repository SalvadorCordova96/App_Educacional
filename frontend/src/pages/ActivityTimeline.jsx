function ActivityTimeline() {
  // Mock de eventos de actividad
  const eventos = [
    { descripcion: 'Inició sesión', fecha: '2024-06-10 08:00' },
    { descripcion: 'Entregó tarea de Historia', fecha: '2024-06-09 18:30' },
    { descripcion: 'Participó en el chat de Ciencias', fecha: '2024-06-09 17:00' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-80 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Línea de Tiempo de Actividad</h2>
        <div className="flex flex-col gap-4">
          {eventos.map((ev, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{ev.descripcion}</div>
              <div className="text-blue-300 text-sm">{ev.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityTimeline;