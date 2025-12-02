import React from 'react'

const Title = ({ title, subTitle}) => {
  return (
    <div className="mb-4">
      <h1 className='font-bold text-2xl md:text-3xl text-white tracking-tight'>
        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{title}</span>
      </h1>
      <p className='text-sm md:text-base text-gray-500 mt-2 max-w-xl leading-relaxed'>{subTitle}</p>
    </div>
  )
}

export default Title
