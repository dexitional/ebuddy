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
import { activateVoter, fetchRegister, fetchVoters } from '../../utils/apiClient'
//import Logo from '../../public/loader.gif'

const data = [];
export default function Voters({setPage}: any) {
  const [ action, setAction ] = useState<any>(null);
  const [ data,setData ] = useState<any>([]);
  const [ keyword,setKeyword ] = useState<string>("");
  const [ pg,setPg ] = useState<number>(1);
  
  const { user, eid, ename } = useUserStore((state) => state);
  const router = useRouter()
  
  const loadRegister = async () => {
    const query = keyword ? `?search=${keyword}&page=${pg}`:`?page=${pg}`;
    const res  = await fetchVoters(query)
    if(res.success){
      setData(res.data)
    }else {
      setData([])
    }
  }

  const verifyVoter = async (id:string) => {
    const res  = await activateVoter(id)
    if(res.success){
      Notiflix.Notify.success('VOTER VERIFIFED!');
      loadRegister()
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
    loadRegister()
  },[])
  
  useEffect(() => {
    loadRegister()
  },[keyword])

  return (
    <>
    <PagerNew onChange={onChange} onSubmit={onSubmit} keyword={keyword} count={data.length} />
    <Table
        header={
        <div className="gap-y-1 gap-x-3 grid grid-cols-7 text-center">
            <span className="col-span-2 indent-20 text-left font-semibold">VOTER</span>
            <span className="col-span-2 font-semibold">DESCRIPTOR</span>
            <span className="col-span-1 font-semibold">VERIFIED</span>
            <span className="col-span-1 font-semibold">
              <button onClick={()=> setPage('list')} className="p-1 px-2 w-16 inline-block border-2 border-red-900 bg-slate-50 text-red-900 text-xs uppercase font-medium rounded"><b>BACK</b></button> 
            </span>
        </div>
        }>

        <div className="gap-y-4 gap-x-3 grid grid-cols-7 text-center overflow-scroll max-h-screen">
            { data?.map(( row:any, i:React.Key ) => (
            <React.Fragment key={i}>
            <span className="col-span-2 font-medium text-left flex flex-row space-x-4">
              <a href={`/api/photos/?tag=voter&eid=${row.tag}`} target="_blank  ">
                 <img src={`/api/photos/?tag=voter&eid=${row.tag}`} className="h-10 rounded border" />
              </a>
              <span>{row.name} <em className="block text-blue-900 font-semibold">{row.tag}</em></span>
            </span>
            <span className="col-span-2 font-medium"><b className="text-xs">{row.descriptor}</b></span>
            <span className={`col-span-1 text-center font-bold`}>{ row.verified == 1 ? 'YES':'NO' }</span>
            {/*
            <span className="col-span-1 font-bold text-center">
              { row.approval == 0 && <span className='flex items-center justify-center py-0 p-0.5 rounded border '>{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
              { row.approval == 1 && <span className="flex items-center justify-center py-0 p-0.5 rounded border border-green-600">{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
              { row.approval == 2 && <span className='flex items-center justify-center py-0 p-0.5 rounded border border-yellow-600'>{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
            </span>
            */}
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                   { row.verified == 0 && row.voted == 0 && (<button onClick={() => verifyVoter(row.id)} className='text-[10px] font-semibold flex items-center justify-center px-2 py-0 rounded ring-1 ring-blue-900 bg-blue-900 text-white border border-white '>VERIFY</button>)}
                   { row.verified == 1 && row.voted == 0 && (<span className='flex items-center justify-center px-2 p-0 text-[11px] rounded border border-gray-900 font-bold'>NOT VOTED</span>) }
                   { row.voted == 1 && (<span className='flex items-center justify-center px-2 p-0.5 rounded border border-green-900 font-bold text-xs text-green-900'>VOTED</span>) }
               </div>
            </span>
            </React.Fragment>
        ))}
        </div>
    </Table>
    </>
  )
}
