// src/components/Auth/SignUp/index.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import http_api from '../../../services/http_api';
import { storeToken } from '../../../services/tokenService';
import { handleError, handleSuccess } from '../../../common/handleError';
import { ModalCropper } from '../../../components/ModalCropper';
import { PrimaryProcessingButton } from '../../../components/common/buttons/PrimaryProcessingButton';
import GoogleAuthWrapper from '../../../components/Auth/Google/GoogleAuthWrapper';
import { IRegistrationRequest, IRegistrationResult } from './types';
import { SignUpTitle, SubTitle } from './SignUpTitle';
import { RegistrationInput } from '../../common/inputs';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';

const SignUpWidget = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigator = useNavigate();

  const request: IRegistrationRequest = {
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    channelPhoto: null,
    captchaToken: '',
  };

  const requestSchema = yup.object({
    email: yup
      .string()
      .required(t('auth.signUp.yourEmail'))
      .email(t('auth.signUp.emailValidation')),
    password: yup
      .string()
      .required(t('auth.signUp.yourPassword'))
      .min(8, t('auth.signUp.passwordMinLength')),
    passwordConfirm: yup
      .string()
      .required(t('auth.signUp.repeatPassword'))
      .test('equal', t('auth.signUp.passwordMismatch'), (v) => {
        return v === values.password;
      }),
    firstName: yup.string().required(t('auth.signUp.yourFirstName')).min(2),
    lastName: yup.string().required(t('auth.signUp.yourLastName')).min(2),
    channelPhoto: yup.mixed().required(t('auth.signUp.imageError')),
    captchaToken: yup.mixed().required('Submit captcha'),
  });

  const onFormSubmit = async (values: IRegistrationRequest) => {
    try {
      setIsLoading(() => true);
      const result = await http_api.post<IRegistrationResult>(
        '/api/auth/signup',
        values,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const { token, verificationToken } = result.data;
      storeToken(token);

      localStorage.setItem('verificationToken', verificationToken);

      handleSuccess(t('auth.signUp.successMessage'));
      navigator('/auth/verifymail');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(() => false);
    }
  };

  const onImageChangeHandler = (f: File) => {
    if (f != null) {
      onImageSaveHandler(f);
    }
  };

  const onImageSaveHandler = (file: File) => {
    values.channelPhoto = file;
  };

  const formik = useFormik({
    initialValues: request,
    validationSchema: requestSchema,
    onSubmit: onFormSubmit,
  });

  const { values, errors, handleSubmit, handleChange } = formik;

  return (
    <>
      <div className="bg-white shadow-default dark:bg-body">
        <div className="flex flex-wrap items-start justify-around">
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
            <div className="w-full pb-7">
              <div>
                <SignUpTitle text={t('auth.signUp.title')}></SignUpTitle>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex w-full mb-7 mt-7">
                  <div className="relative">
                    <ModalCropper
                      onSave={onImageChangeHandler}
                      error={errors.channelPhoto}
                    ></ModalCropper>
                  </div>
                </div>

                <div className="flex w-full mb-7">
                  <div className="mr-7 w-full">
                    <RegistrationInput
                      propertyName="firstName"
                      value={values.firstName}
                      handleChange={handleChange}
                      error={errors.firstName ?? ''}
                      type="text"
                      labelText={t('auth.signUp.yourFirstName')}
                    ></RegistrationInput>
                  </div>
                  <div className="w-full">
                    <RegistrationInput
                      propertyName="lastName"
                      value={values.lastName}
                      handleChange={handleChange}
                      error={errors.lastName ?? ''}
                      type="text"
                      labelText={t('auth.signUp.yourLastName')}
                    ></RegistrationInput>
                  </div>
                </div>

                <div className="flex w-full mb-7">
                  <div className="w-full">
                    <RegistrationInput
                      propertyName="email"
                      value={values.email}
                      handleChange={handleChange}
                      error={errors.email ?? ''}
                      type="text"
                      labelText={t('auth.signUp.yourEmail')}
                    ></RegistrationInput>
                  </div>
                </div>

                <div className="flex w-full mb-7">
                  <div className="mr-7 w-full">
                    <RegistrationInput
                      propertyName="password"
                      value={values.password}
                      handleChange={handleChange}
                      error={errors.password ?? ''}
                      type="password"
                      labelText={t('auth.signUp.yourPassword')}
                    ></RegistrationInput>
                  </div>
                  <div className="w-full">
                    <RegistrationInput
                      propertyName="passwordConfirm"
                      value={values.passwordConfirm}
                      handleChange={handleChange}
                      error={errors.passwordConfirm ?? ''}
                      type="password"
                      labelText={t('auth.signUp.repeatPassword')}
                    ></RegistrationInput>
                  </div>
                </div>

                <div className="flex w-full mb-7">
                  <div className="w-full">
                    <input
                      type="hidden"
                      name="captchaToken"
                      id="captchaToken"
                      value={values.captchaToken}
                      onChange={handleChange}
                    />

                    <ReCAPTCHA
                      theme="dark"
                      sitekey="6LfP4rgpAAAAANKfI6yyf7GIyIGjTBOHQBzlIE-P"
                      onChange={(value) => {
                        values.captchaToken = value;
                        console.log('captcha submit', value);
                      }}
                    ></ReCAPTCHA>
                    {errors.captchaToken && (
                      <div className="mt-2 text-md dark:text-danger">
                        {errors.captchaToken}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-5 flex">
                  <div className="w-auto">
                    <PrimaryProcessingButton
                      onClick={() => {}}
                      text={t('auth.signUp.signUpButton')}
                      type="submit"
                      isLoading={isLoading}
                    ></PrimaryProcessingButton>
                  </div>

                  <div className="flex items-center ml-7">
                    <GoogleAuthWrapper
                      onLoading={() => {
                        setIsLoading(() => true);
                      }}
                    ></GoogleAuthWrapper>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="pt-16">
            <AlreadyHaveAccountWidget></AlreadyHaveAccountWidget>
          </div>
        </div>
      </div>
    </>
  );
};

const AlreadyHaveAccountWidget = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="dark:bg-boxdark w-100">
        <div className="p-7 pb-52">
          <SignUpTitle text={t('auth.signUp.alreadyHaveAccount')}></SignUpTitle>
          <div className="mt-7">
            <SubTitle text={t('auth.signUp.loginEasily')}></SubTitle>
          </div>
          <div className="mt-7">
            <Link
              to={'/auth/signin'}
              className={`w-full flex items-center justify-center font-bold text-2xl py-5 cursor-pointer rounded-md border border-primary bg-primary text-white transition hover:bg-opacity-90`}
            >
              {t('auth.signUp.signInButton')}
            </Link>
          </div>
          <div className="mt-7">
            <Link
              to={'/auth/recover'}
              className={`w-full flex items-center justify-center font-bold text-2xl py-5 cursor-pointer rounded-md border border-secondary bg-secondary text-gray transition hover:bg-opacity-90`}
            >
              {t('auth.signUp.forgotPasswordButton')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpWidget;
