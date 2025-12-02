import React from 'react'

const Title = ({ title, subTitle, align }) => {
  return (
    <div className={`flex flex-col justify-center items-center text-center ${align === "left" && " md:items-start md:text-left"}`}>
      <h1 className='font-black text-4xl md:text-5xl text-white tracking-tight'>{title}</h1>
      <p className='text-sm md:text-base text-gray-500 mt-3 max-w-156'>{subTitle}</p>
    </div>
  )
}

export default Title
