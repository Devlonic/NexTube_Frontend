import axios, { AxiosError } from 'axios';
import jwtDecode from 'jwt-decode';
import { AuthUserActionType, IUser } from '../store/reducers/auth/types';
import http_api from './http_api';
import { store } from '../store';

export const storeToken = (token: string) => {
  console.log('store token');
  localStorage.setItem('token', `Bearer ${token}`);
  http_api.defaults.headers['Authorization'] = getToken();
  const user: IUser = jwtDecode(token);
  store.dispatch({
    type: AuthUserActionType.LOGIN_USER,
    payload: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      channelPhoto: user.channelPhoto,
      roles: user.roles,
      userId: user.userId,
    },
  });
};
 
export const loadTokenFromStorage = () => {
  console.log('loadTokenFromStorage token');
  const token = getToken() as string;
  http_api.defaults.headers['Authorization'] = token;
  const user: IUser = jwtDecode(token);
  store.dispatch({
    type: AuthUserActionType.LOGIN_USER,
    payload: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      channelPhoto: user.channelPhoto,
      roles: user.roles,
      userId: user.userId,
    },
  });
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  delete http_api.defaults.headers['Authorization'];
  store.dispatch({
    type: AuthUserActionType.LOGOUT_USER,
    payload: {},
  });
  return localStorage.removeItem('token');
};

export const decodeToken = (token: string) => {
  return jwtDecode(token);
};

export const isAdmin = (user: IUser | undefined): boolean => {
  return (
    user != null &&
    user.roles != null &&
    (user?.roles as string[]).find((r) => r == 'Administrator') != null
  );
};

export const isUnverified = (user: IUser | undefined): boolean => {
  return (
    user != null &&
    user.roles != null &&
    (user?.roles as string[]).find((r) => r == 'Unverified') != null
  );
};

export const isSignedIn = (): boolean => {
  let t = getToken();
  // todo add overdue check
  return t != null && t != '' && t != undefined;
};

export enum Roles {
  Administrator = 'Administrator',
  User = 'User',
  Unverified = 'Unverified',
}
