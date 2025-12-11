import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = user?.first_name || 'User';
  const roleLabel = user?.role === 'admin' ? 'Pemilik' : (user?.role || 'Pengguna');
  const [activeTab, setActiveTab] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/penyewa') {
      setActiveTab('home');
    } else if (location.pathname === '/admin/fitur' || location.pathname === '/penyewa/fitur') {
      setActiveTab('fitur');
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileButton = document.getElementById('dashboard-profile-button');
      const dropdown = document.getElementById('dashboard-profile-dropdown');
      
      if (profileButton && dropdown && !profileButton.contains(event.target) && !dropdown.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigate(user?.role === 'admin' ? '/admin' : '/penyewa');
    } else if (tab === 'fitur') {
      navigate(user?.role === 'admin' ? '/admin/fitur' : '/penyewa/fitur');
    }
  };

  const NavButton = ({ tab, label }) => (
    <button
      onClick={() => handleNavigation(tab)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        activeTab === tab
          ? 'bg-white text-gray-900 shadow-md'
          : 'text-white hover:text-white/80'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="w-full" style={{ backgroundColor: '#00A5E8' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo Only */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center font-bold text-white">C</div>
          <span className="font-semibold tracking-wide text-white">Chipkost</span>
        </div>
        
        {/* Center: Navigation Tabs */}
        <div className="flex items-center gap-2">
          <NavButton tab="home" label="Home" />
          <NavButton tab="fitur" label="Fitur" />
          <NavButton tab="service" label="Customer Service" />
        </div>

        {/* Right: User Info with Dropdown */}
        <div className="relative">
          <button
            id="dashboard-profile-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="text-right leading-tight">
              <div className="text-sm text-white">{displayName}</div>
              <div className="text-xs text-white/80">{roleLabel}</div>
            </div>
            <img
              src={`https://i.pravatar.cc/40?u=${encodeURIComponent(displayName)}`}
              alt="avatar"
              className="h-9 w-9 rounded-full ring-2 ring-white/50"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div id="dashboard-profile-dropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl z-[9999] overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  navigate(user?.role === 'admin' ? '/admin' : '/penyewa');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={async () => {
                  await logout();
                  setDropdownOpen(false);
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
