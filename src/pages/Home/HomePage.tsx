import { useSelector } from 'react-redux';
import { ChannelPhoto } from '../../components/ChannelPhoto';
import { VideosListContainer } from '../../components/Videos/VideosListContainer';
import { IAuthUser } from '../../store/reducers/auth/types';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  UserIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { Navbar } from '../../components/common/navbars/Navbar';
import { recommendationVideosRoutes } from '../../routes';
import { MainPoster } from '../../components/Home/MainPoster';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import setTitle from '../../common/setTitle';

const HomePage = () => {
  const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);
  const { t } = useTranslation();

  useEffect(() => {
    setTitle('');
  }, []);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="">
          <>
            <MainPoster></MainPoster>
            {!isAuth && (
              <div className="flex relative z-[999] mt-12">
                <div className="mr-4">
                  <div className="h-12 w-12 p-2 rounded-full bg-gray hover:bg-primary duration-300 ease-in-out">
                    <UserIcon></UserIcon>
                  </div>
                </div>
                <div className="text-gray flex items-center dark:hover:text-primary duration-300 ease-in-out">
                  <Link
                    to={`/auth/signin`}
                    className="flex items-center gap-3.5 text-sm font-medium lg:text-base"
                  >
                    <div className="icon w-8 relative">
                      <VideoCameraIcon></VideoCameraIcon>
                    </div>
                    <span className="font-bold">
                      {t('homePage.signInToAct')}
                    </span>
                  </Link>
                </div>
              </div>
            )}
            {isAuth && (
              <div className="flex relative z-[999]  mt-12">
                <div className="mr-4">
                  <ChannelPhoto photoFileId={user?.channelPhoto}></ChannelPhoto>
                </div>
                <div className="text-gray flex items-center dark:hover:text-primary duration-300 ease-in-out">
                  <Link
                    to={`/profile/videos/addVideo`}
                    className="flex items-center gap-3.5 text-sm font-medium lg:text-base"
                  >
                    <div className="icon w-8 relative">
                      <VideoCameraIcon></VideoCameraIcon>
                    </div>
                    <span className="font-bold">
                      {t('homePage.createVideo')}
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </>
          {isAuth && (
            <>
              <div className="nav mt-6 w-full">
                <Navbar
                  routeLength={1}
                  refs={recommendationVideosRoutes}
                ></Navbar>
              </div>
            </>
          )}
          <VideosListContainer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
