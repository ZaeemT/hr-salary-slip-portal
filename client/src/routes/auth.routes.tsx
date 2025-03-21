import { RouteObject } from 'react-router-dom';
import Auth from '@/pages/Auth';
import SignUp from '@/pages/SignUp';

export const authRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Auth />,
  },
  {
    path: '/register',
    element: <SignUp />,
  }
];
