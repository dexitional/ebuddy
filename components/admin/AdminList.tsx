import React, { useEffect, useState } from 'react'
import Photo from '../../public/ucc/logo.png'
import { fetchElectionByActiveCentre, fetchElectionByVoter } from '../../utils/apiClient';
import { useUserStore } from '../../utils/store';

export default function AdminList({page,setPage,setEid }:any) {
    const { admin } = useUserStore((state) => state);
    const [ elections, setElections ] = useState<any>([]);
    const loadElections = async() => {
      const res = await fetchElectionByActiveCentre();
      if(res.success) setElections([...res.data])
    }

    const gotoCentres = () => {
      setPage('centres');
    }

    const gotoVoters = () => {
      setPage('voters');
    }

    const gotoControl = (id: string, name: string) => {
        useUserStore.setState({ eid: id,ename: name })
        setPage('controls');
    }

    useEffect(()=>{
      loadElections()
    },[])
  return (
    <div>
               <h2 className="px-4 py-1 mb-4 bg-slate-100 rounded text-md font-bold text-gray-500">ELECTORAL ADMIN MENUS</h2>
               <div className="flex flex-col sm:flex-wrap sm:flex-row sm:justify-evenly">
                  
                 { ['admin','super'].includes(admin?.role) && (
                  <div className="my-3 p-4 w-full sm:w-80 rounded border border-blue-900">
                      <div className="my-2 flex space-x-2 flex-wrap  items-center justify-center font-bold text-blue-900 text-[11px]">
                        <span className="px-3 py-0.5 rounded-full border-2 border-blue-900">ALL CENTRE-STAGED</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <button onClick={gotoCentres} className="py-4 rounded-b text-white text-lg font-bold bg-blue-900">ELECTIONS</button>
                      </div>
                  </div>
                  )}

                  { ['admin','super'].includes(admin?.role) && (
                  <div className="my-3 p-4 w-full sm:w-80 rounded border border-blue-900">
                      <div className="my-2 flex space-x-2 flex-wrap  items-center justify-center font-bold text-blue-900 text-[11px]">
                        <span className="px-3 py-0.5 rounded-full border-2 border-blue-900">ALL REGISTERED CENTRES</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <button onClick={gotoCentres} className="py-4 rounded-b text-white text-lg font-bold bg-blue-900">USER ACCOUNTS</button>
                      </div>
                  </div>
                  )}
                 
                 
                  { ['admin','super'].includes(admin?.role) && (
                  <div className="my-3 p-4 w-full sm:w-80 rounded border border-blue-900">
                      <div className="my-2 flex space-x-2 flex-wrap  items-center justify-center font-bold text-blue-900 text-[11px]">
                        <span className="px-3 py-0.5 rounded-full border-2 border-blue-900">ALL REGISTERED ELECTION</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <button onClick={gotoCentres} className="py-4 rounded-b text-white text-lg font-bold bg-blue-900">CENTRES</button>
                      </div>
                  </div>
                  )}
                  
                  <div className="my-3 p-4 w-full sm:w-80 rounded border border-blue-900">
                      <div className="my-2 flex space-x-2 flex-wrap  items-center justify-center font-bold text-blue-900 text-[11px]">
                        <span className="px-3 py-0.5 rounded-full border-2 border-blue-900">ALL REGISTERED STUDENT</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <button onClick={gotoVoters} className="py-4 rounded-b text-white text-lg font-bold bg-blue-900">{ ['admin','super'].includes(admin?.role) ? 'VOTERS':'VERIFICATION'}</button>
                      </div>
                  </div>

                  { ['admin','super'].includes(admin?.role) && (
                  <div className="my-3 p-4 w-full sm:w-80 rounded border border-blue-900">
                     <div className="my-2 flex space-x-2 flex-wrap  items-center justify-center font-bold text-blue-900 text-[10px]">
                        { elections.map((row:any) => (
                          <button onClick={() => gotoControl(row.id,row.name)} key={row.id} className="px-3 py-0.5 rounded-full bg-slate-100 border-2 border-blue-900">{row.tag?.toUpperCase()} ELECTION</button>
                          ))
                        }
                      </div>
                      <span className="flex flex-col justify-center">
                        <span className="py-4 rounded-b text-white text-lg text-center font-bold border bg-blue-900 cursor-default">CONTROLS</span>
                      </span>
                  </div>
                   )}

                  { ['admin','super'].includes(admin?.role) && (
                  <div className="my-3 p-4 w-full sm:w-80 rounded border border-blue-900">
                     <div className="my-2 flex space-x-2 flex-wrap  items-center justify-center font-bold text-blue-900 text-[10px]">
                        { elections.map((row:any) => (
                          <button onClick={() => gotoControl(row.id,row.name)} key={row.id} className="px-3 py-0.5 rounded-full bg-slate-100 border-2 border-blue-900">{row.tag?.toUpperCase()} ELECTION</button>
                          ))
                        }
                      </div>
                      <span className="flex flex-col justify-center">
                        <span className="py-4 rounded-b text-white text-lg text-center font-bold border bg-blue-900 cursor-default">PORTFOLIOS</span>
                      </span>
                  </div>
                   )}


                  { ['admin','super'].includes(admin?.role) && (
                  <div className="my-3 p-4 w-full sm:w-80 rounded border border-blue-900">
                     <div className="my-2 flex space-x-2 flex-wrap  items-center justify-center font-bold text-blue-900 text-[10px]">
                        { elections.map((row:any) => (
                          <button onClick={() => gotoControl(row.id,row.name)} key={row.id} className="px-3 py-0.5 rounded-full bg-slate-100 border-2 border-blue-900">{row.tag?.toUpperCase()} ELECTION</button>
                          ))
                        }
                      </div>
                      <span className="flex flex-col justify-center">
                        <span className="py-4 rounded-b text-white text-lg text-center font-bold border bg-blue-900 cursor-default">CANDIDATES</span>
                      </span>
                  </div>
                   )}

                  { ['admin','super'].includes(admin?.role) && (
                  <div className="my-3 p-4 w-full sm:w-80 rounded border border-blue-900">
                      <div className="my-2 flex space-x-2 flex-wrap  items-center justify-center font-bold text-blue-900 text-[10px]">
                         <button onClick={() => null} className="px-3 py-0.5 rounded-full bg-slate-100 border-2 text-blue-900 border-blue-900">LOAD DATA</button>
                         <button onClick={() => null} className="px-3 py-0.5 rounded-full bg-slate-100 border-2 text-green-900 border-green-900">VIEW RESULTS</button>
                         <button onClick={() => null} className="px-3 py-0.5 rounded-full bg-slate-100 border-2 text-red-900 border-red-900">RESET DATA</button>
                         
                      </div>
                      <span className="flex flex-col justify-center">
                        <span className="py-4 rounded-b text-white text-lg text-center font-bold border bg-blue-900 cursor-default">FINAL COALITION</span>
                      </span>
                  </div>
                   )}

                 
                 
                 


                   
                 { /*
                 
                 elections.map((row:any) => (
                  <div key={row.tag} className="p-4 w-full sm:w-80 rounded border ">
                      <div className="p-3 h-48 rounded bg-slate-100 flex items-center justify-center">
                        <img src={`/api/photos/?tag=logo&eid=${row.id}` || Photo.src} className="h-36 object-cover opacity-70 rounded"/>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h2 className="my-2 pt-2 font-semibold text-gray-700 text-sm uppercase text-center">{row?.name}</h2>
                        { !row.vote_status ?
                        <button onClick={()=> gotoElection(row.id,row.name)} className="py-2 rounded text-white text-sm font-bold bg-blue-900">VOTE NOW</button>
                        :<span className="py-2 rounded text-center text-green-900 text-sm font-semibold border border-green-900 overflow-hidden relative">VOTED <span onClick={ ()=>gotoReceipt(row.id,row.name) } className="px-3 cursor-pointer absolute top-0 right-0 h-full border-l border-blue-900 bg-slate-100 text-gray-800 text-[10px] font-bold flex items-center justify-center">BALLOT</span></span>
                        }
                      </div>
                  </div>
                  ))
                */
                }
                </div>
             </div>
  )
}