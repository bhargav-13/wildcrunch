import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !showToast) {
      toast.error('Please login to access this page');
      setShowToast(true);
    }
  }, [isAuthenticated, loading, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F8F7E5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F1B213]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
