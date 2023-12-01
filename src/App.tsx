import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignInPage/SignInPage.tsx';
import SignUp from './pages/Authentication/SignUp/SignUpPage.tsx';
import Loader from './common/Loader';
import DefaultLayout from './layout/DefaultLayout.tsx';
import HomePage from './pages/Home/HomePage.tsx';
import AuthLayout from './layout/AuthLayout.tsx';
import SignOut from './pages/Authentication/SignOut.tsx';
import { ToastContainer } from 'react-toastify';
import { VideosListContainer } from './components/Videos/VideosListContainer.tsx';
import { WatchVideo } from './components/Videos/WatchVideo.tsx';
import { ViewChannel } from './components/Channel/ViewChannel/ViewChannel.tsx';
import routes, { channelRoutes } from './routes/index.ts';
import { ChannelHome } from './components/Channel/Routes/Home/index.tsx';

const AdminLayout = lazy(() => import('./layout/AdminLayout.tsx'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ViewChannel />}>
            <Route index element={<ChannelHome></ChannelHome>}></Route>
            {channelRoutes.map(({ path, component: Component }, id) => (
              <Route
                key={id}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            ))}
          </Route>
          <Route path="search" element={<WatchVideo />} />
          <Route path="friends" element={<VideosListContainer />} />
        </Route>
        <Route path={'/auth'} element={<DefaultLayout />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signout" element={<SignOut />} />
        </Route>
        <Route path={'/admin'} element={<AdminLayout />}>
          <Route index element={<ECommerce />} />
          {routes.map(({ path, component: Component }, id) => (
            <Route
              key={id}
              path={path}
              element={
                <Suspense fallback={<Loader />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
