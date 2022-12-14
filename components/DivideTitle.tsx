import React from 'react'

export default function DivideTitle({title}: any) {
  return (
    <div className="my-2 border-b-[0.5px] border-slate-200">
        <h4 className="m-3 text-sm text-slate-600">{title}</h4>
    </div>
  )
}
