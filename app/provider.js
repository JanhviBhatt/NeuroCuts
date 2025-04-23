'use client'
import React, { useEffect } from 'react'
import { eq } from 'drizzle-orm';
import { db } from '@/configs/db';
import {Users} from '@/configs/db/schema';
import { useUser } from '@clerk/nextjs';

const Provider = ({children}) => {

  const {user} = useUser();
  useEffect(()=>{
    if(user) isNewUser();
  },[user])

  const isNewUser = async()=>{

     {/*Checking the user*/}
    const result = await db.select().from(Users).where(eq(Users.email,user?.primaryEmailAddress?.emailAddress));

    console.log(result);
    {/*If the user is not there creating new user*/}
  if(!result[0])
    {
      await db.insert(Users).values({
        name:user.fullName,
      email:user?.primaryEmailAddress?.emailAddress,
    imageUrl:user?.imageUrl })
    }
  }

  

  return (
    <div>
      {children}
    </div>
  )
}

export default Provider
