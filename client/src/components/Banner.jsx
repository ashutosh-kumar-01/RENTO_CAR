import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const containerRef = useRef(null);
  const demoVideoRef = useRef(null);
  const navigate = useNavigate();

  // Mouse tracking for parallax effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Scroll-based transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [5, -5]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  // Handle mouse movement for parallax
  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(x * 30);
    mouseY.set(y * 30);
  };

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: "🛡️", title: "Full Insurance", desc: "Complete coverage for your peace of mind", stat: "100%" },
    { icon: "💎", title: "Premium Earnings", desc: "Maximize your vehicle's potential", stat: "$50K+" },
    { icon: "⚡", title: "Quick Payouts", desc: "Weekly transfers to your account", stat: "24hrs" },
    { icon: "🔒", title: "Verified Renters", desc: "Background-checked customers only", stat: "5-Star" }
  ];

  const specs = [
    { label: "Active Partners", value: "500+", suffix: "" },
    { label: "Countries", value: "25", suffix: "+" },
    { label: "Success Rate", value: "99", suffix: "%" },
    { label: "Avg. Rating", value: "4.9", suffix: "★" }
  ];

  // Original 30 particles with full animations
  const particles = [...Array(30)].map((_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    delay: i * 0.3,
    duration: 8 + Math.random() * 8,
    size: Math.random() > 0.7 ? 'w-1.5 h-1.5' : 'w-1 h-1',
    color: i % 3 === 0 ? 'bg-amber-400' : i % 3 === 1 ? 'bg-orange-400' : 'bg-white'
  }));

  return (
    <motion.div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ opacity }}
      className='relative min-h-screen flex items-center bg-black overflow-hidden'
    >
      {/* Animated Background with Scroll & Mouse Parallax Effects */}
      <motion.div 
        style={{ 
          y: backgroundY,
          x: mouseXSpring,
          rotateX,
          rotateY
        }}
        className="absolute inset-0 z-0 bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/10 via-transparent to-orange-950/10"></div>
      </motion.div>

      {/* Animated Glowing orbs with scroll & mouse parallax transform */}
      <motion.div 
        style={{ 
          y, 
          scale,
          x: useTransform(mouseXSpring, [-30, 30], [-20, 20]),
        }}
        className="absolute top-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-500/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-[1]" 
      />
      <motion.div 
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [-50, 50]),
          x: useTransform(mouseXSpring, [-30, 30], [15, -15]),
        }}
        className="absolute bottom-1/4 left-1/3 w-[200px] md:w-[350px] h-[200px] md:h-[350px] bg-orange-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-[1]" 
      />
      
      {/* Third orb for extra depth */}
      <motion.div 
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [30, -70]),
          x: useTransform(mouseYSpring, [-30, 30], [-25, 25]),
        }}
        className="absolute top-1/2 right-1/3 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-red-600/5 rounded-full blur-[100px] md:blur-[130px] pointer-events-none z-[1]" 
      />

      {/* Floating Particles - Full 30 particles with complex animations */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              y: [0, -400, 0],
              x: [0, Math.sin(particle.id) * 50, 0],
              opacity: [0, 0.8, 0.4, 0.8, 0],
              scale: [0, 1, 0.8, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeInOut"
            }}
            className={`absolute ${particle.size} rounded-full ${particle.color} shadow-lg`}
            style={{ 
              left: particle.x, 
              top: particle.y,
              boxShadow: particle.color.includes('amber') ? '0 0 10px rgba(245, 158, 11, 0.5)' : 
                         particle.color.includes('orange') ? '0 0 10px rgba(249, 115, 22, 0.5)' : 
                         '0 0 10px rgba(255, 255, 255, 0.3)'
            }}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-amber-400 text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.25em] uppercase">Exclusive Partnership</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-1 sm:space-y-2">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-gray-500 text-base sm:text-lg tracking-wider"
              >
                Transform Your Investment
              </motion.p>
              
              <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white tracking-tight leading-[0.95] sm:leading-[0.9]'>
                <motion.span 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="block"
                >
                  DO YOU
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="block"
                >
                  OWN A
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
                >
                  LUXURY
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
                >
                  CAR?
                </motion.span>
              </h2>
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className='text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-lg'>
                Join the most <span className="text-white font-medium">exclusive network</span> of luxury car owners. 
                Turn your premium vehicle into a <span className="text-amber-400 font-medium">passive income stream</span> while 
                maintaining complete control.
              </p>
              <div className="h-[2px] w-[30%] bg-gradient-to-r from-amber-500 to-transparent mt-4 sm:mt-6" />
            </motion.div>

            {/* Features Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
            >
              <div className="flex gap-2 mb-3 sm:mb-4">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === activeFeature ? 'w-6 sm:w-8 bg-amber-500' : 'w-2 bg-gray-700 hover:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg sm:rounded-xl text-2xl sm:text-3xl">
                    {features[activeFeature].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-base sm:text-lg truncate">{features[activeFeature].title}</h4>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">{features[activeFeature].desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                      {features[activeFeature].stat}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { navigate('/owner/add-car'); scrollTo(0,0); }}
                className='relative px-6 sm:px-10 py-4 sm:py-5 font-bold rounded-full overflow-hidden cursor-pointer bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-black uppercase tracking-wider text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3'
              >
                List Your Car
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowDemoModal(true)}
                className="px-6 sm:px-8 py-4 sm:py-5 border border-white/20 rounded-full font-medium text-white hover:text-amber-400 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 sm:gap-3 backdrop-blur-sm text-sm sm:text-base"
              >
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-500 rounded-full animate-pulse" />
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Video Card (Hidden on mobile/tablet) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main Video Card */}
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-amber-900/20">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="metadata"
                className="w-full h-[400px] xl:h-[500px] object-cover"
              >
                <source src="https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4" type="video/mp4" />
              </video>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 xl:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">Luxury Experience</p>
                    <p className="text-white text-xl xl:text-2xl font-bold">Premium Fleet</p>
                  </div>
                </div>
                
                {/* Progress bar - CSS animation only */}
                <div className="mt-3 xl:mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-progress-bar" />
                </div>
              </div>

              {/* LIVE badge */}
              <div className="absolute top-3 xl:top-4 right-3 xl:right-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-white text-xs font-medium">LIVE</span>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 xl:-bottom-8 -left-4 xl:-left-8 p-3 xl:p-4 bg-black/80 backdrop-blur-xl rounded-xl xl:rounded-2xl border border-amber-500/30 shadow-xl"
            >
              <div className="flex items-center gap-2 xl:gap-3">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg xl:rounded-xl flex items-center justify-center">
                  <span className="text-xl xl:text-2xl">💰</span>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] xl:text-xs">Avg. Monthly</p>
                  <p className="text-white text-lg xl:text-xl font-bold">$4,200+</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -top-3 xl:-top-4 -right-2 xl:-right-4 p-3 xl:p-4 bg-black/80 backdrop-blur-xl rounded-xl xl:rounded-2xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-lg xl:text-xl">★</span>
                <span className="text-white font-bold">4.9</span>
                <span className="text-gray-500 text-xs xl:text-sm">(2.4k)</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Stats Bar - Original Complex Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 border-t border-white/10"
        >
          <div className="grid grid-cols-4 gap-8">
            {specs.map((spec, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div 
                  className="relative"
                  style={{
                    x: useTransform(mouseXSpring, [-30, 30], [-5 * (index - 1.5), 5 * (index - 1.5)])
                  }}
                >
                  <div className="flex items-baseline gap-1 justify-center">
                    <motion.span 
                      className="text-5xl md:text-6xl font-black text-white group-hover:text-amber-400 transition-colors duration-300"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    >
                      {spec.value}
                    </motion.span>
                    <span className="text-2xl md:text-3xl font-bold text-amber-500">{spec.suffix}</span>
                  </div>
                  <p className="text-gray-500 text-sm uppercase tracking-wider mt-2">{spec.label}</p>
                  
                  {/* Decorative line under each stat */}
                  <motion.div 
                    className="h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black to-transparent z-[5] pointer-events-none"></div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={() => setShowDemoModal(false)}
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-amber-500/10 rounded-full blur-[100px] md:blur-[150px]" />

            {/* Close Button */}
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 sm:top-8 right-4 sm:right-8 w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all z-10"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl"
            >
              <video
                ref={demoVideoRef}
                autoPlay
                loop
                controls
                muted
                playsInline
                className="w-full h-full object-cover bg-black"
              >
                <source src="https://videos.pexels.com/video-files/4569076/4569076-hd_1920_1080_30fps.mp4" type="video/mp4" />
              </video>
            </motion.div>

            {/* Bottom Info - Hidden on mobile */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-4 md:gap-8 z-10">
              {[
                { icon: "🏎️", title: "Premium Fleet", sub: "500+ Cars" },
                { icon: "💎", title: "Exclusive Access", sub: "VIP Only" },
                { icon: "⚡", title: "Instant Booking", sub: "24/7" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                  <span className="text-lg sm:text-2xl">{item.icon}</span>
                  <div className="hidden md:block">
                    <p className="text-white font-bold text-sm">{item.title}</p>
                    <p className="text-gray-400 text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for progress bar animation */}
      <style>{`
        @keyframes progressBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progressBar 10s linear infinite;
        }
      `}</style>
    </motion.div>
  )
}

export default Banner
