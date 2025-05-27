// import React, { useState } from 'react'; // (Descomentarlo si se requiere React en futuras mejoras)
import { useState } from 'react';

function AdvancedFeedback() {
  const [feedback, setFeedback] = useState('');
  const [enviado, setEnviado] = useState(false);
  const handleSend = () => {
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
    setFeedback('');
  };
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-xl p-8 bg-black shadow-2xl bg-opacity-80 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Feedback Avanzado</h2>
        <textarea
          className="w-full rounded-lg p-4 bg-blue-950 bg-opacity-80 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={5}
          placeholder="Comparte tus sugerencias, problemas o ideas..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />
        <button
          onClick={handleSend}
          disabled={!feedback.trim()}
          className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white font-bold shadow-md transition-all duration-300 hover:from-blue-800 hover:to-blue-800 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60 disabled:opacity-50"
        >Enviar</button>
        {enviado && <div className="mt-4 text-green-400 font-bold">¡Gracias por tu feedback!</div>}
      </div>
    </div>
  );
}

export default AdvancedFeedback;