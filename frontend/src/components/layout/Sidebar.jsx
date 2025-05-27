import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const sidebarItems = [
  { to: '/', label: 'Inicio' },
  { to: '/login', label: 'Iniciar Sesión' },
  { to: '/register', label: 'Registro' },
  // Agrega más rutas según crezca la app
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="flex flex-col w-56 h-full gap-4 px-4 py-8 bg-black shadow-xl bg-opacity-80 backdrop-blur-md">
      <div className="mb-8 text-xl font-bold text-blue-400 select-none">AppEducacional</div>
      <nav className="flex flex-col gap-2">
        {sidebarItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`text-white px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-900/60 hover:text-blue-300 ${location.pathname === item.to ? 'bg-blue-900/80 text-blue-300' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;