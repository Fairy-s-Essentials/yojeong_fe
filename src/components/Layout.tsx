import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import { SSEProgressModal } from './SSEProgressModal';
import { SummarySSEProvider } from '@/contexts';

/**
 * 공통 레이아웃 컴포넌트
 * - 모든 페이지에 Header와 min-h-screen 적용
 * - 메인 페이지('/')에서만 Header에 isMainPage prop 전달
 * - SummarySSEProvider로 SSE 상태 관리
 * - SSEProgressModal로 진행 상황 표시 (모든 페이지에서 유지)
 */
const Layout = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <SummarySSEProvider>
      <div className="min-h-screen">
        <Header isMainPage={isMainPage} />
        <main>
          <Outlet />
        </main>
        {/* SSE 진행 상황 모달 - 모든 페이지에서 표시 */}
        <SSEProgressModal />
      </div>
    </SummarySSEProvider>
  );
};

export default Layout;
