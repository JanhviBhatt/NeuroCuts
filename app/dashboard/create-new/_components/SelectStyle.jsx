import React, { useState } from 'react'
import Image from 'next/image'


const SelectStyle = ({onUserSelect}) => {
     const [selectedOption, setSelectedOption] = useState()
    const styleOptions =[
        {
            name: 'Realistic',
            image:'/assets/Realistic.jpeg'
        },
        {
            name: 'Cartoon',
            image:'/assets/Cartoon.jpeg'
        },
        {
            name: 'Comic',
            image:'/assets/Comic.jpeg'
        },
        {
            name: 'WaterColor',
            image:'/assets/Watercolor.jpeg'
        },
        {
            name: 'GTA',
            image:'/assets/GTA.jpeg'
        },
      
    ]
  return (
    <div className='mt-7'> 
       <h2 className='font-bold text-2xl text-blue-500'>Style</h2>
      <p className='text-gray-500'>Select your video style</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-3'>
        {
            styleOptions.map((style, index) => (
                <div key={index} className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl ${selectedOption === style.name ? 'border-2 border-blue-500' : ''}`}>
                    <Image onClick={()=>{setSelectedOption(style.name); onUserSelect('imageStyle',style.name)}} className='h-48 object-cover rounded-lg w-full' src={style.image} alt={style.name} width={100} height={100} />
                    <h2 className='absolute p-1 bg-black bottom-0 w-full rounded-b-lg text-white'>{style.name}</h2>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default SelectStyle
