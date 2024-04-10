import { Link } from 'react-router-dom';
import {
  IGetVideoListHistoryResult,
  IVideoLookup,
} from '../../pages/Video/common/types';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import http_api from '../../services/http_api';
import OperationLoader from '../../common/OperationLoader';
import HandleOnVisible from '../HandleOnVisible';
import { t } from 'i18next';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const HistoryVideoItem = (props: { video: IVideoLookup }) => {
  return (
    <>
      <div className="item flex mx-11 my-5 text-gray">
        <Link to={'/video/watch/' + props.video.id}>
          <img
            className="w-75 h-45 rounded-md"
            src={`/api/photo/getPhotoUrl/${props.video.previewPhotoFile}/600`}
          />
        </Link>

        <div className="items-start ml-6">
          <div className="text">
            <Link to={'/video/watch/' + props.video.id}>
              <h3 className="text-white font-semibold text-lg">
                {props.video.name?.length! > 15
                  ? props.video.name?.slice(0, 15) + '...'
                  : props.video.name}
              </h3>
              <h4 className="text-gray mb-2 text-sm">
                <span className="mr-2">
                  {numeral(props.video.views).format('0a').toUpperCase()}{' '}
                  {t('videoItem.views')}
                </span>{' '}
                <span>{dayjs(props.video.dateCreated).fromNow()}</span>
              </h4>
            </Link>
          </div>
          <Link to={'/channel/' + props.video.creator?.userId}>
            <div className="flex">
              <div className="w-12 h-12 mr-5">
                <img
                  className="h-12 w-12 rounded-full"
                  src={`/api/photo/getPhotoUrl/${props.video.creator?.channelPhoto}/600`}
                  alt="User"
                />
              </div>
              <div className="flex items-center justify-center">
                <h4 className=" text-sm">
                  {props.video.creator?.firstName.length! > 15
                    ? props.video.creator?.firstName?.slice(0, 15) + '...'
                    : props.video.creator?.firstName}{' '}
                  {props.video.creator?.lastName.length! > 15
                    ? props.video.creator?.lastName?.slice(0, 15) + '...'
                    : props.video.creator?.lastName}
                </h4>
              </div>
            </div>
          </Link>
          <div className="">
            <h3>
              {props.video.description?.length! > 15
                ? props.video.description?.slice(0, 15) + '...'
                : props.video.description}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export const HistoryVideoContainer = () => {
  const [canLoad, setCanLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<IVideoLookup[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [needReload, setNeedReload] = useState<number>(1);

  useEffect(() => {
    const loadVideoAsync = async () => {
      if (page == 0 || !canLoad) {
        console.log('abort loading');
        return;
      }

      await sleep(200);

      setIsLoading(true);

      const result = (
        await http_api.get<IGetVideoListHistoryResult>(
          `/api/video/getVideoListHistory?Page=${page}&PageSize=${pageSize}`,
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

  return (
    <>
      <ul>
        {videos.map((video) => (
          <li>
            <HistoryVideoItem video={video}></HistoryVideoItem>
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
    </>
  );
};
