'use client'
import React, { useEffect, useState } from 'react'
import EmptyState from './_components/EmptyState'
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { db } from '@/configs/db';
import { VideoData } from '@/configs/db/schema';
import { useUser } from '@clerk/nextjs';
import VideoList from './_components/VideoList';


const Dashbaord = () => {
  const [videoList,setVideoList] = useState([]);
  const {user} = useUser()
  useEffect(()=>{
    user&&GetVideoList()
  },[user])
  const GetVideoList=async()=>{
    const result = await db.select().from(VideoData).where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress))
    console.log(result)
    setVideoList(result)
  }
  return (
    <div>
      <div className="flex justify-between items-center py-10">
        <h2 className="font-bold text-2xl text-blue-500">Dashboard</h2>
        <Link href={'/dashboard/create-new'}>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 cursor-pointer'>
        + Create New
        </button></Link>
    
      </div>
      {/* Empty State */}
      {videoList?.length==0 && <div>
        <EmptyState/>
      </div>}

  {/*List of videos */}
  <VideoList videoList={videoList}/>

    </div>
  )
}

export default Dashbaord
