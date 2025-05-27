// frontend/src/components/chat/ChatInput.jsx
import React, { useState } from 'react';

function ChatInput() {
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    // Lógica para enviar el mensaje
    if (inputText.trim()) {
      console.log('Mensaje enviado:', inputText);
      // Aquí iría la llamada a la función para enviar el mensaje a la IA
      setInputText('');
    }
  };

  return (
    <div className="p-4 bg-gray-200">
      <div className="flex">
        <input
          type="text"
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          placeholder="Escribe tu mensaje..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
        />
        <button
          className="px-4 py-2 ml-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={handleSendMessage}
        >
          Enviar
        </button>
        <button className="p-2 ml-2 text-gray-600 rounded-full hover:bg-gray-300 focus:outline-none focus:shadow-outline">
          {/* Icono de micrófono */}
          🎙️
        </button>
      </div>
    </div>
  );
}

export default ChatInput;