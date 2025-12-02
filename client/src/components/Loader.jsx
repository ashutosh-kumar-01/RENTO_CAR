import React from 'react'

const Loader = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[80vh] bg-black'>
      {/* Outer glow ring */}
      <div className="relative">
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
        
        {/* Main spinner */}
        <div className='relative animate-spin rounded-full h-16 w-16 border-4 border-slate-800 border-t-cyan-500 shadow-lg shadow-cyan-500/30'></div>
        
        {/* Inner spinner (counter-rotate) */}
        <div className='absolute inset-2 animate-spin rounded-full h-12 w-12 border-2 border-slate-700 border-b-cyan-400' style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
      </div>
      
      {/* Loading text */}
      <p className="mt-6 text-gray-400 text-sm tracking-widest uppercase animate-pulse">Loading</p>
      
      {/* Animated dots */}
      <div className="flex gap-1 mt-2">
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
      </div>
    </div>
  )
}

export default Loader
