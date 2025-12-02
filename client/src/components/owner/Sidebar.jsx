import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const { user, axios, fetchUser, token } = useAppContext();
    const location = useLocation()
    const [image, setImage] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [showTooltip, setShowTooltip] = useState(null)

    const updateImage = async () => {
        if (!image) return;
        
        try {
            setIsUploading(true)
            const formData = new FormData();
            formData.append("image", image);

            const { data } = await axios.post('/api/owner/update-image', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                fetchUser();
                toast.success(data.message)
                setImage('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-64 w-full border-r border-white/10 text-sm bg-gradient-to-b from-black via-zinc-950 to-black'
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
            </div>

            {/* Profile Section */}
            <motion.div 
                className='relative z-10'
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <label htmlFor="image" className="cursor-pointer group block relative">
                    {/* Animated Ring */}
                    <motion.div 
                        className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"
                        animate={{ 
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: "200% 200%" }}
                    />
                    
                    <img 
                        src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60" } 
                        alt="Profile"  
                        className='relative h-14 md:h-18 w-14 md:w-18 rounded-full mx-auto object-cover border-2 border-black'
                    />
                    <input type="file" id='image' accept='image/*' hidden onChange={e => setImage(e.target.files[0])} />

                    {/* Hover Overlay */}
                    <motion.div 
                        className='absolute inset-0 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                        <motion.svg 
                            className="w-5 h-5 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            whileHover={{ scale: 1.2 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </motion.svg>
                    </motion.div>

                    {/* Online Indicator */}
                    <motion.div 
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-black"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </label>
            </motion.div>

            {/* Save Image Button */}
            <AnimatePresence>
                {image && (
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        onClick={updateImage}
                        disabled={isUploading}
                        className='absolute top-2 right-2 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 z-20'
                    >
                        {isUploading ? (
                            <motion.div 
                                className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        Save
                    </motion.button>
                )}
            </AnimatePresence>

            {/* User Info */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-center relative z-10 max-md:hidden"
            >
                <h3 className='text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                    {user?.name || "Owner"}
                </h3>
                <p className='text-xs text-gray-500 mt-0.5'>{user?.email || ""}</p>
                <motion.div 
                    className="flex items-center justify-center gap-1.5 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Premium Owner
                    </span>
                </motion.div>
            </motion.div>
      
            {/* Navigation Links */}
            <div className='w-full mt-8 relative z-10'>
                {ownerMenuLinks.map((link, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        onMouseEnter={() => setShowTooltip(index)}
                        onMouseLeave={() => setShowTooltip(null)}
                        className="relative"
                    >
                        <NavLink 
                            to={link.path} 
                            className={({ isActive }) => `
                                relative flex items-center gap-3 w-full py-3.5 px-5 transition-all duration-300 group
                                ${isActive 
                                    ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-400' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active Indicator Bar */}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeIndicator"
                                            className='absolute right-0 w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-full shadow-lg shadow-amber-500/50'
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon with glow */}
                                    <motion.div 
                                        className={`relative ${isActive ? '' : 'group-hover:scale-110'}`}
                                        whileHover={{ scale: isActive ? 1 : 1.1 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-amber-500/30 rounded-lg blur-md" />
                                        )}
                                        <img 
                                            src={isActive ? link.coloredIcon : link.icon} 
                                            alt={link.name} 
                                            className={`w-5 h-5 relative ${!isActive ? "invert opacity-60 group-hover:opacity-100" : ""} transition-opacity`} 
                                        />
                                    </motion.div>

                                    <span className='max-md:hidden font-medium'>{link.name}</span>

                                    {/* Hover Arrow */}
                                    <motion.svg 
                                        className={`w-4 h-4 ml-auto max-md:hidden ${isActive ? 'text-amber-400' : 'text-transparent group-hover:text-white/50'} transition-colors`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                        initial={{ x: -5, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                </>
                            )}
                        </NavLink>

                        {/* Mobile Tooltip */}
                        <AnimatePresence>
                            {showTooltip === index && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-lg shadow-lg border border-white/10 whitespace-nowrap md:hidden z-50"
                                >
                                    {link.name}
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-800" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Footer Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='mt-auto pb-6 px-4 w-full max-md:hidden relative z-10'
            >
                <div className='relative p-4 rounded-2xl overflow-hidden'>
                    {/* Card Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-600/5 to-transparent" />
                    <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />
                    
                    {/* Animated Shine */}
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <motion.span 
                                className="text-xl"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                🚗
                            </motion.span>
                            <span className='text-amber-400 text-sm font-bold'>RentoCar</span>
                        </div>
                        <p className='text-gray-400 text-xs leading-relaxed'>
                            Manage your fleet & maximize earnings with our premium tools
                        </p>
                        
                        {/* Mini Stats */}
                        <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
                            <div className="text-center">
                                <p className="text-amber-400 font-bold text-sm">v2.0</p>
                                <p className="text-gray-600 text-[10px]">Version</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    <p className="text-emerald-400 font-bold text-sm">Live</p>
                                </div>
                                <p className="text-gray-600 text-[10px]">Status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Sidebar
