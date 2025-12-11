import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100/60 to-white">
      {/* Header */}
      <header className="w-full" style={{ backgroundColor: '#00A5E8' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Logo Only */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center font-bold text-white">C</div>
            <span className="font-semibold tracking-wide text-white">Chipkost</span>
          </div>
          
          {/* Center: Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('home')}
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
              <a href="/fitur" className="no-underline">Fitur</a>
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

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Carousel Hero Section */}
      <section className="relative w-full py-20 flex items-center justify-center bg-gradient-to-b from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Kelola Kos Dengan Mudah
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Chipkost membantu Anda mengelola semua aspek kos dengan solusi modern dan terpercaya
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/fitur')}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Jelajahi Fitur
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-white border-2 border-cyan-500 text-cyan-600 font-semibold rounded-lg hover:bg-cyan-50 transition-colors"
            >
              Login Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <div className="bg-gradient-to-b from-transparent to-cyan-50 py-8 text-center text-gray-600 text-sm">
        <p>Kelola kos Anda dengan mudah dan efisien bersama Chipkost</p>
      </div>
    </div>
  );
}

