import React, { useEffect, useState } from 'react'
import MenuItem from './MenuItem'
import {FcHome,FcBarChart,FcViewDetails,FcSupport,FcUnlock,FcShipped,FcSafe,FcMoneyTransfer,FcFilingCabinet,FcDepartment,FcDebt,FcConferenceCall,FcCurrencyExchange,FcFactory,FcPaid} from 'react-icons/fc'
import DivideTitle from './DivideTitle'
import { useUserStore } from '../utils/store'


export default function SideMenu({title}:any) {
  const { showSidebar,centre_id,user } = useUserStore(state => state);
  const [ branch,setBranch ] = useState('') 
  
  useEffect(() => {
     useUserStore.setState({ showSidebar:false })
    
  },[])
  return (
    <div className={`${!showSidebar ? 'hidden' : 'absolute z-10'} print:hidden w-64 py-2 sm:flex flex-col space-y-3 bg-white border-r border-slate-300/60 `}>
        <MenuItem Icon={FcHome} title="Home" url="/home" active={title === 'home'} />
        <MenuItem Icon={FcPaid} title="POS" url="/pos" active={title === 'pos'}/>
        { ['sales'].includes(user?.role?.toLowerCase()) && <MenuItem Icon={FcMoneyTransfer} title="Daily Sale" url="/dailysale" active={title === 'daily sale'} /> }
        { ['admin','owner'].includes(user?.role?.toLowerCase()) && 
        <>
          <DivideTitle title="Product & Stock" />
          <MenuItem Icon={FcFilingCabinet} title="Product" url="/product" active={title === 'product'} />
          <MenuItem Icon={FcShipped} title="Stock" url="/stock" active={title === 'stock'} />
          {/*<MenuItem Icon={FcSafe} title="Stock Log" url="/stocklog" active={title === 'stock log'} />*/}
          {/*<MenuItem Icon={FcFactory} title="Warehouse Stock" url="/warehouse" active={title === 'warehouse stock'}/>*/}
          <DivideTitle title="Sales Books" />
          <MenuItem Icon={FcMoneyTransfer} title="Daily Sale" url="/dailysale" active={title === 'daily sale'} />
          <MenuItem Icon={FcMoneyTransfer} title="Complete Sale" url="/completesale" active={title === 'complete sale'} />
          <MenuItem Icon={FcCurrencyExchange} title="Credit Sale" url="/creditsale" active={title === 'credit sale'} />
          <MenuItem Icon={FcDebt} title="Return Sale" url="/returnsale" active={title === 'return sale'} />
          <DivideTitle title="System Settings" />
          <MenuItem Icon={FcDepartment} title="Branch" url="/branch" active={title === 'branch'} />
          {/*<MenuItem Icon={FcSupport} title="Setting" url="/setting" active={title === 'setting'} />*/}
          <MenuItem Icon={FcConferenceCall} title="User Account" url="/user" active={title === 'user account'} />
          {/*<MenuItem Icon={FcViewDetails} title="User Log" url="/userlog" active={title === 'user log'} />*/}
          <DivideTitle title="Sales & System Reports" />
          <MenuItem Icon={FcBarChart} title="Report" url="/report" active={title === 'report'} />
        </>
        }
    </div>
  )
}
