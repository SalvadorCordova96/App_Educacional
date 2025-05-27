function CalendarWidget() {
  // Mock de eventos para el widget
  const eventos = [
    { titulo: 'Entrega de Tarea', fecha: '2024-06-15' },
    { titulo: 'Examen de Matemáticas', fecha: '2024-06-20' },
    { titulo: 'Feria de Ciencias', fecha: '2024-06-25' },
  ];
  return (
    <div className="w-full max-w-xs p-4 shadow-lg bg-blue-950 bg-opacity-90 rounded-xl">
      <h3 className="mb-4 text-xl font-bold text-blue-400">Próximos Eventos</h3>
      <ul className="text-left text-white">
        {eventos.map((ev, idx) => (
          <li key={idx} className="pb-2 mb-2 border-b border-blue-800 last:border-b-0">
            <span className="font-semibold">{ev.titulo}</span>
            <span className="block text-sm text-blue-300">{ev.fecha}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarWidget;