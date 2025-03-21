import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import { SalaryUploadForm } from '@/pages/Upload';
import { Profile } from '@/pages/Profile';

export const mainRoutes: RouteObject[] = [
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/upload',
    element: <SalaryUploadForm />
  },
  {
    path: '/profile',
    element: <Profile />
  }
];
