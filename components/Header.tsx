import Link from 'next/link'
import React from 'react'
import { MdKeyboardArrowDown,MdOutlineMenu } from 'react-icons/md';
import { FcShop } from 'react-icons/fc';
import Dropdown from './Dropdown';
import DropProfile from './DropProfile';
import { useUserStore } from '../utils/store';
import Logo from '../public/ucc/logo.png'

export default function Header() {
  const { user, showSidebar }  = useUserStore((state) => state);
  const setSidebar = () => {
    useUserStore.setState({ showSidebar: !showSidebar })
  }
  
  return (
    <div className="print:hidden w-full h-16 py-3 pl-2 sm:px-10 bg-white border-b-[0.5px] border-solid border-gray-300/80 flex items-center justify-between space-x-2">
        <MdOutlineMenu onClick={setSidebar} className="z-20 sm:hidden rounded-[0.3rem] font-semibold text-slate-400 p-0 px-1 h-10 w-10 border border-slate-300 cursor-pointer"/>
        <Link href="#">
            <div className="w-auto px-4 py-1 flex space-x-2 items-center text-xs sm:text-sm tracking-widest font-bold text-blue-900 bg-white shadow-sm shadow-blue-900 rounded-full cursor-pointer">
               <img src={Logo.src} className="hidden h-4"/>
               <span>ELECTA VOTING SYSTEM</span>
            </div>
        </Link>
        <div className="">
            <Dropdown content={<DropProfile />}>
            <div className="flex space-x-3 items-center py-1.5 px-3 rounded-md border bg-slate-50 sm:border-0 sm:bg-slate-50/90 hover:border hover:bg-slate-50 cursor-pointer">
               <span className="h-[1.65rem] px-[0.55rem] py-1 bg-green-300/90 text-sm font-semibold text-slate-600 rounded-full">E</span>
               <span className="hidden sm:flex font-semibold text-slate-700">{user?.name || 'ADMIN'}</span>
               <MdKeyboardArrowDown className="rounded-[0.3rem] font-semibold text-slate-700 p-0 h-5 w-5 border border-slate-300 "/>
            </div>
            </Dropdown>
        </div>
    </div>
  )
}
