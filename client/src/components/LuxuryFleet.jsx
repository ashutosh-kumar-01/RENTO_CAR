import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Top 10 Luxury Cars Data
const top10LuxuryCars = [
  { id: 1, name: "Lamborghini Revuelto", brand: "Lamborghini", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600", price: 2500, speed: "350 km/h", acceleration: "2.5s" },
  { id: 2, name: "Ferrari SF90", brand: "Ferrari", image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600", price: 2200, speed: "340 km/h", acceleration: "2.5s" },
  { id: 3, name: "Porsche 911 GT3", brand: "Porsche", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600", price: 1800, speed: "318 km/h", acceleration: "3.2s" },
  { id: 4, name: "McLaren 720S", brand: "McLaren", image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600", price: 2000, speed: "341 km/h", acceleration: "2.8s" },
  { id: 5, name: "Bugatti Chiron", brand: "Bugatti", image: "https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=600", price: 5000, speed: "420 km/h", acceleration: "2.4s" },
  { id: 6, name: "Aston Martin DBS", brand: "Aston Martin", image: "https://images.unsplash.com/photo-1596994836930-80b0ce5e0e5b?w=600", price: 1900, speed: "340 km/h", acceleration: "3.4s" },
  { id: 7, name: "Bentley Continental GT", brand: "Bentley", image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600", price: 1600, speed: "333 km/h", acceleration: "3.6s" },
  { id: 8, name: "Rolls Royce Ghost", brand: "Rolls Royce", image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600", price: 2800, speed: "250 km/h", acceleration: "4.6s" },
  { id: 9, name: "Mercedes AMG GT", brand: "Mercedes", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600", price: 1400, speed: "318 km/h", acceleration: "3.2s" },
  { id: 10, name: "BMW M8 Competition", brand: "BMW", image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600", price: 1200, speed: "305 km/h", acceleration: "3.0s" },
];

const LuxuryFleet = () => {
  const { cars } = useAppContext();
  const [activeCarIndex, setActiveCarIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeCar = top10LuxuryCars[activeCarIndex];

  // Auto-rotate cars - slower interval
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveCarIndex((prev) => (prev + 1) % top10LuxuryCars.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div ref={sectionRef} className="bg-black py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden relative min-h-screen">
      
      {/* Static Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>

      {/* Static Decorative Elements */}
      <div className="absolute top-20 right-10 md:right-20 w-48 md:w-96 h-48 md:h-96 bg-amber-500/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 md:left-20 w-40 md:w-80 h-40 md:h-80 bg-orange-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-12 md:mb-16 relative z-10"
      >
        <span className="text-amber-500 text-[10px] sm:text-xs font-medium tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4 block">Premium Collection</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight">
          TOP <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">10</span> LUXURY CARS
        </h2>
        <p className="text-gray-500 mt-3 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base px-4">Experience automotive excellence with our handpicked selection of the world's finest vehicles</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">
        
        {/* Left Content */}
        <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 justify-center lg:justify-start">
              <span className="text-5xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-600/20">
                {String(activeCarIndex + 1).padStart(2, '0')}
              </span>
              <div className="w-12 sm:w-16 md:w-20 h-[2px] bg-gradient-to-r from-amber-500 to-transparent"></div>
            </div>
            
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-none tracking-tight">
              {activeCar.brand}
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-500 mt-2 font-light">
              {activeCar.name.replace(activeCar.brand, '').trim()}
            </p>
          </motion.div>

          <motion.div 
            key={activeCar.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4 sm:gap-6 md:gap-10 justify-center lg:justify-start flex-wrap"
          >
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-600">Top Speed</span>
              <span className="text-lg sm:text-xl md:text-2xl text-white font-bold">{activeCar.speed}</span>
            </div>
            <div className="w-px h-8 sm:h-12 bg-gray-800 hidden sm:block"></div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-600">0-100 km/h</span>
              <span className="text-lg sm:text-xl md:text-2xl text-white font-bold">{activeCar.acceleration}</span>
            </div>
            <div className="w-px h-8 sm:h-12 bg-gray-800 hidden sm:block"></div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-600">Per Day</span>
              <span className="text-lg sm:text-xl md:text-2xl text-amber-500 font-bold">${activeCar.price}</span>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { navigate('/cars'); scrollTo(0,0); }}
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-full hover:from-amber-400 hover:to-orange-500 transition-all flex items-center gap-2 sm:gap-3 md:gap-4 mx-auto lg:mx-0 shadow-lg shadow-amber-900/30 text-sm sm:text-base"
          >
            <span className="uppercase tracking-wider">Explore Fleet</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </div>

        {/* Right Content - Car Image */}
        <div 
          className="flex-1 relative w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] flex items-center justify-center lg:justify-end"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Static decorative circles */}
          <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-10 pointer-events-none">
            <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px]">
              <div className="absolute inset-0 border border-white/5 rounded-full opacity-50"></div>
              <div className="absolute -inset-8 sm:-inset-12 border border-amber-500/10 rounded-full opacity-30"></div>
              <div className="absolute inset-8 sm:inset-12 bg-amber-500/5 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeCar.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl"
            >
              <img
                src={activeCar.image}
                alt={activeCar.name}
                className="w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Thumbnails - Responsive */}
      <div className="mt-12 sm:mt-16 md:mt-20 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
          {top10LuxuryCars.map((car, index) => (
            <motion.div 
              key={car.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCarIndex(index)}
              className={`min-w-[160px] sm:min-w-[180px] md:min-w-[220px] w-[160px] sm:w-[180px] md:w-[220px] p-3 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden group flex flex-col ${
                index === activeCarIndex 
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/10 border-amber-500/50 shadow-lg shadow-amber-500/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {/* Rank number */}
              <p className={`text-[10px] sm:text-xs font-black mb-1 sm:mb-2 ${index === activeCarIndex ? 'text-amber-400' : 'text-gray-600'}`}>
                #{String(index + 1).padStart(2, '0')}
              </p>
              
              {/* Image container */}
              <div className="w-full h-[80px] sm:h-[100px] md:h-[120px] flex items-center justify-center mb-2 sm:mb-3 overflow-hidden rounded-lg sm:rounded-xl bg-black/30">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              
              <h4 className={`text-xs sm:text-sm font-bold truncate ${index === activeCarIndex ? 'text-white' : 'text-gray-400'}`}>
                {car.brand}
              </h4>
              <p className={`text-[10px] sm:text-xs truncate ${index === activeCarIndex ? 'text-amber-400' : 'text-gray-600'}`}>
                {car.name.replace(car.brand, '').trim()}
              </p>

              {/* Active indicator */}
              {index === activeCarIndex && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-amber-500 to-orange-600"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-1.5 sm:gap-2">
          {top10LuxuryCars.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCarIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeCarIndex 
                  ? 'w-6 sm:w-8 bg-amber-500' 
                  : 'w-1.5 sm:w-2 bg-gray-700 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LuxuryFleet;
