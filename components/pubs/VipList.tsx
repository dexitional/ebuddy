import React, { useEffect, useState } from 'react'
import Photo from '../../public/ucc/logo.png'
import { fetchElectionByActiveCentre, fetchElectionByVoter } from '../../utils/apiClient';
import { useUserStore } from '../../utils/store';

export default function VipList({page,setPage,setEid }:any) {
    const user = useUserStore((state:any) => state.user);
    const [ elections, setElections ] = useState<any>([]);
    const loadElections = async() => {
      const res = await fetchElectionByActiveCentre();
      if(res.success) setElections([...res.data])
    }

    const gotoMonitor = (id:string,name:string) => {
        setPage('monitor');
        useUserStore.setState({ ename: name, eid: id })
    }

    const gotoRegister = (id:string,name:string) => {
        setPage('register');
        useUserStore.setState({ ename: name, eid: id })
    }

    const gotoResult = (id:string,name:string) => {
      setPage('result');
      useUserStore.setState({ ename: name, eid: id })
  }

    const gotoVip = (id:string,name:string) => {
      setPage('vip');
      useUserStore.setState({ ename: name, eid: id })
    }

    useEffect(()=>{
      loadElections()
    },[page])
  return (
    <div className='w-full'>
      <h2 className="px-4 py-1 mb-4 bg-slate-100 rounded text-md font-bold text-gray-500">ACTIVE ELECTIONS</h2>
      <div className="flex flex-col sm:flex-wrap sm:flex-row space-x-6">
        { elections.map((row:any) => (
        <div key={row.tag} className="p-4 w-full sm:w-80 rounded border ">
            <div className="p-3 h-48 rounded bg-slate-100 flex items-center justify-center">
              <img src={`/api/photos/?tag=logo&eid=${row.id}` || Photo.src} className="h-36 object-cover opacity-70 rounded"/>
            </div>
            <div className="flex flex-col justify-center space-y-2">
              <h2 className="my-2 p-2 flex items-center justify-center font-semibold border bg-blue-100 text-gray-800 text-sm uppercase text-center">{row?.name}</h2>
                { row.allow_vip == 1 ? (<button onClick={()=> gotoVip(row.id,row.name)} className="py-2 rounded text-blue-900 text-sm font-medium border border-blue-900">GOTO STRONGROOM</button>): null }
              {/*<span className="py-2 rounded text-center text-green-900 text-sm font-semibold border border-green-900 overflow-hidden relative">VOTED <span onClick={ ()=>gotoReceipt(row.id,row.name) } className="px-3 cursor-pointer absolute top-0 right-0 h-full border-l border-blue-900 bg-slate-100 text-gray-800 text-[10px] font-bold flex items-center justify-center">BALLOT</span></span>*/}
            
            </div>
        </div>
        )) }
      </div>
    </div>
  )
}
