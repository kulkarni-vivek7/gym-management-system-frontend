import { Routes, Route } from 'react-router-dom';
import AdminHomePage from '../Admin/pages/AdminHomePage';
import AdminNavbar from '../Admin/components/AdminNavbar';
import ViewAllActiveMemberships from '../Admin/pages/Membership/ViewAllActiveMemberships';
import ViewAllActiveTrainers from '../Admin/pages/Trainer/viewAllActiveTrainers';
import ViewAllActiveMembers from '../Admin/pages/Member/ViewAllActiveMembers';

const AdminRoutes = () => {
  return (
    <>
      <AdminNavbar />
      <Routes>
        <Route path="/" element={<AdminHomePage />} />
        <Route path='/memberships' element={<ViewAllActiveMemberships />} />
        <Route path='/trainers' element={<ViewAllActiveTrainers />} />
        <Route path='/members' element={<ViewAllActiveMembers />} />
          {/* Add more admin routes here in the future */}
      </Routes>
    </>
  );
};

export default AdminRoutes;
