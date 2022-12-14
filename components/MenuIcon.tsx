import Link from 'next/link'
import React from 'react'

export default function MenuIcon({title,Icon,url}:any) {
  return (
    <Link href={url}>
    <div className="w-26 m-2 cursor-pointer flex flex-col items-center justify-center space-y-2">
        <div className="p-6 w-20 h-20 flex items-center justify-center rounded-lg bg-white border border-slate-300/50 drop-shadow-md">
            <Icon className="w-16 h-16" />
        </div>
        <h3 className="text-[10px] font-semibold text-slate-600 tracking-widest">{title}</h3>
    </div>
    </Link>
  )
}
