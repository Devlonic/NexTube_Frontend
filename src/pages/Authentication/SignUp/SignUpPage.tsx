import { useEffect } from 'react';
import setTitle from '../../../common/setTitle';
import SignUpWidget from '../../../components/Auth/SignUp';

const SignUpPage = () => {
  useEffect(() => {
    setTitle('Sign up');
  }, []);
  return (
    <>
      <SignUpWidget></SignUpWidget>
    </>
  );
};

export default SignUpPage;
