import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiRefreshCw, FiTrendingUp, FiCalendar, FiClock, FiDollarSign, FiCheck, FiX, FiAlertCircle, FiTruck, FiActivity, FiArrowUpRight, FiArrowDownRight, FiPlus, FiChevronRight, FiUser, FiMapPin, FiPackage } from 'react-icons/fi'

// Animated Counter with smooth easing
const AnimatedCounter = ({ value, duration = 1.5, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (typeof value !== 'number' || isNaN(value)) {
      setCount(0)
      return
    }
    
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(value * easeOut))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Subtle 3D Tilt Effect
const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(x, [-0.5, 0.5], [-3, 3])
  
  const springConfig = { stiffness: 200, damping: 25 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)
  
  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width)
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Minimal Ambient Background
const AmbientBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-neutral-500/5 to-transparent rounded-full blur-3xl" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
  </div>
)

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.pending}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'
  const { token, axios, user } = useAppContext()
  const navigate = useNavigate()
  
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get('/api/owner/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log('Dashboard API Response:', data) // Debug log
      
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [token])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Loading State
  if (isLoading) {
    return (
      <div className='min-h-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden'>
        <AmbientBackground />
        <motion.div 
          className="flex flex-col items-center gap-6 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <motion.div 
              className="w-16 h-16 rounded-full border-2 border-neutral-800"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full" />
            </motion.div>
          </div>
          <p className="text-neutral-500 text-sm font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  // Stats Cards Data
  const stats = [
    {
      label: 'Total Cars',
      value: dashboardData?.totalCars || 0,
      icon: FiTruck,
      change: dashboardData?.availableCars || 0,
      changeLabel: 'available',
      accent: 'amber'
    },
    {
      label: 'Total Bookings',
      value: dashboardData?.totalBookings || 0,
      icon: FiCalendar,
      change: dashboardData?.pendingBookings || 0,
      changeLabel: 'pending',
      accent: 'blue'
    },
    {
      label: 'Monthly Revenue',
      value: dashboardData?.monthlyRevenue || 0,
      prefix: currency,
      icon: FiTrendingUp,
      change: ((dashboardData?.monthlyRevenue / (dashboardData?.totalRevenue || 1)) * 100).toFixed(0),
      changeLabel: '% of total',
      accent: 'emerald'
    },
    {
      label: 'Total Revenue',
      value: dashboardData?.totalRevenue || 0,
      prefix: currency,
      icon: FiDollarSign,
      change: dashboardData?.confirmedBookings || 0,
      changeLabel: 'confirmed',
      accent: 'purple'
    }
  ]

  return (
    <div className='min-h-screen bg-neutral-950 relative overflow-hidden'>
      <AmbientBackground />
      
      <div className='relative z-10 px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.p 
                className="text-neutral-500 text-sm mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {getGreeting()}
              </motion.p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome back, <span className="text-amber-500">{user?.name?.split(' ')[0] || 'Owner'}</span>
              </h1>
              <p className="text-neutral-500 mt-2 text-sm">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl border border-neutral-800 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </motion.button>
              
              <Link to="/owner/add-car">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="text-sm">Add Car</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <TiltCard key={stat.label}>
              <motion.div
                className="group relative bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-neutral-800/50 group-hover:bg-${stat.accent}-500/10 transition-colors duration-300`}>
                    <stat.icon className={`w-5 h-5 text-neutral-400 group-hover:text-${stat.accent}-400 transition-colors duration-300`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <span className="text-amber-500 font-medium">{stat.change}</span>
                    <span>{stat.changeLabel}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-neutral-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} />
                  </p>
                </div>
                
                {/* Subtle accent line */}
                <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-${stat.accent}-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-neutral-900/30 rounded-xl p-4 border border-neutral-800/30 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <FiCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Confirmed</p>
              <p className="text-lg font-semibold text-white">{dashboardData?.confirmedBookings || 0}</p>
            </div>
          </div>
          
          <div className="bg-neutral-900/30 rounded-xl p-4 border border-neutral-800/30 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <FiClock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Pending</p>
              <p className="text-lg font-semibold text-white">{dashboardData?.pendingBookings || 0}</p>
            </div>
          </div>
          
          <div className="bg-neutral-900/30 rounded-xl p-4 border border-neutral-800/30 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-red-500/10">
              <FiX className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Cancelled</p>
              <p className="text-lg font-semibold text-white">{dashboardData?.cancelledBookings || 0}</p>
            </div>
          </div>
          
          <div className="bg-neutral-900/30 rounded-xl p-4 border border-neutral-800/30 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FiActivity className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Availability</p>
              <p className="text-lg font-semibold text-white">{dashboardData?.availabilityRate || 0}%</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Bookings Section */}
        <motion.div
          className="bg-neutral-900/30 rounded-2xl border border-neutral-800/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-neutral-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <FiPackage className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
                <p className="text-xs text-neutral-500">Latest customer reservations</p>
              </div>
            </div>
            
            <Link to="/owner/manage-bookings">
              <motion.button
                className="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 transition-colors"
                whileHover={{ x: 2 }}
              >
                View All
                <FiChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
          
          <div className="p-6">
            {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {dashboardData.recentBookings.map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-neutral-900/50 rounded-xl p-4 border border-neutral-800/30 hover:border-neutral-700/50 transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Car Image */}
                        <div className="w-full md:w-20 h-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                          {booking.car?.image ? (
                            <img 
                              src={booking.car.image} 
                              alt={booking.car.model} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiTruck className="w-6 h-6 text-neutral-600" />
                            </div>
                          )}
                        </div>
                        
                        {/* Booking Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-white font-medium truncate">
                                {booking.car?.brand} {booking.car?.model}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-neutral-500">
                                <FiUser className="w-3.5 h-3.5" />
                                <span>{booking.user?.name || 'Unknown User'}</span>
                              </div>
                            </div>
                            <StatusBadge status={booking.status} />
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-3.5 h-3.5" />
                              <span>{formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500 font-medium">
                              <FiDollarSign className="w-3.5 h-3.5" />
                              <span>{currency}{booking.price?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover indicator */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-amber-500 rounded-r transition-all duration-200" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-800/50 mb-4">
                  <FiPackage className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Bookings Yet</h3>
                <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-6">
                  {dashboardData?.totalCars > 0 
                    ? "When customers book your cars, they'll appear here."
                    : "Start by adding your first car to receive bookings."}
                </p>
                <Link to={dashboardData?.totalCars > 0 ? "/owner/manage-bookings" : "/owner/add-car"}>
                  <motion.button
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-medium text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {dashboardData?.totalCars > 0 ? (
                      <>
                        <FiPackage className="w-4 h-4" />
                        View All Bookings
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-4 h-4" />
                        Add Your First Car
                      </>
                    )}
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions (shown only if no cars) */}
        {dashboardData?.totalCars === 0 && (
          <motion.div
            className="mt-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <FiAlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-white font-semibold mb-1">Get Started with Your Fleet</h3>
                <p className="text-neutral-400 text-sm">
                  You don't have any cars listed yet. Add your first car to start receiving bookings from customers.
                </p>
              </div>
              <Link to="/owner/add-car">
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-medium transition-colors whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPlus className="w-5 h-5" />
                  Add Car
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
