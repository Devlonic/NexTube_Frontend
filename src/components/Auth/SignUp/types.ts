import { ICommonResult } from '../../../common/common_responces';

export interface IRegistrationRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  channelPhoto: File | null;
  captchaToken: string;
}

export interface IRegistrationResult {
  result: ICommonResult;
  token: string;
  userId: number;
  verificationToken: string;
}
