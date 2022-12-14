import React, { useEffect, useState } from 'react'
import PagerNew from '../PagerNew'
import Table from '../Table'
import { TbTrashX, TbEdit, TbTruckReturn } from 'react-icons/tb'
import { VscLayersActive,VscDiffAdded,VscDiffRemoved } from 'react-icons/vsc'
import { HiPrinter } from 'react-icons/hi'
import { FcApproval } from 'react-icons/fc'
import { useUserStore } from '../../utils/store'
import axios from 'axios';
import Router, { useRouter } from 'next/router'
import Notiflix from 'notiflix'
import moment from 'moment'
import { fetchElectionDataById, saveAction } from '../../utils/apiClient'
import On from '../../public/on.png'
import Off from '../../public/off.png'
//import Logo from '../../public/loader.gif'

export default function Controls({setPage}: any) {
  const [ data,setData ] = useState<any>({});
  const [ form,setForm ] = useState<any>({});
  const [ keyword,setKeyword ] = useState<string>("");
  const { admin, eid, ename } = useUserStore((state) => state);
  const router = useRouter()
  
  const loadControls = async () => {
    const res  = await fetchElectionDataById(eid)
    console.log(res);
    if(res.success){
      setData(res.data.election[0])
    }
  }

  const saveControl = async () => {
    const dt = { id:eid, data: form }
    const res  = await saveAction(dt)
    console.log(res);
    if(res.success){
      loadControls()
    }
  }

  const action = async (tag:string,value: number) => {
       setForm({ ...form, [tag]:value})
  }


  useEffect(() => {
    loadControls()
  },[])

  useEffect(() => {
    //console.log(form)
    saveControl()
  },[form])

  return (
    <>
    <Table
        header={
        <div className="gap-y-1 gap-x-3 grid grid-cols-4 text-center">
            <span className="col-span-3 text-left text-xl font-bold">{ename.toUpperCase()}</span>
            <span className="col-span-1 font-semibold">
               <button onClick={()=> setPage('list')} className="p-1 px-2 w-16 inline-block border border-blue-900 bg-slate-50 text-blue-900 text-xs uppercase font-medium rounded"><b>BACK</b></button> 
            </span>
        </div>
        }>

        <div className="gap-y-4 gap-x-3 grid grid-cols-4 text-center max-h-screen">
            <React.Fragment>
            <span className="col-span-2 font-medium text-left text-lg self-center">ELECTION PROCESS</span>
            <span className={`col-span-1 text-center font-bold`}></span>
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                  { data.live_status == 1 ? 
                     <img src={On.src} onClick={()=> action('live_status',0)} className="h-12 cursor-pointer" /> 
                    :<img src={Off.src} onClick={()=> action('live_status',1)} className="h-12 cursor-pointer" /> 
                  }
               </div>
            </span>
            </React.Fragment>
            <React.Fragment>
            <span className="col-span-2 font-medium text-left text-lg self-center">PUBLIC MONITOR</span>
            <span className={`col-span-1 text-center font-bold`}></span>
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                  { data.allow_monitor == 1 ? 
                     <img src={On.src} onClick={()=> action('allow_monitor',0)} className="h-12 cursor-pointer" /> 
                    :<img src={Off.src} onClick={()=> action('allow_monitor',1)} className="h-12 cursor-pointer" /> 
                  }
               </div>
            </span>
            </React.Fragment>
            <React.Fragment>
            <span className="col-span-2 font-medium text-left text-lg self-center">STRONGROOM</span>
            <span className={`col-span-1 text-center font-bold`}></span>
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                  { data.allow_vip == 1 ? 
                     <img src={On.src} onClick={()=> action('allow_vip',0)} className="h-12 cursor-pointer" /> 
                    :<img src={Off.src} onClick={()=> action('allow_vip',1)} className="h-12 cursor-pointer" /> 
                  }
               </div>
            </span>
            </React.Fragment>
            <React.Fragment>
            <span className="col-span-2 font-medium text-left text-lg self-center">ELECTION RESULTS</span>
            <span className={`col-span-1 text-center font-bold`}></span>
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                  { data.allow_result == 1 ? 
                     <img src={On.src} onClick={()=> action('allow_result',0)} className="h-12 cursor-pointer" /> 
                    :<img src={Off.src} onClick={()=> action('allow_result',1)} className="h-12 cursor-pointer" /> 
                  }
               </div>
            </span>
            </React.Fragment>
            <React.Fragment>
            <span className="col-span-2 font-medium text-left text-lg self-center">ELECTION DATA</span>
            <span className={`col-span-1 text-center font-bold`}></span>
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
               <button onClick={()=> setPage('list')} className="p-1 px-2 w-16 inline-block border border-blue-900 bg-slate-50 text-blue-900 text-xs uppercase font-medium rounded"><b>EXPORT</b></button> 
               </div>
            </span>
            </React.Fragment>
           
        </div>
    </Table>
    </>
  )
}
