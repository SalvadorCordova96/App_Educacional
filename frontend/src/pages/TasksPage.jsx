

function TasksPage() {
  // Mock de tareas para visualización
  const tareas = [
    { titulo: 'Tarea 1: Ensayo de Historia', estado: 'Pendiente', fechaEntrega: '2024-06-15' },
    { titulo: 'Tarea 2: Problemas de Matemáticas', estado: 'Entregada', fechaEntrega: '2024-06-10' },
    { titulo: 'Tarea 3: Experimento de Ciencias', estado: 'En revisión', fechaEntrega: '2024-06-12' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Tareas / Actividades</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {tareas.map((tarea, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-2 text-xl font-semibold text-white">{tarea.titulo}</div>
              <div className="mb-2 text-blue-300">Estado: {tarea.estado}</div>
              <div className="mb-2 text-sm text-white">Entrega: {tarea.fechaEntrega}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TasksPage;