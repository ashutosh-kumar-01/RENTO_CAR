import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check screen size once on mount
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  // Update clock every MINUTE instead of every second (reduces lag)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const socialLinks = [
    { 
      name: "Facebook", 
      color: "#1877F2",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
    },
    { 
      name: "Instagram", 
      color: "#E4405F",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/></svg>
    },
    { 
      name: "Twitter", 
      color: "#000000",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    },
    { 
      name: "YouTube", 
      color: "#FF0000",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5,6.19a3.02,3.02,0,0,0-2.12-2.14C19.5,3.5,12,3.5,12,3.5s-7.5,0-9.38.55A3.02,3.02,0,0,0,.5,6.19,31.67,31.67,0,0,0,0,12a31.67,31.67,0,0,0,.5,5.81,3.02,3.02,0,0,0,2.12,2.14c1.88.55,9.38.55,9.38.55s7.5,0,9.38-.55a3.02,3.02,0,0,0,2.12-2.14A31.67,31.67,0,0,0,24,12,31.67,31.67,0,0,0,23.5,6.19ZM9.54,15.57V8.43L15.82,12Z"/></svg>
    },
    { 
      name: "LinkedIn", 
      color: "#0A66C2",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    }
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers", icon: "👥" },
    { value: "200+", label: "Luxury Cars", icon: "🚗" },
    { value: "15+", label: "Cities", icon: "🌆" },
    { value: "24/7", label: "Support", icon: "💬" },
  ];

  const locations = [
    { city: "Mumbai", status: "Open", time: "IST" },
    { city: "Dubai", status: "Open", time: "GST" },
    { city: "London", status: "Open", time: "GMT" },
    { city: "New York", status: "Open", time: "EST" },
  ];

  // Memoize particles - only 3 on desktop, none on mobile
  const particles = useMemo(() => {
    if (!isDesktop) return [];
    return [
      { id: 1, left: '20%', top: '30%' },
      { id: 2, left: '70%', top: '60%' },
      { id: 3, left: '40%', top: '80%' }
    ];
  }, [isDesktop]);

  return (
    <footer className="bg-gradient-to-b from-slate-950 via-black to-black pt-16 sm:pt-20 pb-8 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 relative overflow-hidden">
      
      {/* Static Background Elements - NO animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Static gradient orbs - just CSS, no motion */}
        <div className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-br from-white/5 to-gray-400/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-br from-gray-400/3 to-gray-500/3 rounded-full blur-[120px]" />
        
        {/* Static grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}/>

        {/* Only 3 static particles on desktop - CSS animation only */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{ left: p.left, top: p.top }}
          />
        ))}
      </div>

      {/* Top Decorative Line - static */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-12 md:mb-20"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:border-white/30 transition-colors"
            >
              <span className="text-2xl md:text-3xl mb-1 md:mb-2 block">{stat.icon}</span>
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300">
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs md:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        
        {/* Logo, Newsletter & Social Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16 pb-12 lg:pb-16 border-b border-white/5"
        >
          {/* Logo & Description */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-200 via-white to-gray-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-white/25 group-hover:shadow-white/50 transition-all">
                <svg className="w-6 h-6 md:w-9 md:h-9 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-baseline">
                  <span className="text-xl md:text-3xl font-black tracking-tight text-white">Rento</span>
                  <span className="text-xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300">Car</span>
                </div>
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-gray-600">Premium Rentals</span>
              </div>
            </Link>
            <p className="text-gray-500 leading-relaxed mb-6 text-xs md:text-sm">
              Redefining luxury mobility with our curated fleet of the world's most prestigious automobiles. Experience excellence on every journey.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {["SSL Secured", "Verified", "Trusted"].map((badge) => (
                <span
                  key={badge}
                  className="px-2 md:px-3 py-1 md:py-1.5 bg-gray-400/10 border border-gray-400/20 rounded-full text-gray-300 text-[9px] md:text-[10px] uppercase tracking-wider flex items-center gap-1"
                >
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-4">Subscribe for exclusive offers and luxury car updates.</p>
            
            <form onSubmit={handleSubscribe} className="relative">
              <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl sm:rounded-l-xl sm:rounded-r-none px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/50 transition-colors text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-white to-gray-300 text-black font-bold rounded-xl sm:rounded-l-none sm:rounded-r-xl hover:from-gray-200 hover:to-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  {isSubscribed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
              {isSubscribed && (
                <p className="mt-2 text-gray-300 text-sm flex items-center gap-2">
                  <span>🎉</span> Welcome to the club!
                </p>
              )}
            </form>

            {/* Social Icons */}
            <div className="mt-6 md:mt-8">
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-3 md:mb-4">Follow Us</p>
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className="w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    style={{
                      borderColor: hoveredSocial === social.name ? social.color : undefined,
                      backgroundColor: hoveredSocial === social.name ? `${social.color}20` : undefined,
                      color: hoveredSocial === social.name ? social.color : undefined
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Live Locations */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-base md:text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              Live Locations
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
              {locations.map((loc) => (
                <div
                  key={loc.city}
                  className="flex items-center justify-between p-2.5 md:p-3 bg-white/[0.02] border border-white/5 rounded-lg md:rounded-xl hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-xs md:text-sm font-medium">{loc.city}</p>
                      <p className="text-gray-600 text-[10px] md:text-xs">{loc.time}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 md:py-1 bg-gray-400/10 text-gray-300 text-[9px] md:text-[10px] uppercase tracking-wider rounded-full border border-gray-400/20">
                    {loc.status}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Live Clock - Updates every minute now */}
            <div className="mt-4 p-3 md:p-4 bg-gradient-to-r from-white/5 to-gray-300/5 border border-white/10 rounded-xl">
              <p className="text-gray-600 text-[10px] md:text-xs uppercase tracking-wider mb-1">Current Time (IST)</p>
              <p className="text-xl md:text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {[
            {
              title: "Fleet",
              links: ["Supercars", "Luxury Sedans", "Premium SUVs", "Convertibles", "Exotic Cars", "Vintage Collection"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Press & Media", "Blog", "Partners", "Investors"]
            },
            {
              title: "Support",
              links: ["Help Center", "Contact Us", "FAQs", "Terms of Service", "Privacy Policy", "Cancellation"]
            },
            {
              title: "Experience",
              links: ["Airport Transfer", "Wedding Cars", "Corporate Events", "Weekend Getaways", "Chauffeur Service", "Track Days"]
            }
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-sm md:text-base mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-4 md:w-6 h-[2px] bg-gradient-to-r from-white to-gray-300" />
                {section.title}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs md:text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-12 md:mb-16">
          {/* Visit Card */}
          <div className="p-4 md:p-6 bg-white/[0.02] border border-white/10 rounded-xl md:rounded-2xl hover:border-white/30 transition-all">
            <span className="text-2xl md:text-3xl mb-2 md:mb-3 block">📍</span>
            <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">Visit Us</p>
            <p className="text-white font-semibold text-sm md:text-base mt-1">Beverly Hills, CA 90210</p>
            <p className="text-gray-600 text-[10px] md:text-xs mt-1">Open Mon-Sat, 9AM-8PM</p>
          </div>

          {/* Email Card */}
          <a
            href="mailto:ashusinghby2006@gmail.com"
            className="p-4 md:p-6 bg-white/[0.02] border border-white/10 rounded-xl md:rounded-2xl hover:border-white/30 transition-all group"
          >
            <span className="text-2xl md:text-3xl mb-2 md:mb-3 block">📧</span>
            <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">Email Us</p>
            <p className="text-white font-semibold text-sm md:text-base mt-1 group-hover:text-gray-200 transition-colors break-all">ashusinghby2006@gmail.com</p>
            <p className="text-gray-600 text-[10px] md:text-xs mt-1">Click to send email</p>
          </a>

          {/* Phone Card */}
          <a
            href="tel:+917761966639"
            className="p-4 md:p-6 bg-white/[0.02] border border-white/10 rounded-xl md:rounded-2xl hover:border-white/30 transition-all group"
          >
            <span className="text-2xl md:text-3xl mb-2 md:mb-3 block">📞</span>
            <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider">Call Us</p>
            <p className="text-white font-semibold text-sm md:text-base mt-1 group-hover:text-gray-200 transition-colors">+91 7761966639</p>
            <p className="text-gray-600 text-[10px] md:text-xs mt-1">Click to call now</p>
          </a>
        </div>

        {/* App Download Section */}
        <div className="relative mb-12 md:mb-16 p-6 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-white/10 via-gray-300/10 to-gray-400/10">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Download Our App</h3>
              <p className="text-gray-400 text-xs md:text-sm">Book your luxury ride anytime, anywhere!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <a
                href="#"
                className="flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 bg-black border border-white/20 rounded-xl hover:border-white/40 transition-colors"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase">Download on the</p>
                  <p className="text-white font-semibold text-xs md:text-sm">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 bg-black border border-white/20 rounded-xl hover:border-white/40 transition-colors"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase">Get it on</p>
                  <p className="text-white font-semibold text-xs md:text-sm">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6">
            
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 text-center sm:text-left">
              <p className="text-gray-600 text-xs md:text-sm">
                © {new Date().getFullYear()} <span className="text-white font-semibold">Rento</span><span className="text-white font-semibold">Car</span>. All rights reserved.
              </p>
              <span className="hidden sm:block w-px h-4 bg-white/10" />
              <p className="text-gray-700 text-[10px] md:text-xs">Made with ❤️ in India</p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
              <span className="text-gray-600 text-[10px] md:text-xs">We Accept:</span>
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-center">
                {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"].map((payment) => (
                  <div
                    key={payment}
                    className="px-2 md:px-3 py-1 md:py-1.5 bg-white/5 border border-white/10 rounded text-gray-500 text-[9px] md:text-[10px] font-medium"
                  >
                    {payment}
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/10"
            >
              <span className="font-medium">Back to Top</span>
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility', 'Sitemap', 'Legal'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-gray-600 text-[10px] md:text-xs hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative brand watermark - only on xl screens */}
      <div className="absolute bottom-32 right-10 text-[200px] font-black text-white/[0.015] leading-none pointer-events-none select-none hidden xl:block">
        RC
      </div>

      {/* Static corner accents */}
      <div className="absolute bottom-0 left-0 pointer-events-none hidden md:block">
        <div className="absolute bottom-0 left-0 w-px h-20 bg-gradient-to-t from-white/50 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-20 bg-gradient-to-r from-white/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 right-0 pointer-events-none hidden md:block">
        <div className="absolute bottom-0 right-0 w-px h-20 bg-gradient-to-t from-gray-300/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-px w-20 bg-gradient-to-l from-gray-300/50 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
