// src/components/Home/MainPoster.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';
import { IGetVideoResult, IVideoLookup } from '../../pages/Video/common/types';
import http_api from '../../services/http_api';

export const MainPoster = () => {
  const { t } = useTranslation();
  const [randomVideo, setVideo] = useState<IVideoLookup>();

  useEffect(() => {
    const loadRandomVideoAsync = async () => {
      const result = (
        await http_api.get<IGetVideoResult>(`/api/video/getRandomVideo`)
      ).data;
      setVideo(result.video);
    };
    loadRandomVideoAsync();
  }, []);

  return (
    <>
      {randomVideo && (
        <div className="h-[50vh]">
          <div className="h-full flex items-center justify-between">
            <div className="flex z-[9997] flex-col min-[1000px]:w-[32em] min-[1364px]:w-[64em]">
              <div className="mb-2">
                <h1 className="text-white text-6xl font-semibold">
                  {t('mainPoster.watchNow')}
                </h1>
              </div>
              <div className="mb-2">
                <a href={'/video/watch/' + randomVideo?.id}>
                  <h2 className=" font-semibold text-primary  text-5xl">
                    {randomVideo?.name}
                  </h2>{' '}
                </a>
              </div>
              <div className="mb-2">
                <a href={'/channel/' + randomVideo?.creator?.userId}>
                  {' '}
                  <p className="font-semibold text-white text-3xl">
                    {t('mainPoster.from') +
                      '  ' +
                      randomVideo?.creator?.firstName +
                      ' ' +
                      randomVideo?.creator?.lastName}
                  </p>
                </a>
              </div>
            </div>

            <a
              className="relative h-full w-full "
              href={'/video/watch/' + randomVideo?.id}
            >
              <div className="absolute z-[99] -top-[4em] -left-[20em] h-full w-[64em]">
                <div className="h-full w-full flex justify-end">
                  <div
                    className={`banner h-[130%] w-full bg-cover bg-gray`}
                    style={{
                      backgroundImage: `url(${
                        '/api/photo/getPhotoUrl/' +
                        randomVideo?.previewPhotoFile +
                        '/1920'
                      })`,
                    }}
                  ></div>

                  <div className="fade-gradient w-full h-[130%] absolute"></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      )}

      {!randomVideo && (
        <div className="h-[50vh]">
          <div className="h-full flex items-center justify-between">
            <div className="flex z-[9997] flex-col min-[1000px]:w-[32em] min-[1364px]:w-[64em]">
              <div className="mb-2">
                <div className="bg-gray inline-block rounded-md opacity-30">
                  <h1 className="text-transparent text-6xl font-semibold">
                    {t('mainPoster.watchNow')}
                  </h1>
                </div>
              </div>
              <div className="mb-2">
                <div className="bg-gray inline-block  rounded-md opacity-30">
                  <h2 className="text-transparent font-semibold text-5xl">
                    Lorem ipsum dolor
                  </h2>
                </div>
              </div>
              <div className="mb-2">
                <div className="bg-gray inline-block rounded-md opacity-30">
                  <p className="font-semibold text-transparent text-3xl">
                    {t('mainPoster.from') + ' ' + 'Lorem ipsum dolor'}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-full w-full ">
              <div className="absolute z-[99] -top-[4em] -left-[20em] h-full w-[64em]">
                <div className="h-full w-full flex justify-end">
                  <div
                    className={`banner h-[130%] w-full bg-cover bg-gray`}
                  ></div>

                  <div className="fade-gradient w-full h-[130%] absolute"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
