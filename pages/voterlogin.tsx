import axios, { AxiosError } from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React,{ useState} from 'react'
import { FcShop } from 'react-icons/fc';
import { useUserStore } from '../utils/store';
import { verifyVoter } from '../utils/apiClient';
import Adinkra from '../public/adinkra.png'
import UCC60 from '../public/logo/pnmtc.png'

export default function VoterLogin() {
  
  const [ form, setForm ]  = useState({ username:'', password:'' })
  const [ loading, setLoading ] = useState(false);
  const [ msg, setMsg ] = useState('');
  const router = useRouter();
  //const fetchHelpers = useUserStore((state) => state.fetchHelpers);
  
  const onChange = (e:any) => {
     setForm({ ...form,[e.target.name]:e.target.value })
  }
  const authenticate = async (e:any) => {
      e.preventDefault();
      setLoading(true)
      const { username,password } = form;
      try{
        const res = await verifyVoter({username,password});
        if(res.success){
          let user = { ...res.data, access:'voter' };
          useUserStore.setState({user, centre_id: user.centre_id })
          router.push('/voterdash')
        }else{
          setMsg(res.msg);
          setTimeout(() => setMsg(''), 5000)
        }
        setLoading(false)

      } catch (e: any){
        console.log(e)
        setMsg(e.message);
        setTimeout(() => setMsg(''), 5000)
        setLoading(false)
      }
      
  }
  return (
    <div className="w-screen h-screen pb-20 flex flex-col justify-center">
        <div className="w-full mx-auto h-5 flex flex-row items-center justify-between py-3 bg-slate-50 border-b-[0.5px] border-solid border-gray-200/50">
            
            <div className="cursor-pointer">
                <Link href="https://ebuddy.vercel.app">
                    <span className="py-0.5 px-4 bg-green-900 font-bold italic leading-widest tracking-widest text-white">www.electa.app</span>
                </Link>
            </div>
        </div>
        <div className={`w-screen h-screen py-10 flex justify-center bg-[url('../public/adinkra.png')] shadow-md shadow-green-900/80`}>
            <div className="w-full mt-10 p-4 max-w-[370px]">
                <div className="w-full p-6 border bg-slate-50 border-gray-400/90 rounded-md shadow-lg shadow-red-900/30">
                    <form className="flex flex-col space-y-4">
                        <div className="px-4 py-1 flex space-x-2 items-center justify-center text-lg tracking-widest font-bold text-green-900 bg-white shadow-sm shadow-blue-900 rounded-full">
                            <span>ELECTA VOTING SYSTEM</span>
                        </div>
                        <div className="my-6 hidden">
                            <h4 className="text-sm text-yellow-900 font-verdana font-bold">VOTERS LOGIN</h4>
                        </div>
                        <div className="my-6 flex items-center justify-end space-x-4">
                            <h4 className="text-lg text-center text-yellow-700/90 font-verdana font-bold">VOTERS LOGIN</h4>
                            <img src={UCC60.src} className="h-14" />
                        </div>
                        <div className="flex flex-col space-y-3">
                            { msg && (
                            <div className="my-1">
                                <h4 className="px-4 py-2 rounded border border-red-500 text-xs text-red-500 font-verdana font-bold">{msg?.toUpperCase()}</h4>
                            </div>
                            )}
                            <input autoComplete='off' placeholder="Username" type="text" name="username" onChange={onChange} className="py-2 px-4 w-full border text-gray-700 font-medium  placeholder:text-gray-500 placeholder:font-normal border-gray-400/90 rounded-[5px] outline-none" />
                            <input autoComplete='off' placeholder="Password" type="text" name="password" onChange={onChange} className="py-2 px-4 w-full border text-gray-700 font-medium  placeholder:text-gray-500 placeholder:font-normal border-gray-400/90 rounded-[5px] outline-none" />
                            <button onClick={authenticate} disabled={loading} className="py-3 px-4 w-full bg-green-900/90 text-white text-md font-medium rounded-[5px]" type="submit">{loading ? 'authenticating ...':'Log In'}</button>
                        </div>
                        <div className="flex space-x-2 items-center justify-center">
                        <Link href="/public"><span className="p-0.5 px-1 mt-4 rounded border text-[10px] font-semibold text-center text-green-900/90 hover:underline border-green-900/90 cursor-pointer">Monitor Elections</span></Link>
                        {/*<Link href="/vvip"><span className="p-0.5 px-1 mt-4 rounded border text-[10px] font-semibold text-center text-blue-900/90 hover:underline border-blue-900/90 cursor-pointer">Goto Strongroom</span></Link>
                        <Link href="/result"><span className="p-0.5 px-1 mt-4 rounded border text-[10px] font-semibold text-center text-blue-900/90 hover:underline border-blue-900/90 cursor-pointer">View Results</span></Link> */}
                        </div>
                        <span className="mt-4 text-[10px] font-semibold text-center text-green-900/90 hover:underline decoration-green-900/90 cursor-default">Copyright &copy; K-Soft GH {new Date().getFullYear()}</span>
                    
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
