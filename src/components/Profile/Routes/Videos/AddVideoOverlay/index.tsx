import { useEffect, useRef, useState } from 'react';
import CheckboxFour from '../../../../CheckboxFour';
import { PrimaryProcessingButton } from '../../../../common/buttons/PrimaryProcessingButton';
import { FieldEditBigInput, FieldEditInput } from '../../../../common/inputs';
import { CancelButton } from '../../../../common/buttons/CancelButton';
import { useNavigate } from 'react-router-dom';
import { ModalCropper } from '../../../../ModalCropper';
import { IVideoUploadRequest } from '../../../../../pages/Video/common/types';
import http_api from '../../../../../services/http_api';
import { handleError } from '../../../../../common/handleError';
import { useFormik } from 'formik';

export const AddVideoOverlay = () => {
  const [selected, setSelected] = useState<string>('public');
  const navigator = useNavigate();
  const [video, setVideo] = useState<any>();
  const root = useRef(null);
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


    const request: IVideoUploadRequest = {
        name: '',
        description: '',
        previewPhoto: null,
        video: null,
        accessModificator: selected,
    }

    const onFormSubmit = async (values: IVideoUploadRequest) => {
        try {
            await http_api.post<IVideoUploadRequest>('/api/video/uploadVideo', values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigator('/');

        } catch (error: any) {
            handleError(error);
        }
    };

    const onPreviewPhotoChangeHandler = (f: File) => {
        console.log('image input handle change', f);
        if (f != null) {
            onPreviewPhotoSaveHandler(f);
        }
    };

    const onPreviewPhotoSaveHandler = (file: File) => {
        console.log('image save handle', file);
        values.previewPhoto = file;
        console.log(values);
    };

    const onVideoChangeHandler = (f: any) => {
        console.log('video input handle change', f);
        if (f != null) {
            onVideoSaveHandler(f.target.files[0]);
        }
    }

    const onVideoSaveHandler = (file: File) => {
        console.log('image save handle', file);
        values.video = file;
        console.log(values);
    };

    const formik = useFormik({
        initialValues: request,
        onSubmit: onFormSubmit,
    });

    const { values, errors, touched, handleSubmit, handleChange } = formik;

  return (
    <>
      <div
        onClick={(event) => {
          if (event.target === root.current) {
            navigator('..');
          }
        }}
        className="overflow-y-auto fixed left-0 top-0 z-9999 bg-opacity-50  bg-absoluteblack"
      >
        <div ref={root} className="w-screen h-screen flex justify-center">
          <div className="absolute">
            <form className="md:mb-10 overflow-y-auto bg-secondary relative sm:top-0 md:top-10 lg:top-30 lg:left-10 p-6 rounded-md" onSubmit={handleSubmit}>
              <div className="header flex justify-between">
                <h1 className="text-white text-3xl">Grave book // |</h1>
                <div className="flex items-center justify-center">
                  <div className="w-40 mr-6">
                    <PrimaryProcessingButton
                      text="Save"
                      isLoading={false}
                      onClick={() => {}}
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
                <h1 className="text-white text-3xl">Details</h1>
              </div>
              <div className="content md:flex">
                <div className="details md:w-60 lg:w-125">
                  <div className="mb-6">
                    <FieldEditInput
                      propertyName="title"
                      value=""
                      handleChange={() => {}}
                      error=""
                      type="text"
                      labelText="Enter video title"
                    ></FieldEditInput>
                  </div>
                  <div className="mb-6">
                    <FieldEditBigInput
                      propertyName="description"
                      value=""
                      handleChange={() => {}}
                      error=""
                      type="text"
                      labelText="Tell viewers about your video"
                    ></FieldEditBigInput>
                  </div>
                  <div className="border-2 rounded-md border-gray p-2">
                    <div className="mb-3">
                      <CheckboxFour
                        description="Make your video public or private"
                        onChange={() => {}}
                        isChecked={true}
                        name={'Save or publish'}
                        id={'publish'}
                      ></CheckboxFour>
                    </div>
                    <div className="ml-6">
                      <div className="mb-3">
                        <CheckboxFour
                          description="Everyone can watch your video"
                          onChange={() => {
                            setSelected('public');
                            values.accessModificator = selected;
                          }}
                          isChecked={selected === 'public'}
                          name={'Public'}
                          id={'public'}
                        ></CheckboxFour>
                      </div>
                      <div className="">
                        <CheckboxFour
                          description="Only you can watch the video"
                          onChange={() => {
                            setSelected('private');
                            values.accessModificator = selected;
                          }}
                          isChecked={selected === 'private'}
                          name={'Private'}
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
                        filename
                      </label>
                      <input
                        onChange={(e: any) => {
                          const selectedFile: any = e?.target?.files[0];
                          const videoURL = URL.createObjectURL(selectedFile);
                          setVideo(videoURL);
                        }}
                        accept="video/mp4, video/avi, video/webm, video/ogg"
                        type="file"
                        className="file:hidden h-10 hover:cursor-pointer text-white font-medium text-lg"
                      />
                    </div>

                    <h2 className="">Grave book</h2>
                  </div>
                  <div className="bg-body">
                    <label className="mb-3 block text-black dark:text-white">
                      Select video preview
                    </label>
                    <ModalCropper error=""></ModalCropper>
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
