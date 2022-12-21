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
import { fetchElectionDataById, saveAction, syncData } from '../../utils/apiClient'
import On from '../../public/on.png'
import Off from '../../public/off.png'
import Link from 'next/link'
//import Logo from '../../public/loader.gif'

export default function Controls({setPage}: any) {
  const [ data,setData ] = useState<any>({});
  const [ form,setForm ] = useState<any>({});
  const [ keyword,setKeyword ] = useState<string>("");
  const [ syncing,setSyncing ] = useState<any>(false);
  const { admin, eid, ename } = useUserStore((state) => state);
  const router = useRouter()
  
  const loadControls = async () => {
    const res  = await fetchElectionDataById(eid)
    if(res.success){
      setData(res.data.election[0])
    }
  }

  const sync = async (eid:any) => {
   setSyncing(true)
   const res  = await syncData(eid)
   if(res.success){
     setSyncing(false)
     Notiflix.Notify.success('VOTER TRANSCRIPT SYNCED!');
   }else{
     setSyncing(false)
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
    saveControl()
  },[form])

  return (
    <>
    <Table
        header={
        <div className="gap-y-1 sm:gap-x-3 grid sm:grid-cols-4 text-center">
            <span className="sm:col-span-3 text-center text-base sm:text-left sm:text-xl font-bold">{ename.toUpperCase()}</span>
            <span className="sm:col-span-1 font-semibold">
               <button onClick={()=> setPage('list')} className="p-1 px-2 w-4/5 sm:w-16 inline-block border border-blue-900 bg-slate-50 text-blue-900 text-xs uppercase font-medium rounded"><b>BACK</b></button> 
            </span>
        </div>
        }>
         <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6">
            <div className="px-4 py-4 sm:py-0 flex-1 border rounded gap-y-4 gap-x-3 grid grid-cols-4 text-center max-h-screen">
                  <React.Fragment>
                  <span className="col-span-2 font-medium text-left text-sm sm:text-lg self-center">ELECTION PROCESS</span>
                  <span className={`col-span-1 text-center font-bold`}></span>
                  <span className="col-span-1">
                     <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                        { data.live_status == 1 ? 
                           <img src={On.src} onClick={()=> action('live_status',0)} className="h-8 sm:h-12 cursor-pointer" /> 
                        :<img src={Off.src} onClick={()=> action('live_status',1)} className="h-8 sm:h-12 cursor-pointer" /> 
                        }
                     </div>
                  </span>
                  </React.Fragment>
                  <React.Fragment>
                  <span className="col-span-2 font-medium text-left text-sm sm:text-lg self-center">PUBLIC MONITOR</span>
                  <span className={`col-span-1 text-center font-bold`}></span>
                  <span className="col-span-1">
                     <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                        { data.allow_monitor == 1 ? 
                           <img src={On.src} onClick={()=> action('allow_monitor',0)} className="h-8 sm:h-12 cursor-pointer" /> 
                        :<img src={Off.src} onClick={()=> action('allow_monitor',1)} className="h-8 sm:h-12 cursor-pointer" /> 
                        }
                     </div>
                  </span>
                  </React.Fragment>
                  <React.Fragment>
                  <span className="col-span-2 font-medium text-left text-sm sm:text-lg self-center">STRONGROOM</span>
                  <span className={`col-span-1 text-center font-bold`}></span>
                  <span className="col-span-1">
                     <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                        { data.allow_vip == 1 ? 
                           <img src={On.src} onClick={()=> action('allow_vip',0)} className="h-8 sm:h-12 cursor-pointer" /> 
                        :<img src={Off.src} onClick={()=> action('allow_vip',1)} className="h-8 sm:h-12 cursor-pointer" /> 
                        }
                     </div>
                  </span>
                  </React.Fragment>
                  <React.Fragment>
                  <span className="col-span-2 font-medium text-left text-sm sm:text-lg self-center">ELECTION RESULTS</span>
                  <span className={`col-span-1 text-center font-bold`}></span>
                  <span className="col-span-1">
                     <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                        { data.allow_result == 1 ? 
                           <img src={On.src} onClick={()=> action('allow_result',0)} className="h-8 sm:h-12 cursor-pointer" /> 
                        :<img src={Off.src} onClick={()=> action('allow_result',1)} className="h-8 sm:h-12 cursor-pointer" /> 
                        }
                     </div>
                  </span>
                  </React.Fragment>
            </div>

            <div className="p-4 flex-1 border rounded text-center max-h-screen">
                 <React.Fragment>
                  <div className="cols-span-2">
                     <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                     <button onClick={()=> setPage('list')} className="w-4/5 p-1 px-2 inline-block border border-blue-900 bg-slate-50 text-blue-900 text-xs uppercase font-medium rounded"><b>ELECTION CONTROL CENTER</b></button> 
                     </div>
                  </div>
                  <div className="cols-span-2 flex space-x-2 items-center justify-center">
                  { data.allow_monitor == 1 ? <Link href="/public"><span className="p-0.5 px-1 mt-4 rounded border text-[10px] font-semibold text-center text-blue-900/90 hover:underline border-blue-900/90 cursor-pointer">MONITOR ELECTIONS</span></Link> :null}
                  { data.allow_vip == 1 ? <Link href="/vvip"><span className="p-0.5 px-1 mt-4 rounded border text-[10px] font-semibold text-center text-blue-900/90 hover:underline border-blue-900/90 cursor-pointer">VIEW STRONG ROOM</span></Link>:null }
                  { data.allow_result == 1 ? <Link href="/result"><span className="p-0.5 px-1 mt-4 rounded border text-[10px] font-semibold text-center text-blue-900/90 hover:underline border-blue-900/90 cursor-pointer">VIEW FINAL RESULTS</span></Link> : null }
                  { data.live_status == 1 ? !syncing ? (<button onClick={() => sync(data.id)}><div className="p-0.5 px-1 mt-4 rounded border text-[10px] font-semibold text-center text-blue-900/90 hover:underline border-blue-900/90 cursor-pointer">SYNC VOTER TRANSCRIPTS </div></button>): (<button><div className="p-0.5 px-2 mt-4 flex items-center space-x-3 rounded border text-[10px] font-semibold text-center text-blue-900/90 hover:underline border-blue-900/90 cursor-pointer"><img src="/loaderm.gif" className="h-4" /><span>SYNCING ...</span></div></button>) : null }
                  </div>
                  </React.Fragment>
               
            </div>
         </div>
    </Table>
    </>
  )
}
