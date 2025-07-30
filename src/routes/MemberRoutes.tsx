import { Route, Routes } from 'react-router-dom'
import MemberNavbar from '../Member/component/MemberNavbar'
import MemberHomePage from '../Member/pages/MemberHomePage'

const MemberRoutes = () => {
  return (
    <>
      <MemberNavbar />
      <Routes>
        <Route path="/" element={<MemberHomePage />} />
      </Routes>
    </>
  )
}

export default MemberRoutes