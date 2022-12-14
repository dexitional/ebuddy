import React from 'react'
import {FcHome,FcBarChart,FcViewDetails,FcSupport,FcUnlock,FcShipped,FcSafe,FcMoneyTransfer,FcFilingCabinet,FcDepartment,FcDebt,FcConferenceCall,FcCurrencyExchange,FcFactory,FcPaid} from 'react-icons/fc'


export default function LoadIcon({title}: any) {
  const getIcon = () => {
      switch(title){
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
        
      }
  }
  return getIcon()
    
}
