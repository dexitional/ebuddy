import React, { useEffect, useState } from 'react'
import PagerNew from '../PagerNew'
import Table from '../Table'
import { TbTrashX, TbPlus, TbTruckReturn } from 'react-icons/tb'
import { VscLayersActive,VscDiffAdded,VscDiffRemoved } from 'react-icons/vsc'
import { HiPrinter } from 'react-icons/hi'
import { FcApproval } from 'react-icons/fc'
import { useUserStore } from '../../utils/store'
import axios from 'axios';
import Router, { useRouter } from 'next/router'
import Notiflix from 'notiflix'
import moment from 'moment'
import { activateCentre, fetchCentres, fetchRegister, fetchVoters, loadCentre, loadPhoto, resetCentreElections, sendCredentials, setupVoters } from '../../utils/apiClient'
//import Logo from '../../public/loader.gif'

const data = [];
export default function Centres({setPage}: any) {
  const [ action, setAction ] = useState<any>(null);
  const [ data,setData ] = useState<any>([]);
  const [ keyword,setKeyword ] = useState<string>("");
  const [ activity,setActivity ] = useState<any>({})
  const { user, eid, ename } = useUserStore((state) => state);
  const router = useRouter()
  
  const loadCentres = async () => {
    const res  = await fetchCentres()
    console.log(res)
    if(res.success){
      setData(res.data)
    }
  }

  const loadVoters = async (id:string) => {
    setActivity({...activity, [id]:true })
    try{
      const res  = await loadCentre(id)
      console.log(res)
      if(res.success){
        Notiflix.Notify.success('VOTERS DATA STAGED FOR CENTRE!');
        setActivity({...activity, [id]:false })
      }
    } catch(e){
      setActivity({...activity, [id]:false })
    }
  }

  const loadPhotos = async (id:string) => {
    setActivity({...activity, [id]:true })
    try{
      const res  = await loadPhoto(id)
      console.log(res)
      if(res.success){
        Notiflix.Notify.success('PHOTOS STAGED FOR CENTRE!');
        setActivity({...activity, [id]:false })
      }
    } catch(e){
      setActivity({...activity, [id]:false })
    }
  }

  const addElection = async (id:string) => {
    const res  = await setupVoters(id)
    if(res.success){
      loadCentres()
    }
  }

  const setCentre = async (id:string) => {
    const res  = await activateCentre(id)
    if(res.success){
      Notiflix.Notify.success('CENTRE ACTIVATED!');
      loadCentres()
    }
  }

  const resetElections = async (id:string) => {
    const ok = window.confirm("RESET ALL THIS CENTRE ELECTIONS ?")
    if(ok){
      const res  = await resetCentreElections(id)
      if(res.success){
        Notiflix.Notify.success('CENTRE ELECTIONS RESET!');
        loadCentres()
      }
    }
  }

  
  const sendData = async (id:string) => {
    const ok = window.confirm("SEND VOTERS CREDENTIALS ?")
    if(ok){
      const res  = await sendCredentials(id)
      if(res.success){
        Notiflix.Notify.success('CRENDENTIALS SENT !');
        loadCentres()
      }
    }
  }

  

  const onChange = (e:any) => {
    e.preventDefault();
    setKeyword(e.target.value)
  }

  const onSubmit = (e:any) => {
    e.preventDefault();
    setKeyword(e.target.value)
  }

  useEffect(() => {
    loadCentres()
  },[])

  return (
    <>
    <PagerNew onChange={onChange} onSubmit={onSubmit} keyword={keyword} count={data.length}  />
    <Table
        header={
        <div className="gap-y-1 gap-x-3 grid grid-cols-4 text-center">
            <span className="col-span-2 text-left font-semibold">NAME</span>
            <span className="col-span-1 font-semibold">DEFAULT</span>
            <span className="col-span-1 font-semibold">
               <button onClick={()=> setPage('list')} className="p-1 px-2 w-16 inline-block border border-blue-900 bg-slate-50 text-blue-900 text-xs uppercase font-medium rounded"><b>BACK</b></button> 
            </span>
        </div>
        }>

        <div className="gap-y-4 gap-x-3 grid grid-cols-4 text-center overflow-scroll-y max-h-screen">
            { data?.filter((r:any) => r.name.toLowerCase().includes(keyword.toLowerCase()) || r.tag.toLowerCase().includes(keyword.toLowerCase()))?.map(( row:any, i:React.Key ) => (
            <React.Fragment key={i}>
            <span className="col-span-2 font-bold text-left flex flex-row space-x-4">
              <a href={`/api/photos/?tag=centre&eid=${row.tag}`} target="_blank  ">
                 <img src={`/api/photos/?tag=centre&eid=${row.tag}`} className="h-10 rounded border" />
              </a>
              <span>{row.name} ELECTION CENTRE <em className="block text-blue-900 font-semibold">{row.tag}</em></span>
            </span>
            <span className={`${row.default == 1 && 'text-lg text-green-600 rounded  flex items-center justify-center'} col-span-1 text-center font-bold`}>{ row.default == 1 ? 'YES':'NO' }</span>
            {/*
            <span className="col-span-1 font-bold text-center">
              { row.approval == 0 && <span className='flex items-center justify-center py-0 p-0.5 rounded border '>{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
              { row.approval == 1 && <span className="flex items-center justify-center py-0 p-0.5 rounded border border-green-600">{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
              { row.approval == 2 && <span className='flex items-center justify-center py-0 p-0.5 rounded border border-yellow-600'>{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
            </span>
            */}
            <span className="col-span-1 flex items-center justify-center">
               <div className="flex items-center justify-center space-x-1 flex-wrap sm:flex-nowrap">
                   { row.default == 0 && (<button onClick={() => setCentre(row.id)} className='text-[10px] font-semibold flex items-center justify-center px-2 py-0 rounded ring-1 ring-slate-600 bg-slate-600 text-white border border-white'>SET ACTIVE</button>)}
                   { row.default == 1 && (<span className='flex items-center justify-center px-2 p-0.5 rounded border border-green-900 font-bold text-[10px] text-green-900'>ACTIVE</span>) }
                   {/*
                   <button onClick={() => loadVoters(row.id)} className='text-[10px] font-semibold flex items-center justify-center px-2 py-0 rounded-sm ring-1 ring-slate-500 bg-slate-500 text-white border border-white'>{ !activity[row.id] ? 'LOAD':'STAGING...'}</button>
                   <button onClick={() => loadPhotos(row.id)} className='text-[10px] font-semibold flex items-center justify-center px-2 py-0 rounded-sm ring-1 ring-slate-500 bg-slate-500 text-white border border-white'><TbPlus className="font-bold" /><span>PHOTO</span></button>
                   */}
                   <button onClick={() => sendData(row.id)} className='text-[10px] font-bold flex items-center justify-center px-2 py-0 rounded-sm ring-1 ring-yellow-700 bg-yellow-700 text-white border border-white'><span>SEND DATA</span></button>
                   <button onClick={() => resetElections(row.id)} className='text-[10px] font-bold flex items-center justify-center px-2 py-0 rounded-sm ring-1 ring-red-700 bg-red-700 text-white border border-white'><span>RESET</span></button>
                   
               </div>
            </span>
            </React.Fragment>
        ))}
        </div>
    </Table>
    </>
  )
}
