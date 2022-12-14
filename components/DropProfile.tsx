import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import Notiflix from 'notiflix'
import React from 'react'
import { BsPerson,BsGear } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { RiDoorClosedLine } from 'react-icons/ri'
import { Si1Password } from 'react-icons/si'
import { useUserStore } from '../utils/store'


export function IconProfile({ Icon,title,subtitle,url,onClick = null }: any){
    return (
        <div onClick={onClick} className="flex items-center px-4 py-3 space-x-3 cursor-pointer">
            <Icon className="h-6 w-6 text-slate-600" />
            <div>
                <h3 className="text-[0.93rem] text-slate-900">{title}</h3>
                {subtitle && <p className="text-sm text-slate-600 font-normal">{subtitle}</p>}
            </div>
        </div>
    )
}

export default function DropProfile() {
  const router = useRouter()
  const { user } = useUserStore((state) => state);
  
  const logOut = () => {
      const ok = window.confirm("Logout session ? ")
      if(ok){
        const access = user.access;
        if(access == 'voter') router.push('/voterlogin');
        if(access == 'admin') router.push('/adminlogin');
        useUserStore.setState({ user:null })
      }
  }

  const changePwd = async () => {
    var inps = window.prompt('Set New Passsword!');
    if(inps && inps != ''){
       var inps_ = window.prompt('Re-peat New Passsword!');
       try{
          if(inps != inps_) throw('PASSWORD MISMATCH')
          const data = { action:'change', user:user?._id, phone:user?.phone, password: inps }
          const res = await axios.post("/api/account", data);
          if(res.data.success){
            Notiflix.Notify.success('PASSWORD CHANGED!');
            router.push('/login');
            useUserStore.setState({ user:null })
          }
          
       } catch (e){
          console.error(e)
          Notiflix.Notify.failure('PASSWORD CHANGE FAILED!');
       }
    }
    /*
    Notiflix.Confirm.prompt(
        'PASSWORD CHANGER',
        'ENTER NEW PASSWORD',
        'kuukuapos'+new Date().getFullYear(),
        'OK',
        'CANCEL',
        async function okCb(clientAnswer) {
            const data = { action:'change', user:id, phone, password: clientAnswer }
            try{
              const res = await axios.post('/api/account', data);
              alert(res.status)
            } catch (e){
              alert(e)
            }
            
            //JSON.stringify(res);
            //if(res.data.success){
             // Notiflix.Notify.success('PASSWORD CHANGED!');
            //}
            
        },
        function cancelCb(clientAnswer) {
          console.log('Client answer was: ' + clientAnswer);
        },
        {
          // Custom options
        },
      );
      */

  }

  

  return (
    <div className="divide-y divide-slate-200">
        {/*
        <IconProfile Icon={BsPerson} title="Profile" subtitle={`Signed in as ${user?.username}`} url={`/big`} />
        <IconProfile Icon={BsGear} title="User Settings" url={`/big`} />
        <IconProfile Icon={RiDoorClosedLine} title="Close Sales book" url={`/big`} onClick={closeStore}  />
        <IconProfile Icon={Si1Password} title="Change Password" url={`/big`} onClick={changePwd} />
        */}
        <IconProfile Icon={MdLogout} title="Log Out" url={`/big`} onClick={logOut}/>
    </div>
  )
}
