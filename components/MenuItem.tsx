import Link from 'next/link'
import React from 'react'

export default function MenuItem({Icon,title,url,active}:any) {
  return (
    <Link href={url}>
    <div className={`${active && 'bg-gray-200/50'} hover:bg-gray-200/50  mx-2 py-2 px-5 flex items-center space-x-4 rounded-md cursor-pointer`}>
        <Icon className="h-6 w-6" />
        {active}
        <h3 className="text-gray-900 text-[0.95rem] font-medium">{title}</h3>
    </div>
    </Link>
  )
}
