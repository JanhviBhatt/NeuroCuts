import Link from 'next/link'
import React from 'react'

const EmptyState = () => {
  return (
    <div className='p-5 py-24 flex items-center flex-col mt-10 border-2 border-dasehed'>
      <h2>You don't have any short video created</h2>
      <Link href={'/dashboard/create-new'}>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5'>
        Create New Short Video
        </button></Link>
    </div>
  )
}

export default EmptyState
