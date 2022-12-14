import { useRouter } from 'next/router';
import React,{ useState,useEffect } from 'react'
import SearchBox from './SearchBox'
import {MdAddCircleOutline,MdKeyboardArrowRight,MdKeyboardArrowLeft} from 'react-icons/md'
import { useUserStore } from '../utils/store';

export default function PagerNew({onChange,onSubmit,keyword }: any) {
    const router = useRouter()

    const prevPage = () => {
      
    }

    const nextPage = () => {
      
    }

   
  return (
    <div className="border rounded px-3 py-4 sm:py-0 mb-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between">
        <SearchBox onChange={onChange} onSubmit={onSubmit} value={keyword}  />
        <div className="flex justify-between sm:space-x-4 px-4 sm:px-0">
            {/*
            <button onClick={()=> setPage('add')} className="p-1 flex items-center justify-center rounded-full bg-white text-xs font-semibold border border-slate-300">
                <MdAddCircleOutline className="h-6 w-6 text-slate-500" />
            </button>
            */}
            <div className="flex space-x-1">
                <button onClick={prevPage} className="rounded bg-green-50 text-slate-600 text-xs border border-slate-300">
                   <MdKeyboardArrowLeft className="h-6 w-6 text-slate-600" />
                </button>
                {/*<button className="px-2 py-2 rounded-md bg-slate-50 text-slate-600 text-xs font-semibold border">Page {pageNo}</button>*/}
                <button onClick={nextPage}  className="rounded bg-green-50 text-slate-600 text-xs font-semibold border border-slate-300">
                   <MdKeyboardArrowRight className="h-6 w-6 text-slate-600" />
                </button>
            </div>
        </div>
    </div>
  )
}
