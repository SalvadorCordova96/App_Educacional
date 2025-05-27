// frontend/src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/login', label: 'Iniciar Sesión' },
  { to: '/register', label: 'Registro' },
  // Agrega más rutas según crezca la app
];

function Navbar() {
  const location = useLocation();
  return (
    <nav className="flex items-center justify-between w-full px-8 py-4 bg-black shadow-lg bg-opacity-80 backdrop-blur-md">
      <div className="text-2xl font-bold tracking-wider text-blue-400 select-none drop-shadow-lg">
        AppEducacional
      </div>
      <div className="flex gap-6">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`text-white px-3 py-1 rounded-lg transition-all duration-200 hover:bg-blue-900/60 hover:text-blue-300 ${location.pathname === item.to ? 'bg-blue-900/80 text-blue-300' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;