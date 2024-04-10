import { VideoItem } from './VideoItem';
import {
  IGetVideoListResult,
  IVideoLookup,
} from '../../pages/Video/common/types';
import { useEffect, useState } from 'react';
import http_api from '../../services/http_api';
import HandleOnVisible from '../HandleOnVisible';
import OperationLoader from '../../common/OperationLoader';
import AsyncLock from 'async-lock';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VideosListContainer = () => {
  const [canLoad, setCanLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<IVideoLookup[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);

  const [prevLoadedCount, setPrevLoadedCount] = useState<number>(12);

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
      // await sleep(5000);

      setVideos((prev_videos) => [...prev_videos, ...result.videos]);
      setPrevLoadedCount(result.videos.length);
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
      <ul className="w-full z-[9997] relative justify-items-center grid min-[700px]:grid-cols-2 min-[1300px]:grid-cols-3 min-[1650px]:grid-cols-4 min-[2150px]:grid-cols-5 min-[2550px]:grid-cols-6 min-[2950px]:grid-cols-7">
        {videos.map((video) => (
          <li key={video.id}>
            <VideoItem video={video}></VideoItem>
          </li>
        ))}
        {isInitLoading && (
          <div className="">
            <HandleOnVisible
              onVisible={() => {
                setPage((prevPages) => prevPages + 1);
              }}
            ></HandleOnVisible>
            {prevLoadedCount >= pageSize && (
              <div className="item mx-2 my-5">
                {/* thumbnail */}
                <div className="w-75 h-45 rounded-lg bg-secondary " />

                <div className="flex items-start mt-5">
                  <div className="w-12 h-12 mr-5">
                    {/* avatar */}
                    <div className="h-12 min-w-[3rem] min-h-[3rem] w-12 rounded-full bg-secondary" />
                  </div>
                  <div className="text">
                    {/* title */}
                    <div className="text-secondary bg-secondary text-lg h-7 w-36"></div>
                    <div className="mt-2">
                      {/* author name */}
                      <div className="text-secondary bg-secondary text-sm h-5 w-25"></div>
                      <div className="text-secondary  text-sm flex mt-2">
                        {/* views */}
                        <div className="mr-2 bg-secondary w-16  h-5"></div>
                        {/* date */}
                        <div className="bg-secondary w-24  h-5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {prevLoadedCount >= pageSize &&
          Array.from(Array(11).keys()).map(() => (
            <li key={Math.random()}>
              <VideoItem video={null}></VideoItem>
            </li>
          ))}
      </ul>

      <>{/* {isLoading && <OperationLoader></OperationLoader>} */}</>
    </>
  );
};
export { VideosListContainer };
