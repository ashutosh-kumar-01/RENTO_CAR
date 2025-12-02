import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      name: "Rahul Sharma",
      location: "Mumbai, India",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      testimonial: "Absolutely phenomenal experience! The BMW M4 was immaculate and the service was beyond five-star. This is how luxury car rental should be.",
      car: "BMW M4 Competition",
      rating: 5
    },
    {
      name: "Priya Patel",
      location: "Delhi, India",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      testimonial: "I've used many luxury car services, but nothing compares. The attention to detail and the quality of vehicles is unmatched. Truly exceptional!",
      car: "Porsche 911 GT3",
      rating: 5
    },
    {
      name: "Arjun Reddy",
      location: "Bangalore, India",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      testimonial: "From booking to return, everything was seamless. The Ferrari was a dream to drive and the concierge service made me feel like royalty. Highly recommended!",
      car: "Ferrari Roma",
      rating: 5
    },
    {
      name: "Ananya Singh",
      location: "Hyderabad, India",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      testimonial: "The best decision I made for my wedding day. Arriving in a Rolls Royce made the moment even more magical. Thank you for the unforgettable experience!",
      car: "Rolls Royce Ghost",
      rating: 5
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 bg-black relative overflow-hidden"
    >
      
      {/* Static Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-white/5 rounded-full blur-[150px] md:blur-[200px]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Decorative quote marks */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-20 text-[150px] sm:text-[200px] md:text-[300px] font-serif text-white/[0.02] leading-none select-none">"</div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 text-[150px] sm:text-[200px] md:text-[300px] font-serif text-white/[0.02] leading-none select-none rotate-180">"</div>
      </div>

      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 sm:mb-16 md:mb-20 relative z-10"
      >
        <span className="text-white text-[10px] sm:text-xs font-medium tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4 block">Testimonials</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
          WHAT OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300">CLIENTS</span> SAY
        </h2>
      </motion.div>

      {/* Main Testimonial Display */}
      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {Array(testimonials[activeIndex].rating).fill(0).map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-light leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-3xl xl:max-w-4xl mx-auto px-2">
              "{testimonials[activeIndex].testimonial}"
            </p>

            {/* Author Info */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="relative">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  loading="lazy"
                  className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/50"
                />
                <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 bg-black p-0.5 sm:p-1 rounded-full border border-white/30">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-lg sm:text-xl font-bold text-white">{testimonials[activeIndex].name}</h4>
                <p className="text-gray-500 text-xs sm:text-sm">{testimonials[activeIndex].location}</p>
                <p className="text-white text-[10px] sm:text-xs mt-1 uppercase tracking-wider">{testimonials[activeIndex].car}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-10 sm:mt-12 md:mt-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-8 sm:w-12 bg-gradient-to-r from-white to-gray-400' 
                  : 'w-1.5 sm:w-2 bg-gray-700 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows - Hidden on mobile */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 hidden md:flex justify-between pointer-events-none">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="pointer-events-auto w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all hover:bg-white/5 -ml-4 lg:-ml-16"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
            className="pointer-events-auto w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all hover:bg-white/5 -mr-4 lg:-mr-16"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-16 sm:mt-20 md:mt-24 pt-10 sm:pt-12 md:pt-16 border-t border-white/5"
      >
        <p className="text-center text-gray-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8">Trusted by Discerning Clients Worldwide</p>
        <div className="flex justify-center items-center gap-6 sm:gap-8 md:gap-12 opacity-40 flex-wrap">
          {["Forbes", "GQ", "Vogue", "Bloomberg", "WSJ"].map((brand, index) => (
            <span key={index} className="text-white font-bold text-base sm:text-lg md:text-xl tracking-wider">{brand}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Testimonial;
