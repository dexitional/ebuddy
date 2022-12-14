import React from 'react'

export default function PageHeader({title,Icon}: any) {
  return (
    <div className="print:hidden w-full h-24 px-6 py-4 flex items-center bg-white border-b-[0.5px] border-slate-200">
        <div className="flex items-center space-x-4">
            <Icon className="w-10 h-10 p-1 rounded-md bg-slate-100/60" />
            <h3 className="text-2xl font-bold text-slate-600">{title}</h3>
        </div>
    </div>
  )
}
