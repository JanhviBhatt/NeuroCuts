'use client'

import { UserProfile } from '@clerk/nextjs'
import Header from '../dashboard/_components/Header'


export default function Home() {
  return (
    <>
    <Header/>
    <div className='flex justify-center items-center h-screen mt-20'>
    <UserProfile/>
    </div>
    </>
  )
}