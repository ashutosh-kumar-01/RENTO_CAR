import React, { useEffect, useState, useRef } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

// Animated Counter with spring physics
const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const nodeRef = useRef()

  useEffect(() => {
    const startTime = Date.now()
    const startValue = displayValue
    const endValue = value

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(startValue + (endValue - startValue) * easeOut)
      
      setDisplayValue(current)
      
      if (progress < 1) {
        nodeRef.current = requestAnimationFrame(animate)
      }
    }

    nodeRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(nodeRef.current)
  }, [value])

  return <span>{displayValue.toLocaleString()}</span>
}

// 3D Tilt Card with mouse tracking
const TiltCard = ({ children, className = "", intensity = 10 }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 300, damping: 30 })

  const handleMouse = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Particle Field Background
const ParticleField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: [null, "-100%"],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Glowing Orbs Background
const GlowingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div 
      className="absolute -top-40 -right-40 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl"
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl"
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"
      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>
)

// Skeleton Loader with shimmer
const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/90 to-black border border-white/10 p-1">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
    <div className="p-6 space-y-4">
      <div className="w-full h-48 bg-white/5 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-6 bg-white/10 rounded-lg w-3/4" />
        <div className="h-4 bg-white/10 rounded-lg w-1/2" />
        <div className="flex gap-2">
          <div className="h-8 bg-white/10 rounded-full w-20" />
          <div className="h-8 bg-white/10 rounded-full w-24" />
        </div>
      </div>
    </div>
  </div>
)

