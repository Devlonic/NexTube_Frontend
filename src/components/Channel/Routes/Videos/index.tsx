import { Link, useParams } from 'react-router-dom';
import {
  IGetVideoListChannelResult,
  IVideoLookup,
} from '../../../../pages/Video/common/types';
import numeral from 'numeral';
import dayjs from 'dayjs';
import OperationLoader from '../../../../common/OperationLoader';
import HandleOnVisible from '../../../HandleOnVisible';
import { useEffect, useState } from 'react';
import http_api from '../../../../services/http_api';
import { t } from 'i18next';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ChannelVideoItem = (props: { video: IVideoLookup }) => {
  return (
    <>
      <div className="item mx-2 my-5">
        <Link to={'/video/watch/' + props.video.id}>
          <img
            className="w-75 h-45 rounded-lg bg-gray"
            src={
              '/api/photo/getPhotoUrl/' + props.video.previewPhotoFile + '/600'
            }
          />
        </Link>

        <div className="flex items-start mt-5">
          <div className="text">
            <Link
              to={'/video/watch/' + props.video.id}
              title={props.video.name ?? ''}
            >
              <h3 className="text-white text-lg">
                {props.video.name?.length! > 15
                  ? props.video.name?.slice(0, 15) + '...'
                  : props.video.name}
              </h3>
            </Link>

            <div className="mt-2">
              <h4 className="text-white text-sm">
                <span className="mr-2">
                  {numeral(props.video.views).format('0a').toUpperCase()}{' '}
                  {t('videoItem.views')}
                </span>{' '}
                <span>{dayjs(props.video.dateCreated).fromNow()}</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ChannelVideos = () => {
  const [canLoad, setCanLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<IVideoLookup[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(6);
  const [needReload, setNeedReload] = useState<number>(1);
  const params = useParams();

  useEffect(() => {
    const loadVideoAsync = async () => {
      console.log(params);

      if (page == 0 || !canLoad) {
        console.log('abort loading');
        return;
      }

      await sleep(200);

      setIsLoading(true);

      const result = (
        await http_api.get<IGetVideoListChannelResult>(
          `/api/video/getVideoListChannel?ChannelId=${params.id}&Page=${page}&PageSize=${pageSize}`,
        )
      ).data;

      setVideos((prev_videos) => [...prev_videos, ...result.videos]);

      if (result.videos.length == 0) {
        setCanLoad(false);
      }

      setIsLoading(() => false);
      setIsInitLoading(true);
    };

    loadVideoAsync();
  }, [page, needReload]);

  useEffect(() => {
    setVideos([]);
    setCanLoad(true);
    setIsInitLoading(false);
    setPage(1);
    setNeedReload((prev) => prev + 1);
  }, [params.id]);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="">
          <ul className="w-full justify-items-center grid min-[700px]:grid-cols-2 min-[1300px]:grid-cols-3 min-[1650px]:grid-cols-4 mt-8.5">
            {videos.map((video) => (
              <li>
                <ChannelVideoItem video={video}></ChannelVideoItem>
              </li>
            ))}
            ;
          </ul>
          <>
            {isLoading && <OperationLoader></OperationLoader>}

            {isInitLoading && (
              <HandleOnVisible
                onVisible={() => {
                  setPage((prevPages) => prevPages + 1);
                }}
              ></HandleOnVisible>
            )}
          </>
        </div>
      </div>
    </>
  );
};
