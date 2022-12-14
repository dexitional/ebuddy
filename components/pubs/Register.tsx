import React, { useEffect, useState } from 'react'
import PagerNew from '../PagerNew'
import Table from '../Table'
import { TbTrashX, TbEdit, TbTruckReturn } from 'react-icons/tb'
import { VscLayersActive,VscDiffAdded,VscDiffRemoved } from 'react-icons/vsc'
import { HiPrinter } from 'react-icons/hi'
import { FcApproval } from 'react-icons/fc'
import { useUserStore } from '../../utils/store'
import Router, { useRouter } from 'next/router'
import { fetchRegister } from '../../utils/apiClient'

const data = [];
export default function Register({setPage }: any) {
  const [ action, setAction ] = useState<any>(null);
  const [ data,setData ] = useState<any>([]);
  const { user, eid, ename } = useUserStore((state) => state);
  const router = useRouter()
  
  const loadRegister = async () => {
    const res  = await fetchRegister(eid)
    console.log(res);
    if(res.success){
      setData(res.data.electors)
      //useUserStore.setState({ receipt: res.data.data })
    }
  }

  useEffect(() => {
    loadRegister()
  },[])
  return (
    <>
    {/*<PagerNew setPage={setPage} result={orders} limit={limit} />*/}
    <Table
        header={
        <div className="gap-y-1 gap-x-2 grid grid-cols-1 sm:grid-cols-7 sm:text-center">
            <span className="col-span-2 text-left">Name of Voter</span>
            <span className="col-span-1">Voter ID</span>
            <span className="col-span-2">Description</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-1">
               <button onClick={()=> setPage('list')} className="p-1 px-2 w-16 inline-block border border-blue-900 bg-slate-50 text-blue-900 text-xs uppercase font-medium rounded"><b>BACK</b></button> 
            </span>
        </div>
        }>

        <div className="gap-y-4 gap-x-2 grid grid-cols-1 sm:grid-cols-7 sm:text-center overflow-scroll max-h-screen">
            { data?.map(( row:any, i:React.Key ) => (
            <React.Fragment key={i}>
            <span className="col-span-2 font-medium text-left">{row.name}</span>
            <span className="col-span-1 font-medium">{row.tag}</span>
            <span className="col-span-2 font-medium"><b className="text-xs">{row.descriptor}</b></span>
            <span className="col-span-1 font-medium sm:pb-0 sm:border-0 pb-4 border-b border-slate-300">{ row.voted == 1 ? 'Voted':'Not Voted' }</span>
            
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                 &nbsp;
               </div>
            </span>
            </React.Fragment>
        ))}
        </div>
    </Table>
    </>
  )
}
