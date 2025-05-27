import React from 'react';

function ChatPage() {
  // Mock de mensajes para visualización
  const mensajes = [
    { usuario: 'Ana', texto: '¡Hola a todos!', hora: '10:01' },
    { usuario: 'Luis', texto: '¿Alguien entendió la tarea de ciencias?', hora: '10:02' },
    { usuario: 'Docente', texto: 'Recuerden revisar el material en la plataforma.', hora: '10:03' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Chat / Mensajería</h2>
        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto mb-6">
          {mensajes.map((msg, idx) => (
            <div key={idx} className="flex flex-col items-start bg-blue-950 bg-opacity-80 rounded-lg p-4 shadow-md">
              <div className="text-blue-300 text-sm font-semibold">{msg.usuario} <span className="text-gray-400 text-xs">{msg.hora}</span></div>
              <div className="text-white text-base">{msg.texto}</div>
            </div>
          ))}
        </div>
        <form className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 rounded-lg bg-black bg-opacity-70 border-2 border-transparent focus:border-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white transition-all duration-300 shadow-md hover:shadow-blue-900/30"
            disabled
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white font-bold shadow-md transition-all duration-300 hover:from-blue-800 hover:to-blue-800 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60"
            disabled
          >
            Enviar
          </button>
        </form>
        <div className="text-xs text-gray-400 mt-2">(Funcionalidad de envío deshabilitada en esta demo)</div>
      </div>
    </div>
  );
}

export default ChatPage;