import React from 'react';

function NotificationsPage() {
  // Mock de notificaciones para visualización
  const notificaciones = [
    { titulo: 'Nueva tarea disponible', fecha: '2024-06-10', tipo: 'Tarea' },
    { titulo: 'Mensaje del docente', fecha: '2024-06-09', tipo: 'Mensaje' },
    { titulo: 'Actualización de curso', fecha: '2024-06-08', tipo: 'Curso' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Notificaciones y Avisos</h2>
        <div className="flex flex-col gap-4">
          {notificaciones.map((notif, idx) => (
            <div key={idx} className="flex flex-col items-start p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{notif.titulo}</div>
              <div className="text-sm text-blue-300">{notif.tipo}</div>
              <div className="text-xs text-gray-400">{notif.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;