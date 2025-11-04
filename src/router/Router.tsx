import { createBrowserRouter, RouterProvider } from 'react-router';
import { MainPage } from '@/pages/MainPage';
import { OriginalInputPage } from '@/pages/OriginalInputPage';
import { SummaryInputPage } from '@/pages/SummaryInputPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';

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
  {
    path: '/analysis/:id',
    element: <AnalysisPage />,
  },  
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
