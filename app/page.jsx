'use client'
import { SignIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Home() {
  const user = useUser()
  const router = useRouter()
  useEffect(()=>{
    if(user){
      router.push('/dashboard')
    }
  },[user,router])
  return (
    <div className="flex flex-col items-center justify-center ">
      <SignIn/>
    </div>
  );
}
