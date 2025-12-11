import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Carousel } from '../components/Carousel';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';

export default function Fitur() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('fitur');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    totalFinancialReports: 0,
    totalPayments: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/fitur') {
      setActiveTab('home');
    } else {
      setActiveTab('fitur');
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileButton = document.getElementById('profile-button');
      const dropdown = document.getElementById('profile-dropdown');
      
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

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        if (user?.role === 'admin') {
          // Fetch admin stats
          const [users, rooms, complaints, reports, invoices] = await Promise.all([
            dashboardService.getUsers(),
            dashboardService.getRooms(),
            dashboardService.getComplaints(),
            dashboardService.getFinancialReports(),
            dashboardService.getInvoices(),
          ]);
          
          const roomsList = rooms || [];
          const complaintsList = complaints || [];
          const invoicesList = invoices || [];
          
          setStats({
            totalUsers: users?.length || 0,
            totalRooms: roomsList.length,
            availableRooms: roomsList.filter(r => r.status === 'available').length,
            occupiedRooms: roomsList.filter(r => r.status === 'occupied').length,
            totalComplaints: complaintsList.length,
            pendingComplaints: complaintsList.filter(c => c.status === 'pending' || c.status === 'dilaporkan').length,
            totalFinancialReports: reports?.length || 0,
            totalPayments: invoicesList.length,
            pendingPayments: invoicesList.filter(i => i.status === 'pending' || i.status === 'belum_lunas').length,
          });
        } else {
          // Fetch penyewa stats
          const [complaints, invoices] = await Promise.all([
            dashboardService.getComplaints(),
            dashboardService.getInvoices(),
          ]);
          
          const complaintsList = complaints || [];
          const invoicesList = invoices || [];
          
          setStats({
            totalUsers: 0,
            totalRooms: 0,
            availableRooms: 0,
            occupiedRooms: 0,
            totalComplaints: complaintsList.length,
            pendingComplaints: complaintsList.filter(c => c.status === 'pending' || c.status === 'dilaporkan').length,
            totalFinancialReports: 0,
            totalPayments: invoicesList.length,
            pendingPayments: invoicesList.filter(i => i.status === 'pending' || i.status === 'belum_lunas').length,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Admin Features
  const adminFeatures = [
    {
      title: 'Registrasi User',
      button: 'Buka Fitur',
      description: `Total ${stats.totalUsers} pengguna terdaftar`,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate("/admin/fitur/register")
    },
    {
      title: 'Kelola Kamar Kost',
      button: 'Kelola Kamar',
      description: `${stats.availableRooms} tersedia, ${stats.occupiedRooms} terisi dari ${stats.totalRooms} kamar`,
      src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate("/admin/fitur/rooms")
    },
    {
      title: 'Komplain Penghuni',
      button: 'Lihat Komplain',
      description: `${stats.pendingComplaints} komplain menunggu dari ${stats.totalComplaints} total`,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate("/admin/fitur/complaints")
    },
    {
      title: 'Laporan Keuangan',
      button: 'Lihat Laporan',
      description: `${stats.pendingPayments} pembayaran pending, ${stats.totalFinancialReports} laporan`,
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate("/admin/fitur/financial")
    },
  ];

  // Penyewa Features
  const penyewaFeatures = [
    {
      title: 'Komplain',
      button: 'Ajukan Komplain',
      description: `${stats.pendingComplaints} komplain menunggu dari ${stats.totalComplaints} total`,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate("/penyewa/fitur/complaints")
    },
    {
      title: 'Bayar Sewa',
      button: 'Lihat Invoice',
      description: `${stats.pendingPayments} tagihan belum lunas dari ${stats.totalPayments} total`,
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate("/penyewa/fitur/payments")
    },
  ];

  const features = user?.role === 'admin' ? adminFeatures : penyewaFeatures;

  // Convert features to carousel format with live data
  const carouselSlides = features.map((feature) => ({
    title: feature.title,
    button: feature.button,
    src: feature.src,
    description: feature.description,
    action: feature.action,
  }));

  const handleSlideButtonClick = (index) => {
    const slide = carouselSlides[index];
    if (slide?.action && typeof slide.action === 'function') {
      slide.action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100/60 to-white">
      {/* Header */}
      <header className="w-full" style={{ backgroundColor: '#00A5E8' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center font-bold text-white">
              C
            </div>
            <span className="font-semibold tracking-wide text-white">Chipkost</span>
          </div>

          {/* Center: Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (user) {
                  // If logged in, go to dashboard
                  navigate(user.role === 'admin' ? '/admin' : '/penyewa');
                } else {
                  // If not logged in, go to home
                  setActiveTab('home');
                  navigate('/');
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-white hover:text-white/80'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('fitur')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'fitur'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-white hover:text-white/80'
              }`}
            >
              Fitur
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'service'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-white hover:text-white/80'
              }`}
            >
              Customer Service
            </button>
          </div>

          {/* Right: User Info or Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  id="profile-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user.first_name}</p>
                    <p className="text-xs text-white/80 capitalize">{user.role}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-semibold">
                    {user.first_name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div id="profile-dropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl z-[9999] overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{user.first_name}</p>
                      <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate(user.role === 'admin' ? '/admin' : '/penyewa');
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
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Carousel Feature Section */}
      <section className="relative w-full py-20 flex items-center justify-center bg-gradient-to-b from-cyan-50 to-white">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : carouselSlides.length > 0 ? (
          <CarouselWithActions slides={carouselSlides} onButtonClick={handleSlideButtonClick} />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600">Tidak ada fitur tersedia</p>
          </div>
        )}
      </section>

      {/* Footer Info */}
      <div className="bg-gradient-to-b from-transparent to-cyan-50 py-8 text-center text-gray-600 text-sm">
        <p>Kelola kos Anda dengan mudah dan efisien bersama Chipkost</p>
      </div>
    </div>
  );
}

// Custom Carousel Component with Button Action Support
function CarouselWithActions({ slides, onButtonClick }) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    setCurrent((prev) => (prev - 1 < 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrent((prev) => (prev + 1 >= slides.length ? 0 : prev + 1));
  };

  const handleSlideClick = (index) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  // Show 3 slides: previous, current, next
  const getPrevIndex = () => (current - 1 < 0 ? slides.length - 1 : current - 1);
  const getNextIndex = () => (current + 1 >= slides.length ? 0 : current + 1);

  return (
    <div className="relative w-full flex flex-col items-center gap-8 py-16 px-4">
      {/* Carousel Container */}
      <div className="relative w-full flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={handlePreviousClick}
          className="absolute left-0 z-20 w-14 h-14 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
        >
          ←
        </button>

        {/* Slides Container */}
        <div className="flex gap-8 justify-center items-center overflow-hidden px-24">
          {/* Previous Slide (Left, dimmed) */}
          <SlideWithAction
            slide={slides[getPrevIndex()]}
            index={getPrevIndex()}
            current={current}
            handleSlideClick={() => handleSlideClick(getPrevIndex())}
            onButtonClick={() => onButtonClick(getPrevIndex())}
            opacity="opacity-40 scale-75"
          />

          {/* Current Slide (Center, full) */}
          <SlideWithAction
            slide={slides[current]}
            index={current}
            current={current}
            handleSlideClick={handleSlideClick}
            onButtonClick={() => onButtonClick(current)}
            opacity="opacity-100 scale-100"
          />

          {/* Next Slide (Right, dimmed) */}
          <SlideWithAction
            slide={slides[getNextIndex()]}
            index={getNextIndex()}
            current={current}
            handleSlideClick={() => handleSlideClick(getNextIndex())}
            onButtonClick={() => onButtonClick(getNextIndex())}
            opacity="opacity-40 scale-75"
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNextClick}
          className="absolute right-0 z-20 w-14 h-14 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
        >
          →
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex gap-3">
        <button
          onClick={handlePreviousClick}
          className="w-10 h-10 flex items-center justify-center bg-white/30 hover:bg-white/50 text-white rounded-full transition-colors"
        >
          ←
        </button>
        <button
          onClick={handleNextClick}
          className="w-10 h-10 flex items-center justify-center bg-white/30 hover:bg-white/50 text-white rounded-full transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}

// Slide Component with Action Support
function SlideWithAction({ slide, index, current, handleSlideClick, onButtonClick, opacity = "opacity-100 scale-100" }) {
  const slideRef = React.useRef(null);
  const xRef = React.useRef(0);
  const yRef = React.useRef(0);
  const frameRef = React.useRef();

  React.useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty('--x', `${x}px`);
      slideRef.current.style.setProperty('--y', `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event) => {
    event.currentTarget.style.opacity = '1';
  };

  const { src, button, title, description } = slide;

  return (
    <div className={`[perspective:1200px] [transform-style:preserve-3d] transition-all duration-700 ease-out ${opacity}`}>
      <div
        ref={slideRef}
        className="flex flex-col items-center justify-center relative text-center text-white w-96 h-[480px] cursor-pointer"
        onClick={handleSlideClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-lg overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? 'translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)'
                : 'none',
          }}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: 1,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <article className="relative p-6 flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {current === index && (
            <>
              <p className="text-sm text-white/90 mb-6">{description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onButtonClick();
                }}
                className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:shadow-lg transition-shadow"
              >
                {button}
              </button>
            </>
          )}
        </article>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className="text-4xl font-bold text-cyan-600">{value}</p>
    </div>
  );
}
