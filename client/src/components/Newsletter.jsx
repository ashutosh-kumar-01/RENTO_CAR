import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const sectionRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
      setEmail('')
    }
  }

  return (
    <div 
      ref={sectionRef}
      className="relative py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 bg-black overflow-hidden"
    >
      
      {/* Static Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Static glowing orbs */}
        <div className="absolute top-1/2 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/10 rounded-full blur-[150px] md:blur-[200px] -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-gray-400/10 rounded-full blur-[100px] md:blur-[150px] -translate-y-1/2"></div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-20 sm:w-32 h-20 sm:h-32 border-l-2 border-t-2 border-white/20 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 border-r-2 border-t-2 border-white/20 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-20 sm:w-32 h-20 sm:h-32 border-l-2 border-b-2 border-white/20 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-20 sm:w-32 h-20 sm:h-32 border-r-2 border-b-2 border-white/20 rounded-br-lg"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 md:mb-10 border border-white/30 rounded-full bg-white/5 backdrop-blur-sm"
        >
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></span>
          <span className="text-white text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase">Exclusive Access</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight mb-4 sm:mb-6"
        >
          NEVER MISS A{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
            DEAL
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-xl sm:max-w-2xl mx-auto px-2"
        >
          Subscribe for exclusive offers, early access to new arrivals, and VIP member benefits
        </motion.p>

        {/* Subscription Form */}
        <motion.form 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="relative max-w-xl sm:max-w-2xl mx-auto"
        >
          <div className="relative flex flex-col sm:flex-row items-center p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-full overflow-hidden focus-within:border-white/50 transition-colors">
            
            {/* Input */}
            <div className="flex-1 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 w-full">
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white py-3 sm:py-4 placeholder-gray-500 text-sm sm:text-base w-full"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full sm:w-auto px-6 sm:px-8 md:px-12 py-3 sm:py-4 mt-2 sm:mt-0 bg-gradient-to-r from-white to-gray-400 text-black font-bold rounded-xl sm:rounded-full uppercase tracking-wider text-xs sm:text-sm"
            >
              {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
            </motion.button>
          </div>

          {/* Success message */}
          {isSubscribed && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 sm:-bottom-10 left-0 right-0 text-white text-xs sm:text-sm"
            >
              Welcome to the VIP club! Check your inbox for exclusive offers.
            </motion.p>
          )}
        </motion.form>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-12 sm:mt-14 md:mt-16"
        >
          {[
            { icon: "🎁", text: "Exclusive Offers" },
            { icon: "🚀", text: "Early Access" },
            { icon: "💎", text: "VIP Benefits" },
            { icon: "🔔", text: "New Arrivals" }
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-full hover:border-white/50 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="text-base sm:text-lg md:text-xl">{item.icon}</span>
              <span className="text-gray-300 text-xs sm:text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Trust text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-10 md:mt-12 text-gray-600 text-[10px] sm:text-xs"
        >
          Join 15,000+ subscribers • Unsubscribe anytime • No spam, ever
        </motion.p>
      </div>

      {/* Static decorative lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  )
}

export default Newsletter
