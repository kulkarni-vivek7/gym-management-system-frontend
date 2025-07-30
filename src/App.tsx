import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import Login from './loginAndRegister/Login';
import Register from './loginAndRegister/Register';
import TrainerRoutes from './routes/TrainerRoutes';
import MemberRoutes from './routes/MemberRoutes';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/trainer/*" element={<TrainerRoutes />} />
          <Route path="/member/*" element={<MemberRoutes />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
