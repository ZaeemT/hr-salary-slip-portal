import { RouteObject } from 'react-router-dom';
import Auth from '@/pages/Auth';

export const authRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Auth />,
  },
];
