import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SimpleLoader from '../SimpleLoader';

function ProtectedRoute({ children }) {
  const location = useLocation();
  
  try {
    const { currentUser, loading } = useAuth();
    
    if (loading) {
      return <SimpleLoader message="LOADING..." />;
    }

    if (!currentUser) {
      // Redirect to sign in page with return url
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
  } catch (error) {
    // If useAuth fails, just render children without protection
    console.warn('ProtectedRoute: Auth context not available, rendering without protection');
    return children;
  }
};

export default ProtectedRoute;
