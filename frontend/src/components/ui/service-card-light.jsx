"use client";

import { cn } from "../../lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export function ServiceCardLight({
  title,
  description,
  icon,
  image,
  className,
  onClick,
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPos = mouseX / width - 0.5;
    const yPos = mouseY / height - 0.5;

    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative h-80 w-72 cursor-pointer rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-1 flex-shrink-0",
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.15), transparent 40%)",
        }}
      />

      <div className="relative h-full w-full rounded-xl bg-white p-6 transition-all duration-300 group-hover:bg-gray-50 shadow-lg">
        <motion.div
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="flex h-full flex-col"
          style={{
            transform: "translateZ(50px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Image Section */}
          {image ? (
            <div className="relative h-36 w-full mb-4 overflow-hidden rounded-xl">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ) : (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
              {icon && (
                <span className="text-2xl text-white">
                  {icon}
                </span>
              )}
            </div>
          )}

          <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed flex-grow">{description}</p>

          {/* Hover Arrow */}
          <motion.div
            animate={{
              x: isHovered ? 5 : 0,
              opacity: isHovered ? 1 : 0.7,
            }}
            className="mt-auto flex items-center text-cyan-600 pt-3"
          >
            <span className="text-sm font-semibold">Pelajari Lebih</span>
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Glow Effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-purple-500/30 blur-xl"
      />
    </motion.div>
  );
}

export function ServiceCardCarouselLight({ children, className }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={cn(
          "flex gap-6 overflow-x-auto scrollbar-hide py-6 px-4",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          scrollBehavior: isDragging ? "auto" : "smooth",
        }}
      >
        {children}
      </div>

      {/* Gradient Overlays for white background */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}

export default ServiceCardLight;
