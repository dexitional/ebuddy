import React from 'react'

export default function Table({ header,children,num = 6 }:any) {
  return (
    <div className="flex flex-col space-y-3">
        <div className={`py-1 px-3 rounded-md bg-slate-50 text-sm text-gray-500`}>
            {header}
        </div>
        <div className={`py-1 px-3 rounded-md text-sm text-gray-700`}>
          {children}
        </div>
    </div>
  )
}
