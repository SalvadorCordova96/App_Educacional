import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClass } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';

const CreateClassPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen_url: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // For potential checks, though route should protect

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.rol !== 'docente') {
        setError("Acción no autorizada. Debes ser docente para crear clases.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newClass = await createClass(formData);
      setSuccess(`Clase "${newClass.nombre}" creada exitosamente con código: ${newClass.codigo_inscripcion}`);
      setFormData({ nombre: '', descripcion: '', imagen_url: '' }); // Reset form
      // Optionally redirect after a delay or provide a link
      setTimeout(() => {
        navigate('/docente/clases'); // Navigate to the list of classes for the teacher
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al crear la clase. Inténtalo de nuevo.');
      console.error("Create class error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Crear Nueva Clase</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre de la Clase:
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">
            Descripción:
          </label>
          <textarea
            name="descripcion"
            id="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="imagen_url" className="block text-gray-700 text-sm font-bold mb-2">
            URL de la Imagen (Opcional):
          </label>
          <input
            type="url"
            name="imagen_url"
            id="imagen_url"
            value={formData.imagen_url}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:bg-blue-300"
          >
            {isLoading ? 'Creando...' : 'Crear Clase'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassPage;
