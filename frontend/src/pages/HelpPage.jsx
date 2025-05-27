function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Ayuda y Soporte</h2>
        <p className="mb-4 text-white text-lg">¿Tienes dudas o necesitas asistencia? Consulta la sección de preguntas frecuentes, envía tu retroalimentación o contacta al equipo de soporte.</p>
        <ul className="flex flex-col gap-2">
          <li><a href="/faq" className="text-blue-300 hover:underline">Preguntas Frecuentes (FAQ)</a></li>
          <li><a href="/feedback" className="text-blue-300 hover:underline">Enviar Retroalimentación</a></li>
          <li><a href="mailto:soporte@appeducacional.com" className="text-blue-300 hover:underline">Contactar Soporte</a></li>
        </ul>
      </div>
    </div>
  );
}

export default HelpPage;