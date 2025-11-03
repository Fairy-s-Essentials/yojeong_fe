import { createBrowserRouter, RouterProvider } from 'react-router';
import { MainPage } from '../pages/MainPage';
import { OriginalInputPage } from '@/pages/OriginalInputPage';
import { SummaryInputPage } from '@/pages/SummaryInputPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/input',
    element: <OriginalInputPage />,
  },
  {
    path: '/summary',
    element: <SummaryInputPage />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
