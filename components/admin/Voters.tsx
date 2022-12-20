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
import { activateVoter, fetchRegister, fetchVoters, sendToVoter } from '../../utils/apiClient'
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
    const ok = window.confirm("SEND VOTER CREDENTIALS ?")
    if(ok){
      const res  = await sendToVoter(id)
      if(res.success){
        Notiflix.Notify.success('VOTER CRENDENTIALS SENT!');
        loadRegister()
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
        <div className="gap-y-1 gap-x-3 hidden sm:grid grid-cols-7 text-center">
            <span className="col-span-2 indent-20 text-left font-semibold">VOTER</span>
            <span className="col-span-2 font-semibold">PASSWORD</span>
            <span className="col-span-1 font-semibold">VOTE STATUS</span>
            <span className="col-span-1 font-semibold">
              <button onClick={()=> setPage('list')} className="p-1 px-2 w-16 inline-block border-2 border-red-900 bg-slate-50 text-red-900 text-xs uppercase font-medium rounded"><b>BACK</b></button> 
            </span>
        </div>
        }>

        <div className="gap-y-3 sm:gap-y-4 sm:gap-x-3 flex flex-col sm:grid sm:grid-cols-7 text-center overflow-scroll max-h-screen">
            { data?.map(( row:any, i:React.Key ) => (
            <React.Fragment key={i}>
            <div className="col-span-2 font-medium  flex flex-col space-y-1 text-center sm:text-left sm:flex-row space-x-4">
              <span className="flex items-center justify-center sm:hidden w-full rounded bg-slate-100 text-gray-600 sm:indent-20 text-center sm:text-left font-bold">VOTER</span>
              <span>{row.name} <em className="block text-blue-900 font-semibold">{row.tag}</em></span>
            </div>

            <div className="col-span-2 font-medium flex flex-col space-y-1 text-center sm:text-left sm:flex-row space-x-4">
              <span className="flex items-center justify-center sm:hidden w-full rounded bg-slate-100 text-gray-600 font-bold">PASSWORD</span>
              <b className="text-xs italic text-blue-900">{row.password}</b>
            </div>

            <div className={`col-span-1 sm:text-xs font-bold flex flex-col space-y-1 text-center sm:text-left sm:flex-row space-x-4`}>
              <span className="flex items-center justify-center sm:hidden w-full rounded bg-slate-100 text-gray-600  font-bold">VOTE STATUS</span>
              <span className="text-xs font-medium italic">{ row.voted == 1 ? 'VOTED':'NOT VOTED' }</span>
            </div>
           
            <div className="col-span-1 flex flex-col sm:flex-row space-x-4">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                   { row.sms_status == 1000 && (<button onClick={() => verifyVoter(row.id)} className='text-[10px] font-semibold flex items-center justify-center px-2 py-0 rounded ring-1 ring-green-700 bg-green-700 text-white border border-white '>SENT</button>)}
                   { row.sms_status !== 1000 && (<button onClick={() => verifyVoter(row.id)} className='text-[10px] font-semibold flex items-center justify-center px-2 py-0 rounded bg-blue-900 text-white border border-white '>SEND</button>)}
               </div>
            </div>
              <div className="sm:hidden my-2 w-full border-b-2 border-dashed border-blue-900"></div>
            </React.Fragment>
        ))}
        </div>
    </Table>
    </>
  )
}
