import React from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-black'>
      <NavbarOwner />

      <div className='flex flex-1'>
        <Sidebar />
        <div className="flex-1 bg-black">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
