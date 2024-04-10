import { useEffect } from 'react';
import setTitle from '../../../common/setTitle';
import SignInWidget from '../../../components/Auth/SignIn/SignInWidget';

const SignInPage = () => {
  useEffect(() => {
    setTitle('Sign in');
  }, []);
  return (
    <>
      <SignInWidget></SignInWidget>
    </>
  );
};

export default SignInPage;
