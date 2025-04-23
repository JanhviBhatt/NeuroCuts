'use client'
import React from 'react'
import {CircleUser, FileVideo, PanelsTopLeft} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SideNav = () => {
    const MenuOption=[
        {
            id:1,
            name:'Dashboard',
            path:'/dashboard',
            icon:PanelsTopLeft
        },
        {
            id:2,
            name:'Create New',
            path:'/dashboard/create-new',
            icon:FileVideo
        },
   
        {
            id:3,
            name:'Account',
            path:'/account',
            icon:CircleUser
        },
    ]
    const path = usePathname();
    

  return (
    <div className='w-64 h-screen shadow-md p-5'>
      <div className='grid gap-3'>
        {MenuOption.map((item)=>(
          <Link key={item.id}  href={item.path}>
            <div className={`flex items-center gap-3 p-3 hover:bg-blue-500 hover:text-white rounded-md cursor-pointer ${path === item.path && 'bg-blue-500 text-white'}`}>
                <item.icon/>
                <h2>{item.name}</h2>
            </div>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default SideNav
