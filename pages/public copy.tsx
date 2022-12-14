import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout';
import Monitor from '../components/pubs/Monitor';
import PublicList from '../components/pubs/PublicList';
import Result from '../components/pubs/Result';
import Strongroom from '../components/pubs/Strongroom';
import Photo from '../public/ucc/logo.png'
import { fetchElectionByVoter } from '../utils/apiClient';
import { useUserStore } from '../utils/store';
import Register from '../components/pubs/Register';
import VerifyList from '../components/pubs/VerifyList';

export default function Public() {
  const user = useUserStore((state) => state.user);
  const [ eid, setEid ] = useState<any>(null);
  const [ page, setPage ] = useState<any>('list');
  const router = useRouter();
  
  const logOut = () => {
    const ok = window.confirm("Logout session ? ")
    if(ok){
      const access = user.access;
      if(access == 'voter') router.push('/voterlogin');
      useUserStore.setState({ user:null })
    }
  }
  const Switcher = () => {
    switch(page){
      case 'list': return <PublicList page={page} setPage={setPage} setEid={setEid} />; break;
      case 'monitor': return <Monitor setPage={setPage} />; break;
      case 'vip': return <Strongroom setPage={setPage} />; break;
      case 'result': return <Result setPage={setPage} />; break;
      case 'register': return <Register setPage={setPage} />; break;
      default: return <PublicList page={page} setPage={setPage} setEid={setEid} />; break;
    }
  }
  useEffect(()=>{
   
  },[])
  return (
    <PublicLayout>
    <h3 className="rounded-full mb-4 px-10 py-1 bg-slate-100 text-xl text-gray-500 font-semibold tracking-widest">PUBLIC MONITOR</h3>
    <div className="flex flex-row ">
      <div className="w-[50%] ">
        <div className="p-4 rounded border  overflow-scroll">
          <VerifyList />
        </div>
      </div>
      <div className="w-[50%] flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:justify-center sm:space-x-0">
          <div className="hidden p-4 w-80 rounded border ">
              <div className="p-3 h-48 rounded bg-slate-50/90 flex flex-col items-center justify-center space-y-1">
                <div className="py-1.5 px-2 flex space-x-4 rounded bg-white border ">
                    <img src={Photo.src}  className="h-10" />
                    <div>
                      <h3 className="text-xs font-semibold text-gray-600">JOHN KUMAH</h3>
                      <p className="text-[9px] font-semibold text-gray-500">BSC. ANTONOMY, LEVEL 100, ADEHYE HALL</p>
                    </div>
                </div>
                <div className="py-1.5 px-2 flex space-x-4 rounded bg-white border ">
                    <img src={Photo.src}  className="h-10" />
                    <div>
                      <h3 className="text-xs font-semibold text-gray-600">JOHN KUMAH</h3>
                      <p className="text-[9px] font-semibold text-gray-500">BSC. ANTONOMY, LEVEL 100, ADEHYE HALL</p>
                    </div>
                </div>
              </div>
              <button className="w-full mt-4 py-1 rounded border-2 border-blue-900 text-sm text-blue-900 font-semibold">VERIFIED VOTERS: 34</button>
          </div>

          <div className="p-4 flex-1 rounded border">
              <Switcher />
          </div>
      </div>
    </div>
  </PublicLayout>
  )
}
