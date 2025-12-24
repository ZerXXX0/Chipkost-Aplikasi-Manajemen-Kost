import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SubHeader = ({ title, showBackButton = true, backPath, action }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileButton = document.getElementById('subheader-profile-button');
      const dropdown = document.getElementById('subheader-profile-dropdown');
      
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

  const handleBackClick = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const displayName = user?.first_name || 'User';
  
  // Get profile picture URL with fallback
  const getProfilePictureUrl = () => {
    if (user?.profile_picture) {
      // If it's already a full URL, use it
      if (user.profile_picture.startsWith('http')) {
        return user.profile_picture;
      }
      // Otherwise, prepend backend URL
      return `http://localhost:8000${user.profile_picture}`;
    }
    // Fallback to placeholder
    return `https://i.pravatar.cc/40?u=${encodeURIComponent(displayName)}`;
  };

  return (
    <header className="w-full" style={{ backgroundColor: '#00A5E8' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Back Button + Logo + Title */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="text-white hover:text-white/80 text-2xl transition-opacity"
              title="Kembali"
            >
              ←
            </button>
          )}
          <img src="/logo1f.png" alt="Chipkost Logo" className="h-8 w-8 rounded" />
          <span className="font-semibold tracking-wide text-white text-lg">{title}</span>
        </div>

        {/* Center: Action Button (Optional) */}
        {action && (
          <div className="flex-1 flex justify-center">
            {action}
          </div>
        )}

        {/* Right: User Profile with Dropdown */}
        <div className="relative">
          <button
            id="subheader-profile-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-sm text-white">{displayName}</div>
              <div className="text-xs text-white/80">{user?.role === 'admin' ? 'Pemilik' : 'Penyewa'}</div>
            </div>
            <img
              src={getProfilePictureUrl()}
              alt="avatar"
              className="h-9 w-9 rounded-full ring-2 ring-white/50 object-cover"
              onError={(e) => {
                // Fallback jika gambar gagal dimuat
                e.target.src = `https://i.pravatar.cc/40?u=${encodeURIComponent(displayName)}`;
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div id="subheader-profile-dropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl z-[9999] overflow-hidden">
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

export default SubHeader;
