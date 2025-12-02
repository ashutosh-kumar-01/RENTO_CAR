import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {


    const {user }= useAppContext();

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-300 border-b border-slate-800 bg-black relative transition-all'>
        <Link to='/' className="group flex items-center gap-2">
            {/* Logo Icon */}
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
            </div>
            {/* Logo Text */}
            <div className="flex items-center">
                <span className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors">Rento</span>
                <span className="text-xl font-bold text-amber-500 group-hover:text-amber-400 transition-colors">Car</span>
            </div>
        </Link>
        <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-400">Welcome, <span className="text-white font-medium">{user?.name || "Owner"}</span></p>
        </div>
    </div>
  )
}

export default NavbarOwner
