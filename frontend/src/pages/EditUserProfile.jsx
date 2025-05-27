import React, { useState } from 'react';

function EditUserProfile() {
  // Mock de datos de usuario para edición
  const [nombre, setNombre] = useState('Nombre de Usuario');
  const [correo, setCorreo] = useState('usuario@correo.com');
  const [rol] = useState('Alumno'); // o 'Docente', no editable por ahora
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('Cambios guardados (simulado)');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <form onSubmit={handleSubmit} className="bg-black bg-opacity-70 rounded-xl p-8 shadow-2xl max-w-lg w-full">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">Editar Perfil</h2>
        <div className="mb-4">
          <label className="block text-white text-sm font-semibold mb-2">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black bg-opacity-70 border-2 border-transparent focus:border-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white transition-all duration-300 shadow-md hover:shadow-blue-900/30"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-semibold mb-2">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black bg-opacity-70 border-2 border-transparent focus:border-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white transition-all duration-300 shadow-md hover:shadow-blue-900/30"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2">Rol</label>
          <input
            type="text"
            value={rol}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-400 border-2 border-transparent"
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white font-bold shadow-md transition-all duration-300 hover:from-blue-800 hover:to-blue-800 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/60">
          Guardar Cambios
        </button>
        {mensaje && <div className="text-green-400 mt-4">{mensaje}</div>}
      </form>
    </div>
  );
}

export default EditUserProfile;