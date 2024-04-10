import {
  IGetVideoListResult,
  IVideoLookup,
} from '../../pages/Video/common/types';
import { useEffect, useState } from 'react';
import http_api from '../../services/http_api';
import HandleOnVisible from '../HandleOnVisible';
import OperationLoader from '../../common/OperationLoader';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import { Navbar } from '../common/navbars/Navbar';
import { profileRoutes, recommendationVideosRoutes } from '../../routes';
import { t } from 'i18next';
import { useSelector } from 'react-redux';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VideoItem = (props: { video: IVideoLookup }) => {
  const { scrollableBody } = useSelector((store: any) => store.scroll as any);

  return (
    <>
      <div className="item flex my-5 text-gray">
        <Link
          to={'/video/watch/' + props.video.id}
          onClick={() => {
            scrollableBody.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            className="w-40 h-24 rounded-md bg-gray"
            src={`/api/photo/getPhotoUrl/${props.video.previewPhotoFile}/600`}
          />
        </Link>

        <div className="items-start ml-6">
          <div className="text">
            <Link
              to={'/video/watch/' + props.video.id}
              onClick={() => {
                scrollableBody.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <h3 className="text-white font-semibold text-lg">
                {props.video.name?.length! > 15
                  ? props.video.name?.slice(0, 15) + '...'
                  : props.video.name}
              </h3>
            </Link>
            <Link to={'/channel/' + props.video.creator?.userId}>
              <div className="flex dark:hover:text-white duration-100 ease-in-out">
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
            <h4 className="text-gray mb-2 text-sm">
              <span className="mr-2">
                {numeral(props.video.views).format('0a').toUpperCase()}{' '}
                {t('videoItem.views')}
              </span>{' '}
              <span>{dayjs(props.video.dateCreated).fromNow()}</span>
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

const VideoRecommendationsContainer = () => {
  const [canLoad, setCanLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<IVideoLookup[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(6);

  useEffect(() => {
    const loadVideoAsync = async () => {
      if (page == 0 || !canLoad) {
        console.log('abort loading');
        return;
      }

      await sleep(200);

      setIsLoading(true);

      const result = (
        await http_api.get<IGetVideoListResult>(
          `/api/video/getVideoList?Page=${page}&PageSize=${pageSize}`,
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
  }, [page]);

  return (
    <>
      <div className="nav mb-6">
        <Navbar routeLength={1} refs={recommendationVideosRoutes}></Navbar>
      </div>
      <ul className="w-full">
        {videos.map((video) => (
          <li>
            <VideoItem video={video}></VideoItem>
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
export { VideoRecommendationsContainer };
