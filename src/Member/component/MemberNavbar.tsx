import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearAuth } from '../../store/authSlice';

const MemberNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const memberName = useAppSelector((state) => state.auth.name || 'Member');

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 font-medium transition duration-300
     ${isActive ? 'text-red-500' : 'text-gray-300 hover:text-white'}
     after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
     after:h-[2px] after:bg-red-500
     after:w-0 hover:after:w-full after:transition-all after:duration-300`;

  return (
    <nav className="bg-gray-900 w-full fixed top-0 left-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            <NavLink to="/member" onClick={() => setMenuOpen(false)} className="text-2xl font-extrabold text-red-500 cursor-pointer" style={{ textDecoration: 'none' }}>
              Blaze Gym
            </NavLink>
            <div className="hidden sm:flex space-x-4">
              <NavLink to="/member" end className={navLinkClasses}>Home</NavLink>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-center">
              <span className="text-gray-300 font-medium text-sm">Hi, {memberName}</span>
              <button
                onClick={handleLogout}
                className="text-sm mt-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-200"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="sm:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-gray-800 shadow-lg px-4 pb-4 pt-2 space-y-3 rounded-b-md">
          {[
            { to: '/member', label: 'Home' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block text-center px-4 py-2 rounded-md text-sm font-medium transition
                 ${isActive
                   ? 'bg-red-500 text-white'
                   : 'bg-gray-700 text-gray-200 hover:bg-red-600 hover:text-white'}`
              }
              end={item.to === '/member'}
            >
              {item.label}
            </NavLink>
          ))}

          <div className="border-t border-gray-700 pt-3 text-center">
            <p className="text-gray-300 text-sm">Hi, {memberName}</p>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="mt-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md w-full transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MemberNavbar;
