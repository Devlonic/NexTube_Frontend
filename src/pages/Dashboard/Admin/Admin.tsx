import UsersListContainer from '../../../components/Admin/AllUsers';
import AllReports from '../../../components/Admin/AllReports';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <>
      <h1 className="text-white text-3xl mb-2">Admin panel</h1>
      <table>
        <tbody>
          <tr>
            <td className="users">
              <div className="col-span-12 xl:col-span-8 ">
                <UsersListContainer />
              </div>
            </td>
            <td width={100}></td>
            <td className="reports">
              <div className="col-span-12 xl:col-span-20 right">
                <AllReports />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Admin;
