// frontend/src/pages/DashboardPage.jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4">
      <h2 className="mb-6 text-2xl font-bold text-blue-700">Dashboard - Bienvenido {user?.name || ''}</h2>
      <Link to="/courses" className="text-blue-600 hover:underline">Ir a mis cursos</Link>
    </div>
  );
}

export default DashboardPage;