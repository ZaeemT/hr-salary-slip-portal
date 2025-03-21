import { RouteObject } from 'react-router-dom';
import SignUp from '@/pages/SignUp';
import Login from '@/pages/Login';

export const authRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <SignUp />,
  }
];
