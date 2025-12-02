import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Title from '../components/Title'
import { assets, cityList } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useAppContext } from '../context/AppContext'
import Loader from '../components/Loader'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

const Cars = () => {
    const [searchParams] = useSearchParams()
    const urlSearchQuery = searchParams.get('search') || ''
    
    const [input, setInput] = useState(urlSearchQuery)
    const { cars, isCarsLoading, searchLocation, setSearchLocation, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext()
    const [filteredCars, setFilteredCars] = useState([])
    const [category, setCategory] = useState('All')
    const [sortType, setSortType] = useState('relevant')
    const [localLocation, setLocalLocation] = useState(searchLocation || '')
    const [viewMode, setViewMode] = useState('grid') // grid or list
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [priceRange, setPriceRange] = useState([0, 50000])
    const [isDesktop, setIsDesktop] = useState(false)
    const [isLocationOpen, setIsLocationOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)

    const categories = [
        { name: 'All', icon: '🚗', count: cars?.length || 0 },
        { name: 'Sedan', icon: '🚙', count: cars?.filter(c => c.category === 'Sedan').length || 0 },
        { name: 'SUV', icon: '🚐', count: cars?.filter(c => c.category === 'SUV').length || 0 },
        { name: 'Luxury', icon: '✨', count: cars?.filter(c => c.category === 'Luxury').length || 0 },
        { name: 'Sports', icon: '🏎️', count: cars?.filter(c => c.category === 'Sports').length || 0 },
        { name: 'Hatchback', icon: '🚕', count: cars?.filter(c => c.category === 'Hatchback').length || 0 },
        { name: 'Electric', icon: '⚡', count: cars?.filter(c => c.category === 'Electric').length || 0 },
        { name: 'Supercar', icon: '🏁', count: cars?.filter(c => c.category === 'Supercar').length || 0 },
        { name: 'Muscle', icon: '💪', count: cars?.filter(c => c.category === 'Muscle').length || 0 },
        { name: 'Truck', icon: '🛻', count: cars?.filter(c => c.category === 'Truck').length || 0 },
        { name: 'Convertible', icon: '🌞', count: cars?.filter(c => c.category === 'Convertible').length || 0 }
    ].filter(cat => cat.name === 'All' || cat.count > 0)

    // Check desktop on mount
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    // Sync with URL search param
    useEffect(() => {
        if (urlSearchQuery) {
            setInput(urlSearchQuery)
        }
    }, [urlSearchQuery])

    // Sync local location with context
    useEffect(() => {
        setLocalLocation(searchLocation || '')
    }, [searchLocation])

    // Memoized filtering logic
    const computedFilteredCars = useMemo(() => {
        if (!cars) return []
        
        let tempCars = [...cars]

        // Filter by Search Input
        if (input) {
            const searchLower = input.toLowerCase()
            tempCars = tempCars.filter(car => 
                car.brand.toLowerCase().includes(searchLower) || 
                car.model.toLowerCase().includes(searchLower) ||
                `${car.brand} ${car.model}`.toLowerCase().includes(searchLower)
            )
        }

        // Filter by Category
        if (category !== 'All') {
            tempCars = tempCars.filter(car => car.category === category)
        }

        // Filter by Location
        if (localLocation) {
            tempCars = tempCars.filter(car => car.location === localLocation)
        }

        // Filter by Price Range
        tempCars = tempCars.filter(car => 
            car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1]
        )

        // Sort
        if (sortType === 'low-high') {
            tempCars.sort((a, b) => a.pricePerDay - b.pricePerDay)
        } else if (sortType === 'high-low') {
            tempCars.sort((a, b) => b.pricePerDay - a.pricePerDay)
        } else if (sortType === 'rating') {
            tempCars.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
        }

        return tempCars
    }, [cars, input, category, sortType, priceRange, localLocation])

    useEffect(() => {
        setFilteredCars(computedFilteredCars)
    }, [computedFilteredCars])

    // Clear all filters
    const clearFilters = useCallback(() => {
        setInput('')
        setCategory('All')
        setSortType('relevant')
        setLocalLocation('')
        setSearchLocation('')
        setPriceRange([0, 50000])
    }, [setSearchLocation])

    if (isCarsLoading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-black">

            {/* Hero Section */}
            <div className='relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-b border-white/5'>
                
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-500/5 rounded-full blur-[100px] md:blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-orange-600/5 rounded-full blur-[80px] md:blur-[120px]" />
                    
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className='relative z-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-12 md:py-20'>
                    
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8 md:mb-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4 md:mb-6"
                        >
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            <span className="text-amber-400 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">Premium Fleet</span>
                            <span className="text-gray-500 text-[10px] sm:text-xs">• {cars?.length || 0} Vehicles</span>
                        </motion.div>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3 md:mb-4">
                            FIND YOUR{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                                PERFECT RIDE
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
                            Explore our extensive fleet of premium vehicles for every occasion
                        </p>
                    </motion.div>

                    {/* Active Search Banner */}
                    <AnimatePresence>
                        {(searchLocation || pickupDate || returnDate) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 rounded-2xl px-4 md:px-6 py-3 max-w-2xl mx-auto"
                            >
                                {searchLocation && (
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs md:text-sm font-medium">{searchLocation}</span>
                                    </div>
                                )}
                                {searchLocation && (pickupDate || returnDate) && <span className="text-gray-600 hidden sm:block">|</span>}
                                {pickupDate && (
                                    <div className="flex items-center gap-2 text-white">
                                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs md:text-sm font-medium">{new Date(pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                )}
                                {pickupDate && returnDate && <span className="text-amber-500">→</span>}
                                {returnDate && (
                                    <span className="text-xs md:text-sm font-medium text-white">{new Date(returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                )}
                                <button 
                                    onClick={() => { setSearchLocation(''); setPickupDate(''); setReturnDate(''); }}
                                    className="ml-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-all"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search & Filter Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='flex flex-col lg:flex-row items-stretch gap-3 md:gap-4 max-w-6xl mx-auto'
                    >
                        {/* Location */}
                        <div className="relative flex-shrink-0 lg:w-48 z-50">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                            </div>
                            
                            <button
                                onClick={() => { setIsLocationOpen(!isLocationOpen); setIsSortOpen(false); }}
                                className={`w-full h-12 md:h-14 pl-12 pr-10 rounded-xl border bg-white/5 backdrop-blur-xl text-sm outline-none cursor-pointer transition-all font-medium text-left flex items-center ${isLocationOpen ? 'border-amber-500/50 text-white' : 'border-white/10 text-gray-200 hover:border-white/20'}`}
                            >
                                <span className="truncate">{localLocation || "All Locations"}</span>
                            </button>

                            <svg className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none transition-transform duration-300 ${isLocationOpen ? 'rotate-180 text-amber-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>

                            <AnimatePresence>
                                {isLocationOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/50 max-h-60 overflow-y-auto"
                                    >
                                        <div 
                                            onClick={() => { setLocalLocation(''); setSearchLocation(''); setIsLocationOpen(false); }}
                                            className={`px-4 py-3 text-sm cursor-pointer transition-colors border-b border-white/5 flex items-center justify-between ${!localLocation ? 'bg-amber-500/10 text-amber-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <span>All Locations</span>
                                            {!localLocation && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        {cityList.map((city) => (
                                            <div 
                                                key={city} 
                                                onClick={() => { setLocalLocation(city); setSearchLocation(city); setIsLocationOpen(false); }}
                                                className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${localLocation === city ? 'bg-amber-500/10 text-amber-500' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                <span>{city}</span>
                                                {localLocation === city && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Search Bar */}
                        <div className='flex items-center bg-white/5 backdrop-blur-xl border border-white/10 px-4 md:px-6 flex-1 h-12 md:h-14 rounded-xl focus-within:border-amber-500/50 focus-within:bg-white/10 transition-all hover:border-white/20 group z-20'>
                            <svg className="w-5 h-5 mr-3 text-gray-500 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input 
                                onChange={(e) => setInput(e.target.value)} 
                                value={input} 
                                type="text" 
                                placeholder='Search by make or model...' 
                                className='w-full h-full outline-none text-white bg-transparent placeholder-gray-500 text-sm'
                            />
                            {input && (
                                <button 
                                    onClick={() => setInput('')}
                                    className="ml-2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="relative flex-shrink-0 lg:w-48 z-30">
                            <button
                                onClick={() => { setIsSortOpen(!isSortOpen); setIsLocationOpen(false); }}
                                className={`w-full h-12 md:h-14 px-4 md:px-5 pr-10 rounded-xl border bg-white/5 backdrop-blur-xl text-sm outline-none cursor-pointer transition-all font-medium text-left flex items-center ${isSortOpen ? 'border-amber-500/50 text-white' : 'border-white/10 text-gray-200 hover:border-white/20'}`}
                            >
                                <span className="truncate">
                                    {sortType === 'relevant' && 'Relevant'}
                                    {sortType === 'low-high' && 'Price: Low → High'}
                                    {sortType === 'high-low' && 'Price: High → Low'}
                                    {sortType === 'rating' && 'Top Rated'}
                                </span>
                            </button>
                            
                            <svg className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-amber-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/50 z-50"
                                    >
                                        {[
                                            { value: 'relevant', label: 'Relevant' },
                                            { value: 'low-high', label: 'Price: Low → High' },
                                            { value: 'high-low', label: 'Price: High → Low' },
                                            { value: 'rating', label: 'Top Rated' }
                                        ].map((option) => (
                                            <div 
                                                key={option.value} 
                                                onClick={() => { setSortType(option.value); setIsSortOpen(false); }}
                                                className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${sortType === option.value ? 'bg-amber-500/10 text-amber-500' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                <span>{option.label}</span>
                                                {sortType === option.value && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* View Toggle - Desktop Only */}
                        <div className="hidden lg:flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>

                    {/* Category Pills */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 md:mt-8 max-w-6xl mx-auto"
                    >
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                            {categories.map((cat) => (
                                <button 
                                    key={cat.name}
                                    onClick={() => setCategory(cat.name)}
                                    className={`flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border
                                        ${category === cat.name 
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black border-transparent shadow-lg shadow-amber-900/30' 
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-amber-500/50 hover:text-amber-400'
                                        }`}
                                >
                                    <span className="text-sm md:text-base">{cat.icon}</span>
                                    <span>{cat.name}</span>
                                    <span className={`min-w-[20px] px-1.5 py-0.5 rounded-full text-[10px] font-bold text-center ${category === cat.name ? 'bg-black/20' : 'bg-white/10'}`}>
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Results Section */}
            <div className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-8 md:py-12'>
                
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-white">
                            {filteredCars.length} {filteredCars.length === 1 ? 'Vehicle' : 'Vehicles'} Available
                        </h2>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">
                            {category !== 'All' && <span className="text-amber-500">{category}</span>}
                            {category !== 'All' && localLocation && ' • '}
                            {localLocation && <span className="text-amber-500">{localLocation}</span>}
                            {!category || (category === 'All' && !localLocation) ? 'Showing all available cars' : ''}
                        </p>
                    </div>
                    
                    {/* Quick filters */}
                    {(input || category !== 'All' || localLocation) && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm hover:text-red-400 hover:border-red-500/30 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Cars Grid/List */}
                <motion.div 
                    layout
                    className={`${viewMode === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
                        : 'flex flex-col gap-4'
                    }`}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCars.map((car, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                                key={car._id}
                            >
                                <CarCard car={car} index={index} viewMode={viewMode} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredCars.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-center py-16 md:py-24'
                    >
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl" />
                            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className='text-xl md:text-2xl font-bold text-white mb-2'>No cars found</h3>
                        <p className='text-gray-500 mb-6 max-w-md mx-auto'>We couldn't find any cars matching your criteria. Try adjusting your filters or search terms.</p>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset All Filters
                        </button>
                    </motion.div>
                )}

                {/* Load More / Pagination Hint */}
                {filteredCars.length > 0 && filteredCars.length >= 12 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <p className="text-gray-500 text-sm">
                            Showing {filteredCars.length} of {cars?.length || 0} vehicles
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Floating Filter Button - Mobile */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className="fixed bottom-6 right-6 lg:hidden z-50 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center text-black"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
            </button>
        </div>
    )
}

export default Cars
