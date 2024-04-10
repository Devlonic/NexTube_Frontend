import { useEffect } from 'react';
import setTitle from '../../../common/setTitle';
import VerifyMailWidget from '../../../components/Auth/VerifyMail';

const VerifyMailPage = () => {
  useEffect(() => {
    setTitle('Verify email');
  }, []);
  return (
    <>
      <VerifyMailWidget></VerifyMailWidget>
    </>
  );
};

export default VerifyMailPage;
