'use client'
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import Image from 'next/image'

const CustomLoading = ({loading}) => {
  return (
    <AlertDialog open={loading}>
  <AlertDialogContent className='bg-white'>
    <AlertDialogTitle></AlertDialogTitle>
   <div className='bg-white flex flex-xol items-center my-10 justify-center'>
    <Image src='/load-time.gif' alt='loading' width={100} height={100}/>
    <h2>Generating your video :D</h2>
   </div>
  </AlertDialogContent>
</AlertDialog>

  )
}

export default CustomLoading
