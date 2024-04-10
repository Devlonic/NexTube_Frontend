// src/components/Profile/Routes/Branding/index.tsx
import { useEffect, useState } from 'react';
import { PrimaryProcessingButton } from '../../../common/buttons/PrimaryProcessingButton';
import { ModalCropper } from '../../../ModalCropper';
import http_api from '../../../../services/http_api';
import { handleError, handleSuccess } from '../../../../common/handleError';
import { useTranslation } from 'react-i18next'; // Import the hook
import setTitle from '../../../../common/setTitle';

interface IchannelPhoto {
  ChannelPhotoFile: File | null;
}

interface IChangeBannerRequest {
  BannerFileId: File | null;
}

export const ProfileBranding = () => {
  const { t } = useTranslation(); // Initialize the hook

  const [userData, setUserData] = useState<IchannelPhoto>({
    ChannelPhotoFile: null,
  });
  const [banner, setBanner] = useState<File | null>(null);

  const onImageSaveHandler = (file: File) => {
    console.log('image save handle', file);
    setUserData((prevData) => ({
      ...prevData,
      ChannelPhotoFile: file,
    }));
  };

  useEffect(() => {
    setTitle('Profile');
  }, []);

  const handleUploadButtonClick = async () => {
    try {
      await http_api.put('/api/User/UpdateChannelImage', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleSuccess('Update');

      window.location.reload();
    } catch (error) {
      console.error('Error saving changes:', error);
      handleError('Channel image upload failed.');
    }
  };

  const onBannerSaveHandler = (file: File) => {
    setBanner(file);
  };

  const handleUploadBannerClick = async () => {
    try {
      const changeBannerRequest: IChangeBannerRequest = {
        BannerFileId: banner,
      };

      await http_api.put('/api/User/changeBanner', changeBannerRequest, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      handleSuccess('Banner successfully uploaded.');
    } catch (error) {
      console.error('Error saving changes:', error);
      handleError('Banner upload failed.');
    }
  };

  return (
    <>
      <div className="item mb-12">
        <h3 className="text-white text-xl mb-2 font-bold">
          {t('profileBranding.picture')}
        </h3>
        <div className="flex">
          <div className="left">
            <div className="w-36 h-36   rounded-full mr-6">
              <ModalCropper
                onSave={onImageSaveHandler}
                error={''}
              ></ModalCropper>
            </div>
          </div>
          <div className="right w-80">
            <p className="text-gray text-lg">
              {t('profileBranding.recommendedDimensions')}
            </p>
            <div className="w-35 mt-6">
              {userData && userData.ChannelPhotoFile ? (
                <PrimaryProcessingButton
                  onClick={handleUploadButtonClick}
                  isLoading={false}
                  text={t('profileBranding.upload')}
                  type="button"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="item mb-12">
        <h3 className="text-white text-xl mb-2 font-bold">
          {t('profileBranding.bannerImage')}
        </h3>
        <div className="flex">
          <div className="left">
            <div className="mr-6 w-36 fill-white dark:bg-transparent">
              <ModalCropper
                onSave={onBannerSaveHandler}
                error={''}
                aspectRatio={2048 / 1152}
              ></ModalCropper>
            </div>
          </div>
          <div className="right w-80">
            <p className="text-gray text-lg">
              {t('profileBranding.bestResultsBanner')}
            </p>
            <div className="w-35 mt-6">
              <PrimaryProcessingButton
                onClick={handleUploadBannerClick}
                isLoading={false}
                text={t('profileBranding.upload')}
                type="button"
              ></PrimaryProcessingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
