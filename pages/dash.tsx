import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import AdminList from '../components/admin/AdminList';
import Centres from '../components/admin/Centres';
import Controls from '../components/admin/Control';
import Voters from '../components/admin/Voters';
import DashLayout from '../components/DashLayout';
import OmegaVoting from '../components/voter/OmegaVoting';
import Receipt from '../components/voter/Receipt';
import VoterList from '../components/voter/VoterList';
import Voting from '../components/voter/Voting';
import VoterLayout from '../components/VoterLayout';
import Photo from '../public/ucc/logo.png'
import { useUserStore } from '../utils/store';

export default function VoterDash() {
  const user = useUserStore((state) => state.user);
  const [ eid, setEid ] = useState<any>(null);
  const [ page, setPage ] = useState<any>('list');
  const router = useRouter();
  
  const logOut = () => {
    const ok = window.confirm("Logout session ? ")
    if(ok){
      router.push('/adminlogin');
      useUserStore.setState({ admin:null })
    }
  }
  const Switcher = () => {
    switch(page){
      case 'list': return <AdminList page={page} setPage={setPage} setEid={setEid} />; break;
      case 'voters': return <Voters setPage={setPage} />; break;
      case 'centres': return <Centres setPage={setPage} />; break;
      case 'controls': return <Controls setPage={setPage} eid={eid} />; break;
      default: return <AdminList setPage={setPage} setEid={setEid} />; break;
    }
  }
  useEffect(()=>{
   
  },[])
  return (
    <DashLayout>
    <h3></h3>
    <div className="w-full flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:justify-center sm:space-x-6">
        <div className="hidden p-2 w-56 rounded border ">
            <div className="p-1 h-48 rounded bg-slate-100 flex items-center justify-center">
               {user && <img src={`/api/photos/?tag=voter&eid=${user?.tag}` || Photo.src} className="h-44 object-cover rounded-md opacity-60 overflow-hidden"/> }
            </div>
            <div>
               <h2 className="my-2 pt-2 font-medium text-gray-700 text-md uppercase">{user?.name}</h2>
               <p className="text-xs text-gray-600 font-medium">{user?.descriptor}</p>
            </div>
            <button onClick={logOut} className="w-full mt-4 py-1 rounded border-2 border-blue-900 text-sm text-blue-900 font-semibold">LOG OUT</button>
        </div>

        <div className="p-4 flex-1 rounded border">
             <Switcher />
        </div>
    </div>
  </DashLayout>
  )
}
