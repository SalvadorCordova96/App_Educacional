// MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar user={user} />
      
      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar user={user} />
        
        {/* Content */}
        <main className="flex-grow p-6">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
