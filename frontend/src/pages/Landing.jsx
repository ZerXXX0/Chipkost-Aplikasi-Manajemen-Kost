import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCardLight, ServiceCardCarouselLight } from '../components/ui/service-card-light';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const features = [
    {
      title: "RFID Access Control",
      description: "Sistem kontrol akses pintu kamar dengan kartu RFID. Kelola akses penghuni dengan lebih aman dan modern.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    },
    {
      title: "Payment Gateway",
      description: "Pembayaran online dengan berbagai metode: Transfer Bank, QRIS, E-Wallet. Mudah dan cepat.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    },
    {
      title: "Auto Invoice",
      description: "Tagihan otomatis digenerate setiap tanggal 25. Tidak perlu input manual lagi.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    },
    {
      title: "Manajemen Kamar",
      description: "Kelola semua kamar kos dengan mudah. Status, harga, dan penghuni dalam satu dashboard.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
    },
    {
      title: "Sistem Komplain",
      description: "Penghuni bisa langsung report masalah. Admin terima notifikasi dan respon cepat.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80",
    },
    {
      title: "Notifikasi Real-time",
      description: "Dapatkan update langsung untuk pembayaran, komplain, dan pengumuman penting.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative w-full py-16 bg-gradient-to-b from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Chipkost membantu Anda mengelola semua aspek kos dengan solusi modern, terintegrasi, dan terpercaya
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="absolute top-4 right-4 px-8 py-3 bg-white border-2 border-cyan-500 text-cyan-600 font-semibold rounded-lg hover:bg-cyan-50 transition-colors"
            >
              Login Admin
            </button>
          </div>
        </div>
      </section>

      {/* Features Carousel Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-full mb-3">
              ✨ FITUR UNGGULAN
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Fitur-Fitur Terbaik Kami</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Nikmati berbagai fitur modern yang memudahkan pengelolaan kos Anda
            </p>
          </div>
          
          <ServiceCardCarouselLight>
            {features.map((feature, index) => (
              <ServiceCardLight
                key={index}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                onClick={() => navigate('/login')}
              />
            ))}
          </ServiceCardCarouselLight>
        </div>
      </section>
    </div>
  );
}
