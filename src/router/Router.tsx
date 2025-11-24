import { createBrowserRouter, RouterProvider } from 'react-router';
import { MainPage } from '@/pages/MainPage';
import { OriginalInputPage } from '@/pages/OriginalInputPage';
import { SummaryInputPage } from '@/pages/SummaryInputPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { Layout, ProtectedRoute } from '@/components';
import { MyPage } from '@/pages/MyPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
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
            path: '/history',
            element: <HistoryPage />,
          },
        ],
      },

      {
        path: '/mypage',
        element: <MyPage />,
      },
    ],
  },
  // Layout 없이 렌더링하는 페이지들
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
