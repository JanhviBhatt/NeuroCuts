'use client'
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return <div>
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <Image src="/login.jpg" alt="login" width={500} height={500} className='w-full object-contain' />
    </div>
    <div className='flex justify-center items-center h-screen'>
    <SignIn/>
    </div>
  </div>
}