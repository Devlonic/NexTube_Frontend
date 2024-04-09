import { Link } from 'react-router-dom';
import Logo from '../images/logo/logo-icon.svg';
import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownMessage from './DropdownMessage';
import { useSelector } from 'react-redux';
import { IAuthUser } from '../store/reducers/auth/types';
import { SearchField } from './Search/SearchField';
import DropdownNotification from './Notifications/DropdownNotification';
import DropdownUser from './DropdownUser';
import { t } from 'i18next';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);

  return (
    <header className="text-gray h-24 sticky top-0 z-[9998]  flex w-full  dark:bg-[#1e1e20fc] dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between py-4 px-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-[99999999] block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

        <div className="flex">
          <div className="hidden sm:block">
            <SearchField></SearchField>
          </div>
          <div className="ml-6">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              {isAuth && (
                <>
                  {/* <!-- Notification Menu Area --> */}
                  <DropdownNotification />
                  {/* <!-- Notification Menu Area --> */}
                </>
              )}
              {/* <!-- Dark Mode Toggler --> */}
              {/* <DarkModeSwitcher /> */}
              {/* <!-- Dark Mode Toggler --> */}
            </ul>
          </div>
        </div>

        <div className="flex z-9999 items-center gap-3 2xsm:gap-7">
          {/* <!-- User Area --> */}
          {isAuth && (
            <DropdownUser
              sidebarOpen={props.sidebarOpen}
              setSidebarOpen={props.setSidebarOpen}
            />
          )}
          {!isAuth && (
            <>
              <Link
                to="/auth/signup"
                className="flex text-gray items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                {t('auth.signUp.signUpButton')}
              </Link>
              <Link
                to="/auth/signin"
                className="flex text-gray items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                {t('auth.signUp.signInButton')}
              </Link>
            </>
          )}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
