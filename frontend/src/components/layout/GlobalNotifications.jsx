import React, { useState, useEffect } from 'react';

function GlobalNotifications() {
  // Mock de notificaciones globales
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, mensaje: '¡Bienvenido a la nueva plataforma educativa!', tipo: 'info' },
    { id: 2, mensaje: 'Recuerda actualizar tu perfil para una mejor experiencia.', tipo: 'warning' },
  ]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (notificaciones.length > 0) {
      const timer = setTimeout(() => setVisible(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [notificaciones]);

  if (!visible || notificaciones.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-lg">
      {notificaciones.map(n => (
        <div key={n.id} className={`rounded-lg px-6 py-4 shadow-lg text-white font-semibold ${n.tipo === 'info' ? 'bg-blue-700' : 'bg-yellow-600'}`}>{n.mensaje}</div>
      ))}
    </div>
  );
}

export default GlobalNotifications;