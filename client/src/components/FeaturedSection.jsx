import React, { useRef } from 'react'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion, useInView } from 'framer-motion'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { cars } = useAppContext()
    const sectionRef = useRef(null)
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" })

    // Simplified stagger animation for cards
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    }

    const cardVariants = {
      hidden: { 
        opacity: 0, 
        y: 40,
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      }
    }

  return (
    <div 
      ref={sectionRef}
      className='relative flex flex-col items-center py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 bg-black overflow-hidden'
    >
      {/* Static Background Elements - No parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Static gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/10 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-gray-400/10 rounded-full blur-[80px] md:blur-[120px]" />
        
        {/* Static grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Static accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>

      {/* Section Header */}
      <div ref={headerRef} className="text-center mb-10 sm:mb-12 md:mb-16 relative z-10 px-2">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-gradient-to-r from-white/10 to-gray-300/10 border border-white/20 rounded-full backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
          <span className="text-white text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.25em] uppercase">Featured Vehicles</span>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
        </motion.div>
        
        {/* Main Title */}
        <motion.h2 
          initial={{ y: 30, opacity: 0 }}
          animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 sm:mb-6"
        >
          EXPLORE OUR{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
            ELITE
          </span>
          {' '}FLEET
        </motion.h2>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg px-4"
        >
          Handpicked selection of premium vehicles for your next extraordinary journey
        </motion.p>

        {/* Decorative line */}
        <div className="w-24 sm:w-32 h-[2px] bg-gradient-to-r from-white/0 via-white to-white/0 mx-auto mt-6 sm:mt-8" />
      </div>

      {/* Cars Grid with staggered animations */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full relative z-10'
      >
        {
          // Filter to get unique images first, then take 6 cars
          (cars || [])
            .filter((car, index, self) => 
              index === self.findIndex(c => c.image === car.image)
            )
            .slice(0, 6)
            .map((car, index)=> (
              <motion.div 
                key={car._id}
                variants={cardVariants}
                className="group"
              >
                <CarCard car={car} index={index}/>
              </motion.div>
            ))
        }
      </motion.div>

      {/* Explore Button */}
      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        onClick={()=> {
          navigate('/cars'); scrollTo(0,0)
        }} 
        className='group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 mt-12 sm:mt-16 md:mt-20 font-bold uppercase tracking-wider text-xs sm:text-sm cursor-pointer rounded-full border-2 border-white bg-transparent hover:border-gray-200 transition-all duration-300'
      >
        {/* Button text */}
        <span className="text-white group-hover:text-white transition-colors duration-300">
          Explore Full Collection
        </span>
        
        {/* Arrow icon */}
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </motion.button>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  )
}

export default FeaturedSection
