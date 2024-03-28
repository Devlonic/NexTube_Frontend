import { IVideoLookup } from '../../../../../pages/Video/common/types';

export interface VideoUploadProgress {
  percentage: number;
  totalBytesTransferred: number;
  video: IVideoLookup;
}
