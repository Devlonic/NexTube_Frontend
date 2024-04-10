// src/components/Profile/Routes/Info/index.tsx
import React, { useEffect, useState } from 'react';
import {
  FieldBasicEditBigInput,
  FieldBasicEditInput,
} from '../../../common/inputs';
import {
  ILoginResult,
  IUserUpdate,
  IPasswordChange,
} from '../../../../pages/UpdateUser/types';
import http_api from '../../../../services/http_api';
import { useSelector } from 'react-redux';
import { IAuthUser } from '../../../../store/reducers/auth/types';
import { handleError, handleSuccess } from '../../../../common/handleError';
import { useTranslation } from 'react-i18next'; // Import the hook

export const ProfileInfo = () => {
  const { t } = useTranslation(); // Initialize the hook

  const [userData, setUserData] = useState<IUserUpdate>({
    firstName: '',
    lastName: '',
    nickname: '',
    description: '',
    oldPassword: '',
    newPassword: '',
  });

  const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);
  useEffect(() => {
    if (isAuth) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await http_api.get<IUserUpdate>(
        `/api/User/GetUser?ChannelId=${user?.userId}`,
      );
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Update', userData);
      await http_api.put<ILoginResult>('/api/user/updateuser', userData);
      if (userData.newPassword != null && userData.oldPassword != null) {
        await http_api.post<IPasswordChange>('/api/auth/changePassword', {
          password: userData.oldPassword,
          newPassword: userData.newPassword,
        });
      }
      window.location.reload();
      handleSuccess('Update');
    } catch (error) {
      console.error('Error saving changes:', error);
      handleError(error);
    }
  };

  return (
    <>
      <div className="mb-6">
        <FieldBasicEditInput
          name="firstName"
          title={t('profileInfo.firstName')}
          description={t('profileInfo.channelNamePlaceholder')}
          placeholder={t('profileInfo.channelNamePlaceholder')}
          value={userData.firstName}
          handleChange={handleInputChange}
          error=""
          type="text"
        />
      </div>
      <div className="mb-6">
        <FieldBasicEditInput
          name="lastName"
          title={t('profileInfo.lastName')}
          description={t('profileInfo.channelNamePlaceholder')}
          placeholder={t('profileInfo.channelNamePlaceholder')}
          value={userData.lastName}
          handleChange={handleInputChange}
          error=""
          type="text"
        />
      </div>
      <div className="mb-6">
        <FieldBasicEditInput
          name="nickname"
          title={t('profileInfo.handle')}
          description={t('profileInfo.channelNamePlaceholder')}
          placeholder={t('profileInfo.handlePlaceholder')}
          value={userData.nickname}
          handleChange={handleInputChange}
          error=""
          type="text"
        />
      </div>
      <div className="mb-6">
        <FieldBasicEditBigInput
          name="description"
          title={t('profileInfo.description')}
          description=""
          placeholder={t('profileInfo.tellViewersPlaceholder')}
          value={userData.description}
          handleChange={handleInputChange}
          error=""
        />
      </div>
      <div className="mb-6">
        <FieldBasicEditInput
          name="oldPassword"
          title={t('profileInfo.changePassword') + ' ⚠️ '}
          description=""
          placeholder={t('profileInfo.oldPassword')}
          value={userData.oldPassword}
          handleChange={handleInputChange}
          error=""
          type="password"
        />
        <FieldBasicEditInput
          name="newPassword"
          title={''}
          description=""
          placeholder={t('profileInfo.newPassword')}
          value={userData.newPassword}
          handleChange={handleInputChange}
          error=""
          type="password"
        />
      </div>
      <div className="mb-5">
        <button
          type="submit"
          className="w-50 cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
          onClick={handleSubmit}
        >
          {t('profileInfo.saveButton')}
        </button>
      </div>
    </>
  );
};
