import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UserSidebar from '../components/Sidebar/UserSidebar';
import { useEffect, useRef, useState } from 'react';
import { isSignedIn } from '../services/tokenService';
import './../styles/custom-scrollbar.css';
import { store } from '../store';
import { ScrollingReducerActionTypes } from '../store/reducers/scrolling/ScrollingReducer';
import GoogleAuthWrapper from '../components/Auth/Google/GoogleAuthWrapper';
import { useSelector } from 'react-redux';
import { IAuthUser } from '../store/reducers/auth/types';
const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const navigator = useNavigate();
  const scrollable = useRef<any>();
  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  useEffect(() => {
    store.dispatch({
      type: ScrollingReducerActionTypes.SET_SCROLLABLE_COMPONENT,
      payload: scrollable,
    });
  }, []);

  return (
    <div className="dark:bg-body dark:text-bodydark ">
      {!isAuth && (
        <div className="hidden">
          <GoogleAuthWrapper onLoading={() => {}}></GoogleAuthWrapper>
        </div>
      )}

      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        <UserSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* <!-- ===== Content Area Start ===== --> */}
        <div
          ref={scrollable}
          className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden default-custom-scrollbar"
        >
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="bg-body">
            <div className="mx-auto">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};
export default DefaultLayout;
