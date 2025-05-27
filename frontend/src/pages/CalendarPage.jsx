import React from 'react';

function CalendarPage() {
  // Mock de eventos para visualización
  const eventos = [
    { titulo: 'Entrega de Tarea de Historia', fecha: '2024-06-15' },
    { titulo: 'Examen de Matemáticas', fecha: '2024-06-20' },
    { titulo: 'Feria de Ciencias', fecha: '2024-06-25' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Calendario de Eventos</h2>
        <div className="flex flex-col gap-4">
          {eventos.map((evento, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{evento.titulo}</div>
              <div className="text-sm text-blue-300">{evento.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;