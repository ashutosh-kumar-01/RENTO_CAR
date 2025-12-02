import React, { useState, useEffect, useRef, useMemo } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const Navbar = () => {

    const {setShowLogin, user, logout, isOwner, axios, setIsOwner, cars} = useAppContext() 

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeLink, setActiveLink] = useState("/")
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef(null)
    const navigate = useNavigate()

    const { scrollY } = useScroll()

    // Filter cars based on search query
    const searchResults = useMemo(() => {
      if (!searchQuery.trim() || !cars) return []
      const query = searchQuery.toLowerCase()
      return cars.filter(car => 
        car.brand?.toLowerCase().includes(query) || 
        car.model?.toLowerCase().includes(query) ||
        car.category?.toLowerCase().includes(query) ||
        `${car.brand} ${car.model}`.toLowerCase().includes(query)
      ).slice(0, 5) // Limit to 5 results
    }, [searchQuery, cars])

    // Show results when there's a query
    useEffect(() => {
      setShowResults(searchQuery.trim().length > 0 && searchResults.length > 0)
    }, [searchQuery, searchResults])

    // Track scroll direction
    useMotionValueEvent(scrollY, "change", (latest) => {
      const previous = scrollY.getPrevious()
      if (latest > previous && latest > 150) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      setScrolled(latest > 50)
    })

    // Update active link
    useEffect(() => {
      setActiveLink(location.pathname)
    }, [location])

    // Close search on click outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
          setSearchOpen(false)
          setShowResults(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
      setOpen(false)
    }, [location])

    const changeRole = async () =>{
      try {
        const {data} = await axios.post('/api/owner/change-role')
        if(data.success){
            setIsOwner(true)
            toast.success(data.message)
        }else{
            toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const handleSearch = (e) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        navigate(`/cars?search=${searchQuery}`)
        setSearchOpen(false)
        setSearchQuery("")
        setShowResults(false)
      }
    }

    const handleCarClick = (carId) => {
      navigate(`/car-details/${carId}`)
      setSearchOpen(false)
      setSearchQuery("")
      setShowResults(false)
    }

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-2' 
            : 'py-4'
        }`}
      >
        {/* Navbar Background with Gradient Border */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          scrolled 
            ? 'bg-transparent' 
            : 'bg-transparent'
        }`}>
          {/* Animated gradient border at bottom */}
          <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}></div>
          
          {/* Ambient glow */}
          <div className={`absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-20 bg-white/5 blur-3xl transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>

        <div className="relative flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32">
          
          {/* RentoCar Logo */}
          <Link to='/' className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              {/* Car Icon */}
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-200 via-white to-gray-300 rounded-xl flex items-center justify-center shadow-lg shadow-white/20 group-hover:shadow-white/40 transition-shadow"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </motion.div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/40 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Text Logo */}
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-white">Rento</span>
                  <span className="text-xl md:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white">Car</span>
                </div>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-gray-500 -mt-1">Premium Rentals</span>
              </div>

              {/* Animated underline */}
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-white via-gray-300 to-white rounded-full origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Glass morphism pills */}
          <div className="hidden lg:flex items-center p-1.5 rounded-full">
            {menuLinks.map((link, index)=> (
              <Link 
                key={index} 
                to={link.path}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    activeLink === link.path 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {/* Active underline indicator */}
                  {activeLink === link.path && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {/* Hover glow for inactive */}
                  {activeLink !== link.path && (
                    <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 bg-white/5 transition-opacity"></div>
                  )}
                  <span className="relative z-10 text-sm tracking-wide">{link.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Search Button & Expandable Search with Live Results */}
            <div ref={searchRef} className="relative hidden md:block">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div
                    initial={{ width: 44, opacity: 0.5 }}
                    animate={{ width: 350, opacity: 1 }}
                    exit={{ width: 44, opacity: 0.5 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative"
                  >
                    <form
                      onSubmit={handleSearch}
                      className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden focus-within:border-white/50 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-white/10 transition-all duration-300"
                    >
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full px-5 py-3 bg-transparent text-white placeholder-gray-500 outline-none text-sm caret-white selection:bg-white/30"
                        placeholder="Search cars by brand, model..."
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="p-2 text-gray-500 hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 text-white hover:text-gray-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </motion.button>
                    </form>

                    {/* Live Search Results Dropdown */}
                    <AnimatePresence>
                      {showResults && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50"
                        >
                          <div className="p-2">
                            <p className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wider">
                              {searchResults.length} car{searchResults.length !== 1 ? 's' : ''} found
                            </p>
                            <div className="space-y-1">
                              {searchResults.map((car, index) => (
                                <motion.div
                                  key={car._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => handleCarClick(car._id)}
                                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all"
                                >
                                  {/* Car Image */}
                                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                    <img 
                                      src={car.images?.[0] || car.image || 'https://via.placeholder.com/100x75?text=Car'} 
                                      alt={`${car.brand} ${car.model}`}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                  
                                  {/* Car Info */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-semibold text-sm truncate group-hover:text-gray-300 transition-colors">
                                      {car.brand} {car.model}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span className="px-2 py-0.5 bg-white/5 rounded-full">{car.category}</span>
                                      <span>•</span>
                                      <span className="text-white font-semibold">₹{car.pricePerDay}/day</span>
                                    </div>
                                  </div>

                                  {/* Arrow */}
                                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </motion.div>
                              ))}
                            </div>
                            
                            {/* View All Results */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSearch}
                              className="w-full mt-2 p-3 text-center text-sm font-medium text-white hover:text-gray-300 hover:bg-white/5 rounded-xl transition-all"
                            >
                              View all results for "{searchQuery}"
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* No Results */}
                      {searchQuery.trim().length > 0 && searchResults.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50 p-6 text-center"
                        >
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <p className="text-gray-400 text-sm">No cars found for "{searchQuery}"</p>
                          <p className="text-gray-600 text-xs mt-1">Try searching for brand or model</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchOpen(true)}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* List Your Car / Dashboard Button */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=> isOwner ? navigate('/owner') : changeRole()} 
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 font-medium text-sm group"
            >
              {isOwner ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </motion.div>
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>List Your Car</span>
                </>
              )}
            </motion.button>

            {/* Login/Logout Button - Premium Style */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=> {user ? logout() : setShowLogin(true)}} 
              className="relative group px-6 py-2.5 rounded-full font-bold text-sm overflow-hidden"
            >
              {/* Animated gradient background */}
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%]"
                animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              ></motion.span>
              
              {/* Inner glow */}
              <span className="absolute inset-[1px] bg-gradient-to-r from-white to-gray-100 rounded-full"></span>
              
              {/* Shine sweep effect */}
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                ></motion.span>
              </span>
              
              {/* Outer glow on hover */}
              <span className="absolute -inset-1 bg-gradient-to-r from-white to-gray-200 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
              
              <span className="relative z-10 flex items-center gap-2 text-black font-semibold">
                {user ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Sign Out
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Sign In
                  </>
                )}
              </span>
            </motion.button>

            {/* Mobile Menu Button - Enhanced */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all" 
              aria-label="Menu" 
              onClick={()=> setOpen(!open)}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <motion.span 
                  animate={{ 
                    rotate: open ? 45 : 0, 
                    y: open ? 7 : 0,
                    backgroundColor: open ? "#ffffff" : "#ffffff"
                  }}
                  className="w-full h-0.5 rounded-full origin-left"
                />
                <motion.span 
                  animate={{ 
                    opacity: open ? 0 : 1, 
                    x: open ? 20 : 0,
                    width: open ? 0 : "100%"
                  }}
                  className="h-0.5 bg-white rounded-full"
                />
                <motion.span 
                  animate={{ 
                    rotate: open ? -45 : 0, 
                    y: open ? -7 : 0,
                    backgroundColor: open ? "#ffffff" : "#ffffff"
                  }}
                  className="w-full h-0.5 rounded-full origin-left"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40 lg:hidden"
            >
              {/* Animated background particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    y: -200,
                    x: Math.random() * 100 - 50
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{ left: `${Math.random() * 100}%`, top: `${50 + Math.random() * 50}%` }}
                />
              ))}
            </motion.div>
            
            {/* Mobile Menu Panel - Enhanced */}
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-gradient-to-b from-gray-950 to-black border-l border-white/10 z-50 lg:hidden overflow-hidden"
            >
              {/* Decorative gradient orb */}
              <div className="absolute top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-40 -left-20 w-40 h-40 bg-gray-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Mobile Menu Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  {/* Mobile Logo */}
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white">Rento</span>
                    <span className="text-lg font-bold text-gray-300">Car</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-white/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Mobile Search - Enhanced */}
              <div className="relative p-6 border-b border-white/5">
                <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-white/30 focus-within:shadow-lg focus-within:shadow-white/5 transition-all">
                  <div className="pl-4 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-4 bg-transparent text-white placeholder-gray-500 outline-none"
                    placeholder="Search luxury cars..."
                  />
                  {searchQuery && (
                    <motion.button 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      type="submit" 
                      className="p-4 text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  )}
                </form>
              </div>

              {/* Mobile Navigation Links - Enhanced */}
              <div className="relative p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-320px)]">
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] mb-4 px-4">Navigation</p>
                {menuLinks.map((link, index)=> (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.08, type: "spring", stiffness: 100 }}
                  >
                    <Link 
                      to={link.path}
                      className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                        activeLink === link.path 
                          ? 'bg-gradient-to-r from-white/20 via-gray-500/10 to-transparent text-white border-l-2 border-white' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white hover:pl-6'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full transition-all ${activeLink === link.path ? 'bg-white shadow-lg shadow-white/50' : 'bg-gray-700 group-hover:bg-gray-500'}`}></span>
                      <span className="font-medium text-lg">{link.name}</span>
                      {activeLink === link.path && (
                        <motion.svg 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="w-4 h-4 ml-auto text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Divider */}
                <div className="py-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>

                <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] mb-4 px-4">Quick Actions</p>

                {/* Mobile List Your Car Button */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + menuLinks.length * 0.08, type: "spring", stiffness: 100 }}
                >
                  <button 
                    onClick={()=> { isOwner ? navigate('/owner') : changeRole(); setOpen(false); }} 
                    className="group flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white hover:pl-6 transition-all duration-300"
                  >
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/20 to-gray-500/20 flex items-center justify-center">
                      {isOwner ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </span>
                    <span className="font-medium text-lg">{isOwner ? 'Dashboard' : 'List Your Car'}</span>
                    <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              </div>

              {/* Mobile User Section - Enhanced */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-gradient-to-t from-black via-black to-transparent">
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={()=> {user ? logout() : setShowLogin(true); setOpen(false);}} 
                  className="relative w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 overflow-hidden group"
                >
                  {/* Animated gradient background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-gradient-x"></span>
                  
                  {/* Shine effect */}
                  <span className="absolute inset-0 overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </span>
                  
                  <span className="relative flex items-center gap-2 text-black">
                    {user ? (
                      <>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        Sign Out
                      </>
                    ) : (
                      <>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        Sign In to Continue
                      </>
                    )}
                  </span>
                </motion.button>
                
                {/* Bottom branding */}
                <p className="text-center text-[10px] text-gray-600 mt-4 tracking-widest uppercase">Premium Car Rentals</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className={`${scrolled ? 'h-16' : 'h-20'} transition-all duration-500`}></div>
    </>
  );
};

export default Navbar;
