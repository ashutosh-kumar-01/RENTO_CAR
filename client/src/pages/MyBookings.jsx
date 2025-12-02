import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

// Fallback image when car image fails to load
const FALLBACK_CAR_IMAGE = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

const MyBookings = () => {


  const [bookings, setBookings] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const currency = import.meta.env.VITE_CURRENCY
  const { token } = useAppContext()


  const fetchMyBooking = async () => {
    try {
      const { data } = await axios.get('/api/booking/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      const { data } = await axios.post('/api/booking/cancel', 
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchMyBooking() // Refresh bookings
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setCancellingId(null);
    }
  }

  const handleCancelClick = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  }

  const clearAllBookings = async () => {
    try {
      setIsClearing(true);
      const { data } = await axios.delete('/api/booking/clear-all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message)
        setBookings([]) // Clear bookings from state
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsClearing(false);
    }
  }

  const handleClearAll = () => {
    if (window.confirm('⚠️ Are you sure you want to clear ALL booking history? This action cannot be undone!')) {
      clearAllBookings();
    }
  }


  useEffect(()=>{
    if (token) {
      fetchMyBooking()
    }
  },[token])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-10 pb-20 text-sm max-w-7xl mx-auto min-h-screen'>
      <div className="animate-fade-in-up mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <Title title='My Bookings' subTitle='View and manage your all car bookings' align='left'/>
        
        {bookings.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={isClearing}
            className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600/20 to-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:from-red-600/30 hover:to-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
          >
            {isClearing ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Clearing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All Bookings
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {bookings.length === 0 ? (
            <div className="text-center py-20 bg-slate-900 rounded-xl border border-dashed border-slate-700">
                <p className="text-gray-400 text-lg">You haven't booked any cars yet.</p>
            </div>
        ) : (
            bookings.map((booking, index)=>(
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-slate-800 rounded-xl bg-slate-900 shadow-lg shadow-black/50 hover:shadow-cyan-500/10 transition-all animate-fade-in' style={{animationDelay: `${index * 100}ms`}}>
                {/* Car image and info */}
                <div className='md:col-span-1'>
                <div className='rounded-lg overflow-hidden mb-3 h-32 bg-slate-800 flex items-center justify-center'>
                    <img 
                        src={booking.car?.image || FALLBACK_CAR_IMAGE} 
                        alt={`${booking.car?.brand} ${booking.car?.model}`}  
                        className='w-full h-full object-cover hover:scale-110 transition-transform duration-500'
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_CAR_IMAGE;
                        }}
                    />
                </div>
                <p className='text-lg font-bold text-white'>{booking.car?.brand} {booking.car?.model}</p>

                <p className='text-gray-400 text-xs mt-1 uppercase tracking-wide'>{booking.car?.year} • {booking.car?.category} • {booking.car?.location}</p>
                </div>
                    {/* booking info */}

                    <div className='md:col-span-2 flex flex-col justify-center space-y-4'>
                        <div className='flex items-center gap-3'>
                        <span className='px-3 py-1 bg-slate-800 text-gray-300 rounded-md font-medium text-xs border border-slate-700'>Booking #{index+1}</span>

                        <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${booking.status === 'confirmed' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>{booking.status}</span>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className='flex items-start gap-3'>
                                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                                    <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 invert opacity-70'/>
                                </div>
                                <div>
                                    <p className='text-gray-500 text-xs uppercase font-semibold'>Rental Period</p>
                                    <p className="text-gray-300 font-medium mt-0.5">{booking.pickupDate.split('T')[0]} <span className="text-gray-500 mx-1">to</span> {booking.returnDate.split('T')[0]}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                                    <img src={assets.location_icon_colored} alt="" className='w-4 h-4 invert opacity-70'/>
                                </div>
                                <div>
                                    <p className='text-gray-500 text-xs uppercase font-semibold'>Pick-up Location</p>
                                    <p className="text-gray-300 font-medium mt-0.5">{booking.car?.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* price */}

                    <div className='md:col-span-1 flex flex-col justify-center items-end gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6'>
                        <p className='text-xs text-gray-500 uppercase font-semibold'>Total Price</p>
                        <h1 className='text-3xl font-bold text-cyan-400'>{currency}{booking.price}</h1>
                        <p className='text-xs text-gray-500'>Booked on {booking.createdAt.split('T')[0]}</p>
                        
                        <div className="mt-4 w-full space-y-2">
                            <button 
                                onClick={() => setSelectedBooking(booking)}
                                className="w-full py-2 border border-slate-700 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors text-xs font-medium flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Details
                            </button>
                            
                            {booking.status !== 'cancelled' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleCancelClick(booking._id); }}
                                    disabled={cancellingId === booking._id}
                                    className="w-full py-2 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {cancellingId === booking._id ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel Booking
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>


            </div>
            ))
        )}
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="relative">
                <div className="h-48 overflow-hidden rounded-t-2xl bg-slate-800 flex items-center justify-center">
                  <img 
                    src={selectedBooking.car?.image || FALLBACK_CAR_IMAGE} 
                    alt={`${selectedBooking.car?.brand} ${selectedBooking.car?.model}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_CAR_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 text-sm font-bold rounded-full uppercase tracking-wide ${
                    selectedBooking.status === 'confirmed' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>

                {/* Car Info Overlay */}
                <div className="absolute bottom-4 left-6 right-6">
                  <h2 className="text-2xl font-bold text-white">{selectedBooking.car?.brand} {selectedBooking.car?.model}</h2>
                  <p className="text-gray-400 text-sm">{selectedBooking.car?.year} • {selectedBooking.car?.category}</p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Price Section */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-semibold">Total Amount</p>
                    <p className="text-3xl font-bold text-amber-400">{currency}{selectedBooking.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs uppercase font-semibold">Daily Rate</p>
                    <p className="text-xl font-semibold text-white">{currency}{selectedBooking.car?.pricePerDay}/day</p>
                  </div>
                </div>

                {/* Booking Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pickup Date */}
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs uppercase font-semibold">Pickup Date</p>
                    </div>
                    <p className="text-white font-medium text-lg">{new Date(selectedBooking.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  {/* Return Date */}
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs uppercase font-semibold">Return Date</p>
                    </div>
                    <p className="text-white font-medium text-lg">{new Date(selectedBooking.returnDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  {/* Location */}
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs uppercase font-semibold">Pickup Location</p>
                    </div>
                    <p className="text-white font-medium text-lg">{selectedBooking.car?.location}</p>
                  </div>

                  {/* Booking Date */}
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs uppercase font-semibold">Booked On</p>
                    </div>
                    <p className="text-white font-medium text-lg">{new Date(selectedBooking.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Car Specifications */}
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-4">Car Specifications</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                      <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-white font-semibold">{selectedBooking.car?.seating_capacity || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">Seats</p>
                    </div>
                    <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                      <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-white font-semibold">{selectedBooking.car?.fuel_type || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">Fuel</p>
                    </div>
                    <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                      <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-white font-semibold">{selectedBooking.car?.transmission || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">Transmission</p>
                    </div>
                    <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                      <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-white font-semibold">{selectedBooking.car?.year || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">Year</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 py-3 border border-slate-700 rounded-xl text-gray-300 hover:bg-slate-800 hover:text-white transition-colors font-medium"
                  >
                    Close
                  </button>
                  {selectedBooking.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        setSelectedBooking(null);
                        handleCancelClick(selectedBooking._id);
                      }}
                      className="flex-1 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MyBookings
