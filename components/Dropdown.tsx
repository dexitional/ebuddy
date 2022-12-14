import React, { useState } from 'react'

export default function Dropdown({children,content}: any) {

  const [ show,setShow ] = useState(false);
  return (
    <div className="relative group">
         <div className="z-12" onClick={()=> setShow(!show)}>{children}</div>
         {show && 
         <div onClick={() => setShow(!show)} className={`z-10 absolute top-12 right-1 py-2 w-72 bg-white border border-slate-300/70 rounded-lg`}>
             {content}
         </div>
         }
         <div onClick={() => setShow(false)} className=" hidden z-1 fixed top-0 left-0 w-full h-full"></div>
    </div>
  )
}
