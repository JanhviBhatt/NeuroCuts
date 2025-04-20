'use client'
import React, { useState } from 'react'
import EmptyState from './_components/EmptyState'
import Link from 'next/link';

const Dashbaord = () => {
  const [videoList,setVideoList] = useState([]);
  return (
    <div>
      <div className="flex justify-between items-center py-10">
        <h2 className="font-bold text-2xl text-blue-500">Dashboard</h2>
        <Link href={'/dashboard/create-new'}>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5'>
        + Create New
        </button></Link>
    
      </div>
      {/* Empty State */}
      {videoList?.length==0 && <div>
        <EmptyState/>
      </div>}
    </div>
  )
}

export default Dashbaord
