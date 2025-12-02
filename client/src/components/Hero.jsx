import React, { useState, useRef, useEffect, useMemo } from "react";
import { assets, cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { pickupDate, setPickupDate, returnDate, setReturnDate, setSearchLocation } = useAppContext();
  const [pickupLocation, setPickupLocation] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  const ref = useRef(null);
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    // Delay animations until component is mounted
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Simplified scroll animations - only on desktop
  const videoScale = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1, 1.1]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Memoized particles - reduced count and only on desktop
  const particles = useMemo(() => {
    if (isMobile) return [];
    return [...Array(6)].map((_, i) => ({
      id: i,
      left: `${15 + i * 15}%`,
      top: `${20 + (i % 3) * 25}%`,
      delay: i * 0.5,
      duration: 4 + (i % 2),
    }));
  }, [isMobile]);

  return (
    <div ref={ref} className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10 relative text-center px-4 sm:px-6 pt-16 sm:pt-20 overflow-visible">
      
      {/* Background Video - Optimized with lazy loading */}
      <motion.div 
        style={{ scale: videoScale, opacity: videoOpacity }}
        className="absolute -top-24 left-0 right-0 bottom-0 z-0 will-change-transform"
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
            <source src="https://videos.pexels.com/video-files/7727416/7727416-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
      </motion.div>

      {/* Floating Particles - Only on desktop, reduced count */}
      {!isMobile && isLoaded && (
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden hidden md:block">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{ left: particle.left, top: particle.top }}
              animate={{ y: [0, -80, 0], opacity: [0, 0.8, 0] }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Static Glowing Orbs - CSS only, no animation */}
      <div className="absolute top-20 right-10 md:right-20 w-32 md:w-64 h-32 md:h-64 bg-white/10 rounded-full blur-3xl z-[1] opacity-50" />
      <div className="absolute bottom-40 left-5 md:left-10 w-40 md:w-72 h-40 md:h-72 bg-gray-500/10 rounded-full blur-3xl z-[1] opacity-40" />

      {/* Hero Content - Simplified animations */}
      <motion.div 
        style={{ opacity: contentOpacity }}
        className="space-y-4 sm:space-y-6 z-10 relative will-change-transform"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-2 sm:mb-4"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-[10px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase">Exclusive Collection</span>
        </motion.div>

        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white tracking-tighter drop-shadow-2xl"
        >
          <span>FUTURE</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-200">DRIVE</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl md:max-w-2xl mx-auto font-light tracking-wide px-4"
        >
            Experience the next generation of mobility. Premium fleet. Instant booking.
        </motion.p>

        {/* Stats row - responsive */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 pt-2 sm:pt-4"
        >
          {[
            { value: "50+", label: "Luxury Cars" },
            { value: "24/7", label: "Support" },
            { value: "15K+", label: "Happy Clients" }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-wider sm:tracking-widest mt-0.5 sm:mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Search Form - Fully Responsive */}
      <motion.form 
        onSubmit={(e) => {
          e.preventDefault();
          setSearchLocation(pickupLocation);
          navigate('/cars');
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-0 p-3 sm:p-4 lg:p-2 rounded-2xl lg:rounded-full w-full max-w-4xl bg-transparent border border-white/20 z-10"
      >
        
        <div className="flex-1 flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-8 px-2 sm:px-4 lg:px-6 w-full">
          
          {/* Location */}
          <div className="flex flex-col items-start gap-1 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-white/10 pb-2 lg:pb-0 lg:pr-4 xl:pr-6">
            <div className="flex items-center gap-2 text-gray-500 font-medium text-[10px] sm:text-xs uppercase tracking-wider">
                <img src={assets.location_icon} className="w-3 h-3 opacity-60 invert" alt="" />
                <span>Location</span>
            </div>
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-transparent outline-none text-white text-sm cursor-pointer font-semibold"
            >
              <option value="" className="bg-black">Select City</option>
              {cityList.map((city) => (
                <option key={city} value={city} className="bg-black">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Pick-up Date */}
          <div className="flex flex-col items-start gap-1 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-white/10 pb-2 lg:pb-0 lg:pr-4 xl:pr-6">
             <div className="flex items-center gap-2 text-gray-500 font-medium text-[10px] sm:text-xs uppercase tracking-wider">
                <img src={assets.calendar_icon_colored} className="w-3 h-3 opacity-60 invert" alt="" />
                <span>Pick-up</span>
            </div>
            <input
              type="date"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-transparent outline-none text-white text-sm cursor-pointer font-semibold [color-scheme:dark]"
            />
          </div>

          {/* Return Date */}
          <div className="flex flex-col items-start gap-1 w-full lg:w-auto">
             <div className="flex items-center gap-2 text-gray-500 font-medium text-[10px] sm:text-xs uppercase tracking-wider">
                <img src={assets.calendar_icon_colored} className="w-3 h-3 opacity-60 invert" alt="" />
                <span>Return</span>
            </div>
            <input
              type="date"
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              className="w-full bg-transparent outline-none text-white text-sm cursor-pointer font-semibold [color-scheme:dark]"
            />
          </div>
        </div>

        <motion.button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white hover:bg-gray-200 text-black font-bold py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-xl lg:rounded-full transition-all duration-300 shadow-lg shadow-white/20 w-full lg:w-auto mt-2 lg:mt-0 uppercase tracking-wider text-sm sm:text-base"
        >
          Search
        </motion.button>
      </motion.form>

      {/* Scroll indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-60">Scroll</span>
        <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-gray-600 rounded-full flex justify-center p-1.5 sm:p-2">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
