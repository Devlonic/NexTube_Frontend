// src/components/Channel/ViewChannel/ViewChannel.tsx
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { Navbar } from '../../common/navbars/Navbar';
import './styles.css';
import SubscribeButton from '../../../pages/Subscription/UpdateUser/Subscription';
import http_api from '../../../services/http_api';
import { IconedProcessingButton } from '../../common/buttons/IconedButton';
import ReportForm from '../../ReportForm';
import { FlagIcon } from '@heroicons/react/20/solid';
import {
  IUsersubscription,
  SubscriptionReducerActionsType,
} from '../../../store/reducers/subscription/types';
import { channelRoutes } from '../../../routes';
import { IAuthUser } from '../../../store/reducers/auth/types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import setTitle from '../../../common/setTitle';

const ViewChannel = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<IUserInfo>();
  const { id } = useParams();
  const parts = location.pathname.split('/');
  const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);

  useEffect(() => {
    setTitle(`${user?.lastName} ${user?.firstName}`);
  }, []);

  const [showReportForm, setShowReportForm] = useState(false);

  const handleReportClick = () => {
    setShowReportForm((prevShowReportForm) => !prevShowReportForm);
  };

  const handleReportFormClose = () => {
    setShowReportForm(false);
  };
  const userSubscriptions = useSelector(
    (store: any) => store.subscription as IUsersubscription,
  );

  useEffect(() => {
    fetchData();
  }, [userSubscriptions, id]);

  const fetchData = async () => {
    try {
      const response = await http_api.get(`/api/User/GetUser?ChannelId=${id}`);

      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (!userData) {
    return <div>{t('channel.loading')}</div>;
  }

  return (
    <>
      <div className="">
        <div
          className={`absolute banner h-150 w-full bg-cover`}
          style={{
            backgroundImage: `url('/api/photo/getPhotoUrl/${userData.bannerFileId}/1920')`,
          }}
        ></div>
        <div className="absolute fade h-150 w-full radial-gradient"></div>
        <div className="absolute top-100 content font-bold p-8 w-full">
          <div className="flex">
            {/* channel photo */}
            <div className="w-36 h-36 dark:bg-primary rounded-full p-3 mr-6">
              <img
                className=" fill-white rounded-full dark:bg-transparent"
                src={
                  '/api/Photo/GetPhotoUrl/' +
                  userData.channelPhotoFileId +
                  '/150'
                }
                alt=""
              />
            </div>
            {/* channel info */}
            <div className="text">
              {/* Channel title */}
              <h1 className="text-white text-3xl mb-2">
                {userData.lastName} {userData.firstName}{' '}
              </h1>
              {/* Channel info */}
              <h4 className="text-gray text-md  mb-2">
                <span className="mr-4">@{userData.nickname}</span>
                <span className="mr-4">
                  {userData.subsciptions} {t('channel.subscribers')}
                </span>
                <span className="">
                  {userData.video} {t('channel.videos')}
                </span>
              </h4>

              {/* Channel description */}
              <h4 className="text-md  mb-2">
                <span className="text-white"> {userData.description}</span>
              </h4>
              {/* Subscribe to channel */}
              {user?.userId === id && (
                <div className="w-35 ">
                  <Link
                    to={'/profile'}
                    className="f`w-full h-12 cursor-pointer rounded-md   bg-secondary  p-2 px-10     text-white transition hover:bg-opacity-90`"
                  >
                    Profile
                  </Link>
                  <Link
                    to={'/profile/videos'}
                    className="f`w-full h-12 cursor-pointer rounded-md   bg-secondary  p-2 px-10 m-2    text-white transition hover:bg-opacity-90`"
                  >
                    Video
                  </Link>
                </div>
              )}

              {id !== user?.userId && (
                <div className="channel-tools">
                  <div className="w-35 ">
                    <SubscribeButton
                      isLoading={false}
                      onClick={() => {}}
                      text={t('watchVideo.subscribe')}
                      type="button"
                      backgroundClassname="primary"
                      subscribeId={id}
                    ></SubscribeButton>
                  </div>
                  <div className="w-11 h-0 ml-4">
                    <IconedProcessingButton
                      isLoading={false}
                      onClick={handleReportClick}
                      text=""
                      type="button"
                      icon={<FlagIcon height={25} width={25} />}
                      backgroundClassname="primary"
                    ></IconedProcessingButton>
                  </div>
                </div>
              )}
            </div>
          </div>
          {showReportForm && (
            <div className="report-form-overlay w-150 p-0">
              <ReportForm
                abuser={Number(parts[2])}
                videoId={null}
                onSubmitSuccess={handleReportFormClose}
              />
              <button onClick={handleReportFormClose}>
                {t('channel.reportForm.closeButton')}
              </button>
            </div>
          )}
          {!showReportForm && (
            <div>
              <div className="nav mt-6">
                <Navbar routeLength={4} refs={channelRoutes}></Navbar>
              </div>

              <div className="page mt-6">
                <Outlet></Outlet>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export { ViewChannel };
