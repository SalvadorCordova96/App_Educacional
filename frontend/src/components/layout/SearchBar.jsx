function SearchBar() {
  // Mock de barra de búsqueda global
  return (
    <div className="w-full max-w-lg mx-auto my-8">
      <input
        className="w-full rounded-lg p-4 bg-blue-950 bg-opacity-80 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Buscar en la plataforma..."
        disabled
      />
      <div className="text-xs text-gray-400 mt-2">(Funcionalidad de búsqueda deshabilitada en esta demo)</div>
    </div>
  );
}

export default SearchBar;