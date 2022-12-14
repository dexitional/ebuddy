import axios, { AxiosError } from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React,{ useState} from 'react'
import { FcShop } from 'react-icons/fc';
import { useUserStore } from '../utils/store';
import { verifyAdmin, verifyVoter } from '../utils/apiClient';
import UCC60 from '../public/@60.jpg'

export default function AdminLogin() {
  
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
        const res = await verifyAdmin({username,password});
        if(res.success){
          let admin = { ...res.user, access:'admin' };
          useUserStore.setState({ admin })
          router.push('/dash')
        }else{
          setMsg(res.msg);
          setTimeout(() => setMsg(''), 5000)
        } setLoading(false)

      } catch (e){
        console.log(e)
        setMsg(`Wrong Credentials !`);
        setTimeout(() => setMsg(''), 5000)
        setLoading(false)
      }
      
  }
  return (
    <div className="w-screen h-screen pb-20 flex flex-col justify-center bg-white">
        <div className="w-full mx-auto h-5 flex flex-row items-center justify-between py-3 bg-slate-50 border-b-[0.5px] border-solid border-gray-200/50">
            
            <div className="">
                <Link href="">
                    <span className="hidden py-2 px-4 rounded-md bg-blue-900 font-medium text-white">Home Page</span>
                </Link>
            </div>
        </div>
        <div className={`w-screen h-screen py-10 flex justify-center bg-[url('../public/adinkra.png')] shadow-md shadow-blue-900/80`}>
            <div className="w-full mt-10 p-4 max-w-[370px]">
                <div className="w-full p-6 border bg-slate-50 border-gray-400/90 rounded-md shadow-lg shadow-red-900/30">
                    <form className="flex flex-col space-y-4">
                        <div className="px-4 py-1 flex space-x-2 items-center justify-center text-lg tracking-widest font-bold text-blue-900 bg-white shadow-sm shadow-blue-900 rounded-full">
                            <span>ELECTA VOTING SYSTEM</span>
                        </div>
                        <div className="my-6 flex items-center justify-between">
                            <h4 className="text-xl text-center text-red-700/90 font-verdana font-bold">ADMIN LOGIN</h4>
                            <img src={UCC60.src} className="h-14" />
                        </div>
                        <div className="flex flex-col space-y-3">
                            { msg && (
                            <div className="my-1">
                                <h4 className="px-4 py-2 rounded border border-red-500 text-sm text-red-500 font-verdana font-medium">{msg}</h4>
                            </div>
                            )}
                            <input autoComplete='off' placeholder="Username" type="text" name="username" onChange={onChange} className="py-2 px-4 w-full border text-gray-700 font-medium placeholder:text-gray-500 placeholder:font-normal border-gray-400/90 rounded-[5px] outline-none" />
                            <input autoComplete='off' placeholder="Password" type="password" name="password" onChange={onChange} className="py-2 px-4 w-full border text-gray-700 font-medium placeholder:text-gray-500 placeholder:font-normal border-gray-400/90 rounded-[5px] outline-none" />
                            <button onClick={authenticate} disabled={loading} className="py-3 px-4 w-full bg-blue-900/90 text-white text-md font-medium rounded-[5px]" type="submit">{loading ? 'authenticating ...':'Log In'}</button>
                        </div>
                        <Link href="/public"><span className="mt-4 text-[10px] font-semibold text-center text-red-900/90 hover:underline decoration-red-900/90 cursor-pointer">Monitor Elections Now!</span></Link>
                        <Link href=""><span className="mt-4 text-[10px] font-semibold text-center text-blue-900/90 hover:underline decoration-blue-900/90 cursor-pointer">Copyright &copy; DICTS-{new Date().getFullYear()}</span></Link>
                    
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
