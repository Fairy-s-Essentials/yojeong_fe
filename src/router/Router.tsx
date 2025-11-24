import { createBrowserRouter, RouterProvider } from 'react-router';
import { MainPage } from '@/pages/MainPage';
import { OriginalInputPage } from '@/pages/OriginalInputPage';
import { SummaryInputPage } from '@/pages/SummaryInputPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { Layout, ProtectedRoute } from '@/components';
import { MyPage } from '@/pages/MyPage';
import { UsageCheckRoute } from './UsageCheckRoute';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // 레이아웃 안에 있는 페이지
      {
        path: '/',
        element: <MainPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          // 로그인 후 사용 가능한 페이지들
          {
            element: <UsageCheckRoute />,
            children: [
              // 사용량 체크 후 이용 가능한 페이지들
              {
                path: '/input',
                element: <OriginalInputPage />,
              },
              {
                path: '/summary',
                element: <SummaryInputPage />,
              },
            ],
          },
          {
            path: '/analysis/:id',
            element: <AnalysisPage />,
          },
          {
            path: '/history',
            element: <HistoryPage />,
          },
          {
            path: '/mypage',
            element: <MyPage />,
          },
        ],
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
