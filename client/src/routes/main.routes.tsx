import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';

export const mainRoutes: RouteObject[] = [
  {
    path: '/home',
    element: <Home />,
  },
];
