import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import OperationLoader from '../../../common/OperationLoader';
import {
  IVideoLookup,
  IGetVideoListChannelResult,
} from '../../../pages/Video/common/types';
import http_api from '../../../services/http_api';
import { store } from '../../../store';
import { IAuthUser } from '../../../store/reducers/auth/types';
import CheckboxOne from '../../CheckboxOne';
import HandleOnVisible from '../../HandleOnVisible';
import { PrimaryButtonLink } from '../../common/links/PrimaryButtonLink';
import {
  IProfileVideoList,
  ProfileVideosReducerActionsType,
} from '../../../store/reducers/profileVideos/types';
import { handleSuccess, handleError } from '../../../common/handleError';
import { DialogConfirm } from '../../DialogConfirm';
import { SetVideoPlaylistShort } from '../../Playlists/SetVideoPlaylist';
import classNames from 'classnames';

const EditVideoItem = (props: { video: IVideoLookup }) => {
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);

  const onDelete = async (videoId: number | null) => {
    try {
      await http_api.delete(`/api/Admin/DeleteVideoAsModerator/${videoId}`);

      handleSuccess('Video successfully deleted');
    } catch (error) {
      handleError(error);
    }
  };

  const approveVideo = async (video: IVideoLookup) => {
    try {
      await http_api.post(`/api/Admin/ApproveVideo/${video.id}`);
      handleSuccess('Video approved');
      video.isApproved = true;
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <tr className="border-t-2 border-primary">
        <td className="pb-2 text-left">
          <div className="">
            <CheckboxOne text="" onChange={() => {}}></CheckboxOne>
          </div>
        </td>
        <td className="pb-2 text-left">
          <div className="item flex mt-3">
            <div className="video mr-3">
              <Link to={'/video/watch/' + props.video.id}>
                <img
                  className="w-40 h-25 bg-gray rounded-lg"
                  src={
                    '/api/photo/getPhotoUrl/' +
                    props.video.previewPhotoFile +
                    '/600'
                  }
                ></img>
              </Link>
            </div>

            <div className="text">
              <Link to={'/video/watch/' + props.video.id}>
                <h3 className="text-white text-lg">
                  {props.video.name?.length! > 15
                    ? props.video.name?.slice(0, 100) + '...'
                    : props.video.name}
                </h3>
              </Link>
              <p className="text-gray">
                {props.video.description?.slice(0, 20)}...
              </p>
              <p className="text-primary mt-2.5">
                {props.video.accessModificator ?? 'Private'}
              </p>
            </div>
          </div>
        </td>
        <td className="pb-2 text-left">
          <span>{props.video.views}</span>
        </td>
        <td className="pb-2 text-left">
          <span>{props.video.commentsCount}</span>
        </td>
        <td className="pb-2 text-right">
          <button
            className={classNames('uppercase font-semibold mr-4', {
              'text-success': props.video.isApproved,
              'text-white': !props.video.isApproved,
            })}
            onClick={() => approveVideo(props.video)}
          >
            {!props.video.isApproved && 'Approve'}
            {props.video.isApproved && 'Approved'}
          </button>
          <button
            className="text-warning uppercase font-semibold"
            onClick={() => setOpenDialogConfirm(true)}
          >
            Delete
          </button>
        </td>
      </tr>

      <>
        {openDialogConfirm && (
          <DialogConfirm
            handleAgreeClick={async () => onDelete(props.video.id)}
            handleDisagreeClick={async () => setOpenDialogConfirm(false)}
            actionText="Confirm Delete?"
          />
        )}
      </>
    </>
  );
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const VideosControlPanel = () => {
  const [pageSize] = useState<number>(5);
  const [canLoad, setCanLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [needLoad, setNeedLoad] = useState<number>(1);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);

  const { user } = useSelector((store: any) => store.auth as IAuthUser);

  const { videos, page } = useSelector(
    (store: any) => store.profileVideos as IProfileVideoList,
  );

  useEffect(() => {
    const loadVideoAsync = async () => {
      if (needLoad == 0 || !canLoad) {
        console.log('abort loading');
        return;
      }

      store.dispatch({
        type: ProfileVideosReducerActionsType.NEXT_PROFILE_VIDEO_LIST,
      });

      await sleep(200);

      setIsLoading(true);

      const result = (
        await http_api.get<IGetVideoListChannelResult>(
          `/api/Admin/GetAllVideos?Page=${page}&PageSize=${pageSize}`,
        )
      ).data;

      if (result.videos.length == 0) {
        setCanLoad(false);
      }

      store.dispatch({
        type: ProfileVideosReducerActionsType.APPEND_PROFILE_VIDEO_LIST,
        payload: result,
      });

      setIsInitLoading(true);
      setIsLoading(() => false);
    };

    loadVideoAsync();
    console.log(videos);
  }, [needLoad]);

  return (
    <>
      <Outlet></Outlet>

      <table className="text-gray w-full table-auto align-top">
        <tbody>
          {/* dont touch below */}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div className="relative">
                <div className="absolute right-0 bottom-2">
                  <div className="flex items-end w-full justify-end">
                    <div className="w-30">
                      <PrimaryButtonLink
                        urlTo="addVideo"
                        title={t('profileVideos.addButtonTitle')}
                      ></PrimaryButtonLink>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th className="pb-2 text-left">
              <CheckboxOne text="" onChange={() => {}}></CheckboxOne>
            </th>
            <th className="pb-2 text-left">{t('videos.videos')}</th>
            <th className="pb-2 text-left">{t('videos.views')}</th>
            <th className="pb-2 text-left">{t('videos.comments')}</th>
            <th className="pb-2 text-right">{t('videos.actions')}</th>
          </tr>
          {/* render videos here */}
          {videos?.length > 0 &&
            videos.map((v) => <EditVideoItem key={v.id} video={v} />)}
          {/* <tr>
            <td>
              {isLoading && <OperationLoader></OperationLoader>}

              {isInitLoading &&
                <HandleOnVisible
                  onVisible={() => {
                    setNeedLoad((prevPage) => prevPage + 1);
                  }}
                ></HandleOnVisible>}
            </td>
          </tr> */}
        </tbody>
      </table>

      {isLoading && <OperationLoader></OperationLoader>}

      {isInitLoading && (
        <HandleOnVisible
          onVisible={() => {
            setNeedLoad((prevPage) => prevPage + 1);
          }}
        ></HandleOnVisible>
      )}
    </>
  );
};
