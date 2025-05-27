function SupportPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Soporte Técnico</h2>
        <p className="mb-4 text-white text-lg">¿Tienes un problema técnico? Describe tu situación y el equipo de soporte te ayudará lo antes posible.</p>
        <form className="flex flex-col gap-4 items-center">
          <textarea className="w-full rounded-lg p-4 bg-blue-950 bg-opacity-80 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" rows={5} placeholder="Describe tu problema aquí..." disabled />
          <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white font-bold shadow-md transition-all duration-300 hover:from-blue-800 hover:to-blue-800 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60" disabled>Enviar</button>
        </form>
        <div className="text-xs text-gray-400 mt-2">(Funcionalidad de envío deshabilitada en esta demo)</div>
      </div>
    </div>
  );
}

export default SupportPage;