import { Navigate } from 'react-router-dom';

function AuthRedirectRoute({ isAuthenticated, children }) {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default AuthRedirectRoute;
