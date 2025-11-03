import { createBrowserRouter, RouterProvider } from 'react-router';
import { MainPage } from '../pages/MainPage';
import { OriginalInputPage } from '@/pages/OriginalInputPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/input',
    element: <OriginalInputPage />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
