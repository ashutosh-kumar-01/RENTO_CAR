import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

// Animated Counter
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

// 3D Tilt Card
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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
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
      className="absolute top-1/3 left-1/3 w-72 h-72 bg-gray-400/5 rounded-full blur-3xl"
      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>
)

// Skeleton Loader
const SkeletonRow = () => (
  <div className="animate-pulse p-5 border-b border-white/5">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-white/10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="h-3 bg-white/5 rounded w-1/4" />
      </div>
      <div className="h-8 w-24 bg-white/10 rounded-full" />
    </div>
  </div>
)

// Status configuration
const statusConfig = {
  pending: {
    color: 'amber',
    bg: 'bg-white/10',
    border: 'border-white/30',
    text: 'text-gray-200',
    icon: 'clock',
    label: 'Pending',
    glow: 'shadow-white/20'
  },
  confirmed: {
    color: 'emerald',
    bg: 'bg-gray-400/10',
    border: 'border-gray-400/30',
    text: 'text-gray-300',
    icon: 'check',
    label: 'Confirmed',
    glow: 'shadow-gray-400/20'
  },
  cancelled: {
    color: 'red',
    bg: 'bg-gray-400/10',
    border: 'border-gray-400/30',
    text: 'text-gray-300',
    icon: 'x',
    label: 'Cancelled',
    glow: 'shadow-gray-400/20'
  }
}

const ManageBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { token, axios, user } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get('/api/booking/owner', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setBookings(data.bookings)
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
    if (token) fetchBookings()
  }, [token])

  const changeStatus = async (bookingId, newStatus) => {
    try {
      setActionLoading(bookingId)
      const { data } = await axios.post('/api/booking/change-status', 
        { bookingId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(`Booking ${newStatus} successfully!`)
        fetchBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setActionLoading(null)
    }
  }

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(b => {
      const matchesFilter = activeFilter === 'all' || b.status === activeFilter
      const matchesSearch = searchQuery === '' || 
        `${b.car?.brand} ${b.car?.model} ${b.user?.name}`.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt)
        case 'amount-high': return b.totalPrice - a.totalPrice
        case 'amount-low': return a.totalPrice - b.totalPrice
        default: return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  // Stats calculations
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysCount = (from, to) => {
    const start = new Date(from)
    const end = new Date(to)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }

  return (
    <div className='px-4 pt-8 md:px-10 w-full bg-black min-h-screen relative overflow-hidden'>
      <GlowingOrbs />
      
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
                <div className="h-14 w-1.5 bg-gradient-to-b from-gray-300 via-gray-400 to-cyan-600 rounded-full" />
                <motion.div
                  className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-gray-300 rounded-full blur-sm"
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
                  Booking Management
                </motion.p>
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  All Bookings
                </motion.h1>
              </div>
            </motion.div>
            <motion.p 
              className="text-gray-500 ml-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Track, manage, and respond to all customer booking requests
            </motion.p>
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-gray-400/10 to-emerald-600/5 border border-gray-400/20">
              <p className="text-gray-300 font-bold text-2xl">{currency}<AnimatedCounter value={stats.totalRevenue} /></p>
              <p className="text-gray-500 text-xs">Total Revenue</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 relative z-10"
      >
        {[
          { label: 'Total Bookings', value: stats.total, icon: 'clipboard', gradient: 'from-gray-500 via-gray-400 to-gray-300', glow: 'shadow-gray-400/20' },
          { label: 'Pending', value: stats.pending, icon: 'clock', gradient: 'from-gray-300 via-white to-gray-300', glow: 'shadow-white/20' },
          { label: 'Confirmed', value: stats.confirmed, icon: 'check', gradient: 'from-emerald-600 via-gray-400 to-gray-300', glow: 'shadow-gray-400/20' },
          { label: 'Cancelled', value: stats.cancelled, icon: 'x', gradient: 'from-gray-500 via-gray-400 to-gray-200', glow: 'shadow-gray-400/20' },
        ].map((stat, index) => (
          <TiltCard key={stat.label} intensity={8}>
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              className={`relative h-full p-6 rounded-3xl bg-gradient-to-br ${stat.gradient} overflow-hidden shadow-2xl ${stat.glow}`}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
              
              <motion.div 
                className="relative z-10"
                style={{ transform: "translateZ(30px)" }}
              >
                <motion.div 
                  className="w-10 h-10 mb-2 flex items-center justify-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {stat.icon === 'clipboard' && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                  {stat.icon === 'clock' && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {stat.icon === 'check' && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {stat.icon === 'x' && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                </motion.div>
                <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-white/80 text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>

              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </motion.div>
          </TiltCard>
        ))}
      </motion.div>

      {/* Filter Tabs & Search */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mb-8 p-6 rounded-3xl bg-gradient-to-br from-zinc-900/95 to-black/95 border border-white/10 backdrop-blur-2xl shadow-2xl"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
              { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
            ].map(tab => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-5 py-3 rounded-xl font-medium transition-all ${
                  activeFilter === tab.key 
                    ? 'text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeFilter === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-xl ${
                      tab.key === 'all' ? 'bg-white' :
                      tab.key === 'pending' ? 'bg-gradient-to-r from-gray-200 to-white' :
                      tab.key === 'confirmed' ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                      'bg-gradient-to-r from-gray-300 to-gray-400'
                    }`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeFilter === tab.key ? 'bg-black/20' : 'bg-white/10'
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by car or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-gray-400/50 focus:ring-2 focus:ring-gray-400/20 outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-5 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white focus:border-gray-400/50 outline-none transition-all cursor-pointer hover:bg-white/10"
            >
              <option value="newest" className="bg-zinc-900">Newest First</option>
              <option value="oldest" className="bg-zinc-900">Oldest First</option>
              <option value="amount-high" className="bg-zinc-900">Amount: High → Low</option>
              <option value="amount-low" className="bg-zinc-900">Amount: Low → High</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between mb-6 relative z-10"
      >
        <p className="text-gray-400">
          Showing <span className="text-white font-bold text-lg">{filteredBookings.length}</span> bookings
        </p>
        <motion.button 
          onClick={fetchBookings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-all"
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

      {/* Bookings List */}
      {isLoading ? (
        <div className="relative z-10 rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900/95 to-black border border-white/10">
          {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : filteredBookings.length === 0 ? (
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-3">No Bookings Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {bookings.length === 0 
              ? "You haven't received any bookings yet. Share your listings to get started!"
              : "No bookings match your current filters. Try adjusting your search."}
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900/95 to-black border border-white/10 shadow-2xl"
        >
          <AnimatePresence>
            {filteredBookings.map((booking, index) => {
              const config = statusConfig[booking.status] || statusConfig.pending
              
              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group border-b border-white/5 last:border-0 hover:bg-white/5 transition-all"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Car Image & Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <motion.div 
                          className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img 
                            src={booking.car?.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200'}
                            alt={`${booking.car?.brand} ${booking.car?.model}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-gray-300 transition-colors">
                            {booking.car?.brand} {booking.car?.model}
                          </h3>
                          <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-white/5 rounded text-xs">{booking.car?.year}</span>
                            <span>•</span>
                            <span>{booking.car?.category}</span>
                          </p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                          {booking.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{booking.user?.name || 'Unknown'}</p>
                          <p className="text-gray-500 text-xs">{booking.user?.email}</p>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex flex-wrap gap-4 lg:gap-6 items-center">
                        {/* Dates */}
                        <div className="text-center">
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Duration</p>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">{formatDate(booking.fromDate)}</span>
                            <span className="text-gray-600">→</span>
                            <span className="text-white text-sm font-medium">{formatDate(booking.toDate)}</span>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            {getDaysCount(booking.fromDate, booking.toDate)} days
                          </p>
                        </div>

                        {/* Amount */}
                        <div className="text-center min-w-[100px]">
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Amount</p>
                          <p className="text-gray-200 font-bold text-xl">{currency}{booking.totalPrice}</p>
                        </div>

                        {/* Status Badge */}
                        <div className="min-w-[120px]">
                          <motion.span 
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${config.bg} ${config.border} ${config.text}`}
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.span
                              animate={booking.status === 'pending' ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {config.icon}
                            </motion.span>
                            {config.label}
                          </motion.span>
                        </div>

                        {/* Actions */}
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <motion.button
                              onClick={() => changeStatus(booking._id, 'confirmed')}
                              disabled={actionLoading === booking._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-400 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-gray-400/25 transition-all disabled:opacity-50"
                            >
                              {actionLoading === booking._id ? (
                                <motion.div 
                                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Confirm
                                </>
                              )}
                            </motion.button>
                            <motion.button
                              onClick={() => changeStatus(booking._id, 'cancelled')}
                              disabled={actionLoading === booking._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-400/10 border border-gray-400/30 text-gray-300 font-semibold hover:bg-gray-400/20 transition-all disabled:opacity-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Decline
                            </motion.button>
                          </div>
                        )}

                        {/* View Details */}
                        <motion.button
                          onClick={() => { setSelectedBooking(booking); setShowDetailModal(true); }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Header Image */}
              <div className="relative h-48">
                <img 
                  src={selectedBooking.car?.image}
                  alt={`${selectedBooking.car?.brand} ${selectedBooking.car?.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedBooking.car?.brand} {selectedBooking.car?.model}
                  </h3>
                  <p className="text-gray-300 text-sm">{selectedBooking.car?.year} • {selectedBooking.car?.category}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig[selectedBooking.status]?.bg} ${statusConfig[selectedBooking.status]?.border} ${statusConfig[selectedBooking.status]?.text}`}>
                    {statusConfig[selectedBooking.status]?.icon} {statusConfig[selectedBooking.status]?.label}
                  </span>
                </div>

                {/* Customer */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-3">Customer Details</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                      {selectedBooking.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedBooking.user?.name}</p>
                      <p className="text-gray-500 text-sm">{selectedBooking.user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">From</p>
                    <p className="text-white font-medium">{formatDate(selectedBooking.fromDate)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">To</p>
                    <p className="text-white font-medium">{formatDate(selectedBooking.toDate)}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-white/10 to-gray-300/10 border border-white/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Total Amount</p>
                      <p className="text-gray-500 text-xs">
                        {getDaysCount(selectedBooking.fromDate, selectedBooking.toDate)} days × {currency}{selectedBooking.car?.pricePerDay}/day
                      </p>
                    </div>
                    <p className="text-gray-200 font-bold text-3xl">{currency}{selectedBooking.totalPrice}</p>
                  </div>
                </div>

                {/* Actions */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => { changeStatus(selectedBooking._id, 'confirmed'); setShowDetailModal(false); }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-gray-400 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-gray-400/25 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Confirm Booking
                    </motion.button>
                    <motion.button
                      onClick={() => { changeStatus(selectedBooking._id, 'cancelled'); setShowDetailModal(false); }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 rounded-xl bg-gray-400/10 border border-gray-400/30 text-gray-300 font-semibold hover:bg-gray-400/20 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Decline
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageBookings
