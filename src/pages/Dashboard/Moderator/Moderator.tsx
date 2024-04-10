import { Link } from 'react-router-dom';
import AllReports from '../../../components/Admin/AllReports';
const Moderator = () => {
  return (
    <>
      <Link
        className="text-white text-lg hover:text-primary"
        to={'videos-control-panel'}
      >
        Videos Control panel
      </Link>

      <h1 className="text-white text-3xl mb-2">Moderator 💪</h1>
      <div className="col-span-12 xl:col-span-20 right">
        <AllReports />
      </div>
    </>
  );
};

export default Moderator;
