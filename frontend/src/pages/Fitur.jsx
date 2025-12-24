import React, { useState, useEffect, useRef, useId } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import { IconArrowNarrowRight } from "@tabler/icons-react";

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
      src: 'https://plus.unsplash.com/premium_photo-1677252438425-e4125f74fbbe?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
      title: 'CCTV Kos',
      button: 'Lihat CCTV',
      description: 'CCTV KOS',
      src: 'https://plus.unsplash.com/premium_photo-1728848993113-69c351ec7264?q=80&w=754&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      action: () => navigate("/admin/fitur/cctv")
    },
    {
      title: 'Komplain Penghuni',
      button: 'Lihat Komplain',
      description: `${stats.pendingComplaints} komplain menunggu dari ${stats.totalComplaints} total`,
      src: 'https://plus.unsplash.com/premium_photo-1661573719277-7674c20ff80c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      action: () => navigate("/admin/fitur/complaints")
    },
    {
      title: 'Laporan Keuangan',
      button: 'Lihat Laporan',
      description: `${stats.pendingPayments} pembayaran pending, ${stats.totalFinancialReports} laporan`,
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate("/admin/fitur/financial")
    },
    {
      title: 'Manajemen RFID',
      button: 'Kelola RFID',
      description: 'Kelola kartu akses RFID dan log akses penghuni',
      src: 'https://images.unsplash.com/photo-1597463330912-eb868206b68e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      action: () => navigate("/admin/fitur/rfid")
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
    {
      title: 'Simulasi Tap RFID',
      button: 'Coba Tap',
      description: 'Uji akses kamar dengan kartu Anda. Log tercatat di admin.',
      src: 'https://images.unsplash.com/photo-1597463330912-eb868206b68e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0',
      action: () => navigate("/penyewa/fitur/rfid")
    },
  ];

  const features = user?.role === 'admin' ? adminFeatures : penyewaFeatures;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full" style={{ backgroundColor: '#00A5E8' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo1f.png" alt="Chipkost Logo" className="h-8 w-8 rounded" />
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
      <section className="relative w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data...</p>
            </div>
          ) : (
            <CarouselWithActions slides={features} />
          )}
        </div>
      </section>

      {/* Footer Info */}
      <div className="bg-gradient-to-b from-white to-cyan-50 py-8 text-center text-gray-600 text-sm">
        <p>Kelola kos Anda dengan mudah dan efisien bersama Chipkost</p>
      </div>
    </div>
  );
}

// Slide Component with Action Support
const Slide = ({ slide, index, current, handleSlideClick }) => {
  const slideRef = useRef(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      const x = xRef.current;
      const y = yRef.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
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

  const { src, button, title, description, action } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 list-none"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: current !== index ? "scale(0.98) rotateX(8deg)" : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform: current === index ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)" : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover transition-opacity duration-600 ease-in-out"
            style={{ opacity: current === index ? 1 : 0.5 }}
            alt={title}
            src={src}
            loading="eager"
            decoding="sync"
          />
          {current === index && <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />}
        </div>

        <article className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${current === index ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative">{title}</h2>
          <p className="text-sm md:text-base text-white/80 mt-2 max-w-md">{description}</p>
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (action) action();
              }}
              className="mt-6 px-6 py-3 w-fit mx-auto text-black bg-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              {button}
            </button>
          </div>
        </article>
      </li>
    </div>
  );
};

// Carousel Control Button
const CarouselControl = ({ type, title, handleClick }) => {
  return (
    <button
      className={`w-12 h-12 flex items-center mx-2 justify-center bg-cyan-500 hover:bg-cyan-600 text-white rounded-full focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 shadow-lg ${type === "previous" ? "rotate-180" : ""}`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight />
    </button>
  );
};

// Carousel with Actions
function CarouselWithActions({ slides }) {
  const [current, setCurrent] = useState(0);
  const id = useId();

  const handlePreviousClick = () => {
    setCurrent((prev) => (prev - 1 < 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrent((prev) => (prev + 1 >= slides.length ? 0 : prev + 1));
  };

  const handleSlideClick = (index) => {
    if (current !== index) setCurrent(index);
  };

  return (
    <div className="relative w-full flex flex-col items-center" aria-labelledby={`carousel-heading-${id}`}>
      <div className="relative mx-auto" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div className="relative w-[70vmin] h-[70vmin] overflow-hidden">
          <ul
            className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${current * (100 / slides.length)}%)` }}
          >
            {slides.map((slide, index) => (
              <Slide key={index} slide={slide} index={index} current={current} handleSlideClick={handleSlideClick} />
            ))}
          </ul>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center gap-3 mt-6">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-14 h-14 rounded-full overflow-hidden border-3 transition-all duration-300 ${current === index ? 'border-cyan-500 scale-110 shadow-lg' : 'border-gray-300 opacity-60 hover:opacity-100'}`}
          >
            <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Arrow Controls */}
      <div className="flex justify-center w-full mt-6">
        <CarouselControl type="previous" title="Sebelumnya" handleClick={handlePreviousClick} />
        <CarouselControl type="next" title="Selanjutnya" handleClick={handleNextClick} />
      </div>
    </div>
  );
}
