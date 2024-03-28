import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo/logo.svg';
import SidebarLinkGroup from '../SidebarLinkGroup';
import './style.css';
import { useTranslation } from 'react-i18next'; // Import the hook

import {
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  Cog6ToothIcon,
  FaceSmileIcon,
  HandThumbUpIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import http_api from '../../services/http_api';
import { IAuthUser } from '../../store/reducers/auth/types';
import { useSelector } from 'react-redux';
import {
  IUsersubscription,
  SubscriptionReducerActionsType,
} from '../../store/reducers/subscription/types';
import { store } from '../../store';
import { ChannelPhoto } from '../ChannelPhoto';

interface UserSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const UserSidebar = ({ sidebarOpen, setSidebarOpen }: UserSidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  useEffect(() => {
    console.log('Current win w', window.screen.width);
    if (window.screen.width < 1024) {
      setSidebarOpen(false);
      setSidebarExpanded(false);
    }
  }, [window.screen.width]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const userSubscriptions = useSelector(
    (store: any) => store.subscription as IUsersubscription,
  );
  console.log(
    'store',
    userSubscriptions.subscriptions.map((c) => c.channelPhotoFileId),
  );
  const { user } = useSelector((store: any) => store.auth as IAuthUser);
  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (window.localStorage.token != undefined) {
        const response = (await http_api.get(`/api/Subscription/Subscriptions`))
          .data;
        const Subscriptions = response;
        store.dispatch({
          type: SubscriptionReducerActionsType.SET_SUBSCRIPTION_LIST,
          payload: Subscriptions,
        });
      }
    };
    console.log(user?.roles.find((r) => r == 'Unverified'));
    fetchSubscriptions();
  }, [
    user,
    SubscriptionReducerActionsType.ADD_SUBSCRIBER,
    SubscriptionReducerActionsType.DELETE_SUBSCRIBER,
  ]);
  const { t } = useTranslation(); // Initialize the hook
  return (
    <>
      <aside
        ref={sidebar}
        className={`absolute select-none left-0 top-0 z-[9999999] flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 mt-10">
          <NavLink to="/">
            <div className="w-[193px]">
              <img src={Logo} alt="Logo" />
            </div>
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <div className="w-8 dark:text-gray dark:hover:text-primary duration-300 ease-in-out">
              <ArrowLeftIcon></ArrowLeftIcon>
            </div>
          </button>
        </div>

        <div className="p-7">
          <NavLink
            to={'/'}
            className={`w-5/6 relative flex items-center justify-center font-bold text-2xl py-3 cursor-pointer rounded-md border border-transparent bg-primary  text-white transition hover:bg-opacity-90`}
          >
            <div className="rounded-md gradient absolute inset-0"></div>
            {t('userSidebar.home')}
          </NavLink>
        </div>

        <div className="no-scrollbar select-none flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <div>
              <ul className="mb-6 flex flex-col gap-1.5">
                {user && (
                  <>
                    <li>
                      <SidebarItem
                        active={true}
                        url="/profile"
                        title={t('userSidebar.profile')}
                        icon={<UserIcon></UserIcon>}
                      ></SidebarItem>
                    </li>

                    <li>
                      <SidebarItem
                        url={`/channel/${user?.userId}`}
                        icon={<UserGroupIcon></UserGroupIcon>}
                        title={t('dropdownUser.yourChannel')}
                        active={true}
                      ></SidebarItem>
                    </li>

                    <li>
                      <SidebarItem
                        active={false}
                        url={`/channel/${user.userId}/playlists`}
                        title={t('userSidebar.library')}
                        icon={
                          <ClipboardDocumentListIcon></ClipboardDocumentListIcon>
                        }
                      ></SidebarItem>
                    </li>

                    <li>
                      <SidebarItem
                        active={false}
                        url="/history"
                        title={t('userSidebar.history')}
                        icon={<ClockIcon></ClockIcon>}
                      ></SidebarItem>
                    </li>
                  </>
                )}

                {user == null && (
                  <>
                    <li>
                      <SidebarItem
                        active={true}
                        url="/auth/signin"
                        title={t('userSidebar.signIn')}
                        icon={<UserPlusIcon></UserPlusIcon>}
                      ></SidebarItem>
                    </li>
                  </>
                )}

                {/* <li>
                  <SidebarItem
                    active={false}
                    url="/liked"
                    title={t("userSidebar.likedVideos")}
                    icon={<HandThumbUpIcon></HandThumbUpIcon>}
                  ></SidebarItem>
                </li> */}

                {/* <li>
                  <SidebarItem
                    active={false}
                    url="/later"
                    title={t("userSidebar.watchLater")}
                    icon={<ClockIcon></ClockIcon>}
                  ></SidebarItem>
                </li> */}

                <li>
                  <div className="h-8"></div>
                </li>
              </ul>
            </div>

            <div className="sub">
              <ul className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Menu Item Auth Pages --> */}
                <SidebarLinkGroup activeCondition={true}>
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-secondary dark:hover:bg-secondary rounded-lg ${
                            (pathname === '/auth' ||
                              pathname.includes('auth')) &&
                            ''
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          {() => {
                            if (window.localStorage.token != undefined)
                              return t('userSidebar.subscriptions');
                          }}
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && 'hidden'
                          }`}
                        >
                          <ul>
                            {userSubscriptions.subscriptions.map(
                              (subscription, index) => (
                                <li key={index}>
                                  <SidebarItem
                                    active={true}
                                    url={`/channel/${subscription.userId}`}
                                    title={`${subscription.firstName} ${subscription.lastName}`}
                                    icon={
                                      <div className="thumb bg-danger rounded-full w-8 h-8">
                                        {subscription.channelPhotoFileId && (
                                          <img
                                            className="h-8 w-8 rounded-full"
                                            src={
                                              '/api/Photo/GetPhotoUrl/' +
                                              subscription.channelPhotoFileId +
                                              '/50'
                                            }
                                            alt="User"
                                          />
                                        )}
                                      </div>
                                    }
                                  />
                                </li>
                              ),
                            )}
                          </ul>{' '}
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/* <!-- Menu Item Auth Pages --> */}
              </ul>
            </div>

            <div>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <SidebarItem
                    active={true}
                    url="/profile/info"
                    title={t('userSidebar.settings')}
                    icon={<Cog6ToothIcon></Cog6ToothIcon>}
                  ></SidebarItem>
                </li>

                {/* <li>
                  <SidebarItem
                    active={true}
                    url="/reports"
                    title={t("userSidebar.reportHistory")}
                    icon={<FaceSmileIcon></FaceSmileIcon>}
                  ></SidebarItem>
                </li> */}

                {/* <li>
                  <SidebarItem
                    active={false}
                    url="/help"
                    title={t("userSidebar.help")}
                    icon={<QuestionMarkCircleIcon></QuestionMarkCircleIcon>}
                  ></SidebarItem>
                </li> */}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = (props: {
  url: string;
  title: string;
  icon: any;
  active: boolean;
}) => {
  return (
    <>
      <NavLink
        to={props.url}
        className={`group rounded-lg relative flex items-center gap-2.5 py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-secondary dark:hover:bg-secondary`}
      >
        <div className="icon w-8 relative dark:text-white">{props.icon}</div>
        {props.title}
      </NavLink>
    </>
  );
};

export default UserSidebar;
