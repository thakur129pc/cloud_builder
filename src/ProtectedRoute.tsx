import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { ReduxState } from './redux/store';
import { ComponentType } from 'react';

interface ProtectedRouteProps {
  element: ComponentType;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Element,
  redirectTo = '/wizard/task_types',
}) => {
  const location = useLocation();
  const isAuth =
    useSelector((state: ReduxState) => state.AuthSlice.authObj) ||
    localStorage.getItem('authObj');

  const unAuthRoutes = [
    'login',
    'register',
    'forgotpassword',
    'resetpassword',
    'passwordrecovernotice',
  ];

  const isAuthPage = unAuthRoutes.includes(location.pathname.replace('/', ''));

  if (isAuth && isAuthPage) {
    return <Navigate to={redirectTo} />;
  }

  if (!isAuth && !isAuthPage) {
    return <Navigate to="/login" />;
  }
  return <Element />;
};

export default ProtectedRoute;
