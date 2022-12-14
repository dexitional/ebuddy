import React, { useEffect } from 'react'
import Footer from './Footer'
import Header from './Header'
import LoadIcon from './LoadIcon'
import PageHeader from './PageHeader'
import SideMenu from './SideMenu'
import {FcHome,FcBarChart,FcViewDetails,FcSupport,FcUnlock,FcShipped,FcSafe,FcMoneyTransfer,FcFilingCabinet,FcDepartment,FcDebt,FcConferenceCall,FcCurrencyExchange,FcFactory,FcPaid} from 'react-icons/fc'
import { useRouter } from 'next/router'
import { useUserStore } from '../utils/store'

export default function Layout({ children,title }: any) {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    useEffect(() => {
       if(!user) router.push('/login');
    },[])
    

    const getIcon = () => {
        switch(title?.toLowerCase()){
          case 'home': return FcHome; break;
          case 'pos': return FcPaid; break;
          case 'product': return FcFilingCabinet; break;
          case 'stock': return FcShipped; break;
          case 'stock log': return FcSafe; break;
          case 'warehouse stock': return FcFactory; break;
          case 'daily sale': return FcMoneyTransfer; break;
          case 'complete sale': return FcMoneyTransfer; break;
          case 'credit sale': return FcCurrencyExchange; break;
          case 'return sale': return FcDebt; break;
          case 'branch': return FcDepartment; break;
          case 'setting': return FcSupport; break;
          case 'user account': return FcConferenceCall; break;
          case 'user log': return FcViewDetails; break;
          case 'report': return FcBarChart; break;
          default: return FcHome; break;
          
        }
   }

  return (
    <div className="w-screen flex flex-col justify-start bg-slate-50/90">
        <Header />
        <div className="flex m-0 p-0">
            <SideMenu title={title?.toLowerCase()}/>
            <div className="w-full">
               <PageHeader title={title} Icon={getIcon()} />
               <div className="print:p-0 print:m-0 print:drop-shadow-none flex-1 m-2 p-2 sm:m-6 sm:p-6 rounded-md drop-shadow-sm bg-white border-[0.5px] border-gray-200">
                  {children}
               </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}
