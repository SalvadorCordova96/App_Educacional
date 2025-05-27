// import React, { useState } from 'react'; // (Descomentarlo si se requiere React en futuras mejoras)
import { useState } from 'react';

function NotificationPreferences() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [sms, setSms] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-xl p-8 bg-black shadow-2xl bg-opacity-80 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Preferencias de Notificaciones</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
            <div className="text-left">
              <div className="mb-1 text-lg font-semibold text-white">Notificaciones por Email</div>
              <div className="text-sm text-blue-300">Recibe avisos y novedades en tu correo electrónico.</div>
            </div>
            <button onClick={() => setEmail(e => !e)} className={`ml-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 ${email ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{email ? 'Activado' : 'Desactivado'}</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
            <div className="text-left">
              <div className="mb-1 text-lg font-semibold text-white">Notificaciones Push</div>
              <div className="text-sm text-blue-300">Recibe alertas instantáneas en tu dispositivo.</div>
            </div>
            <button onClick={() => setPush(p => !p)} className={`ml-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 ${push ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{push ? 'Activado' : 'Desactivado'}</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
            <div className="text-left">
              <div className="mb-1 text-lg font-semibold text-white">Notificaciones SMS</div>
              <div className="text-sm text-blue-300">Recibe mensajes de texto con información relevante.</div>
            </div>
            <button onClick={() => setSms(s => !s)} className={`ml-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 ${sms ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{sms ? 'Activado' : 'Desactivado'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPreferences;