// src/components/Profile/Routes/Videos/AddVideoOverlay
import { useEffect, useRef, useState } from 'react';
import CheckboxFour from '../../../../CheckboxFour';
import { PrimaryProcessingButton } from '../../../../common/buttons/PrimaryProcessingButton';
import { FieldEditBigInput, FieldEditInput } from '../../../../common/inputs';
import { CancelButton } from '../../../../common/buttons/CancelButton';
import { useNavigate } from 'react-router-dom';
import { ModalCropper } from '../../../../ModalCropper';
import {
  IVideoLookup,
  IVideoUploadRequest,
} from '../../../../../pages/Video/common/types';
import http_api from '../../../../../services/http_api';
import { handleError, handleSuccess } from '../../../../../common/handleError';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { store } from '../../../../../store';
import { ProfileVideosReducerActionsType } from '../../../../../store/reducers/profileVideos/types';
import { useTranslation } from 'react-i18next';

export const AddVideoOverlay = () => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<string>('Public');
  const [video, setVideo] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigator = useNavigate();
  const root = useRef(null);

  const request: IVideoUploadRequest = {
    name: '',
    description: '',
    previewPhoto: null,
    video: null,
    accessModificator: selected,
  };

  const requestSchema: any = yup.object({
    name: yup
      .string()
      .required(t('addVideoOverlay.videoTitleLabel'))
      .min(2)
      .max(100),
    description: yup
      .string()
      .required(t('addVideoOverlay.videoDescriptionLabel'))
      .min(2)
      .max(1000),
    previewPhoto: yup
      .mixed()
      .required(t('addVideoOverlay.selectVideoPreviewLabel')),
    video: yup.mixed().required(t('addVideoOverlay.videoFilenameLabel')),
  });

  const handleEscPress = (event: any) => {
    if (event.keyCode === 27) {
      navigator('..');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscPress);
    return () => {
      document.removeEventListener('keydown', handleEscPress);
    };
  }, []);

  const onFormSubmit = async (values: IVideoUploadRequest) => {
    try {
      setIsLoading(true);

      var result = (
        await http_api.post<IVideoLookup>('/api/video/uploadVideo', values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data;

      store.dispatch({
        type: ProfileVideosReducerActionsType.APPEND_BEGIN_PROFILE_VIDEO,
        payload: result,
      });

      setIsLoading(false);
      navigator('..');

      handleSuccess(t('addVideoOverlay.videoUploadSuccess'));
    } catch (error: any) {
      handleError(error);
      setIsLoading(false);
    }
  };

  const onPreviewPhotoChangeHandler = (f: File) => {
    if (f != null) {
      onPreviewPhotoSaveHandler(f);
    }
  };

  const onPreviewPhotoSaveHandler = (file: File) => {
    values.previewPhoto = file;
  };

  const onVideoChangeHandler = (f: any) => {
    if (f != null) {
      onVideoSaveHandler(f.target.files[0]);
    }
  };

  const onVideoSaveHandler = (file: File) => {
    values.video = file;
  };

  const formik = useFormik({
    initialValues: request,
    validationSchema: requestSchema,
    onSubmit: onFormSubmit,
  });

  const { values, errors, touched, handleSubmit, handleChange } = formik;

  return (
    <>
      <div className="overflow-y-auto fixed left-0 top-0 z-9999 bg-opacity-50  bg-absoluteblack">
        <div ref={root} className="w-screen h-screen flex justify-center">
          <div className="absolute">
            <form
              className="md:mb-10 overflow-y-auto bg-secondary relative sm:top-0 md:top-10 lg:top-30 lg:left-10 p-6 rounded-md"
              onSubmit={handleSubmit}
            >
              <div className="header flex justify-between">
                <h1 className="text-white text-3xl">{values.name}</h1>
                <div className="flex items-center justify-center">
                  <div className="w-40 mr-6">
                    <PrimaryProcessingButton
                      text={t('addVideoOverlay.saveButton')}
                      isLoading={isLoading}
                      onClick={handleSubmit}
                      type="submit"
                    ></PrimaryProcessingButton>
                  </div>
                  <div className="">
                    <CancelButton
                      onClick={() => {
                        navigator('..');
                      }}
                    ></CancelButton>
                  </div>
                </div>
              </div>
              <hr className="mx-6 h-0.5 my-8 border-0 dark:bg-primary"></hr>
              <div className="mb-3">
                <h1 className="text-white text-3xl">
                  {t('addVideoOverlay.detailsHeading')}
                </h1>
              </div>
              <div className="content md:flex">
                <div className="details md:w-60 lg:w-125">
                  <div className="mb-6">
                    <FieldEditInput
                      propertyName="name"
                      value={values.name}
                      handleChange={handleChange}
                      error={errors.name ?? ''}
                      type="text"
                      labelText={t('addVideoOverlay.videoTitleLabel')}
                    ></FieldEditInput>
                  </div>
                  <div className="mb-6">
                    <FieldEditBigInput
                      propertyName="description"
                      value={values.description}
                      handleChange={handleChange}
                      error={errors.description ?? ''}
                      type="text"
                      labelText={t('addVideoOverlay.videoDescriptionLabel')}
                    ></FieldEditBigInput>
                  </div>
                  <div className="border-2 rounded-md border-gray p-2">
                    <div className="mb-3">
                      <CheckboxFour
                        description={t(
                          'addVideoOverlay.makeVideoPublicOrPrivateDescription',
                        )}
                        onChange={() => {}}
                        isChecked={true}
                        name={t('addVideoOverlay.saveOrPublishLabel')}
                        id={'publish'}
                      ></CheckboxFour>
                    </div>
                    <div className="ml-6">
                      <div className="mb-3">
                        <CheckboxFour
                          description={t(
                            'addVideoOverlay.everyoneCanWatchDescription',
                          )}
                          onChange={() => {
                            setSelected('Public');
                            values.accessModificator = 'Public';
                          }}
                          isChecked={selected === 'Public'}
                          name={t('addVideoOverlay.publicLabel')}
                          id={'public'}
                        ></CheckboxFour>
                      </div>
                      <div className="">
                        <CheckboxFour
                          description={t(
                            'addVideoOverlay.onlyYouCanWatchDescription',
                          )}
                          onChange={() => {
                            setSelected('Private');
                            values.accessModificator = 'Private';
                          }}
                          isChecked={selected === 'Private'}
                          name={t('addVideoOverlay.privateLabel')}
                          id={'private'}
                        ></CheckboxFour>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-6 w-75 overflow-x-hidden">
                  <div className="w-75 h-45 bg-gray video-preview">
                    <video controls className="w-75 h-45" src={video}></video>
                  </div>
                  <div className="bg-body p-3 mb-3">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        {t('addVideoOverlay.videoFilenameLabel')}
                      </label>
                      <input
                        onChange={(e: any) => {
                          const selectedFile: any = e?.target?.files[0];
                          const videoURL = URL.createObjectURL(selectedFile);
                          setVideo(videoURL);
                          onVideoChangeHandler(e);
                        }}
                        accept="video/mp4, video/avi, video/webm, video/ogg"
                        type="file"
                        className="file:hidden h-10 hover:cursor-pointer text-white font-medium text-lg"
                      />
                      {errors.video && (
                        <div className="mt-2 text-md dark:text-danger">
                          {errors.video}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-body">
                    <label className="mb-3 block text-black dark:text-white">
                      {t('addVideoOverlay.selectVideoPreviewLabel')}
                    </label>
                    <ModalCropper
                      onSave={onPreviewPhotoChangeHandler}
                      error={errors.previewPhoto ?? ''}
                      aspectRatio={16 / 9}
                    ></ModalCropper>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
