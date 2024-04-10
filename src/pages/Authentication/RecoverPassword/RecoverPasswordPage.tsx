import { useEffect } from 'react';
import setTitle from '../../../common/setTitle';
import RecoverPassword from '../../../components/Auth/RecoverPassword/RecoverPassword';

const SignInPage = () => {
  useEffect(() => {
    setTitle('Recover password');
  }, []);
  return (
    <>
      <RecoverPassword></RecoverPassword>
    </>
  );
};

export default SignInPage;
