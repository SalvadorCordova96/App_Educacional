import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTeacherClasses, getStudentAvailableClasses } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) {
        setError("Debes iniciar sesión para ver las clases.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        let fetchedClasses;
        if (user.rol === 'docente') {
          fetchedClasses = await getTeacherClasses();
        } else if (user.rol === 'alumno') {
          fetchedClasses = await getStudentAvailableClasses();
        } else {
          // Defaulting to student view for simplicity if role is unrecognized but user exists.
          fetchedClasses = await getStudentAvailableClasses(); 
        }
        setCourses(fetchedClasses || []);
      } catch (err) {
        setError(err.message || 'Error al cargar las clases.');
        console.error("Fetch courses error:", err);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const handleViewDetails = (classId) => {
    console.log(`Ver detalles de la clase ID: ${classId}`);
    // navigate(`/clases/${classId}`); // Example future navigation
  };
  
  const handleEditClass = (classId) => {
    console.log(`Editar clase ID: ${classId}`);
    // navigate(`/docente/clases/${classId}/editar`); // Example future navigation
  };

  const handleDeleteClass = async (classId) => {
    console.log(`Eliminar clase ID: ${classId}. Funcionalidad pendiente.`);
    // Example future implementation:
    // if (window.confirm("¿Estás seguro de que quieres eliminar esta clase?")) {
    //   try {
    //     // await deleteClass(classId); // Assuming deleteClass is imported from courseService
    //     setCourses(courses.filter(course => course.id !== classId));
    //   } catch (err) {
    //     setError(err.message || "Error al eliminar la clase.");
    //   }
    // }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-8 text-xl">Cargando clases...</p>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 max-w-lg mx-auto text-center" role="alert">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {user?.rol === 'docente' ? 'Mis Clases Creadas' : 'Clases Disponibles'}
        </h1>
        {user?.rol === 'docente' && (
          <Link
            to="/docente/clases/crear"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          >
            Crear Nueva Clase
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-2xl mb-4">
            {user?.rol === 'docente' ? 'Aún no has creado ninguna clase.' : 'No hay clases disponibles en este momento.'}
          </p>
          {user?.rol === 'docente' && <p className="text-lg">¡Comienza creando tu primera clase para tus estudiantes!</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300">
              {course.imagen_url && (
                <img src={course.imagen_url} alt={`Imagen de ${course.nombre}`} className="w-full h-48 object-cover"/>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3 truncate" title={course.nombre}>{course.nombre}</h2>
                <p className="text-gray-700 text-sm mb-4 flex-grow min-h-[60px]">
                  {course.descripcion ? (course.descripcion.length > 120 ? course.descripcion.substring(0, 117) + '...' : course.descripcion) : 'No hay descripción disponible.'}
                </p>
                {user?.rol === 'docente' && course.codigo_inscripcion && (
                  <p className="text-sm text-blue-700 font-medium mb-3">
                    Código: <span className="font-bold bg-blue-100 px-2 py-1 rounded-md">{course.codigo_inscripcion}</span>
                  </p>
                )}
                 <p className="text-xs text-gray-500 mb-4">
                  ID: {course.id} {user?.rol === 'docente' ? `(Docente ID: ${course.docente_id})` : ''}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-200">
                  {user?.rol === 'docente' ? (
                    <div className="flex justify-start space-x-3">
                      <button 
                        onClick={() => handleEditClass(course.id)}
                        className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition duration-150"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteClass(course.id)}
                        className="text-sm bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-150"
                      >
                        Eliminar
                      </button>
                    </div>
                  ) : ( // Alumno view
                    <button 
                      onClick={() => handleViewDetails(course.id)}
                      className="w-full text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
                    >
                      Ver Detalles
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseListPage;