import { IUser } from '../../../store/reducers/auth/types';

export interface IVideoLookup {
  id: number | null;
  name: string | null;
  description: string | null;
  videoFile: string | null;
  previewPhotoFile: string | null;
  creator: IUser | null;
  dateCreated: string | null;
  views: number | null;
  accessModificator: string | null;
  playlistId: number | null | undefined;
  commentsCount: number | null;
  isApproved: boolean | null | undefined;
}

export interface IGetVideoResult {
  video: IVideoLookup;
}

export interface IGetVideoListResult {
  videos: IVideoLookup[];
}

export interface IGetVideoListChannelResult {
  videos: IVideoLookup[];
}

export interface IGetVideoListHistoryResult {
  videos: IVideoLookup[];
}

export interface IVideoUploadRequest {
  name: string;
  description: string;
  previewPhoto: File | null;
  video: File | null;
  accessModificator: string | null;
}

export interface IVideoUpdateRequest {
  videoId: number;
  name: string;
  description: string;
  accessModificator: string;
}
