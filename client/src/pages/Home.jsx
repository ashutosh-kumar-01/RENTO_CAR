import React, { useRef, useState, useEffect, lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import { motion, useScroll, useSpring } from 'framer-motion'

// Lazy load components below the fold for better initial load performance
const LuxuryFleet = lazy(() => import('../components/LuxuryFleet'))
const FeaturedSection = lazy(() => import('../components/FeaturedSection'))
const Banner = lazy(() => import('../components/Banner'))
const Testimonial = lazy(() => import('../components/Testimonial'))
const Newsletter = lazy(() => import('../components/Newsletter'))

// Simple loading placeholder
const SectionLoader = () => (
  <div className="min-h-[50vh] bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
)

const Home = () => {
  const containerRef = useRef(null)
  const [showScrollIndicators, setShowScrollIndicators] = useState(false)
  const { scrollYProgress } = useScroll()
  
  // Lighter spring physics for scroll progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.01
  })

  // Show scroll indicators after initial load
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollIndicators(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-white via-gray-300 to-gray-400 origin-left z-[100] will-change-transform"
        style={{ scaleX }}
      />
      
      {/* Floating Scroll Indicator Dots - Only show on large screens after delay */}
      {showScrollIndicators && (
        <div className="fixed right-4 xl:right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-2.5 sm:gap-3">
          {['Hero', 'Fleet', 'Featured', 'Banner', 'Reviews', 'Newsletter'].map((section, index) => (
            <div
              key={section}
              className="group flex items-center gap-2 sm:gap-3 cursor-pointer"
              onClick={() => {
                const sections = document.querySelectorAll('section')
                sections[index]?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="text-[10px] sm:text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {section}
              </span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-700 group-hover:bg-white group-hover:scale-125 transition-all duration-200" />
            </div>
          ))}
        </div>
      )}

      {/* Main Content - Hero loads immediately, others lazy load */}
      <section id="hero">
        <Hero />
      </section>
      
      <Suspense fallback={<SectionLoader />}>
        <section id="fleet">
          <LuxuryFleet />
        </section>
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <section id="featured">
          <FeaturedSection />
        </section>
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <section id="banner">
          <Banner />
        </section>
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <section id="testimonials">
          <Testimonial />
        </section>
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <section id="newsletter">
          <Newsletter />
        </section>
      </Suspense>
    </div>
  )
}

export default Home
