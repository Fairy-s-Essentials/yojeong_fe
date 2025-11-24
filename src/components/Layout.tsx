import { Outlet, useLocation } from 'react-router';
import Header from './Header';

/**
 * 공통 레이아웃 컴포넌트
 * - 모든 페이지에 Header와 min-h-screen 적용
 * - 메인 페이지('/')에서만 Header에 isMainPage prop 전달
 */
const Layout = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <div className="min-h-screen">
      <Header isMainPage={isMainPage} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
