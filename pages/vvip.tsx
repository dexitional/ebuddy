import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout';
import Monitor from '../components/pubs/Monitor';
import PublicList from '../components/pubs/PublicList';
import Result from '../components/pubs/Result';
import Strongroom from '../components/pubs/Strongroom';
import Photo from '../public/ucc/logo.png'
import { fetchElectionByActiveCentre, fetchElectionByVoter } from '../utils/apiClient';
import { useUserStore } from '../utils/store';
import Register from '../components/pubs/Register';
import VerifyList from '../components/pubs/VerifyList';
import VipList from '../components/pubs/VipList';

export default function Vvip() {
  const user = useUserStore((state) => state.user);
  const [ eid, setEid ] = useState<any>(null);
  const [ page, setPage ] = useState<any>('list');
  const router = useRouter();
  const [ elections, setElections ] = useState<any>([]);
  const loadElections = async() => {
    const res = await fetchElectionByActiveCentre();
    if(res.success) setElections([...res.data])
  }

  const logOut = () => {
    const ok = window.confirm("Logout session ? ")
    if(ok){
      const access = user.access;
      if(access == 'voter') router.push('/voterlogin');
      useUserStore.setState({ user:null })
    }
  }
  
  useEffect(()=>{
    loadElections()
  },[])
  return (
    <PublicLayout>
    <h3 className="rounded-full mb-4 px-10 py-1 bg-slate-100 text-xl text-gray-500 font-semibold tracking-widest">STRONGROOM MONITOR</h3>
    <div className="flex flex-row">
      { elections?.map((row:any) => (
      <div key={row.id} className="w-[100%] flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:justify-center sm:space-x-0">
          <div className="p-4 flex-1 rounded border">
            <Strongroom setPage={setPage} eid={row.id} ename={row.name} logo={row.id}  />
          </div>
      </div>
        ))
      }
    </div>
  </PublicLayout>
  )
}
