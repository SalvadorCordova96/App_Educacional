// import React from 'react'; // (Descomentarlo si se requiere React en futuras mejoras)

function LegalPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-xl p-8 bg-black shadow-2xl bg-opacity-80 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Aviso Legal y Privacidad</h2>
        <div className="text-base text-left text-white">
          <p className="mb-4">Esta plataforma cumple con las normativas de protección de datos y privacidad. Tu información será tratada con confidencialidad y solo se usará para fines educativos y de mejora continua.</p>
          <p className="mb-2">Para más detalles, consulta nuestra <a href="#" className="text-blue-300 underline">Política de Privacidad</a> y <a href="#" className="text-blue-300 underline">Términos de Uso</a>.</p>
        </div>
      </div>
    </div>
  );
}

export default LegalPage;