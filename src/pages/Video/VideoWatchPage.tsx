import { Outlet, useParams } from 'react-router-dom';
import http_api from '../../services/http_api';
import { useEffect, useState } from 'react';
import { IGetVideoResult, IVideoLookup } from './common/types';
import { WatchVideo } from '../../components/Videos/WatchVideo';
import classNames from 'classnames';
import { VideoRecommendationsContainer } from '../../components/Videos/VideoRecommendationsContainer';
import setTitle from '../../common/setTitle';

const VideoWatchPage = () => {
  const { videoId, playlistId } = useParams();

  useEffect(() => {
    const request = async () => {
      const result = await http_api.get<IGetVideoResult>(
        '/api/video/getVideo?VideoId=' + videoId,
      );
      setVideo(result.data.video);
    };
    request();
  }, [videoId]);

  const [video, setVideo] = useState<IVideoLookup>();

  useEffect(() => {
    setTitle(video?.name);
  }, [video]);

  return (
    <>
      <div className="flex">
        <div
          className={classNames('', {
            'w-full': playlistId === undefined,
            ' w-2/3': playlistId,
          })}
        >
          {video && <WatchVideo video={video} />}
        </div>
        <div className="w-1/3 mt-6 mr-6 ml-6">
          <div className="w-full">
            {playlistId && (
              <div className="mb-6">
                <Outlet></Outlet>
              </div>
            )}

            <VideoRecommendationsContainer></VideoRecommendationsContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoWatchPage;
