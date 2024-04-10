import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';
import {
  IGetVideoListResult,
  IVideoLookup,
} from '../../pages/Video/common/types';
import { useEffect, useState } from 'react';
import http_api from '../../services/http_api';
import OperationLoader from '../../common/OperationLoader';
import HandleOnVisible from '../HandleOnVisible';
import numeral from 'numeral';
import { t } from 'i18next';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VideoItem = (props: { video: IVideoLookup }) => {
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
                {/* <ChannelPhoto photoFileId={props.video.creator?.channelPhoto} /> */}
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

export const SearchResults = () => {
  const [canLoad, setCanLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<IVideoLookup[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [needReload, setNeedReload] = useState<number>(1);

  const params = useParams();

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
          `/api/video/getVideoList?Name=${params.name}&Page=${page}&PageSize=${pageSize}`,
        )
      ).data;

      setVideos((prev_videos) => [...prev_videos, ...result.videos]);

      if (result.videos.length == 0) {
        setCanLoad(false);
      }

      setIsLoading(() => false);
      setIsInitLoading(true);
    };

    console.log(params.name);
    loadVideoAsync();
  }, [page, needReload]);

  useEffect(() => {
    setVideos([]);
    setCanLoad(true);
    setIsInitLoading(false);
    setPage(1);
    setNeedReload((prev) => prev + 1);
  }, [params.name]);

  return (
    <>
      <>
        {videos.length == 0 && (
          <h1 className="flex items-center justify-center text-gray text-lg">
            No result
          </h1>
        )}
      </>

      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <VideoItem video={video}></VideoItem>
          </li>
        ))}
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
