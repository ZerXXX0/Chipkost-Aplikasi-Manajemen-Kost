import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CarouselDashboard({ stats, user }) {
  const navigate = useNavigate();

  // Admin Features
  const adminFeatures = [
    {
      title: 'Registrasi User',
      button: 'Buka Fitur',
      description: `Total ${stats.rooms} kamar tersedia`,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Kelola Kamar Kost',
      button: 'Kelola Kamar',
      description: `${stats.rooms} kamar tersedia untuk disewa`,
      src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate('/admin/rooms'),
    },
    {
      title: 'Komplain Penghuni',
      button: 'Lihat Komplain',
      description: `${stats.complaints} komplain masuk`,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate('/admin/complaints'),
    },
    {
      title: 'Laporan Keuangan',
      button: 'Lihat Laporan',
      description: `${stats.invoices} laporan tersedia`,
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate('/admin/financial'),
    },
  ];

  // Penyewa Features
  const penyewaFeatures = [
    {
      title: 'Komplain',
      button: 'Ajukan Komplain',
      description: `${stats.complaints} komplain Anda`,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate('/penyewa/complaints'),
    },
    {
      title: 'Bayar Sewa',
      button: 'Lihat Invoice',
      description: `${stats.invoices} tagihan menunggu`,
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
      action: () => navigate('/penyewa/payments'),
    },
  ];

  const features = user?.role === 'admin' ? adminFeatures : penyewaFeatures;

  const carouselSlides = features.map((feature) => ({
    title: feature.title,
    button: feature.button,
    src: feature.src,
    description: feature.description,
    action: feature.action,
  }));

  const handleSlideButtonClick = (index) => {
    if (carouselSlides[index]?.action) {
      carouselSlides[index].action();
    }
  };

  return (
    <section className="relative w-full flex items-center justify-center">
      {carouselSlides.length > 0 ? (
        <CarouselWithActions slides={carouselSlides} onButtonClick={handleSlideButtonClick} />
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600">Tidak ada fitur tersedia</p>
        </div>
      )}
    </section>
  );
}

// Custom Carousel Component with Button Action Support
function CarouselWithActions({ slides, onButtonClick }) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative mx-auto" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div className="relative w-[70vmin] h-[70vmin] overflow-hidden">
          <ul
            className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${current * (100 / slides.length)}%)`,
            }}
      >
        {slides.map((slide, index) => (
          <SlideWithAction
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
            onButtonClick={() => onButtonClick(index)}
          />
        ))}
      </ul>
        </div>
      </div>

      <div className="flex justify-center w-full mt-4">
        <button
          className="w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 rotate-180"
          title="Go to previous slide"
          onClick={handlePreviousClick}
        >
          ➜
        </button>

        <button
          className="w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200"
          title="Go to next slide"
          onClick={handleNextClick}
        >
          ➜
        </button>
      </div>
    </div>
  );
}

// Slide Component with Action Support
function SlideWithAction({ slide, index, current, handleSlideClick, onButtonClick }) {
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
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? 'scale(0.98) rotateX(8deg)'
              : 'scale(1) rotateX(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'bottom',
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? 'translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)'
                : 'none',
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative mb-2">
            {title}
          </h2>
          <p className="text-sm md:text-base text-white/90 mb-4">{description}</p>
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
              className="mt-2 px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
            >
              {button}
            </button>
          </div>
        </article>
      </li>
    </div>
  );
}
