import React, { useState, memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Memoized CarCard for performance
const CarCard = memo(({ car, index = 0, viewMode = 'grid' }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    const handleClick = useCallback(() => {
        navigate(`/car-details/${car._id}`)
        window.scrollTo(0, 0)
    }, [navigate, car._id])

    const handleLike = useCallback((e) => {
        e.stopPropagation()
        setIsLiked(prev => !prev)
    }, [])

    if (!car) return null

    // List View
    if (viewMode === 'list') {
        return (
            <motion.div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group flex flex-col sm:flex-row bg-gradient-to-r from-zinc-900 to-zinc-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 cursor-pointer transition-all duration-300"
            >
                {/* Image */}
                <div className="relative w-full sm:w-72 md:w-80 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img 
                        src={car.image} 
                        alt={`${car.brand} ${car.model}`}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-900" />
                    
                    {/* Available Badge */}
                    <div className={`absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-gray-400/30 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${car.isAvailable ? 'text-emerald-300' : 'text-red-300'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${car.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {car.isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <h3 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white'}`}>
                                    {car.brand} {car.model}
                                </h3>
                                <p className='text-gray-500 text-xs font-medium mt-1 uppercase tracking-wider'>
                                    {car.category} • {car.year}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-white bg-white/10 px-2.5 py-1 rounded-full">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs font-bold">4.8</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {[
                                { icon: "👥", label: `${car.seating_capacity} Seats` },
                                { icon: "⛽", label: car.fuel_type },
                                { icon: "⚙️", label: car.transmission },
                                { icon: "📍", label: car.location }
                            ].map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1.5 rounded-lg">
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className='font-black text-white text-2xl'>{currency}{car.pricePerDay}</span>
                            <span className='text-gray-500 text-xs ml-1'>/day</span>
                        </div>
                        <button className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${isHovered ? 'bg-gradient-to-r from-white to-gray-400 text-black' : 'bg-white/5 border border-white/10 text-white'}`}>
                            View Details
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>
        )
    }

    // Grid View (Default)
    return (
        <motion.div 
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className='group bg-gradient-to-br from-zinc-900 via-zinc-900 to-black rounded-2xl overflow-hidden shadow-xl shadow-black/30 border border-white/5 hover:border-white/30 cursor-pointer h-full flex flex-col relative'
        >
            {/* Glow effect on hover */}
            <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-white/50 to-gray-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10`} />
            
            {/* Image Container */}
            <div className='relative h-44 sm:h-48 md:h-52 overflow-hidden'>
                {/* Skeleton while loading */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
                )}
                
                {/* Car Image */}
                <img 
                    src={car.image} 
                    alt={`${car.brand} ${car.model}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                />
                
                {/* Shine effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full ${isHovered ? 'translate-x-full' : ''} transition-transform duration-700 skew-x-12`} />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Available badge */}
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-gray-400/30 text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${car.isAvailable ? 'text-emerald-300' : 'text-red-300'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${car.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {car.isAvailable ? 'Available' : 'Unavailable'}
                </div>

                {/* Price tag */}
                <div className='absolute bottom-3 right-3 bg-black/80 backdrop-blur-xl text-white px-3 sm:px-4 py-2 rounded-xl border border-white/10 group-hover:border-white/50 transition-colors'>
                    <span className='font-black text-white text-base sm:text-lg'>{currency}{car.pricePerDay}</span>
                    <span className='text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wider ml-1'>/day</span>
                </div>

                {/* Heart button */}
                <button 
                    onClick={handleLike}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${isLiked ? 'bg-gray-400/30 border-gray-400/50 text-gray-300' : 'bg-black/50 border-white/10 text-white/70 hover:text-gray-300 hover:border-gray-400/30'}`}
                >
                    <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className='p-4 sm:p-5 flex flex-col flex-grow'> 

                <div className='flex justify-between items-start mb-4'>
                    <div className="min-w-0 flex-1">
                        <h3 className={`text-base sm:text-lg font-bold tracking-tight truncate transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white'}`}>
                            {car.brand} {car.model}
                        </h3>
                        <p className='text-gray-500 text-[10px] sm:text-xs font-medium mt-1 uppercase tracking-wider'>
                            {car.category} • {car.year}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-white bg-white/10 border border-white/20 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-bold">4.8</span>
                    </div>
                </div>

                {/* Feature pills */}
                <div className='mt-auto grid grid-cols-2 gap-2'>
                    {[
                        { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label: `${car.seating_capacity} Seats` },
                        { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: car.fuel_type },
                        { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label: car.transmission },
                        { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label: car.location }
                    ].map((item, i) => (
                        <div 
                            key={i}
                            className={`flex items-center text-[10px] sm:text-xs font-medium text-gray-400 p-2 sm:p-2.5 rounded-lg border transition-all duration-300 ${isHovered ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'}`}
                        >
                            <svg className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                            </svg>
                            <span className="truncate">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full mt-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative ${isHovered ? 'bg-gradient-to-r from-white to-gray-400 text-black' : 'bg-white/10 border border-white/30 text-white'}`}>
                    <span className="relative z-10">View Details</span>
                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </motion.div>
    )
})

CarCard.displayName = 'CarCard'

export default CarCard
