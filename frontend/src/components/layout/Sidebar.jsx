import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

// Define navigation items for public/unauthenticated users
const publicItems = [
  { to: '/', label: 'Inicio' },
  { to: '/login', label: 'Iniciar Sesión' },
  { to: '/register', label: 'Registro' },
];

function Sidebar() { // Removed user prop, will use useAuth directly
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout from AuthContext

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  // Base items for all authenticated users
  let authenticatedNavItems = [
    { to: '/dashboard', label: 'Dashboard' },
    // { to: '/courses', label: 'Cursos' }, // General courses link, can be kept or removed if /docente/clases is preferred for teachers
    { to: '/perfil', label: 'Perfil' },
    { to: '/chat-nuevo', label: 'Chat IA' },
    { to: '/settings', label: 'Configuración' },
  ];

  // Add teacher-specific items
  if (user && user.rol === 'docente') {
    authenticatedNavItems.splice(1, 0, { to: '/docente/clases', label: 'Mis Clases (Docente)' });
  } else if (user && (user.rol === 'alumno' || user.rol === 'student')) { // Support 'student' role as well
    // Link for students to see available classes
     authenticatedNavItems.splice(1, 0, { to: '/alumno/clases', label: 'Clases Disponibles' });
  }
  // For admin, items could be different or include all of the above plus admin-specific links

  // Define navigation items for public/unauthenticated users
  const publicItems = [
    { to: '/', label: 'Inicio' },
    { to: '/login', label: 'Iniciar Sesión' },
    { to: '/register', label: 'Registro' },
  ];
  
  // Determine which items to display
  const itemsToDisplay = user ? authenticatedNavItems : publicItems;

  return (
    <aside className="flex flex-col w-64 h-full gap-4 px-4 py-8 bg-gray-800 text-white shadow-xl">
      <div className="mb-8 text-2xl font-bold text-center text-blue-400 select-none">
        CogniSpark
      </div>
      <nav className="flex flex-col gap-2">
        {itemsToDisplay.map(item => (
          <Link
            key={item.label} 
            to={item.to}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                        ${location.pathname === item.to 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          >
            {item.label}
          </Link>
        ))}
        {user && ( 
          <button
            onClick={handleLogout}
            className={`mt-auto px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out text-gray-300 hover:bg-red-700 hover:text-white w-full text-left`}
          >
            Cerrar Sesión
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;