import { createBrowserRouter, RouterProvider } from 'react-router';
import { MainPage } from '@/pages/MainPage';
import { OriginalInputPage } from '@/pages/OriginalInputPage';
import { SummaryInputPage } from '@/pages/SummaryInputPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { ProtectedRoute } from '@/components';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/input',
    element: (
      <ProtectedRoute>
        <OriginalInputPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/summary',
    element: (
      <ProtectedRoute>
        <SummaryInputPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analysis/:id',
    element: (
      <ProtectedRoute>
        <AnalysisPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