// Sparkle Effect
const Sparkle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-2 h-2"
    initial={{ scale: 0, rotate: 0 }}
    animate={{ 
      scale: [0, 1, 0],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    <div className="w-full h-full bg-gray-200 rounded-full blur-[1px]" />
  </motion.div>
)

const ManageCars = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { token, axios } = useAppContext()

  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterAvailability, setFilterAvailability] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCar, setSelectedCar] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  const fetchCars = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get('/api/owner/cars', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchCars()
  }, [token])

  const toggleAvailability = async (carId) => {
    try {
      setActionLoading(carId)
      const { data } = await axios.post('/api/owner/toggle-car', 
        { carId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setActionLoading(null)
    }
  }

  const deleteCar = async () => {
    if (!selectedCar) return
    try {
      setActionLoading(selectedCar._id)
      const { data } = await axios.post('/api/owner/delete-car', 
        { carId: selectedCar._id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Car deleted successfully')
        setShowDeleteModal(false)
        setSelectedCar(null)
        fetchCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setActionLoading(null)
    }
  }

  // Filter and sort cars
  const filteredCars = cars
    .filter(car => {
      const matchesSearch = `${car.brand} ${car.model} ${car.location}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'all' || car.category === filterCategory
      const matchesAvailability = filterAvailability === 'all' || 
        (filterAvailability === 'available' && car.isAvailable) ||
        (filterAvailability === 'unavailable' && !car.isAvailable)
      return matchesSearch && matchesCategory && matchesAvailability
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high': return b.pricePerDay - a.pricePerDay
        case 'price-low': return a.pricePerDay - b.pricePerDay
        case 'name': return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
        default: return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  // Get unique categories
  const categories = [...new Set(cars.map(car => car.category))]

  // Stats
  const stats = {
    total: cars.length,
    available: cars.filter(c => c.isAvailable).length,
    unavailable: cars.filter(c => !c.isAvailable).length,
    avgPrice: cars.length ? Math.round(cars.reduce((sum, c) => sum + c.pricePerDay, 0) / cars.length) : 0
  }

  return (
    <div className='px-4 pt-8 md:px-10 w-full bg-black min-h-screen relative overflow-hidden'>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer { animation: shimmer 2s infinite; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <GlowingOrbs />
      <ParticleField />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 mb-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <motion.div 
              className="flex items-center gap-4 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="h-14 w-1.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-500 rounded-full" />
                <motion.div
                  className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-gray-200 rounded-full blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <motion.p 
                  className="text-gray-400 text-sm tracking-wider uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Fleet Management
                </motion.p>
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Your Vehicles
                </motion.h1>
              </div>
            </motion.div>
            <motion.p 
              className="text-gray-500 ml-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Manage, edit, and track all your listed cars in one place
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Link 
              to="/owner/add-car"
              className="group relative flex items-center gap-3 px-8 py-4 overflow-hidden rounded-2xl font-semibold text-black"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-300 transition-all group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-amber-300 via-gray-200 to-gray-200" />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-30"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ 
                  background: "linear-gradient(90deg, transparent, white, transparent)",
                  backgroundSize: "200% 100%"
                }}
              />
              <svg className="w-6 h-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="relative z-10 text-lg">Add New Car</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards with 3D Effect */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 relative z-10"
      >
        {[
          { label: 'Total Cars', value: stats.total, icon: 'car', gradient: 'from-gray-500 via-gray-400 to-gray-300', glow: 'shadow-gray-400/20' },
          { label: 'Available', value: stats.available, icon: 'check', gradient: 'from-emerald-600 via-gray-400 to-gray-300', glow: 'shadow-gray-400/20' },
          { label: 'Unavailable', value: stats.unavailable, icon: 'pause', gradient: 'from-gray-400 via-gray-300 to-gray-200', glow: 'shadow-gray-300/20' },
          { label: 'Avg. Price', value: stats.avgPrice, prefix: currency, icon: 'dollar', gradient: 'from-purple-600 via-gray-400 to-gray-300', glow: 'shadow-gray-400/20' },
        ].map((stat, index) => (
          <TiltCard key={stat.label} intensity={8}>
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              className={`relative h-full p-6 rounded-3xl bg-gradient-to-br ${stat.gradient} overflow-hidden shadow-2xl ${stat.glow}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
              
              {/* Floating Icon */}
              <motion.div 
                className="relative z-10"
                style={{ transform: "translateZ(30px)" }}
              >
                <motion.div 
                  className="w-10 h-10 mb-2 flex items-center justify-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {stat.icon === 'car' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-2-4H7L5 9m14 0v8a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1V9m14 0H5m14 0a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2" /></svg>
                  )}
                  {stat.icon === 'check' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                  {stat.icon === 'pause' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                  {stat.icon === 'dollar' && (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                </motion.div>
                <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {stat.prefix}<AnimatedCounter value={stat.value} />
                </p>
                <p className="text-white/80 text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl" />
            </motion.div>
          </TiltCard>
        ))}
      </motion.div>

      {/* Advanced Filters & Search */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mb-10 p-6 rounded-3xl bg-gradient-to-br from-zinc-900/95 to-black/95 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/50"
      >
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-4">
          {/* Search with animation */}
          <div className="flex-1 relative group">
            <motion.div
              className="absolute -inset-0.5 bg-gradient-to-r from-white to-gray-400 rounded-xl opacity-0 group-focus-within:opacity-50 blur transition-opacity"
            />
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-gray-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by brand, model, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none transition-all"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative group">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none px-5 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/50 outline-none transition-all cursor-pointer hover:bg-white/10"
            >
              <option value="all" className="bg-zinc-900">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Availability Filter */}
          <div className="relative">
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="appearance-none px-5 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/50 outline-none transition-all cursor-pointer hover:bg-white/10"
            >
              <option value="all" className="bg-zinc-900">All Status</option>
              <option value="available" className="bg-zinc-900">🟢 Available</option>
              <option value="unavailable" className="bg-zinc-900">🔴 Unavailable</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-5 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/50 outline-none transition-all cursor-pointer hover:bg-white/10"
            >
              <option value="newest" className="bg-zinc-900">Newest First</option>
              <option value="price-high" className="bg-zinc-900">Price: High → Low</option>
              <option value="price-low" className="bg-zinc-900">Price: Low → High</option>
              <option value="name" className="bg-zinc-900">Name A-Z</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white/5 rounded-xl border border-white/10 p-1.5">
            {[
              { mode: 'grid', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { mode: 'list', icon: 'M4 6h16M4 12h16M4 18h16' }
            ].map(({ mode, icon }) => (
              <motion.button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`relative p-3 rounded-lg transition-all ${viewMode === mode ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {viewMode === mode && (
                  <motion.div
                    layoutId="viewModeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Filters Pills */}
        <AnimatePresence>
          {(searchQuery || filterCategory !== 'all' || filterAvailability !== 'all') && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative z-10 flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/5"
            >
              <span className="text-gray-500 text-sm flex items-center">Active filters:</span>
              {searchQuery && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-400/20 to-gray-400/20 text-gray-300 rounded-full text-xs border border-gray-400/30"
                >
                  🔍 "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-white transition-colors">×</button>
                </motion.span>
              )}
              {filterCategory !== 'all' && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-400/20 to-gray-400/20 text-gray-300 rounded-full text-xs border border-gray-400/30"
                >
                  📁 {filterCategory}
                  <button onClick={() => setFilterCategory('all')} className="hover:text-white transition-colors">×</button>
                </motion.span>
              )}
              {filterAvailability !== 'all' && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-white/20 to-gray-300/20 text-gray-200 rounded-full text-xs border border-white/30"
                >
                  {filterAvailability === 'available' ? '🟢' : '🔴'} {filterAvailability}
                  <button onClick={() => setFilterAvailability('all')} className="hover:text-white transition-colors">×</button>
                </motion.span>
              )}
              <button 
                onClick={() => { setSearchQuery(''); setFilterCategory('all'); setFilterAvailability('all'); }}
                className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between mb-8 relative z-10"
      >
        <div className="flex items-center gap-4">
          <p className="text-gray-400">
            Showing <span className="text-white font-bold text-lg">{filteredCars.length}</span> of <span className="text-white font-medium">{cars.length}</span> cars
          </p>
          {filteredCars.length !== cars.length && (
            <span className="px-2 py-1 bg-white/10 text-gray-200 rounded-lg text-xs border border-white/20">
              Filtered
            </span>
          )}
        </div>
        <motion.button 
          onClick={fetchCars}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-200 text-sm transition-all"
        >
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={isLoading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </motion.svg>
          Refresh
        </motion.button>
      </motion.div>

      {/* Cars Grid/List */}
      {isLoading ? (
        <div className={`grid gap-6 relative z-10 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredCars.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center py-24"
        >
          <motion.div 
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/10 shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-2-4H7L5 9m14 0v8a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1V9m14 0H5m14 0a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {cars.length === 0 ? "No Cars Listed Yet" : "No cars match your filters"}
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {cars.length === 0 
              ? "Start earning by adding your first car to the platform. It only takes a few minutes!" 
              : "Try adjusting your filters or search query to find what you're looking for"}
          </p>
          {cars.length === 0 ? (
            <Link 
              to="/owner/add-car"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-gray-400 text-black font-bold rounded-2xl hover:shadow-lg hover:shadow-white/25 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Car
            </Link>
          ) : (
            <button 
              onClick={() => { setSearchQuery(''); setFilterCategory('all'); setFilterAvailability('all'); }}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-200 transition-all"
            >
              Clear all filters
            </button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            layout
            className={`grid gap-6 relative z-10 pb-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
          >
            {filteredCars.map((car, index) => (
              <TiltCard key={car._id} intensity={5}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, type: "spring" }}
                  onMouseEnter={() => setHoveredCard(car._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative rounded-3xl bg-gradient-to-br from-zinc-900/95 to-black border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-white/10 ${viewMode === 'list' ? 'flex' : ''}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Sparkle effects on hover */}
                  <AnimatePresence>
                    {hoveredCard === car._id && (
                      <>
                        <Sparkle delay={0} />
                        <Sparkle delay={0.2} />
                        <Sparkle delay={0.4} />
                      </>
                    )}
                  </AnimatePresence>

                  {/* Status Badge with animation */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md ${car.isAvailable ? 'bg-gray-400/20 text-emerald-300 border border-gray-300/40' : 'bg-gray-400/20 text-red-300 border border-gray-300/40'}`}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className={`w-2 h-2 rounded-full ${car.isAvailable ? 'bg-gray-300' : 'bg-gray-300'}`}
                        animate={car.isAvailable ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                  </motion.div>

                  {/* Image Container */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-72 h-48' : 'h-56'}`}>
                    <motion.img
                      src={car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    
                    {/* Price Badge */}
                    <motion.div 
                      className="absolute bottom-4 right-4 px-5 py-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                    >
                      <span className="text-gray-200 font-bold text-xl">{currency}{car.pricePerDay}</span>
                      <span className="text-gray-400 text-xs">/day</span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`} style={{ transform: "translateZ(20px)" }}>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-gray-200 transition-colors duration-300">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-500 text-sm mb-5 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white/5 rounded-md">{car.year}</span>
                        <span>•</span>
                        <span>{car.category}</span>
                      </p>

                      {/* Features Pills */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {[
                          { icon: 'location', value: car.location },
                          { icon: 'gear', value: car.transmission },
                          { icon: 'fuel', value: car.fuel_type },
                          { icon: 'users', value: `${car.seating_capacity} seats` }
                        ].map((feature, i) => (
                          <motion.span 
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-400 border border-white/5 transition-colors cursor-default"
                            whileHover={{ scale: 1.05 }}
                          >
                            {feature.icon === 'location' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            {feature.icon === 'gear' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            {feature.icon === 'fuel' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            {feature.icon === 'users' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                            {feature.value}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => toggleAvailability(car._id)}
                        disabled={actionLoading === car._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                          car.isAvailable 
                            ? 'bg-gray-300/10 text-gray-200 border-2 border-gray-300/30 hover:bg-gray-300/20 hover:border-gray-300/50' 
                            : 'bg-gray-400/10 text-gray-300 border-2 border-gray-400/30 hover:bg-gray-400/20 hover:border-gray-400/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {actionLoading === car._id ? (
                          <motion.div 
                            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : car.isAvailable ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pause Listing
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                            Activate
                          </>
                        )}
                      </motion.button>
                      
                      <motion.button
                        onClick={() => { setSelectedCar(car); setShowDeleteModal(true); }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-xl bg-gray-400/10 text-gray-300 border-2 border-gray-400/30 hover:bg-gray-400/20 hover:border-gray-400/50 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl"
            >
              <div className="text-center">
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-400/20 to-gray-500/20 flex items-center justify-center border border-gray-400/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">Delete This Car?</h3>
                <p className="text-gray-400 mb-2">
                  Are you sure you want to permanently delete
                </p>
                <p className="text-gray-200 font-semibold text-lg mb-2">{selectedCar.brand} {selectedCar.model}</p>
                <p className="text-gray-300/80 text-sm mb-8 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                  </svg>
                  This action cannot be undone
                </p>

                <div className="flex gap-4">
                  <motion.button
                    onClick={() => setShowDeleteModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-semibold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={deleteCar}
                    disabled={actionLoading === selectedCar._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === selectedCar._id ? (
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Forever
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageCars
