import { useEffect, useRef, useState } from 'react';
import { IconedProcessingButton } from '../common/buttons/IconedButton';
import { Link } from 'react-router-dom';
import { CollapseText } from '../common/CollapseText';
import SubscribeButton from '../../pages/Subscription/UpdateUser/Subscription';
import { AddVideoReaction } from '../Reactions/AddVideoReaction';
import VideoCommentsLoader from '../Comments/CommentsContainer/VideoCommentsLoader';
import { IVideoLookup } from '../../pages/Video/common/types';
import { BigPlayButton, LoadingSpinner, Player } from 'video-react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import './../../styles/custom-video-react.css';
import ReportForm from '../ReportForm';
import { handleSuccess } from '../../common/handleError';
import http_api from '../../services/http_api';
import {
  IUsersubscription,
  SubscriptionReducerActionsType,
} from '../../store/reducers/subscription/types';
import { useSelector } from 'react-redux';
import { IAuthUser } from '../../store/reducers/auth/types';
import MoreVideoActions from './MoreVideoActions';
import { ShareIcon } from '@heroicons/react/24/outline';

import { useTranslation } from 'react-i18next'; // Import the hook

dayjs.extend(relativeTime);

const WatchVideo = (props: { video: IVideoLookup | undefined }) => {
  const [showReportForm, setShowReportForm] = useState(false);

  const [isAuthUserVideoOwner, setIsAuthUserVideoOwner] = useState(false);

  const { user } = useSelector((state: any) => state.auth as IAuthUser);

  const player = useRef<any>(null);

  useEffect(() => {
    // determine that current signed in user is owner of current video
    setIsAuthUserVideoOwner(user?.userId == props.video?.creator?.userId);
  }, [user?.userId, props.video]);

  const handleReportClick = () => {
    setShowReportForm((prevShowReportForm) => !prevShowReportForm);
  };

  const handleReportFormClose = () => {
    setShowReportForm(false);
  };

  const [userData, setUserData] = useState<IUserInfo>();

  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const userSubscriptions = useSelector(
    (store: any) => store.subscription as IUsersubscription,
  );

  useEffect(() => {
    if (isAuth) {
      const fetchData = async () => {
        const response = await http_api.get(
          `/api/User/GetUser?ChannelId=${props.video?.creator?.userId}`,
        );
        setUserData(response.data);
      };
      fetchData();
    }
  }, [userSubscriptions]);

  useEffect(() => {
    player.current.load();
  }, [props.video]);
  const { t } = useTranslation(); // Initialize the hook
  return (
    <>
      <div className="warp my-6">
        {/* video player */}
        <div className="video w-full pl-6 ">
          <div className="flex rounded-xl">
            {props.video && (
              <Player
                ref={player}
                fluid={false}
                aspectRatio="16:9"
                height={600}
                poster={`/api/photo/getPhotoUrl/${props.video.previewPhotoFile}/1024`}
                autoPlay={false} // change by desire
              >
                <source
                  src={
                    '/api/video/getVideoUrl?VideoFileId=' +
                    props.video?.videoFile
                  }
                />
                <BigPlayButton className="" position="center"></BigPlayButton>
                <LoadingSpinner></LoadingSpinner>
              </Player>
            )}
          </div>
        </div>

        <div className="ml-6">
          {/* video title */}
          <div className="mt-5 ml-5">
            <h3 className="text-white text-3xl">{props.video?.name}</h3>
          </div>

          {/* actions section */}
          <div className="ml-5 mt-2.5 flex justify-between items-center">
            <div className="flex items-center">
              <Link to={`/channel/${props.video?.creator?.userId}`}>
                <div className="flex items-center">
                  <img
                    className="rounded-full h-16 w-16"
                    src={
                      '/api/photo/getPhotoUrl/' +
                      props.video?.creator?.channelPhoto +
                      '/600'
                    }
                  ></img>
                  <div className="ml-5 min-w-50">
                    <h3 className="text-white text-xl">
                      {props.video!.creator?.firstName.length! > 15
                        ? props.video!.creator?.firstName?.slice(0, 15) + '...'
                        : props.video!.creator?.firstName}{' '}
                      {props.video!.creator?.lastName.length! > 15
                        ? props.video!.creator?.lastName?.slice(0, 15) + '...'
                        : props.video!.creator?.lastName}
                    </h3>
                    <h3 className="text-gray text-md">
                      {' '}
                      {userData?.subsciptions} {t('watchVideo.subscribers')}
                    </h3>
                  </div>
                </div>
              </Link>
              {!isAuthUserVideoOwner && (
                <div className="w-30 ml-5">
                  <SubscribeButton
                    isLoading={false}
                    onClick={() => {}}
                    text={t('watchVideo.subscribe')}
                    type="button"
                    backgroundClassname="primary"
                    subscribeId={props.video?.creator?.userId.toString()}
                  ></SubscribeButton>
                </div>
              )}
            </div>

            <div className="likes flex">
              <AddVideoReaction
                videoId={props.video?.id ?? -1}
              ></AddVideoReaction>
              <div className="mr-5">
                <IconedProcessingButton
                  collapseTextOn="lg"
                  isLoading={false}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    handleSuccess('Copied link to clipboard');
                  }}
                  text={t('watchVideo.share')}
                  type="button"
                  icon={<ShareIcon></ShareIcon>}
                  backgroundClassname="secondary"
                ></IconedProcessingButton>
              </div>
              <div className="">
                <MoreVideoActions
                  handleReportClick={handleReportClick}
                  video={props.video}
                ></MoreVideoActions>
              </div>
            </div>
          </div>
          {/* video info */}
          {showReportForm && (
            <div className="report-form-overlay">
              <ReportForm
                abuser={props.video?.creator?.userId}
                videoId={props.video?.id}
                onSubmitSuccess={handleReportFormClose}
              />
              <button onClick={handleReportFormClose}>
                {t('watchVideo.closeReportForm')}
              </button>
            </div>
          )}

          <div className="description bg-secondary p-5 mt-5 rounded-lg">
            <h3 className="text-white text-2xl">
              <span className="mr-3">
                {props.video?.views} {t('watchVideo.views')}
              </span>
              <span>{dayjs(props.video?.dateCreated).fromNow()}</span>
            </h3>
            <CollapseText text={props.video?.description}></CollapseText>
          </div>
        </div>

        <VideoCommentsLoader
          videoId={props.video?.id ?? -1}
        ></VideoCommentsLoader>
      </div>
    </>
  );
};

export { WatchVideo };
