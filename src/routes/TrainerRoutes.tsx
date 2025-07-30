
import TrainerNavbar from '../Trainer/components/TrainerNavbar'
import { Route, Routes } from 'react-router-dom'
import TrainerHomePage from '../Trainer/pages/TrainerHomePage'
import ViewAllActiveRegisteredMembers from '../Trainer/pages/ViewAllActiveRegisteredMembers'

const TrainerRoutes = () => {
    return (
        <>
            <TrainerNavbar />
            <Routes>
                <Route path='/' element={<TrainerHomePage />} />
                <Route path='/registeredMembers' element={<ViewAllActiveRegisteredMembers />} />
            </Routes>
        </>
    )
}

export default TrainerRoutes