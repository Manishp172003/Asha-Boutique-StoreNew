import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const AdminRoute = ({ children }) => {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F2EE] w-full">
        <div className="text-center">
          <p className="font-serif text-lg text-[#2B1E1A] animate-pulse">Verifying administration access...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
