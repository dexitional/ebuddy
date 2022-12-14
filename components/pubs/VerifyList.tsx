import React, { useEffect, useState } from 'react'
import Photo from '../../public/ucc/logo.png'
import { fetchVerifiedByActiveCentre } from '../../utils/apiClient';

export default function VerifyList() {
    const [ verilist, setVerilist ] = useState<any>([]);
    const loadVerified = async() => {
      const res = await fetchVerifiedByActiveCentre();
      if(res.success) { 
        setVerilist([...res.data])
      }else{
        setVerilist([])
      }
    }

    useEffect(()=>{
      const ins = setInterval(() => loadVerified(),5000)
      return ()=>{
        clearInterval(ins)
      }
    },[])
  return (
    <div className="h-screen">
      <h2 className="px-4 py-1 mb-4 flex items-center justify-between bg-slate-100 rounded text-md font-bold text-gray-500">
        <span>VERIFIED VOTERS</span>
        <span className="p-0 px-4 pb-1 rounded-full border-2 bg-slate-50 font-bold text-3xl">{verilist?.length}</span>
        
      </h2>
      <div className="flex flex-col justify-center flex-wrap sm:flex-row space-x-2 ">
        { verilist?.map((row:any) => (
        <div key={row.tag} className="relative p-1 m-1 w-full sm:w-24 rounded border-2 ">
            <div className="sm:w-full sm:h-full rounded flex items-center justify-center">
              <img src={`/api/photos/?tag=voter&eid=${row.tag}` || Photo.src} className="h-44 object-cover opacity-70 rounded"/>
              <h2 className="absolute bottom-0.5 w-full my-2 p-2 flex items-center justify-center text-[9px] font-extrabold bg-blue-300/20 text-blue-900 uppercase text-center drop-shadow-md bg-blur-md">{row?.name}</h2>
            </div>
        </div>
        )) }
      </div>
    </div>
  )
}
